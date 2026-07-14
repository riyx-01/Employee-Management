from django.contrib import admin

from apps.employees.models import Employee


@admin.register(Employee)
class EmployeeAdmin(admin.ModelAdmin):
    list_display = ["employee_id", "first_name", "last_name", "email", "department", "designation", "status"]
    list_filter = ["status", "department", "designation"]
    search_fields = ["employee_id", "first_name", "last_name", "email"]
    ordering = ["-joining_date"]
