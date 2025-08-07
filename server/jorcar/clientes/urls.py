from rest_framework import routers  
from rest_framework import routers
from .api import ClienteViewSet, DireccionViewSet #ServicioClienteViewSet

# Crear el enrutador
router = routers.DefaultRouter()

# Registrar los viewsets para Cliente y ServicioCliente
router.register('api/clientes', ClienteViewSet, basename='cliente')
router.register('api/direcciones',DireccionViewSet, basename='add-direcciones')
#router.register('api/servicios', ServicioClienteViewSet, basename='servicio_cliente')

# Exponer las rutas
urlpatterns = router.urls