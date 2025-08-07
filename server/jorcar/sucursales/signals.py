# sucursales/signals.py
from django.db.models.signals import post_save
from django.dispatch import receiver
from productos.models import Producto  # Importa el modelo Producto desde la app productos
from .models import Sucursal
from productos.models import InventarioSucursal  # Importa el modelo InventarioSucursal desde la app inventario

@receiver(post_save, sender=Sucursal)
def crear_inventarios_para_sucursal(sender, instance, created, **kwargs):
    if created:  # Solo ejecuta la acción si es una sucursal recién creada
        productos = Producto.objects.all()  # Obtiene todos los productos
        for producto in productos:
            # Crea un inventario para cada producto con los valores por defecto
            InventarioSucursal.objects.create(
                producto=producto,
                sucursal=instance,
                cantidad=0,  # Cantidad por defecto 0
                disponibilidad=False  # Disponibilidad por defecto False
            )
