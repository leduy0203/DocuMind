export type FileType = "pdf" | "docx" | "txt" | "md" | "csv" | "xlsx";

export type DocumentStatus = "Indexed" | "Processing" | "Error";

export interface DocumentItem {
  id: string;
  name: string;
  type: FileType;
  size: number;
  status: DocumentStatus;
  pageCount?: number;
  createdAt: string;
  category?: string;
  summary?: string;
  contentSnippet?: string;
  passages?: {
    id: string;
    page?: number;
    text: string;
  }[];
}

export interface Citation {
  id: string;
  documentId: string;
  documentName: string;
  page?: number;
  passageText: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  citations?: Citation[];
  isStreaming?: boolean;
}

export interface ChatSession {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: ChatMessage[];
  selectedDocIds: string[]; // Scoped document IDs for this conversation
}
