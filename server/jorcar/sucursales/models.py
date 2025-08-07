from django.db import models

class Sucursal(models.Model):
    nombre = models.TextField(null=False)
    direccion = models.TextField(null=False)
    disponible = models.BooleanField(default=True)  # Campo booleano que indica si la sucursal está en funcionamiento

    def __str__(self):
        return self.nombre
