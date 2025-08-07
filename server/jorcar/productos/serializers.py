from rest_framework import serializers
from .models import Producto, Category, InventarioSucursal


class ProductoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Producto
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'procesado_por_ia', 'fecha_primer_procesamiento', 'fecha_ultima_modificacion_ia']

    def validate_precio(self, value):
        if value <= 0:
            raise serializers.ValidationError("El precio debe ser mayor que cero.")
        return value

class CategoriasSerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__' 
        read_only_fields = ['id']

class InventarioSucursalSerializer(serializers.ModelSerializer):
    producto = serializers.CharField(source='producto.nombre')  # Nombre del producto
    sucursal = serializers.CharField(source='sucursal.nombre')  # Nombre de la sucursal

    class Meta:
        model = InventarioSucursal
        fields = ['id', 'producto', 'sucursal', 'cantidad', 'disponibilidad', 'producto_id']  # Incluir el id
