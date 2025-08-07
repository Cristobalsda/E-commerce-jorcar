from django.db import models
from clientes.models import Cliente
from productos.models import Producto
from pedidos.models import Pedido

# Create your models here.
class Venta(models.Model):
    fecha = models.DateTimeField(auto_now_add=True)
    cliente = models.ForeignKey(Cliente, on_delete=models.SET_NULL, null=True, blank=True)
    total = models.DecimalField(max_digits=10, decimal_places=2, null=False)
    tipo_venta = models.CharField(max_length=20, choices=[('Online', 'Online'), ('Presencial', 'Presencial')], null=False)


class DetalleVenta(models.Model):
    venta = models.ForeignKey(Venta, on_delete=models.CASCADE, related_name='detalles')
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE)
    cantidad = models.IntegerField(null=False)
    precio_unitario = models.DecimalField(max_digits=10, decimal_places=2, null=False)
    subtotal = models.DecimalField(max_digits=10, decimal_places=2, null=False)
    iva = models.BigIntegerField(null=False)

class HistorialTransaccion(models.Model):
    venta = models.ForeignKey(Venta, on_delete=models.SET_NULL, null=True, blank=True)
    pedido = models.ForeignKey(Pedido, on_delete=models.SET_NULL, null=True, blank=True)
    fecha = models.DateTimeField(auto_now_add=True)
    descripcion = models.TextField()
