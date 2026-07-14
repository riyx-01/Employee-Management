from django.db import models

from apps.employees.models import Employee


class Advance(models.Model):
    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        APPROVED = "approved", "Approved"
        REJECTED = "rejected", "Rejected"
        PAID = "paid", "Paid"

    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name="advances")
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    requested_date = models.DateField()
    reason = models.TextField()
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-requested_date", "-created_at"]
        indexes = [
            models.Index(fields=["employee", "-requested_date"]),
        ]

    def __str__(self) -> str:
        return f"{self.employee.employee_id} - {self.amount}"
