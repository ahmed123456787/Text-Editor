from channels.db import database_sync_to_async
from text_editor.apps.core.models import OperationalLog
import json
import copy


def get_position_of_change(document_id, new_content):
    """
    Get the position of changes between old and new content.
    
    Args:
        new_content (dict): The updated JSON content
        document_id (int): The ID of the document being updated
        
    Returns:
        tuple: (position, operation_type, changed_content, version)
            - position (int): The position of the first change
            - operation_type (str): 'insert' or 'delete'
            - changed_content (dict): The content that was inserted or deleted
            - version (int): The version number
    """
    
    print("new_content", new_content)
    last_log = OperationalLog.objects.filter(document_id=document_id).order_by('-version').first()
    if not last_log:
        return 0, 'insert', new_content, 1  # The First log return the first position with all content as new

    old_content = last_log.updated_content
    
    # Handle special cases for empty content
    if not old_content and new_content:
        return 0, 'insert', new_content, last_log.version + 1
    elif old_content and not new_content:
        return 0, 'delete', old_content, last_log.version + 1
    
    # For JSON content, we need to compare blocks differently
    # Get blocks from old and new content
    old_blocks = old_content.get('blocks', [])
    new_blocks = new_content.get('blocks', [])
    
    # Handle cases where blocks are different lengths
    if not old_blocks and new_blocks:
        # New blocks added to empty content
        return 0, 'insert', new_content, last_log.version + 1
    elif old_blocks and not new_blocks:
        # All blocks deleted
        return 0, 'delete', old_content, last_log.version + 1
    
    # Compare blocks to find what changed
    min_blocks = min(len(old_blocks), len(new_blocks))
    
    # Find first different block
    position = 0
    for i in range(min_blocks):
        if old_blocks[i] != new_blocks[i]:
            position = i
            break
        position = i + 1  # If we get here, all blocks so far match
    
    # Determine operation type based on block comparison
    if len(new_blocks) > len(old_blocks):
        # Blocks were added
        operation_type = 'insert'
        changed_content = new_content
    elif len(new_blocks) < len(old_blocks):
        # Blocks were deleted
        operation_type = 'delete'
        changed_content = old_content
    else:
        # Same number of blocks but different content
        # Here we're detecting changes within a block
        if position < len(old_blocks):
            # Check if it's a content change for a particular block type
            old_block_type = old_blocks[position].get('type', '')
            new_block_type = new_blocks[position].get('type', '')
            
            if old_block_type == 'image' or new_block_type == 'image':
                operation_type = 'image_insert' if new_block_type == 'image' else 'delete'
            else:
                # Check if content length changed to determine insert vs delete
                old_content_text = old_blocks[position].get('content', '')
                new_content_text = new_blocks[position].get('content', '')
                
                if len(new_content_text) >= len(old_content_text):
                    operation_type = 'insert'
                else:
                    operation_type = 'delete'
        else:
            # If position is beyond block length, it's likely a formatting change
            operation_type = 'insert'
        
        changed_content = new_content
    
    return position, operation_type, changed_content, last_log.version 


# New async-compatible function
@database_sync_to_async
def get_position_of_change_async(document_id, new_content):
    """Async wrapper for get_position_of_change function"""
    return get_position_of_change(document_id, new_content)


