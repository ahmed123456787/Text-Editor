from rest_framework.generics import ListCreateAPIView, DestroyAPIView, GenericAPIView
from rest_framework.response import Response
from rest_framework import status
from text_editor.apps.core.models import Document, DocumentAccessToken
from .serializers import DocumentSerializer, DocumentAccessSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from uuid import uuid4

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
        
        # Format response to match WebSocket format
        response_data = {
            'type': 'INITIALIZE',
            'document': {
                'id': str(document.id),
                'title': document.title,
                'content': document.content,
                'version': document.current_version,
            }
        }
        
        return Response(
            response_data,
            status=status.HTTP_201_CREATED,
            headers=headers
        )

    def list(self, request, *args, **kwargs):
        """
        Handle listing of documents
        """
        queryset = self.filter_queryset(self.get_queryset().filter(user=request.user))
        serializer = self.get_serializer(queryset, many=True)
        
        # Return standard list response - no need to match WebSocket format for lists
        return Response(serializer.data)

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
    
class DocumentAccessTokenView(GenericAPIView):
    """
    API endpoint to create and retrieve the access token for a specific document.
    """
    serializer_class = DocumentAccessSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]


    def post(self, request, document_id):
        try:
            # Retrieve the specific document instance for the given document_id
            document = Document.objects.get(id=document_id, user=request.user)
            
            # Use the serializer to validate and process the request data
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            print("serializer data", serializer.validated_data)
            
            # Delete any existing token for the document
            DocumentAccessToken.objects.filter(document=document).delete()
            
            short_id = str(uuid4())[:6]

            # Create a new token for the document
            token_entry = DocumentAccessToken.objects.create(
                document=document,
                shared_id=short_id,
                permissions=serializer.validated_data.get("permissions"),  # Use validated permissions
            )
            
            # Return the newly created token
            return Response({"sharedId": str(token_entry.shared_id)}, status=status.HTTP_200_OK)
        except Document.DoesNotExist:
            return Response({"detail": "Document not found."}, status=status.HTTP_404_NOT_FOUND)