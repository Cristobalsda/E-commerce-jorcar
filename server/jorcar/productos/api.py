from rest_framework import viewsets
from .models import Producto, Category, InventarioSucursal
from .serializers import ProductoSerializer, CategoriasSerializer, InventarioSucursalSerializer
from rest_framework.permissions import AllowAny
from rest_framework.authentication import TokenAuthentication
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from cloudinary.uploader import upload, destroy
from rest_framework.response import Response
from rest_framework import status
import json
from django.shortcuts import get_object_or_404
from .ia_product_config import procesar_producto_con_ia, obtener_descripcion_ia
from rest_framework.decorators import action,  api_view
from django.utils import timezone
from rest_framework.filters import BaseFilterBackend
from sucursales.models import Sucursal
from sucursales.serializers import SucursalSerializer


class ProductoViewSet(viewsets.ModelViewSet):
    queryset = Producto.objects.all()
    permission_classes = [AllowAny]
    authentication_classes = [TokenAuthentication]
    serializer_class = ProductoSerializer
    parser_classes = (MultiPartParser, FormParser)

    def get_queryset(self):
        
        queryset = Producto.objects.all()
        categoria_id = self.request.query_params.get('categoria', None)
        
        if categoria_id:
            # Obtener la categoría seleccionada
            categoria = get_object_or_404(Category, id=categoria_id)
            
            # Obtener todas las subcategorías (usando modelo de árbol como mptt)
            subcategorias = Category.objects.filter(
                tree_id=categoria.tree_id,
                lft__gte=categoria.lft,
                rght__lte=categoria.rght
            )
            
            # Filtrar productos que pertenezcan a la categoría o a sus subcategorías
            queryset = queryset.filter(categoria__in=subcategorias)
        
        return queryset

    def create(self, request, *args, **kwargs):
        try:
            uploaded_images = []
            for img in request.FILES.getlist('imagenes'):
                result = upload(img)
                uploaded_images.append(result['secure_url'])
            
            categoria = get_object_or_404(Category, id=request.data['categoria'])
            producto = Producto.objects.create(
                nombre=request.data['nombre'],
                descripcion=request.data['descripcion'],
                precio=request.data['precio'],
                calidad=request.data.get('calidad'),
                imagenes=uploaded_images,
                categoria=categoria,
                marca=request.data.get('marca'),
                fecha_primer_procesamiento=timezone.now(),
            )

            # Crear el stock en todas las sucursales con valores por defecto (0 cantidad y no disponible)
            sucursales = Sucursal.objects.all()
            for sucursal in sucursales:
                InventarioSucursal.objects.create(
                    producto=producto,
                    sucursal=sucursal,
                    cantidad=0,  # Establecer cantidad en 0 por defecto
                    disponibilidad=False  # Establecer disponibilidad en False por defecto
                )
            procesar_producto_con_ia(producto.id)
            serializer = self.get_serializer(producto)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        except Exception as e:
            print(f"Error al procesar la solicitud: {e}")
            return Response({"error": "Hubo un error al procesar la solicitud."}, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()

        print(f"Datos recibidos para actualización: {request.data}") 

        # Asignar la categoría correctamente
        categoria_id = request.data.get('categoria')
        if categoria_id:
            categoria = get_object_or_404(Category, id=categoria_id)
            instance.categoria = categoria

        # Actualizar otros campos
        instance.nombre = request.data.get('nombre', instance.nombre)
        instance.descripcion = request.data.get('descripcion', instance.descripcion)
        instance.precio = request.data.get('precio', instance.precio)
        instance.calidad = request.data.get('calidad', instance.calidad)
        instance.marca = request.data.get('marca', instance.marca)
        



        # Eliminar imágenes si es necesario
        if 'imagenes_a_eliminar' in request.data:
            try:
                indices_a_eliminar = json.loads(request.data['imagenes_a_eliminar'])
                imagenes_actuales = instance.imagenes

                for index in sorted(indices_a_eliminar, reverse=True):
                    if 0 <= index < len(imagenes_actuales):
                        imagen_url = imagenes_actuales[index]
                        imagen_id = imagen_url.split('/')[-1].split('.')[0]
                        destroy(imagen_id)  # Eliminar imagen de Cloudinary
                        imagenes_actuales.pop(index)

                instance.imagenes = imagenes_actuales
            except Exception as e:
                print(f"Error al eliminar imágenes: {e}")
                return Response({"error": "Error al eliminar imágenes."}, status=status.HTTP_400_BAD_REQUEST)

        # Subir nuevas imágenes si es necesario
        if 'imagenes' in request.FILES:
            nuevas_imagenes = []
            for img in request.FILES.getlist('imagenes'):
                result = upload(img)
                nuevas_imagenes.append(result['secure_url'])

            # Agregar nuevas imágenes a la lista existente
            instance.imagenes.extend(nuevas_imagenes)    
              
        instance.fecha_ultima_modificacion_ia = timezone.now()  # Fecha de la última modificación
        instance.procesado_por_ia = True  # Marcar como procesado por IA

        instance.save()
       

        serializer = self.get_serializer(instance)
        return Response(serializer.data)
    
    
    parser_classes = (MultiPartParser, FormParser, JSONParser)
    @action(detail=False, methods=['post'], url_path='procesar-descripcion-ia')
    def procesar_descripcion_con_ia(self, request):
        try:
            # Obtener datos de la solicitud
            nombre_producto = request.data.get('nombre')
            categorias_ids = request.data.get('categorias')  # Ahora recibimos un array de categorías
            calidad_producto = request.data.get('calidad')

            if not nombre_producto or not categorias_ids or not calidad_producto:
                return Response({'error': 'Nombre,  categorías y calidad son obligatorios.'}, status=status.HTTP_400_BAD_REQUEST)

            # Obtener todas las categorías de la base de datos
            categorias = Category.objects.filter(id__in=categorias_ids)

            if not categorias:
                return Response({'error': 'No se encontraron categorías válidas.'}, status=status.HTTP_400_BAD_REQUEST)

            # Obtener los nombres de las categorías seleccionadas
            nombres_categorias = [categoria.name for categoria in categorias]

            # Generar descripción con IA usando el nombre del producto y las categorías
            descripcion_ia = obtener_descripcion_ia(nombre_producto, nombres_categorias, calidad_producto)

            if not descripcion_ia.get("success", False):
                return Response({'error': descripcion_ia.get("descripcion", "Error desconocido")}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            return Response({
                'message': 'Descripción generada exitosamente.',
                'descripcion': descripcion_ia["descripcion"]
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({'error': f'Error en el servidor: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    

class InventarioFilterBackend(BaseFilterBackend):
    def filter_queryset(self, request, queryset, view):
        sucursal_id = request.query_params.get('sucursal_id')
        if sucursal_id:
            queryset = queryset.filter(sucursal_id=sucursal_id)
        return queryset



class CategoriasViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowAny]
    queryset = Category.objects.all()
    serializer_class = CategoriasSerializer

    def list(self, request, *args, **kwargs):
        # Ordenar las categorías para mostrarlas de forma jerárquica
        categories = Category.objects.all().order_by('tree_id', 'lft')
        serializer = self.get_serializer(categories, many=True)
        return Response(serializer.data)
    



