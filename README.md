# Employee Management API

A Django REST Framework project for employee, salary, and advance management.

## Tech Stack

- Python 3.12
- Django 6.0
- Django REST Framework
- SQLite
- Auth0 JWT authentication

## Project Structure

```text
employee_management/
├── manage.py
├── requirements.txt
├── .env.example
└── src/
    ├── employee_management/
    │   ├── settings.py
    │   ├── urls.py
    │   ├── asgi.py
    │   └── wsgi.py
    └── apps/
        ├── api/v1/urls.py
        ├── common/
        ├── employees/
        ├── salaries/
        └── advances/
```

## Setup

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
python manage.py migrate
python manage.py runserver
```

Update `.env` before running in production.

## Auth0 Setup

1. Create a free Auth0 account.
2. Create an API in Auth0.
3. Set the API Identifier, for example `https://employee-management-api`.
4. Copy the Auth0 domain and API identifier into `.env`:

```env
AUTH0_DOMAIN=your-tenant.us.auth0.com
AUTH0_AUDIENCE=https://employee-management-api
AUTH0_ALGORITHMS=RS256
```

5. Request an Auth0 access token for that API audience.
6. Send requests with:

```http
Authorization: Bearer <access_token>
```

All API endpoints require a valid Auth0 JWT access token.

## API Versioning

Current API prefix:

```text
/api/v1/
```

Future versions can be added under:

```text
/api/v2/
```

## Endpoints

### Employees

```text
GET     /api/v1/employees/
POST    /api/v1/employees/
GET     /api/v1/employees/{id}/
PUT     /api/v1/employees/{id}/
PATCH   /api/v1/employees/{id}/
DELETE  /api/v1/employees/{id}/
```

Supported query parameters:

```text
search=<employee_id|name|email>
ordering=joining_date|-joining_date
page=1
page_size=20
```

### Salaries

```text
GET     /api/v1/salaries/
POST    /api/v1/salaries/
GET     /api/v1/salaries/{id}/
PUT     /api/v1/salaries/{id}/
PATCH   /api/v1/salaries/{id}/
DELETE  /api/v1/salaries/{id}/
```

`gross_salary` is calculated automatically:

```text
basic + hra + bonus - deduction
```

### Advances

```text
GET     /api/v1/advances/
POST    /api/v1/advances/
GET     /api/v1/advances/{id}/
PUT     /api/v1/advances/{id}/
PATCH   /api/v1/advances/{id}/
DELETE  /api/v1/advances/{id}/
```

Advance amount cannot exceed the employee's current gross salary.

## Response Format

Successful responses use:

```json
{
  "success": true,
  "message": "Request completed successfully.",
  "data": {}
}
```

Errors use:

```json
{
  "success": false,
  "message": "Validation error.",
  "errors": {}
}
```
