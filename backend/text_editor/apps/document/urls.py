from django.urls import path
from .views import DocumentView

urlpatterns = [
    path("document/", DocumentView.as_view(), name="document-list-create"),
]