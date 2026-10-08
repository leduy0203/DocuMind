from fastapi import APIRouter
from typing import List, Optional
from pydantic import BaseModel

router = APIRouter(prefix="/conversations", tags=["Conversations"])

class ConversationCreate(BaseModel):
    title: Optional[str] = "New Chat"

class RenameRequest(BaseModel):
    title: str

@router.get("/")
def list_conversations():
    """List recent conversations"""
    return {"conversations": []}

@router.post("/")
def create_conversation(data: ConversationCreate):
    """Create a new conversation session"""
    return {"id": "session-1", "title": data.title}

@router.get("/{conversation_id}")
def get_conversation(conversation_id: str):
    """Get conversation messages and history"""
    return {"id": conversation_id, "messages": []}

@router.patch("/{conversation_id}")
def rename_conversation(conversation_id: str, data: RenameRequest):
    """Rename a conversation"""
    return {"id": conversation_id, "title": data.title}

@router.delete("/{conversation_id}")
def delete_conversation(conversation_id: str):
    """Delete a conversation session"""
    return {"id": conversation_id, "deleted": True}
