from rest_framework import routers
from .api import ProductoViewSet, CategoriasViewSet
from .producto_stock import ProductoStockViewSet

router = routers.DefaultRouter()
router.register('api/producto', ProductoViewSet, 'Producto')
router.register('api/categorias', CategoriasViewSet, 'Categorias')
router.register('api/stock_producto', ProductoStockViewSet, 'Producto-Stock')


urlpatterns = router.urls