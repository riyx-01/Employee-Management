from rest_framework.routers import DefaultRouter

from apps.salaries.views import SalaryViewSet


router = DefaultRouter()
router.register("", SalaryViewSet, basename="salary")

urlpatterns = router.urls
