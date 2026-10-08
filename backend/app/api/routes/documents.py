from fastapi import APIRouter, UploadFile, File, HTTPException
from typing import List

router = APIRouter(prefix="/documents", tags=["Documents"])

@router.get("/")
def list_documents():
    """Get all uploaded documents"""
    return {"documents": []}

@router.post("/upload")
async def upload_document(file: UploadFile = File(...)):
    """Upload and process a document (PDF, DOCX, TXT, XLSX)"""
    return {
        "filename": file.filename,
        "status": "received",
        "message": "File received. Processing pipeline will be integrated."
    }

@router.get("/{document_id}")
def get_document(document_id: str):
    """Get specific document details"""
    return {"id": document_id, "status": "Indexed"}

@router.delete("/{document_id}")
def delete_document(document_id: str):
    """Delete a document and its vector chunks"""
    return {"id": document_id, "deleted": True}
