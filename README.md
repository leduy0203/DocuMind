<div align="center">

# 🧠 DocuMind

**A Clean, Modern, and Professional AI Document Workspace with Cited Answers.**

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)](https://react.js.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

[Live Demo](#) · [Features](#-features) · [Architecture](#-architecture) · [Getting Started](#-getting-started) · [API Integration](#-backend-api-integration)

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
  - Drag-and-drop file ingestion supporting **PDF, DOCX, TXT, Markdown, CSV, and XLSX**.
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
  - Filter and scope which documents the AI should reference for any specific conversation.

- 🔐 **Authentication UI**:
  - Dedicated **Sign In (`/login`)** and **Sign Up (`/register`)** pages with form validation and social login options (Google & GitHub).

- 🌙 **Dark & Light Mode**:
  - Built-in theme toggle with accessible neutral color palettes.

---

## 🏗 Architecture & Project Structure

```text
KnowledgeHub/
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx             # Root layout with fonts & metadata
│   │   │   ├── page.tsx               # New chat / landing workspace
│   │   │   ├── globals.css            # Tailwind CSS & theme tokens
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
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18.17+ or v20+ / v22+
- **npm**, **pnpm**, or **yarn**

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/<your-username>/KnowledgeHub.git
   cd KnowledgeHub
   ```

2. Navigate to the `frontend` directory and install dependencies:
   ```bash
   cd frontend
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔌 Backend API Integration

The frontend includes a simulated intelligent RAG engine in `src/services/ragService.ts` for immediate prototyping. When your backend (e.g., **FastAPI**, **LangChain**, **LlamaIndex**) is ready, you can connect it via standard REST / SSE endpoints:

```typescript
// Example endpoint contract
POST /api/v1/chat
{
  "conversation_id": "6ac69d62-df44-83ec-9aee-03098d423443",
  "query": "What was the revenue in Q3 2025?",
  "document_ids": ["doc-1", "doc-2"],
  "stream": true
}
```

---

## 🛠 Tech Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **UI Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Markdown**: [React Markdown](https://github.com/remarkjs/react-markdown) + [Remark GFM](https://github.com/remarkjs/remark-gfm)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
