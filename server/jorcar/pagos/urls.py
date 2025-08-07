from rest_framework import routers
from .api import CreatePreferenceViewSet

router = routers.DefaultRouter()
router.register('api/create_preference', CreatePreferenceViewSet, 'create preference')

urlpatterns = router.urls