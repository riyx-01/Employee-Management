from django.utils import timezone
from rest_framework import serializers

from apps.employees.models import Employee


class EmployeeSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(read_only=True)

    class Meta:
        model = Employee
        fields = [
            "id",
            "employee_id",
            "first_name",
            "last_name",
            "full_name",
            "email",
            "phone",
            "dob",
            "department",
            "designation",
            "joining_date",
            "address",
            "status",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "full_name", "created_at", "updated_at"]

    def validate_employee_id(self, value: str) -> str:
        value = value.strip().upper()
        if not value:
            raise serializers.ValidationError("Employee ID is required.")
        return value

    def validate_first_name(self, value: str) -> str:
        value = value.strip()
        if len(value) < 2:
            raise serializers.ValidationError("First name must be at least 2 characters.")
        return value

    def validate_last_name(self, value: str) -> str:
        value = value.strip()
        if len(value) < 2:
            raise serializers.ValidationError("Last name must be at least 2 characters.")
        return value

    def validate_dob(self, value):
        today = timezone.localdate()
        if value >= today:
            raise serializers.ValidationError("Date of birth must be in the past.")
        return value

    def validate_joining_date(self, value):
        today = timezone.localdate()
        if value > today:
            raise serializers.ValidationError("Joining date cannot be in the future.")
        return value

    def validate(self, attrs):
        dob = attrs.get("dob", getattr(self.instance, "dob", None))
        joining_date = attrs.get("joining_date", getattr(self.instance, "joining_date", None))
        if dob and joining_date and dob >= joining_date:
            raise serializers.ValidationError({"joining_date": "Joining date must be after date of birth."})
        return attrs
