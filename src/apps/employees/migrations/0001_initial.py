# Generated for the employee_management project.

from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="Employee",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("employee_id", models.CharField(db_index=True, max_length=30, unique=True)),
                ("first_name", models.CharField(max_length=100)),
                ("last_name", models.CharField(max_length=100)),
                ("email", models.EmailField(db_index=True, max_length=254, unique=True)),
                ("phone", models.CharField(max_length=20, unique=True)),
                ("dob", models.DateField()),
                ("department", models.CharField(max_length=100)),
                ("designation", models.CharField(max_length=100)),
                ("joining_date", models.DateField(db_index=True)),
                ("address", models.TextField()),
                (
                    "status",
                    models.CharField(
                        choices=[
                            ("active", "Active"),
                            ("inactive", "Inactive"),
                            ("on_leave", "On Leave"),
                            ("terminated", "Terminated"),
                        ],
                        db_index=True,
                        default="active",
                        max_length=20,
                    ),
                ),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
            ],
            options={
                "ordering": ["-joining_date", "employee_id"],
                "indexes": [models.Index(fields=["first_name", "last_name"], name="employees_e_first__28f7b7_idx")],
            },
        ),
    ]
