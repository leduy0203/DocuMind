import { apiClient } from "@/lib/api";
import { ChatSession, ChatMessage } from "@/types";

export interface ConversationListItemApi {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  message_count: number;
}

export interface MessageApi {
  id: string;
  conversation_id: string;
  role: "user" | "assistant" | "system";
  content: string;
  citations: any[] | null;
  created_at: string;
}

export interface ConversationDetailApi {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  selected_doc_ids: string[];
  messages: MessageApi[];
}

export interface CreateConversationPayload {
  title?: string;
  document_ids?: string[];
}

export interface UpdateConversationPayload {
  title?: string;
  document_ids?: string[];
}

export const conversationService = {
  /**
   * Fetch all conversations for current user
   */
  async getConversations(): Promise<ChatSession[]> {
    const list = await apiClient<ConversationListItemApi[]>("/api/v1/conversations");
    return list.map((item) => ({
      id: item.id,
      title: item.title,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
      messages: [],
      selectedDocIds: [],
    }));
  },

  /**
   * Create a new conversation session
   */
  async createConversation(payload: CreateConversationPayload): Promise<ChatSession> {
    const data = await apiClient<ConversationDetailApi>("/api/v1/conversations", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    return {
      id: data.id,
      title: data.title,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      messages: [],
      selectedDocIds: data.selected_doc_ids || [],
    };
  },

  /**
   * Get single conversation details with messages and scoped documents
   */
  async getConversationById(id: string): Promise<ChatSession> {
    const data = await apiClient<ConversationDetailApi>(`/api/v1/conversations/${id}`);

    const messages: ChatMessage[] = (data.messages || []).map((m) => ({
      id: m.id,
      role: m.role as "user" | "assistant",
      content: m.content,
      timestamp: m.created_at,
      citations: m.citations || [],
    }));

    return {
      id: data.id,
      title: data.title,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      messages,
      selectedDocIds: data.selected_doc_ids || [],
    };
  },

  /**
   * Rename a conversation title
   */
  async renameConversation(id: string, newTitle: string): Promise<void> {
    await apiClient(`/api/v1/conversations/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ title: newTitle }),
    });
  },

  /**
   * Delete a conversation
   */
  async deleteConversation(id: string): Promise<void> {
    await apiClient(`/api/v1/conversations/${id}`, {
      method: "DELETE",
    });
  },
};
