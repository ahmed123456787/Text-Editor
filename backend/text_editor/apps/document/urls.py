from django.urls import path
from .views import DocumentView, DocumentAccessTokenView

urlpatterns = [
    path("documents/", DocumentView.as_view(), name="document-list-create"),
    path("documents/shared/<int:document_id>/", DocumentAccessTokenView.as_view(), name="document-detail"),
]