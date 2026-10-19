from fastapi import APIRouter, Depends, status
from typing import List
from uuid import UUID
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.services.conversation_service import ConversationService
from app.schemas.conversation import (
    ConversationCreate,
    ConversationUpdate,
    ConversationListItem,
    ConversationDetail,
    MessageResponse,
)

router = APIRouter(prefix="/conversations", tags=["Conversations"])


@router.get("", response_model=List[ConversationListItem])
def list_conversations(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """List all conversations belonging to the current user"""
    return ConversationService.get_user_conversations(db=db, user_id=current_user.id)


@router.post("", response_model=ConversationDetail, status_code=status.HTTP_201_CREATED)
def create_conversation(
    data: ConversationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Create a new conversation session"""
    return ConversationService.create_conversation(
        db=db, user_id=current_user.id, data=data
    )


@router.get("/{conversation_id}", response_model=ConversationDetail)
def get_conversation(
    conversation_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get full conversation details, scoped documents, and message history"""
    return ConversationService.get_conversation_by_id(
        db=db, user_id=current_user.id, conversation_id=conversation_id
    )


@router.patch("/{conversation_id}", response_model=ConversationListItem)
def update_conversation(
    conversation_id: UUID,
    data: ConversationUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Rename a conversation or update its scoped documents"""
    return ConversationService.update_conversation(
        db=db,
        user_id=current_user.id,
        conversation_id=conversation_id,
        data=data,
    )


@router.delete("/{conversation_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_conversation(
    conversation_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Delete a conversation session"""
    ConversationService.delete_conversation(
        db=db, user_id=current_user.id, conversation_id=conversation_id
    )
    return None


@router.get("/{conversation_id}/messages", response_model=List[MessageResponse])
def get_conversation_messages(
    conversation_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get all messages for a specific conversation in chronological order"""
    return ConversationService.get_conversation_messages(
        db=db, user_id=current_user.id, conversation_id=conversation_id
    )
