from rest_framework import serializers
from .models import CarritoCompras, Carrito

class CarritoComprasSerializer(serializers.ModelSerializer):
    class Meta:
        model = CarritoCompras
        fields = '__all__' 
        read_only_fields = ['id']

class CarritoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Carrito
        fields = '__all__' 
        read_only_fields = ['id']