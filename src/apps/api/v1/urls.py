from django.urls import include, path


urlpatterns = [
    path("employees/", include("apps.employees.urls")),
    path("salaries/", include("apps.salaries.urls")),
    path("advances/", include("apps.advances.urls")),
]
