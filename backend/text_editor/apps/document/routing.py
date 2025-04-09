from django.urls import re_path
from . import consumer

websocket_urlpatterns = [
    re_path(r'ws/document/(?P<document_id>\w+)/$', consumer.DocumentConsumer.as_asgi()),
    re_path(r'ws/document/shared/(?P<shared_id>\w+)/$', consumer.GuestDocumentConsumer.as_asgi()),
]