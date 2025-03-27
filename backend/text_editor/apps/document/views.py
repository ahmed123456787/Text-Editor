from rest_framework.generics import ListCreateAPIView, DestroyAPIView
from rest_framework.response import Response
from rest_framework import status
from text_editor.apps.core.models import Document
from .serializers import DocumentSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication

class DocumentView(ListCreateAPIView, DestroyAPIView):
    """
    API endpoint that allows documents to be:
    - Listed (GET)
    - Created (POST)
    - Deleted (DELETE)
    """
    serializer_class = DocumentSerializer
    queryset = Document.objects.all()
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def create(self, request, *args, **kwargs):
        """
        Handle document creation with user assignment
        """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # Assign the current user to the document before saving
        document = serializer.save(user=request.user)
        
        headers = self.get_success_headers(serializer.data)
        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED,
            headers=headers
        )

    def destroy(self, request, *args, **kwargs):
        """
        Handle document deletion
        """
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(
            {"detail": "Document deleted successfully."},
            status=status.HTTP_204_NO_CONTENT
        )