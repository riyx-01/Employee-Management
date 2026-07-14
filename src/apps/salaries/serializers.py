from decimal import Decimal

from rest_framework import serializers

from apps.salaries.models import Salary


class SalarySerializer(serializers.ModelSerializer):
    employee_name = serializers.CharField(source="employee.full_name", read_only=True)
    employee_id = serializers.CharField(source="employee.employee_id", read_only=True)

    class Meta:
        model = Salary
        fields = [
            "id",
            "employee",
            "employee_id",
            "employee_name",
            "basic",
            "hra",
            "bonus",
            "deduction",
            "gross_salary",
            "effective_from",
            "status",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "employee_id", "employee_name", "gross_salary", "created_at", "updated_at"]

    def validate(self, attrs):
        for field_name in ["basic", "hra", "bonus", "deduction"]:
            value = attrs.get(field_name, getattr(self.instance, field_name, Decimal("0.00")))
            if value < Decimal("0.00"):
                raise serializers.ValidationError({field_name: "Amount cannot be negative."})

        basic = attrs.get("basic", getattr(self.instance, "basic", Decimal("0.00")))
        hra = attrs.get("hra", getattr(self.instance, "hra", Decimal("0.00")))
        bonus = attrs.get("bonus", getattr(self.instance, "bonus", Decimal("0.00")))
        deduction = attrs.get("deduction", getattr(self.instance, "deduction", Decimal("0.00")))

        if deduction > basic + hra + bonus:
            raise serializers.ValidationError({"deduction": "Deduction cannot exceed total earnings."})

        return attrs
