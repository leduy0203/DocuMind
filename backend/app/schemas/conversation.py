from pydantic import BaseModel
from typing import Optional, List, Any
from uuid import UUID
from datetime import datetime

# Schema for creating a new conversation
class ConversationCreate(BaseModel):
    title: Optional[str] = "New Chat"
    document_ids: Optional[List[UUID]] = []

# Schema for updating a conversation title or scoped documents
class ConversationUpdate(BaseModel):
    title: Optional[str] = None
    document_ids: Optional[List[UUID]] = None

# Schema for a single Message response
class MessageResponse(BaseModel):
    id: UUID
    conversation_id: UUID
    role: str
    content: str
    citations: Optional[List[Any]] = None
    created_at: datetime

    class Config:
        from_attributes = True

# Schema for Conversation list item (for Sidebar)
class ConversationListItem(BaseModel):
    id: UUID
    title: str
    created_at: datetime
    updated_at: datetime
    message_count: int = 0

    class Config:
        from_attributes = True

# Schema for Conversation detail with messages & scoped document IDs
class ConversationDetail(BaseModel):
    id: UUID
    title: str
    created_at: datetime
    updated_at: datetime
    selected_doc_ids: List[UUID] = []
    messages: List[MessageResponse] = []

    class Config:
        from_attributes = True
