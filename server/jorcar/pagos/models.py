from django.db import models
from pedidos.models import Pedido

# Create your models here.

class Pago(models.Model):
    pedido = models.ForeignKey(Pedido, on_delete=models.CASCADE)
    metodo_pago = models.TextField(null=False)
    monto = models.DecimalField(max_digits=10, decimal_places=2, null=False)
    fecha = models.DateTimeField(auto_now_add=True)