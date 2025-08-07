from rest_framework import routers
from .api import EmpleadoViewSet

router = routers.DefaultRouter()
router.register('api/empleado', EmpleadoViewSet, 'Empleado')

urlpatterns = router.urls