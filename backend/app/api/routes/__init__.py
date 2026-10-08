from fastapi import APIRouter
from app.api.routes.documents import router as documents_router
from app.api.routes.conversations import router as conversations_router
from app.api.routes.chat import router as chat_router

api_router = APIRouter(prefix="/api/v1")
api_router.include_router(documents_router)
api_router.include_router(conversations_router)
api_router.include_router(chat_router)
