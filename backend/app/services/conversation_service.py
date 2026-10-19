from typing import List, Optional
from uuid import UUID
from sqlalchemy.orm import Session
from sqlalchemy import func
from fastapi import HTTPException, status

from app.models.conversation import Conversation
from app.models.message import Message
from app.models.document import Document
from app.schemas.conversation import (
    ConversationCreate,
    ConversationUpdate,
    ConversationListItem,
    ConversationDetail,
    MessageResponse,
)


class ConversationService:
    @staticmethod
    def get_user_conversations(db: Session, user_id: UUID) -> List[ConversationListItem]:
        """Fetch all conversations belonging to the user with message counts"""
        conversations = (
            db.query(
                Conversation.id,
                Conversation.title,
                Conversation.created_at,
                Conversation.updated_at,
                func.count(Message.id).label("message_count"),
            )
            .outerjoin(Message, Conversation.id == Message.conversation_id)
            .filter(Conversation.user_id == user_id)
            .group_by(Conversation.id)
            .order_by(Conversation.updated_at.desc())
            .all()
        )

        return [
            ConversationListItem(
                id=c.id,
                title=c.title,
                created_at=c.created_at,
                updated_at=c.updated_at,
                message_count=c.message_count,
            )
            for c in conversations
        ]

    @staticmethod
    def create_conversation(
        db: Session, user_id: UUID, data: ConversationCreate
    ) -> ConversationDetail:
        """Create a new conversation session with optional document scoping"""
        new_conv = Conversation(
            user_id=user_id,
            title=data.title or "New Chat",
        )

        if data.document_ids:
            docs = (
                db.query(Document)
                .filter(
                    Document.id.in_(data.document_ids),
                    Document.user_id == user_id,
                )
                .all()
            )
            new_conv.scoped_documents = docs

        db.add(new_conv)
        db.commit()
        db.refresh(new_conv)

        return ConversationDetail(
            id=new_conv.id,
            title=new_conv.title,
            created_at=new_conv.created_at,
            updated_at=new_conv.updated_at,
            selected_doc_ids=[doc.id for doc in new_conv.scoped_documents],
            messages=[],
        )

    @staticmethod
    def get_conversation_by_id(
        db: Session, user_id: UUID, conversation_id: UUID
    ) -> ConversationDetail:
        """Retrieve conversation by ID verifying user ownership"""
        conv = (
            db.query(Conversation)
            .filter(
                Conversation.id == conversation_id,
                Conversation.user_id == user_id,
            )
            .first()
        )

        if not conv:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Conversation not found",
            )

        return ConversationDetail(
            id=conv.id,
            title=conv.title,
            created_at=conv.created_at,
            updated_at=conv.updated_at,
            selected_doc_ids=[doc.id for doc in conv.scoped_documents],
            messages=[MessageResponse.model_validate(msg) for msg in conv.messages],
        )

    @staticmethod
    def update_conversation(
        db: Session, user_id: UUID, conversation_id: UUID, data: ConversationUpdate
    ) -> ConversationListItem:
        """Update conversation title or scoped documents"""
        conv = (
            db.query(Conversation)
            .filter(
                Conversation.id == conversation_id,
                Conversation.user_id == user_id,
            )
            .first()
        )

        if not conv:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Conversation not found",
            )

        if data.title is not None:
            conv.title = data.title.strip()

        if data.document_ids is not None:
            docs = (
                db.query(Document)
                .filter(
                    Document.id.in_(data.document_ids),
                    Document.user_id == user_id,
                )
                .all()
            )
            conv.scoped_documents = docs

        db.commit()
        db.refresh(conv)

        msg_count = db.query(Message).filter(Message.conversation_id == conv.id).count()

        return ConversationListItem(
            id=conv.id,
            title=conv.title,
            created_at=conv.created_at,
            updated_at=conv.updated_at,
            message_count=msg_count,
        )

    @staticmethod
    def delete_conversation(db: Session, user_id: UUID, conversation_id: UUID) -> None:
        """Delete conversation and cascade delete its messages"""
        conv = (
            db.query(Conversation)
            .filter(
                Conversation.id == conversation_id,
                Conversation.user_id == user_id,
            )
            .first()
        )

        if not conv:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Conversation not found",
            )

        db.delete(conv)
        db.commit()

    @staticmethod
    def get_conversation_messages(
        db: Session, user_id: UUID, conversation_id: UUID
    ) -> List[MessageResponse]:
        """Fetch messages for a verified user conversation"""
        conv = (
            db.query(Conversation)
            .filter(
                Conversation.id == conversation_id,
                Conversation.user_id == user_id,
            )
            .first()
        )

        if not conv:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Conversation not found",
            )

        messages = (
            db.query(Message)
            .filter(Message.conversation_id == conversation_id)
            .order_by(Message.created_at.asc())
            .all()
        )

        return [MessageResponse.model_validate(msg) for msg in messages]
