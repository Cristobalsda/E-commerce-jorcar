from rest_framework import routers
from .api import SucursalViewSet

router = routers.DefaultRouter()
router.register('api/sucursal', SucursalViewSet, 'Sucursal')

urlpatterns = router.urls