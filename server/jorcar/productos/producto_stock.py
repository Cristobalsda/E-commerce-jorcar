from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django.shortcuts import get_object_or_404
from .models import InventarioSucursal, Producto
from .serializers import InventarioSucursalSerializer

class ProductoStockViewSet(ModelViewSet):
    queryset = Producto.objects.all()
    serializer_class = InventarioSucursalSerializer
    permission_classes = [AllowAny]  # Asegúrate de que la autenticación sea correcta
    authentication_classes = [TokenAuthentication]

    @action(detail=True, methods=['PUT'], url_path='stock/(?P<stock_id>\d+)')
    def actualizar_stock_individual(self, request, pk=None, stock_id=None):
        """
        Actualiza el stock de un inventario en una sucursal específica.
        """
        try:
            # Buscar inventario de producto en sucursal
            inventario = InventarioSucursal.objects.get(id=stock_id, producto_id=pk)
        except InventarioSucursal.DoesNotExist:
            return Response({"error": "El inventario solicitado no existe."}, status=status.HTTP_404_NOT_FOUND)

        # Validar y obtener los datos de stock
        cantidad = request.data.get('cantidad')
        disponibilidad = request.data.get('disponibilidad')

        # Verificar que los datos estén presentes
        if cantidad is None or disponibilidad is None:
            return Response({"error": "Los campos 'cantidad' y 'disponibilidad' son obligatorios."}, status=status.HTTP_400_BAD_REQUEST)

        # Validar tipos de datos
        try:
            cantidad = int(cantidad)
        except ValueError:
            return Response({"error": "La cantidad debe ser un número entero."}, status=status.HTTP_400_BAD_REQUEST)

        if not isinstance(disponibilidad, bool):
            return Response({"error": "El campo 'disponibilidad' debe ser un valor booleano."}, status=status.HTTP_400_BAD_REQUEST)

        # Evitar stock negativo
        if cantidad < 0:
            return Response({"error": "La cantidad no puede ser negativa."}, status=status.HTTP_400_BAD_REQUEST)

        # Actualizar inventario
        inventario.cantidad = cantidad

        # Si la cantidad es 0, actualizar la disponibilidad a False
        if cantidad == 0:
            inventario.disponibilidad = False
        else:
            inventario.disponibilidad = disponibilidad

        inventario.save()

        return Response({"success": "Stock actualizado correctamente."}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['GET'], url_path='stocks')
    def obtener_stock(self, request, pk=None):
        """
        Obtiene el stock por sucursal para un producto específico, solo de sucursales disponibles.
        """
        producto = get_object_or_404(Producto, pk=pk)
        
        # Filtrar los inventarios asociados a sucursales con disponibilidad True
        inventarios = InventarioSucursal.objects.filter(
            producto=producto,
            sucursal__disponible=True  # Aquí se filtra sobre la relación de sucursal
        ).prefetch_related('sucursal')

        serializer = InventarioSucursalSerializer(inventarios, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)