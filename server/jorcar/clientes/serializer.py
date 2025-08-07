from rest_framework import serializers
from .models import Cliente, ServicioCliente, Direccion


# Serializador para el modelo Dirección
class DireccionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Direccion
        fields = ['id', 'tipo', 'direccion', 'ciudad', 'estado', 'codigo_postal', 'pais']


# Serializador para el modelo Cliente
class ClienteSerializer(serializers.ModelSerializer):
    direcciones = DireccionSerializer(many=True, required=False)  # Relación anidada

    class Meta:
        model = Cliente
        fields = [
            'id', 'nombre', 'email', 'telefono', 'rut', 'razon_social', 
            'fecha_registro', 'activo', 'notas', 'direcciones'
        ]
        read_only_fields = ['fecha_registro']  # Fecha de registro es solo lectura

    def create(self, validated_data):
        # Extraer direcciones del cliente
        direcciones_data = validated_data.pop('direcciones', [])
        cliente = Cliente.objects.create(**validated_data)
        # Crear direcciones asociadas
        for direccion_data in direcciones_data:
            Direccion.objects.create(cliente=cliente, **direccion_data)
        return cliente

    def update(self, instance, validated_data):
        # Actualizar campos del cliente
        direcciones_data = validated_data.pop('direcciones', [])
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # Manejar direcciones asociadas
        if direcciones_data:
            Direccion.objects.filter(cliente=instance).delete()
            for direccion_data in direcciones_data:
                Direccion.objects.create(cliente=instance, **direccion_data)

        return instance

# Serializador para el modelo ServicioCliente
class ServicioClienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServicioCliente
        fields = ['id', 'cliente', 'descripcion', 'fecha', 'estado']