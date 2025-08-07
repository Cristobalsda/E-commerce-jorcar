from .models import CustomUser  # Asegúrate de importar tu modelo personalizado
from rest_framework import serializers

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser  # Cambia a tu modelo personalizado
        fields = ['first_name', 'last_name', 'email', 'password', 'confirm_password']

    def validate(self, attrs):
        if attrs['password'] != attrs['confirm_password']:
            raise serializers.ValidationError({"password": "Las contraseñas no coinciden"})
        return attrs

    def create(self, validated_data):
        # Elimina confirm_password, ya que no se necesita para crear el usuario
        validated_data.pop('confirm_password')
        
        # Si no se pasa un username, crea uno a partir del email
        username = validated_data.get('username', validated_data['email'].split('@')[0])
        
        # Usa el método create_user para manejar el guardado del usuario y la contraseña de forma segura
        user = CustomUser.objects.create_user(
            username=username,
            first_name=validated_data.get('first_name'),
            last_name=validated_data.get('last_name'),
            email=validated_data['email'],
            password=validated_data['password'],
        )
        
        return user