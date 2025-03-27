from rest_framework.serializers import ModelSerializer
from text_editor.apps.core.models import Document


class DocumentSerializer(ModelSerializer):
    class Meta:
        model = Document
        fields = ['title','content']


