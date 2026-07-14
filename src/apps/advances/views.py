from apps.advances.models import Advance
from apps.advances.serializers import AdvanceSerializer
from apps.common.viewsets import ResponseModelViewSet


class AdvanceViewSet(ResponseModelViewSet):
    queryset = Advance.objects.select_related("employee")
    serializer_class = AdvanceSerializer
    search_fields = ["employee__employee_id", "employee__first_name", "employee__last_name", "employee__email", "status"]
    ordering_fields = ["requested_date", "amount", "created_at"]
    ordering = ["-requested_date"]
