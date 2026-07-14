from decimal import Decimal

from rest_framework import serializers

from apps.advances.models import Advance
from apps.salaries.models import Salary


class AdvanceSerializer(serializers.ModelSerializer):
    employee_name = serializers.CharField(source="employee.full_name", read_only=True)
    employee_id = serializers.CharField(source="employee.employee_id", read_only=True)

    class Meta:
        model = Advance
        fields = [
            "id",
            "employee",
            "employee_id",
            "employee_name",
            "amount",
            "requested_date",
            "reason",
            "status",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "employee_id", "employee_name", "created_at", "updated_at"]

    def validate_amount(self, value):
        if value <= Decimal("0.00"):
            raise serializers.ValidationError("Advance amount must be greater than zero.")
        return value

    def validate(self, attrs):
        employee = attrs.get("employee", getattr(self.instance, "employee", None))
        amount = attrs.get("amount", getattr(self.instance, "amount", None))

        if not employee or amount is None:
            return attrs

        current_salary = Salary.objects.filter(employee=employee).order_by("-effective_from", "-created_at").first()
        if current_salary is None:
            raise serializers.ValidationError({"employee": "Employee does not have a current salary."})

        if amount > current_salary.gross_salary:
            raise serializers.ValidationError(
                {
                    "amount": (
                        "Advance amount cannot exceed current salary "
                        f"({current_salary.gross_salary})."
                    )
                }
            )

        return attrs
