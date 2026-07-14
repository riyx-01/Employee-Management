from rest_framework import status, viewsets
from rest_framework.response import Response

from apps.common.exceptions import build_response


class ResponseModelViewSet(viewsets.ModelViewSet):
    list_message = "Request completed successfully."
    retrieve_message = "Request completed successfully."
    create_message = "Resource created successfully."
    update_message = "Resource updated successfully."
    partial_update_message = "Resource updated successfully."
    destroy_message = "Resource deleted successfully."

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(build_response(True, self.list_message, data=serializer.data), status=status.HTTP_200_OK)

    def retrieve(self, request, *args, **kwargs):
        serializer = self.get_serializer(self.get_object())
        return Response(build_response(True, self.retrieve_message, data=serializer.data), status=status.HTTP_200_OK)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(build_response(True, self.create_message, data=serializer.data), status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop("partial", False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        message = self.partial_update_message if partial else self.update_message
        return Response(build_response(True, message, data=serializer.data), status=status.HTTP_200_OK)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(build_response(True, self.destroy_message, data=None), status=status.HTTP_200_OK)
