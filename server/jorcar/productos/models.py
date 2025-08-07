from django.db import models
from sucursales.models import Sucursal
from mptt.models import MPTTModel, TreeForeignKey
from django.utils.text import slugify  


class Producto(models.Model):
    CALIDAD_CHOICES = [
        ('original', 'Original'),
        ('alternativo', 'Alternativo'),
        ('otras', 'Otras Referencias'),
    ]
    nombre = models.TextField(null=False)
    descripcion = models.TextField(blank=True, null=True)
    precio = models.PositiveIntegerField(blank=True, null=False)
    imagenes = models.JSONField(default=list, blank=True)
    categoria = TreeForeignKey(
        'Category',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='productos'
    )
    marca = models.CharField(max_length=100, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True, null=False)

    procesado_por_ia = models.BooleanField(default=False)  # Indica si el producto fue procesado por la IA
    fecha_primer_procesamiento = models.DateTimeField(null=True, blank=True)  # Fecha del primer procesamiento
    fecha_ultima_modificacion_ia = models.DateTimeField(null=True, blank=True)  # Fecha de la última modificación por la IA

    calidad = models.CharField(
        max_length=20,
        choices=CALIDAD_CHOICES,
        default='original',  # Valor por defecto
    )

    def __str__(self):
        return self.nombre


class InventarioSucursal(models.Model):
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE, related_name='inventario')
    sucursal = models.ForeignKey(Sucursal, on_delete=models.CASCADE, related_name='inventarios')
    cantidad = models.IntegerField(null=False)
    disponibilidad = models.BooleanField(default=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['producto', 'sucursal'], name='unique_producto_sucursal')
        ]


class Category(MPTTModel):
    name = models.CharField(max_length=255, unique=True)
    slug = models.SlugField(max_length=255, unique=True, blank=True)  # Permitimos que el slug sea vacío inicialmente
    parent = TreeForeignKey(
        'self',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='children'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class MPTTMeta:
        order_insertion_by = ['name']

    class Meta:
        verbose_name = "Categoría"
        verbose_name_plural = "Categorías"

    def save(self, *args, **kwargs):
        if not self.slug:  # Si no hay un slug, generamos uno automáticamente
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name
