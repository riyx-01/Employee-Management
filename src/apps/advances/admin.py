from django.contrib import admin

from apps.advances.models import Advance


@admin.register(Advance)
class AdvanceAdmin(admin.ModelAdmin):
    list_display = ["employee", "amount", "requested_date", "status"]
    list_filter = ["status", "requested_date"]
    search_fields = ["employee__employee_id", "employee__first_name", "employee__last_name", "employee__email"]
    ordering = ["-requested_date"]
