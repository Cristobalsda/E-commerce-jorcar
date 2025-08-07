from rest_framework import routers
from .api import CarritoComprasViewSet, CarritoViewSet

router = routers.DefaultRouter()
router.register('api/carrito_compras', CarritoComprasViewSet, 'CarritoDeCompra')
router.register('api/carrito', CarritoViewSet, 'Carrito')

urlpatterns = router.urls