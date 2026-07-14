from django.contrib import admin
from django.urls import include, path
from django.http import JsonResponse


def api_root(request):
    return JsonResponse({"message": "Employee Management API is running!", "status": "online"})


urlpatterns = [
    path("", api_root),
    path("admin/", admin.site.urls),
    path("api/v1/", include("apps.api.v1.urls")),
]
