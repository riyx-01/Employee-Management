# API Testing Guide (cURL Commands)

This guide documents the cURL commands to interact with the Employee Management REST API.

All endpoints require JWT Authentication. Replace `YOUR_TOKEN` with a valid Auth0 Access Token.

---

## 1. Employee Endpoints (`/api/v1/employees/`)

### Create Employee (POST)
```bash
curl -X POST http://localhost:8000/api/v1/employees/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "employee_id": "EMP001",
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "dob": "1990-01-01",
    "department": "Engineering",
    "designation": "Software Engineer",
    "joining_date": "2026-06-29",
    "address": "123 main street, NY",
    "status": "active"
  }'
```

### List Employees (GET)
```bash
curl -X GET http://localhost:8000/api/v1/employees/ \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Get Single Employee details (GET)
```bash
curl -X GET http://localhost:8000/api/v1/employees/1/ \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Update Employee (PUT)
*(Replaces entire resource)*
```bash
curl -X PUT http://localhost:8000/api/v1/employees/1/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "employee_id": "EMP001",
    "first_name": "John",
    "last_name": "Doe",
    "email": "john.updated@example.com",
    "phone": "+1234567890",
    "dob": "1990-01-01",
    "department": "HR",
    "designation": "Software Engineer",
    "joining_date": "2026-06-29",
    "address": "123 main street, NY",
    "status": "active"
  }'
```

### Partial Update Employee (PATCH)
```bash
curl -X PATCH http://localhost:8000/api/v1/employees/1/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "designation": "Senior Developer"
  }'
```

### Delete Employee (DELETE)
```bash
curl -X DELETE http://localhost:8000/api/v1/employees/1/ \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 2. Salary Endpoints (`/api/v1/salaries/`)

### Create Salary (POST)
```bash
curl -X POST http://localhost:8000/api/v1/salaries/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "employee": 1,
    "basic": "5000.00",
    "hra": "1000.00",
    "bonus": "500.00",
    "deduction": "200.00",
    "effective_from": "2026-06-01"
  }'
```

### List Salaries (GET)
```bash
curl -X GET http://localhost:8000/api/v1/salaries/ \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Update Salary (PUT)
```bash
curl -X PUT http://localhost:8000/api/v1/salaries/1/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "employee": 1,
    "basic": "5500.00",
    "hra": "1000.00",
    "bonus": "500.00",
    "deduction": "200.00",
    "effective_from": "2026-07-01"
  }'
```

### Delete Salary (DELETE)
```bash
curl -X DELETE http://localhost:8000/api/v1/salaries/1/ \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 3. Advance Endpoints (`/api/v1/advances/`)

### Create Advance (POST)
```bash
curl -X POST http://localhost:8000/api/v1/advances/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "employee": 1,
    "amount": "1000.00",
    "reason": "Family emergency",
    "requested_date": "2026-06-29"
  }'
```

### List Advances (GET)
```bash
curl -X GET http://localhost:8000/api/v1/advances/ \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Update Advance Status (PATCH)
*(Used by HR to approve/reject)*
```bash
curl -X PATCH http://localhost:8000/api/v1/advances/1/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "status": "approved"
  }'
```

### Delete Advance Record (DELETE)
```bash
curl -X DELETE http://localhost:8000/api/v1/advances/1/ \
  -H "Authorization: Bearer YOUR_TOKEN"
```
