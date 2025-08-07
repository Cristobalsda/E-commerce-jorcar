from django.db import models
from clientes.models import Cliente
from productos.models import Producto
import uuid

class Pedido(models.Model):
    cliente = models.ForeignKey(Cliente, on_delete=models.CASCADE, related_name='pedidos')
    fecha = models.DateTimeField(auto_now_add=True)
    estado = models.CharField(
        max_length=20,
        choices=[
            ('Pendiente', 'Pendiente'),
            ('Procesando', 'Procesando'),
            ('Enviado', 'Enviado'),
            ('Entregado', 'Entregado'),
            ('Cancelado', 'Cancelado')
        ],
        null=False
    )
    carrito = models.ForeignKey('CarritoCompras', on_delete=models.CASCADE)
    metodo_envio = models.ForeignKey('MetodoEnvio', on_delete=models.SET_NULL, null=True, blank=True)

class Carrito(models.Model):
    cliente = models.ForeignKey(Cliente, on_delete=models.SET_NULL, null=True, blank=True)
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    cart_id = models.CharField(max_length=255, unique=True, default=uuid.uuid4) 

class CarritoCompras(models.Model):
    carrito = models.ForeignKey(Carrito, related_name='productos', on_delete=models.CASCADE)
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE)
    cantidad = models.IntegerField()
    precio_unitario = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        unique_together = ('carrito', 'producto')

class MetodoEnvio(models.Model):
    nombre = models.TextField(null=False)
    descripcion = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.nombre
