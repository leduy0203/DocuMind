<div align="center">

# 🧠 DocuMind

**A Clean, Modern, and Professional AI Document Workspace with Cited Answers.**

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?style=flat-square&logo=fastapi)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)](https://react.js.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Python](https://img.shields.io/badge/Python-3.12-3776AB?style=flat-square&logo=python)](https://www.python.org/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

[Live Demo](#) · [Features](#-features) · [Architecture](#-architecture) · [Getting Started & Run](#-getting-started--how-to-run) · [API Endpoints](#-api-endpoints)

</div>

---

## 📖 Overview

**DocuMind** is a production-grade document workspace designed for seamless document analysis and question answering powered by Retrieval-Augmented Generation (RAG). 

Unlike cluttered developer dashboards or noisy AI agent platforms, **DocuMind** focuses on the core user journey:
$$\text{Documents} \longrightarrow \text{Ask} \longrightarrow \text{Answer} \longrightarrow \text{Sources}$$

It provides a quiet, elegant SaaS experience with dedicated side-by-side document inspection, transparent source passages, and persistent conversation routing.

---

## ✨ Features

- 📑 **Document Management**:
  - Drag-and-drop file ingestion supporting **PDF, DOCX, TXT, Markdown, and XLSX**.
  - Document status indicator (`Indexed`, `Processing`, `Error`).
  - Document inspector showing file metadata, page counts, and extracted passages.

- 💬 **Clean AI Chat & Streaming Answers**:
  - Real-time token streaming with stop generation support.
  - Markdown formatting: tables, bullet lists, and syntax-highlighted code blocks.
  - Transparent **Sources & Citations** cards specifying document names, page numbers, and exact text excerpts.

- 📖 **Side-by-Side Document Viewer (Split View)**:
  - Inspect full document text alongside AI responses.
  - Clicking any cited source automatically opens the viewer and highlights the relevant passage.

- 🔗 **ChatGPT-Style URL Dynamic Routing (`/chat/[conversationId]`)**:
  - Each conversation is identified by a secure UUID.
  - Seamless page refresh (F5), multi-tab support, and browser back/forward history navigation.
  - Automatic URL assignment upon sending the first message.

- ✏️ **Inline Conversation Management**:
  - Rename conversation titles inline on the header or directly from the sidebar.
  - Delete and switch between past chat sessions effortlessly.

- 🎯 **Document Scope Filtering**:
  - Search across all documents by default, or optionally scope queries to specific files.

- 🔐 **Authentication UI**:
  - Dedicated **Sign In (`/login`)** and **Sign Up (`/register`)** pages with form validation and social login options (Google & GitHub).

- 🌙 **Dark & Light Mode**:
  - Built-in theme toggle with accessible neutral color palettes.

---

## 🏗 Architecture & Project Structure

```text
DocuMind/
├── frontend/                          # Next.js 16 App Router Frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx             # Root layout with fonts & metadata
│   │   │   ├── page.tsx               # New chat / landing workspace
│   │   │   ├── globals.css            # Tailwind CSS tokens
│   │   │   ├── chat/[id]/page.tsx     # Dynamic conversation route (/chat/[id])
│   │   │   ├── login/page.tsx         # Sign In authentication page
│   │   │   └── register/page.tsx      # Sign Up authentication page
│   │   ├── components/
│   │   │   ├── chat/                  # ChatHeader, ChatMessageItem, ChatInputArea, CitationCard
│   │   │   ├── documents/             # DocumentDetailsModal, DocumentScopeModal, DocumentUploadModal
│   │   │   ├── sidebar/               # Sidebar navigation & Session history
│   │   │   ├── split-view/            # SplitDocumentViewer (Side-by-side reader)
│   │   │   ├── ui/                    # Button, Badge, Modal dialog primitives
│   │   │   └── workspace/             # Unified ChatWorkspace state manager
│   │   ├── mock/                      # Mock document dataset & initial demo chats
│   │   ├── services/                  # RAG answer generation & streaming service
│   │   ├── types/                     # TypeScript interfaces
│   │   └── lib/                       # Utility helpers (cn, formatters, UUID generator)
│   ├── package.json
│   └── tsconfig.json
│
└── backend/                           # FastAPI Python RAG Backend
    ├── app/
    │   ├── api/
    │   │   └── routes/
    │   │       ├── documents.py       # Document upload, listing & deletion routes
    │   │       ├── conversations.py   # Conversation management & rename routes
    │   │       ├── chat.py            # RAG query & citation generation routes
    │   │       └── __init__.py        # API router aggregator (/api/v1)
    │   ├── core/
    │   │   ├── config.py              # Pydantic Settings & CORS configuration
    │   │   └── database.py            # SQLAlchemy engine & session factory
    │   ├── models/                    # SQLAlchemy database models
    │   ├── schemas/                   # Pydantic request/response schemas
    │   ├── services/                  # Business logic services
    │   └── rag/                       # Core RAG pipeline (Parser, Chunker, Embedder)
    ├── .env                           # Environment variables
    ├── .gitignore
    ├── requirements.txt               # Python package dependencies
    ├── main.py                        # FastAPI application instance
    └── run.py                         # Fast server starter script
```

---

## 🚀 Getting Started & How to Run

### Prerequisites

- **Node.js**: v18.17+ or v20+ / v22+
- **Python**: v3.10+ / v3.12+
- **Git**

---

### 1️⃣ Run Backend (FastAPI)

Open a terminal (PowerShell / Command Prompt) and run:

```powershell
# 1. Navigate to backend directory
cd D:\DocuMind\backend

# 2. Create and activate Python virtual environment
python -m venv .venv
.venv\Scripts\activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Start the Backend server
python run.py
```

- **Backend API Root**: [http://localhost:8000/](http://localhost:8000/)
- **Interactive Swagger Documentation**: [http://localhost:8000/docs](http://localhost:8000/docs)

---

### 2️⃣ Run Frontend (Next.js)

Open a second terminal window and run:

```powershell
# 1. Navigate to frontend directory
cd D:\DocuMind\frontend

# 2. Install dependencies (if not already installed)
npm install

# 3. Start the Next.js development server
npm run dev
```

- **Frontend App**: [http://localhost:3000](http://localhost:3000)
- **Sign In Page**: [http://localhost:3000/login](http://localhost:3000/login)
- **Sign Up Page**: [http://localhost:3000/register](http://localhost:3000/register)

---

## 🔌 API Endpoints

All backend endpoints are prefixed with `/api/v1`:

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/v1/documents/` | List all uploaded documents |
| `POST` | `/api/v1/documents/upload` | Upload & ingest document (PDF, DOCX, TXT, XLSX) |
| `GET` | `/api/v1/documents/{id}` | Get document metadata & status |
| `DELETE` | `/api/v1/documents/{id}` | Delete document and its vector chunks |
| `GET` | `/api/v1/conversations/` | List recent conversation sessions |
| `POST` | `/api/v1/conversations/` | Create a new conversation |
| `PATCH` | `/api/v1/conversations/{id}` | Rename conversation title |
| `DELETE` | `/api/v1/conversations/{id}` | Delete conversation |
| `POST` | `/api/v1/chat/` | Ask question & receive RAG response with citations |

---

## 🛠 Tech Stack

- **Frontend**: [Next.js 16](https://nextjs.org/), [React 19](https://react.dev/), [Tailwind CSS v4](https://tailwindcss.com/), [Framer Motion](https://www.framer.com/motion/), [Lucide Icons](https://lucide.dev/)
- **Backend**: [FastAPI](https://fastapi.tiangolo.com/), [Uvicorn](https://www.uvicorn.org/), [Pydantic v2](https://docs.pydantic.dev/)
- **Database & Vector Search**: [PostgreSQL](https://www.postgresql.org/) + [pgvector](https://github.com/pgvector/pgvector), [SQLAlchemy 2.0](https://www.sqlalchemy.org/)
- **Document Parsers**: `pypdf`, `python-docx`, `openpyxl`, `pandas`
- **AI & Embeddings**: [OpenAI Python SDK](https://github.com/openai/openai-python) (`text-embedding-3-small`, `gpt-4o-mini`)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
