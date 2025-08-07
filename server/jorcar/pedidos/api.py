from rest_framework import viewsets
from .models import CarritoCompras, Carrito
from productos.models import Producto
from .serializers import CarritoSerializer, CarritoComprasSerializer
from rest_framework.permissions import AllowAny
from rest_framework.authentication import TokenAuthentication
from rest_framework.response import Response


class CarritoComprasViewSet(viewsets.ModelViewSet):
    queryset = CarritoCompras.objects.all()
    permission_classes = [AllowAny]
    authentication_classes = [TokenAuthentication]
    serializer_class = CarritoComprasSerializer

    def create(self, request, *args, **kwargs):
        # Verificar si se proporcionó un cart_id
        cart_id = request.data.get('cart_id')
        if not cart_id:
            return Response({'error': 'cart_id es obligatorio'}, status=400)

        carrito, created = Carrito.objects.get_or_create(cart_id=cart_id)

        producto = Producto.objects.get(id=request.data['producto'])

        carrito_producto, created = CarritoCompras.objects.get_or_create(
            carrito=carrito,
            producto=producto,
            defaults={'cantidad': request.data['cantidad'], 'precio_unitario': producto.precio}
        )

        if not created:  # Si ya existe el producto, actualizar la cantidad
            carrito_producto.cantidad += request.data['cantidad']
            carrito_producto.save()

        return Response({'mensaje': 'Producto agregado al carrito', 'producto': request.data['producto']})
   
    
class CarritoViewSet(viewsets.ModelViewSet):
    queryset = Carrito.objects.all()
    permission_classes = [AllowAny]
    authentication_classes = [TokenAuthentication]
    serializer_class = CarritoSerializer
