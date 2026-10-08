from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter(prefix="/chat", tags=["Chat & RAG"])

class ChatRequest(BaseModel):
    conversation_id: Optional[str] = None
    query: str
    document_ids: Optional[List[str]] = []
    stream: Optional[bool] = False

@router.post("/")
async def send_chat_message(request: ChatRequest):
    """Send a question and get RAG synthesized answer with sources"""
    return {
        "conversation_id": request.conversation_id or "session-new",
        "answer": f"Echo: You asked '{request.query}'. RAG pipeline is ready to be hooked.",
        "citations": [
            {
                "document_name": "Sample_Document.pdf",
                "page": 1,
                "passage": "Sample relevant passage excerpt will be returned here."
            }
        ]
    }
