from django.db import models
from ventas.models import Venta
from pedidos.models import Pedido
from pagos.models import Pago

# Create your models here.
class HistorialFinanzas(models.Model):
    fecha = models.DateTimeField(auto_now_add=True)
    tipo = models.CharField(max_length=20, choices=[('Ingreso', 'Ingreso'), ('Egreso', 'Egreso')], null=False)
    monto = models.DecimalField(max_digits=10, decimal_places=2, null=False)
    descripcion = models.TextField()
    venta = models.ForeignKey(Venta, on_delete=models.SET_NULL, null=True, blank=True)
    pedido = models.ForeignKey(Pedido, on_delete=models.SET_NULL, null=True, blank=True)
    pago = models.ForeignKey(Pago, on_delete=models.SET_NULL, null=True, blank=True)