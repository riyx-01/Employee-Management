# Generated for the employee_management project.

import decimal
import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        ("employees", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="Salary",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("basic", models.DecimalField(decimal_places=2, max_digits=12)),
                ("hra", models.DecimalField(decimal_places=2, default=decimal.Decimal("0.00"), max_digits=12)),
                ("bonus", models.DecimalField(decimal_places=2, default=decimal.Decimal("0.00"), max_digits=12)),
                ("deduction", models.DecimalField(decimal_places=2, default=decimal.Decimal("0.00"), max_digits=12)),
                ("gross_salary", models.DecimalField(decimal_places=2, editable=False, max_digits=12)),
                ("effective_from", models.DateField()),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                (
                    "employee",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="salaries",
                        to="employees.employee",
                    ),
                ),
            ],
            options={
                "ordering": ["-effective_from", "-created_at"],
                "indexes": [models.Index(fields=["employee", "-effective_from"], name="salaries_sa_employe_f983b8_idx")],
            },
        ),
    ]
