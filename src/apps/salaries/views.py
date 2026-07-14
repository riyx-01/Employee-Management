from apps.common.viewsets import ResponseModelViewSet
from apps.salaries.models import Salary
from apps.salaries.serializers import SalarySerializer


class SalaryViewSet(ResponseModelViewSet):
    queryset = Salary.objects.select_related("employee")
    serializer_class = SalarySerializer
    search_fields = ["employee__employee_id", "employee__first_name", "employee__last_name", "employee__email"]
    ordering_fields = ["effective_from", "gross_salary", "created_at"]
    ordering = ["-effective_from"]
