from django.db import models

# Create your models here.


from django.db import models
from django.conf import settings

class Cliente(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='cliente'
    )
    nombre = models.CharField(max_length=100, null=False)
    email = models.EmailField(unique=True, null=False)
    telefono = models.CharField(max_length=15, blank=True, null=True)
    rut = models.CharField(max_length=15, unique=True, null=True, blank=True)  
    razon_social = models.CharField(max_length=150, blank=True, null=True)    # Nombre fiscal para empresas
    fecha_registro = models.DateTimeField(auto_now_add=True)                  
    activo = models.BooleanField(default=True)                               # Indica si el cliente está activo
    notas = models.TextField(blank=True, null=True)                          

    def __str__(self):
        return self.nombre

class Direccion(models.Model):
    TIPO_DIRECCION_CHOICES = [
        ('Facturación', 'Facturación'),
        ('Envío', 'Envío'),
    ]
    cliente = models.ForeignKey(Cliente, on_delete=models.CASCADE, related_name='direcciones')
    tipo = models.CharField(max_length=15, choices=TIPO_DIRECCION_CHOICES, null=False)
    direccion = models.TextField(null=False)
    ciudad = models.CharField(max_length=50, null=True, blank=True)
    estado = models.CharField(max_length=50, null=True, blank=True)
    codigo_postal = models.CharField(max_length=10, null=True, blank=True)
    pais = models.CharField(max_length=50, null=True, blank=True)

    def __str__(self):
        return f"{self.tipo} - {self.direccion[:30]} ({self.cliente.nombre})"
    
class ServicioCliente(models.Model):
    cliente = models.ForeignKey(Cliente, on_delete=models.CASCADE, related_name='servicios')
    descripcion = models.TextField(null=False)
    fecha = models.DateTimeField(auto_now_add=True)
    estado = models.CharField(max_length=20, choices=[('En proceso', 'En proceso'), ('Pendiente', 'Pendiente'), ('Completado', 'Completado')], null=False)


