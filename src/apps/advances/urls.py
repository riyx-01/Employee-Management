from rest_framework.routers import DefaultRouter

from apps.advances.views import AdvanceViewSet


router = DefaultRouter()
router.register("", AdvanceViewSet, basename="advance")

urlpatterns = router.urls
