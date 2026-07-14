from rest_framework import filters

from apps.common.viewsets import ResponseModelViewSet
from apps.employees.models import Employee
from apps.employees.serializers import EmployeeSerializer


class EmployeeViewSet(ResponseModelViewSet):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["employee_id", "first_name", "last_name", "email"]
    ordering_fields = ["joining_date"]
    ordering = ["-joining_date"]
