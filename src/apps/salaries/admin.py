from django.contrib import admin

from apps.salaries.models import Salary


@admin.register(Salary)
class SalaryAdmin(admin.ModelAdmin):
    list_display = ["employee", "basic", "hra", "bonus", "deduction", "gross_salary", "effective_from"]
    list_filter = ["effective_from"]
    search_fields = ["employee__employee_id", "employee__first_name", "employee__last_name", "employee__email"]
    ordering = ["-effective_from"]
