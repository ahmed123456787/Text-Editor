import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
import jwt
from django.conf import settings
from text_editor.apps.core.models import Document

User = get_user_model()

class DocumentConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # Extract token from query string
        query_string = self.scope.get('query_string', b'').decode('utf-8')
        query_params = dict(param.split('=') for param in query_string.split('&') if '=' in param)
        token = query_params.get('token', None)
        
        if not token:
            # Reject connection if no token provided
            await self.close()
            return
        
        try:
            # Verify JWT token
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
            user_id = payload.get('user_id')
            
            if not user_id:
                await self.close()
                return
            
            # Authenticate user
            self.user = await self.get_user(user_id)
            if not self.user:
                await self.close()
                return
            
            # Get document ID from URL route
            self.document_id = self.scope['url_route']['kwargs']['document_id']
            self.room_group_name = f'document_{self.document_id}'
            
            # Get the document content
            document = await self.get_document()
            if not document:
                await self.close()
                return
                
            # Join room group
            await self.channel_layer.group_add(
                self.room_group_name,
                self.channel_name
            )
            
            # Accept the connection
            await self.accept()
            
            # Send document content to the newly connected user
            await self.send(text_data=json.dumps({
                'type': 'INITIALIZE',
                'document': document,
            }))
            
        except jwt.PyJWTError:
            # Reject connection if token is invalid
            await self.close()
    
    @database_sync_to_async
    def get_user(self, user_id):
        try:
            return User.objects.get(id=user_id)
        except User.DoesNotExist:
            return None
            
    @database_sync_to_async
    def get_document(self):
        try:
            document = Document.objects.get(id=self.document_id)
            # Convert the document model to a serializable dictionary
            return {
                'id': str(document.id),
                'title': document.title,
                'content': document.content,
                'last_updated': document.updated_at.isoformat(),
            }
        except Document.DoesNotExist:
            return None
            
    @database_sync_to_async
    def save_document_update(self, content):
        try:
            document = Document.objects.get(id=self.document_id)
            document.content = content
            document.save()
            return True
        except Document.DoesNotExist:
            return False

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        data = json.loads(text_data)
        print("data", data)
        
        # Save the update to the database if it contains content
        if 'content' in data:
            await self.save_document_update(data['content'])
            
        # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'document_update',  # Must match the method name
                'data': data,
                'user_id': str(self.user.id)
            }
        )
    
    async def document_update(self, event):
        # Send update to WebSocket
        await self.send(text_data=json.dumps({
            'type': 'UPDATE',
            'data': event['data'],
            'user_id': event['user_id']
        }))