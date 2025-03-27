import asyncio
import websockets
import json
import jwt
from datetime import datetime, timedelta

# Configuration
DOCUMENT_ID = 1
SECRET_KEY = "django-insecure-3a&=lkq5^*7=#5_aw$^^a*1#5_-5qhlab___-hw9q*hs1m$aut"  # Must match Django's SECRET_KEY
USER_ID = 1  # Test user ID

async def test_websocket():
    # Generate JWT token for authentication
    token = jwt.encode({
        'user_id': USER_ID,
        'exp': datetime.utcnow() + timedelta(minutes=30)
    }, SECRET_KEY, algorithm='HS256')

    uri = f"ws://127.0.0.1:8000/ws/document/{DOCUMENT_ID}/?token={token}"
    
    try:
        async with websockets.connect(uri) as websocket:
            print(f"✅ Connected to document {DOCUMENT_ID}")

            # Simulate text editor operations
            test_operations = [
                {"type": "insert", "text": "Hello", "version": 1},
                {"type": "insert", "text": " world", "version": 2},
                {"type": "delete", "length": 5, "version": 3}
            ]

            for op in test_operations:
                # Send operation
                await websocket.send(json.dumps(op))
                print(f"📤 Sent operation: {op}")

                # Wait for acknowledgment
                response = await websocket.recv()
                print(f"📥 Server response: {response}")

                # Add delay to simulate real typing
                await asyncio.sleep(1)

            # Keep listening for updates from other clients
            while True:
                update = await websocket.recv()
                print(f"📥 Received update: {update}")
                await asyncio.sleep(0.1)

    except websockets.exceptions.ConnectionClosedOK:
        print("🛑 Connection closed normally")
    except websockets.exceptions.ConnectionClosedError:
        print("❌ Connection closed with error")
    except Exception as e:
        print(f"❌ Unexpected error: {str(e)}")

# Run the client
asyncio.get_event_loop().run_until_complete(test_websocket())