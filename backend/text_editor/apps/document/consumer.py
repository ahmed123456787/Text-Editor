import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
import jwt
from django.conf import settings
from text_editor.apps.core.models import Document, OperationalLog
from django.db import transaction
from .utils import get_position_of_change_async

User = get_user_model()

class DocumentConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        """Handle new WebSocket connection with token authentication"""
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
            
            # Join room group
            await self.channel_layer.group_add(
                self.room_group_name,
                self.channel_name
            )
            
            # Accept the connection
            await self.accept()
            
            # Get the document content or the last log
            last_log = await self.get_last_log()
            if last_log:
                # Send the last log to the newly connected user
                await self.send(text_data=json.dumps({
                    'type': 'INITIALIZE',
                    'document': {
                        'id': str(self.document_id),
                        'content': last_log['updated_content'],
                        'version': last_log['version'],
                    },
                }))
            else:
                # Send the document content to the newly connected user
                document = await self.get_document()
                if not document:
                    await self.close()
                    return
                await self.send(text_data=json.dumps({
                    'type': 'INITIALIZE',
                    'document': {
                        'id': str(document['id']),
                        'content': document['content'],
                        'version': document['version'],
                    },
                }))
            
        except jwt.PyJWTError:
            # Reject connection if token is invalid
            await self.close()
    
    async def disconnect(self, close_code):
        """Handle WebSocket disconnection"""
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        """Handle messages received from WebSocket"""
        data = json.loads(text_data)
        print("Received data:", data)
        
        operation_type = data.get('type')
        
        if operation_type == 'UPDATE':
            # Process operation of update document content
            position, opertype, changed_content, last_version_log = await get_position_of_change_async(self.document_id, data['content'])
            success = await self.save_operation(self.document_id, opertype, position, data['content'], last_version_log)
            if not success:
                print(f"Failed to save operation for document_id: {self.document_id}")
                return
       
            # Build the last version of the document
            document = await self.get_document()
            if not document:
                await self.close()
                return            
        
            # Send message to room group using the document_update method.
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'document_update',
                    'document': {
                        'id': str(document['id']),
                        'content': data['content'],
                        'version': document['version'],
                    },
                }
            )
        
        elif operation_type == 'UNDO':
            # Process undo operation
            document_id = data.get('document_id', self.document_id)
            version = data.get('version')
            success, updated_document = await self.perform_undo(document_id, version)
            if success:
                await self.send(text_data=json.dumps({
                    'type': 'UNDO',
                    'success': True,
                    'document': updated_document,
                }))
            else:
                await self.send(text_data=json.dumps({
                    'type': 'UNDO',
                    'success': False,
                    'message': 'Nothing to undo',
                }))

    async def document_update(self, event):
        """Handle document_update messages from the channel layer"""
        # Forward the document update to the all connected to this room group
        await self.send(text_data=json.dumps({
            'type': 'UPDATE',
            'document': event['document'],
        }))

    @database_sync_to_async
    def get_user(self, user_id):
        """Get user by ID from database"""
        try:
            return User.objects.get(id=user_id)
        except User.DoesNotExist:
            return None
            
    @database_sync_to_async
    def get_document(self):
        """Get document by ID from database"""
        try:
            document = Document.objects.get(id=self.document_id)
            # Convert the document model to a serializable dictionary
            return {
                'id': str(document.id),
                'title': document.title,
                'content': document.content,
                'last_updated': document.updated_at.isoformat(),
                'version': document.current_version,
            }
        except Document.DoesNotExist:
            return None
    
    @database_sync_to_async
    def get_last_log(self):
        """Get the last operation log for the document"""
        try:
            last_log = OperationalLog.objects.filter(document_id=self.document_id).order_by('-version').first()
            if last_log:
                return {
                    'operation': last_log.operation,
                    'position': last_log.position,
                    'updated_content': last_log.updated_content,
                    'version': last_log.version,
                }
            return None
        except Exception as e:
            print(f"Error fetching last log: {e}")
            return None

    @database_sync_to_async
    def save_operation(self, document_id, operation_type, position, new_content, last_version_log):
        """Save operation log and update document if needed exceed the 50 version"""

        with transaction.atomic():
            try:
                # Get the document
                document = Document.objects.get(id=document_id)
                
                # Create operation log
                OperationalLog.objects.create(
                    document_id=document_id,
                    operation=operation_type,
                    position=position,
                    version=last_version_log + 1,
                    updated_content=new_content,
                )
                
                # Update document content every 50 versions
                if last_version_log % 50 == 0:
                    # Update document with new content
                    document.content = new_content
                
                # Increment document version
                document.current_version += 1
                document.save()
                
                return True
            except Exception as e:
                print(f"Error saving operation: {e}")
                return False

    @database_sync_to_async
    def perform_undo(self, document_id, version):
        """Perform undo operation by fetching the previous log entry"""
        try:
            # Get the document
            document = Document.objects.get(id=document_id)
            
            # Fetch the log entry for the specified version
            log_entry = OperationalLog.objects.filter(document=document, version=version - 1).first()
            if not log_entry:
                print("No previous log entry found for undo")
                return False, None
            
            
            updated_document = {
                'id': str(document.id),
                'title': document.title,
                'content': log_entry.updated_content,
                'last_updated': document.updated_at.isoformat(),
                'version': log_entry.version,
            }
            return True, updated_document
        
        except Exception as e:
            print(f"Error performing undo: {e}")
            import traceback
            traceback.print_exc()
            return False, None
