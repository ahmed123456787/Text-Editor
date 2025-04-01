from rest_framework.serializers import ModelSerializer, IntegerField, SerializerMethodField, ListField, ChoiceField
from text_editor.apps.core.models import Document, DocumentAccessToken
from django.utils.timezone import now


class DocumentSerializer(ModelSerializer):
    version = IntegerField(source='current_version', read_only=True)
    last_updated = SerializerMethodField()  # Add a custom field for human-readable time

    class Meta:
        model = Document
        fields = ['id', 'title', 'content', 'last_updated', 'version']
        read_only_fields = ['last_updated', 'id', 'version']

    def get_last_updated(self, obj):
        """Calculate and format the last updated time as 'X min ago'."""
        time_difference = now() - obj.updated_at
        minutes_ago = int(time_difference.total_seconds() // 60)
        return f"{minutes_ago} min ago" if minutes_ago > 0 else "Just now"
    

class DocumentAccessSerializer(ModelSerializer):
    permissions = ListField(
        child=ChoiceField(choices=[("read", "Read"), ("write", "Write")]),
        allow_empty=False
    )

    class Meta:
        model = DocumentAccessToken
        fields = ["permissions"]