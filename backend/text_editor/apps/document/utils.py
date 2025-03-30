from channels.db import database_sync_to_async
from text_editor.apps.core.models import Document, OperationalLog


def get_position_of_change(document_id, new_content):
    """
    Get the position of changes between old and new content.
    
    Args:
        new_content (str): The updated content
        document_id (int): The ID of the document being updated
        
    Returns:
        tuple: (position, operation_type, changed_content)
            - position (int): The position of the first change
            - operation_type (str): 'insert' or 'delete'
            - changed_content (str): The content that was inserted or deleted
    """

    last_log = OperationalLog.objects.filter(document_id=document_id).order_by('-version').first()
    if not last_log:
        return 0, 'insert', new_content, 1  # The First log return the first position with all content as new

    old_content = last_log.updated_content
    
    # Handle special cases for empty content
    if not old_content and new_content:
        return 0, 'insert', new_content, last_log.version + 1
    elif old_content and not new_content:
        return 0, 'delete', old_content, last_log.version + 1
    
    # Find the common prefix length
    prefix_len = 0
    min_len = min(len(old_content), len(new_content))
    for i in range(min_len):
        if old_content[i] != new_content[i]:
            break
        prefix_len += 1
    
    # Find the common suffix length
    suffix_len = 0
    for i in range(1, min_len - prefix_len + 1):
        if old_content[-i] != new_content[-i]:
            break
        suffix_len += 1
    
    # Extract the middle parts that differ
    old_middle = old_content[prefix_len:len(old_content) - suffix_len]
    new_middle = new_content[prefix_len:len(new_content) - suffix_len]
    
    # Determine operation type
    if not old_middle and new_middle:
        # Pure insertion
        operation_type = 'insert'
        position = prefix_len
        changed_content = new_middle
    elif old_middle and not new_middle:
        # Pure deletion
        operation_type = 'delete'
        position = prefix_len
        changed_content = old_middle
    elif len(new_middle) > len(old_middle):
        # Mostly insertion with possible replacement
        operation_type = 'insert'
        position = prefix_len
        changed_content = new_middle
    else:
        # Mostly deletion with possible replacement
        operation_type = 'delete'
        position = prefix_len
        changed_content = old_middle
    
    return position, operation_type, changed_content, last_log.version 


# New async-compatible function
@database_sync_to_async
def get_position_of_change_async(document_id, new_content):
    """Async wrapper for get_position_of_change function"""
    return get_position_of_change(document_id, new_content)


