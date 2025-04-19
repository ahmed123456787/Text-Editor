import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
import jwt
from django.conf import settings
from text_editor.apps.core.models import Document, OperationalLog, DocumentAccessToken
from django.db import transaction
from .utils import get_position_of_change_async
from django.utils.timesince import timesince
from django.utils.timezone import now
from abc import ABC, abstractmethod
from enum import Enum 
import uuid


User = get_user_model()


class UserRole(Enum):
    READER = "Reader"
    WRITER = "Writer"


class BaseDocumentConsumer(AsyncWebsocketConsumer, ABC):
    role = None

    @abstractmethod
    async def connect(self):
        pass

    @abstractmethod
    async def receive(self, text_data):
        pass

    async def disconnect(self, close_code):
        """Handle WebSocket disconnection"""
        if self.room_group_name:  # Simply check if it's not None
            await self.channel_layer.group_discard(
                self.room_group_name,
                self.channel_name
            )

    async def document_update(self, event):
        await self.send(text_data=json.dumps({
            'type': 'UPDATE',
            'document': event['document'],
        }))

    @abstractmethod
    async def authenticate_user(self):
        pass

    @database_sync_to_async
    def get_user(self, user_id):
        try:
            return User.objects.get(id=user_id)
        except User.DoesNotExist:
            return None

    @database_sync_to_async
    def get_document(self, document_id):
        try:
            document = Document.objects.get(id=document_id)
            # Don't manipulate the content here, just use it as is
            content = document.content

            return {
                'id': str(document.id),
                'title': document.title,
                'content': content,
                'version': document.current_version,
                'last_updated': timesince(document.updated_at, now()) + " ago",
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

            # Ensure `updated_at` is a datetime object and calculate human-readable time
            last_updated_human = timesince(document.updated_at, now()) + " ago"
            updated_document = {
                'id': str(document.id),
                'title': document.title,
                'content': log_entry.updated_content,
                'last_updated': last_updated_human,
                'version': log_entry.version,
            }
            return True, updated_document

        except Exception as e:
            print(f"Error performing undo: {e}")
            import traceback
            traceback.print_exc()
            return False, None

    @database_sync_to_async
    def perform_redo(self, document_id, version):
        """Perform redo operation by fetching the next log entry"""
        try:
            # Get the document
            document = Document.objects.get(id=document_id)

            # Fetch the log entry for the specified version
            log_entry = OperationalLog.objects.filter(document=document, version=version + 1).first()
            if not log_entry:
                print("No next log entry found for redo")
                return False, None

            # Ensure `updated_at` is a datetime object and calculate human-readable time
            last_updated_human = timesince(document.updated_at, now()) + " ago"
            updated_document = {
                'id': str(document.id),
                'title': document.title,
                'content': log_entry.updated_content,
                'last_updated': last_updated_human,
                'version': log_entry.version,
            }
            return True, updated_document

        except Exception as e:
            print(f"Error performing redo: {e}")
            import traceback
            traceback.print_exc()
            return False, None

    @database_sync_to_async
    def save_operation(self, document_id, operation_type, position, new_content, last_version_log):
        """Save operation log and update document if needed exceed the 50 version"""
        with transaction.atomic():
            try:
                # Get the document
                document = Document.objects.get(id=document_id)

                # Process the content based on operation type
                processed_content = self._process_content(operation_type, new_content, position)
                print("processed_content", processed_content)   
                # Create operation log with additional metadata
                operation_data = {
                    'position': position,
                    'content_type': processed_content.get('type', 'text'),
                    'block_id': processed_content.get('block_id', str(uuid.uuid4()))
                }

                OperationalLog.objects.create(
                    document_id=document_id,
                    operation=operation_type,
                    position=position,
                    version=last_version_log + 1,
                    updated_content=processed_content,
                    operation_data=operation_data
                )

                # Always update document with new content
                document.content = processed_content

                # Increment document version
                document.current_version += 1
                document.save()

                return True
            except Exception as e:
                print(f"Error saving operation: {e}")
                return False

    def _process_content(self, operation_type, content, position):
        """Process and structure the content based on its type"""
        try:
            print("operation type", operation_type)
            print(type(content), " type of the content")
            
            # If content is a string, convert it to the proper structure
            if isinstance(content, str):
                content = {
                    "blocks": [],
                    "type": "text",
                    "content": content
                }
            
            # Ensure content has a blocks array
            if "blocks" not in content:
                content["blocks"] = []

            # Handle different operation types
            if operation_type == 'insert':
                # Add new block to the content
                block = {
                    "type": "text",  # Default to text, can be changed based on content
                    "content": content.get("content", ""),
                    "metadata": {
                        "position": position,
                        "style": {}
                    }
                }
                content["blocks"].insert(position, block)

            elif operation_type == 'image_insert':
                # Add image block to the content
                block = {
                    "type": "image",
                    "content": content.get("content", ""),  # This should be the image URL
                    "metadata": {
                        "position": position,
                        "style": {
                            "width": "100%",
                            "height": "auto"
                        }
                    }
                }
                content["blocks"].insert(position, block)

            elif operation_type == 'delete':
                pass
                # Remove block at the specified position
                # if position < len(content.get("blocks", [])):
                #     content["blocks"].pop(position)
            
            print("blocks", content)
            return content

        except Exception as e:
            print(f"Error processing content: {e}")
            return content


class DocumentConsumer(BaseDocumentConsumer):
    role = UserRole.WRITER  # Define role as WRITER (Owner)

    async def connect(self):
        """Handle new WebSocket connection with token authentication"""
        # Extract token from query string
        query_string = self.scope.get('query_string', b'').decode('utf-8')
        print(f"Query params: {query_string}")
        query_params = dict(param.split('=') for param in query_string.split('&') if '=' in param)
        token = query_params.get('token', None)
        print(f"Token: {token}")
        if not token:
            # Reject connection if no token provided
            await self.close()
            return

        try:
            # Verify JWT token
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
            print(f"Payload: {payload}")
            user_id = payload.get('user_id')
            print(f"User ID: {user_id}")
            if not user_id:
                await self.close()
                return

            # Authenticate user
            self.user = await self.get_user(user_id)
            print(f"User: {self.user}")
            if not self.user:
                await self.close()
                return

            # Get document ID from URL route
            self.document_id = self.scope['url_route']['kwargs'].get('document_id')
            if not self.document_id:
                print("Document ID not found in URL route")
                await self.close()
                return

            # Initialize room group name
            self.room_group_name = f'document_{self.document_id}'
            print(f"Room group name: {self.room_group_name}")

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
                print("last_log", last_log)
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
                document = await self.get_document(self.document_id)
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

        except jwt.PyJWTError as e:
            # Reject connection if token is invalid
            print("Invalid token", e)
            await self.close()
            

    async def authenticate_user(self):
        query_string = self.scope.get('query_string', b'').decode('utf-8')
        query_params = dict(param.split('=') for param in query_string.split('&') if '=' in param)
        token = query_params.get('token')

        if not token:
            return None

        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
            user_id = payload.get('user_id')
            return await self.get_user(user_id)
        except jwt.PyJWTError:
            return None

    async def disconnect(self, close_code):
        """Handle WebSocket disconnection"""
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        """Handle messages received from WebSocket Client"""
        if self.role != UserRole.WRITER:
            await self.send(text_data=json.dumps({'error': 'Permission denied'}))
            return

        data = json.loads(text_data)
        print("Received data:", data)

        operation_type = data.get('type')
        content = data.get('content')
        position = data.get('position')

        if operation_type == 'UPDATE':
            # Process string content into proper structure
            if isinstance(content, str):
                structured_content = {
                    "blocks": [],
                    "type": "text",
                    "content": content
                }
                content = structured_content
                
            # Process operation of update document content
            position, opertype, changed_content, last_version_log = await get_position_of_change_async(self.document_id, content)
            success = await self.save_operation(self.document_id, opertype, position, content, last_version_log)
            if not success:
                print(f"Failed to save operation for document_id: {self.document_id}")
                return

            # Build the last version of the document
            document = await self.get_document(self.document_id)
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
                        'content': document['content'],
                        'version': document['version'],
                    },
                }
            )

        elif operation_type == 'IMAGE_INSERT':
            # Handle image insertion
            success = await self.save_operation(self.document_id, 'image_insert', position, content, document['version'])
            if success:
                document = await self.get_document(self.document_id)
                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        'type': 'document_update',
                        'document': {
                            'id': str(document['id']),
                            'content': document['content'],
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

        elif operation_type == 'REDO':
            # Process redo operation
            document_id = data.get('document_id', self.document_id)
            version = data.get('version')
            success, updated_document = await self.perform_redo(document_id, version)
            if success:
                await self.send(text_data=json.dumps({
                    'type': 'REDO',
                    'success': True,
                    'document': updated_document,
                }))
            else:
                await self.send(text_data=json.dumps({
                    'type': 'REDO',
                    'success': False,
                    'message': 'Nothing to redo',
                }))




class GuestDocumentConsumer(BaseDocumentConsumer):
    role = None  # Role will be determined based on the token

    async def connect(self):
        """Handle new WebSocket connection with token-based permissions"""
        print("guest hello")
        self.user, self.role,self.document_id = await self.authenticate_user()
        print(f"User: {self.user}, Role: {self.role}")

        if not self.user or not self.role:
            await self.close()
            return

        # Get document ID from URL route

        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

        document = await self.get_document(self.document_id)
        if document:
            print("test",self.role)
            await self.send(text_data=json.dumps({'type': 'INITIALIZE', 'document': document,'role': self.role}))
        else:
            await self.close()

    @database_sync_to_async
    def authenticate_user(self):
        """Authenticate user and determine role based on token"""
        
        shared_id_value = self.scope['url_route']['kwargs'].get('shared_id')
        print("hello from the shared ", shared_id_value)
        if not shared_id_value:
            return None, None, None  # Make sure to return 3 values

        try:
            token = DocumentAccessToken.objects.get(shared_id=shared_id_value)
            print("shared id permissions:", token.permissions)
            
            # Initialize room_group_name here
            self.room_group_name = f'document_{token.document.id}'
            
            # Check permissions correctly - MultiSelectField stores as comma-separated string
            if 'write' in token.permissions:
                print("Giving writer access")
                return token.document.user, UserRole.WRITER.value, token.document.id
            elif 'read' in token.permissions:
                print("Giving reader access")
                return token.document.user, UserRole.READER.value, token.document.id
            else:
                print("No valid permissions")
                return None, None, None
        except DocumentAccessToken.DoesNotExist:
            print("Token not found")
            return None, None, None

    async def receive(self, text_data):
        """Handle messages received from WebSocket Client"""
        if self.role == UserRole.READER:
            await self.send(text_data=json.dumps({'error': 'Permission denied: Read-only access'}))
            return

        if self.role == UserRole.WRITER:
            data = json.loads(text_data)
            operation_type = data.get('type')
            content = data.get('content')
            position = data.get('position')

            if operation_type == 'UPDATE':
                # Process string content into proper structure
                if isinstance(content, str):
                    structured_content = {
                        "blocks": [],
                        "type": "text",
                        "content": content
                    }
                    content = structured_content
                
                position, opertype, changed_content, last_version_log = await get_position_of_change_async(self.document_id, content)
                success = await self.save_operation(self.document_id, opertype, position, content, last_version_log)
                if not success:
                    return

                document = await self.get_document(self.document_id)
                if not document:
                    await self.close()
                    return

                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        'type': 'document_update',
                        'document': {
                            'id': str(document['id']),
                            'content': document['content'],
                            'version': document['version'],
                        },
                    }
                )

            elif operation_type == 'IMAGE_INSERT':
                # Handle image insertion
                success = await self.save_operation(self.document_id, 'image_insert', position, content, document['version'])
                if success:
                    document = await self.get_document(self.document_id)
                    await self.channel_layer.group_send(
                        self.room_group_name,
                        {
                            'type': 'document_update',
                            'document': {
                                'id': str(document['id']),
                                'content': document['content'],
                                'version': document['version'],
                            },
                        }
                    )

    async def document_update(self, event):
        """Handle document updates and broadcast to all connected users"""
        await self.send(text_data=json.dumps({
            'type': 'UPDATE',
            'document': event['document'],
        }))
