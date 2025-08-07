from django.db import models
from sucursales.models import Sucursal

# Create your models here.

class Empleado(models.Model):
    nombre = models.TextField(null=False)
    puesto = models.TextField(null=False)
    sucursal = models.ForeignKey(Sucursal, on_delete=models.CASCADE, related_name='empleados')
    salario = models.DecimalField(max_digits=10, decimal_places=2, null=False)
    fecha_contratacion = models.DateField(null=False)

    def __str__(self):
        return self.nombre
    
class Actividad(models.Model):
    descripcion = models.TextField(null=False)
    fecha = models.DateTimeField(auto_now_add=True)
    personal = models.ForeignKey(Empleado, on_delete=models.CASCADE, related_name='actividades')
    estado = models.CharField(max_length=20, choices=[('Pendiente', 'Pendiente'), ('En Proceso', 'En Proceso'), ('Completada', 'Completada')], null=False)

class HorarioTrabajo(models.Model):
    personal = models.ForeignKey(Empleado, on_delete=models.CASCADE, related_name='horarios')
    sucursal = models.ForeignKey(Sucursal, on_delete=models.CASCADE, related_name='horarios')
    dia_semana = models.TextField(null=False)
    hora_inicio = models.TimeField(null=False)
    hora_fin = models.TimeField(null=False)