from decimal import Decimal

from django.db import models

from apps.employees.models import Employee


class Salary(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name="salaries")
    basic = models.DecimalField(max_digits=12, decimal_places=2)
    hra = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal("0.00"))
    bonus = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal("0.00"))
    deduction = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal("0.00"))
    gross_salary = models.DecimalField(max_digits=12, decimal_places=2, editable=False)
    effective_from = models.DateField()
    status = models.CharField(
        max_length=20,
        choices=[("unpaid", "Unpaid"), ("paid", "Paid")],
        default="unpaid",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-effective_from", "-created_at"]
        indexes = [
            models.Index(fields=["employee", "-effective_from"]),
        ]

    def __str__(self) -> str:
        return f"{self.employee.employee_id} - {self.gross_salary}"

    def calculate_gross_salary(self) -> Decimal:
        return self.basic + self.hra + self.bonus - self.deduction

    def save(self, *args, **kwargs):
        self.gross_salary = self.calculate_gross_salary()
        super().save(*args, **kwargs)
