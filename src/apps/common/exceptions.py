from django.core.exceptions import PermissionDenied as DjangoPermissionDenied
from django.http import Http404
from rest_framework import status
from rest_framework.exceptions import AuthenticationFailed, NotAuthenticated, NotFound, PermissionDenied, ValidationError
from rest_framework.views import exception_handler


def build_response(success: bool, message: str, data=None, errors=None) -> dict:
    payload = {
        "success": success,
        "message": message,
    }
    if success:
        payload["data"] = data
    else:
        payload["errors"] = errors
    return payload


def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)

    if response is None:
        import traceback
        traceback.print_exc()
        if isinstance(exc, Http404):
            return _error_response("Object not found.", {"detail": "Not found."}, status.HTTP_404_NOT_FOUND)
        if isinstance(exc, DjangoPermissionDenied):
            return _error_response(
                "Permission denied.",
                {"detail": "You do not have permission to perform this action."},
                status.HTTP_403_FORBIDDEN,
            )
        return _error_response(
            "Unexpected error.",
            {"detail": "An unexpected error occurred."},
            status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

    if isinstance(exc, ValidationError):
        message = "Validation error."
    elif isinstance(exc, (AuthenticationFailed, NotAuthenticated)):
        message = "Authentication failed."
    elif isinstance(exc, PermissionDenied):
        message = "Permission denied."
    elif isinstance(exc, (Http404, NotFound)):
        message = "Object not found."
    else:
        message = response.data.get("detail", "Request failed.") if isinstance(response.data, dict) else "Request failed."

    response.data = build_response(False, message, errors=response.data)
    return response


def _error_response(message: str, errors: dict, status_code: int):
    from rest_framework.response import Response

    return Response(build_response(False, message, errors=errors), status=status_code)
