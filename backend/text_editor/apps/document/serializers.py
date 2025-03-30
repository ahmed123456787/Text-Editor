from rest_framework.serializers import ModelSerializer, IntegerField
from text_editor.apps.core.models import Document


class DocumentSerializer(ModelSerializer):
    version = IntegerField(source='current_version', read_only=True)  # Corrected CharField usage

    class Meta:
        model = Document
        fields = ['id', 'title', 'content', 'updated_at', 'version']
        read_only_fields = ['updated_at', 'id', 'version']