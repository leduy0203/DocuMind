"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  DocumentItem,
  ChatSession,
  ChatMessage,
  Citation,
} from "@/types";
import {
  MOCK_DOCUMENTS,
  INITIAL_CHAT_SESSIONS,
  SUBTLE_PROMPTS,
} from "@/mock/data";
import { generateRAGAnswer } from "@/services/ragService";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { ChatMessageItem } from "@/components/chat/ChatMessageItem";
import { ChatInputArea } from "@/components/chat/ChatInputArea";
import { SplitDocumentViewer } from "@/components/split-view/SplitDocumentViewer";
import { DocumentDetailsModal } from "@/components/documents/DocumentDetailsModal";
import { DocumentScopeModal } from "@/components/documents/DocumentScopeModal";
import { DocumentUploadModal } from "@/components/documents/DocumentUploadModal";
import { generateUUID } from "@/lib/utils";
import { FileText } from "lucide-react";

interface ChatWorkspaceProps {
  conversationId?: string;
}

const SESSIONS_STORAGE_KEY = "documind_chat_sessions";
const DOCUMENTS_STORAGE_KEY = "documind_documents";

const DEFAULT_NEW_SESSION: ChatSession = {
  id: "new",
  title: "New Chat",
  createdAt: "2026-10-08T00:00:00Z",
  updatedAt: "2026-10-08T00:00:00Z",
  messages: [],
  selectedDocIds: [],
};

export function ChatWorkspace({ conversationId }: ChatWorkspaceProps) {
  const router = useRouter();

  // Documents & Sessions State
  const [documents, setDocuments] = useState<DocumentItem[]>(MOCK_DOCUMENTS);
  const [sessions, setSessions] = useState<ChatSession[]>(INITIAL_CHAT_SESSIONS);
  const [currentSessionId, setCurrentSessionId] = useState<string>(conversationId || "new");
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydrate from localStorage on client side
  useEffect(() => {
    try {
      const savedDocs = localStorage.getItem(DOCUMENTS_STORAGE_KEY);
      if (savedDocs) setDocuments(JSON.parse(savedDocs));

      const savedSessions = localStorage.getItem(SESSIONS_STORAGE_KEY);
      if (savedSessions) setSessions(JSON.parse(savedSessions));
    } catch (e) {
      console.error(e);
    }
    setIsHydrated(true);
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(sessions));
      } catch (e) {
        console.error(e);
      }
    }
  }, [sessions, isHydrated]);

  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem(DOCUMENTS_STORAGE_KEY, JSON.stringify(documents));
      } catch (e) {
        console.error(e);
      }
    }
  }, [documents, isHydrated]);

  // Sync conversationId prop from URL
  useEffect(() => {
    if (conversationId) {
      setCurrentSessionId(conversationId);
    } else {
      setCurrentSessionId("new");
    }
  }, [conversationId]);

  // UI State
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSplitViewOpen, setIsSplitViewOpen] = useState(false);
  const [activeCitation, setActiveCitation] = useState<Citation | null>(null);

  // Modals
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isScopeOpen, setIsScopeOpen] = useState(false);
  const [selectedDetailDoc, setSelectedDetailDoc] = useState<DocumentItem | null>(null);

  // Streaming State
  const [isLoading, setIsLoading] = useState(false);
  const abortControllerRef = useRef<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Find active session
  const currentSession: ChatSession =
    sessions.find((s) => s.id === currentSessionId) || {
      ...DEFAULT_NEW_SESSION,
      id: currentSessionId,
    };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentSession.messages, isLoading]);

  // Citation Click
  const handleSelectCitation = (citation: Citation) => {
    setActiveCitation(citation);
    setIsSplitViewOpen(true);
  };

  // Preview document
  const handlePreviewDocument = (doc: DocumentItem) => {
    setIsSplitViewOpen(true);
  };

  // Send Message
  const handleSendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    abortControllerRef.current = false;
    setIsLoading(true);

    let activeId = currentSessionId;
    let isBrandNewSession = false;
    const nowTimestamp = new Date().toISOString();

    // If starting on a new chat session, generate UUID and update URL
    if (activeId === "new" || !sessions.some((s) => s.id === activeId)) {
      isBrandNewSession = true;
      activeId = generateUUID();
      setCurrentSessionId(activeId);
      // Smoothly update browser URL without triggering full page reload
      window.history.pushState({}, "", `/chat/${activeId}`);
    }

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: "user",
      content,
      timestamp: nowTimestamp,
    };

    const assistantMsgId = `msg-${Date.now() + 1}`;
    const initialAssistantMessage: ChatMessage = {
      id: assistantMsgId,
      role: "assistant",
      content: "",
      timestamp: nowTimestamp,
      isStreaming: true,
      citations: [],
    };

    const sessionTitle =
      content.slice(0, 32) + (content.length > 32 ? "..." : "");

    if (isBrandNewSession) {
      const newSession: ChatSession = {
        id: activeId,
        title: sessionTitle,
        createdAt: nowTimestamp,
        updatedAt: nowTimestamp,
        messages: [userMessage, initialAssistantMessage],
        selectedDocIds: currentSession.selectedDocIds,
      };
      setSessions((prev) => [newSession, ...prev]);
    } else {
      setSessions((prev) =>
        prev.map((s) =>
          s.id === activeId
            ? {
                ...s,
                updatedAt: nowTimestamp,
                messages: [...s.messages, userMessage, initialAssistantMessage],
              }
            : s
        )
      );
    }

    let streamAccumulator = "";

    try {
      const result = await generateRAGAnswer({
        query: content,
        documents,
        selectedDocIds: currentSession.selectedDocIds,
        onToken: (token) => {
          if (abortControllerRef.current) return;
          streamAccumulator += token;
          setSessions((prev) =>
            prev.map((s) =>
              s.id === activeId
                ? {
                    ...s,
                    messages: s.messages.map((m) =>
                      m.id === assistantMsgId
                        ? { ...m, content: streamAccumulator }
                        : m
                    ),
                  }
                : s
            )
          );
        },
      });

      if (!abortControllerRef.current) {
        setSessions((prev) =>
          prev.map((s) =>
            s.id === activeId
              ? {
                  ...s,
                  messages: s.messages.map((m) =>
                    m.id === assistantMsgId
                      ? {
                          ...m,
                          content: result.fullText,
                          citations: result.citations,
                          isStreaming: false,
                        }
                      : m
                  ),
                }
              : s
          )
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStopGeneration = () => {
    abortControllerRef.current = true;
    setIsLoading(false);
    setSessions((prev) =>
      prev.map((s) =>
        s.id === currentSession.id
          ? {
              ...s,
              messages: s.messages.map((m) =>
                m.isStreaming ? { ...m, isStreaming: false } : m
              ),
            }
          : s
      )
    );
  };

  const handleNewChat = () => {
    router.push("/");
  };

  const handleSelectSession = (id: string) => {
    router.push(`/chat/${id}`);
  };

  const handleDeleteSession = (id: string) => {
    const remaining = sessions.filter((s) => s.id !== id);
    setSessions(remaining);
    if (currentSessionId === id) {
      router.push("/");
    }
  };

  const handleRenameSession = (id: string, newTitle: string) => {
    const nowTimestamp = new Date().toISOString();
    setSessions((prev) =>
      prev.map((s) =>
        s.id === id
          ? { ...s, title: newTitle, updatedAt: nowTimestamp }
          : s
      )
    );
  };

  // Toggle doc scope
  const handleToggleDoc = (docId: string) => {
    setSessions((prev) =>
      prev.map((s) => {
        if (s.id !== currentSession.id) return s;
        const exists = s.selectedDocIds.includes(docId);
        return {
          ...s,
          selectedDocIds: exists
            ? s.selectedDocIds.filter((id) => id !== docId)
            : [...s.selectedDocIds, docId],
        };
      })
    );
  };

  const handleSelectAllDocs = () => {
    setSessions((prev) =>
      prev.map((s) =>
        s.id === currentSession.id
          ? { ...s, selectedDocIds: documents.map((d) => d.id) }
          : s
      )
    );
  };

  const handleClearAllDocs = () => {
    setSessions((prev) =>
      prev.map((s) =>
        s.id === currentSession.id ? { ...s, selectedDocIds: [] } : s
      )
    );
  };

  const handleDeleteDocument = (id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
    setSessions((prev) =>
      prev.map((s) => ({
        ...s,
        selectedDocIds: s.selectedDocIds.filter((dId) => dId !== id),
      }))
    );
  };

  const handleUploadSuccess = (newDoc: DocumentItem) => {
    setDocuments((prev) => [newDoc, ...prev]);
  };

  const activeScopedDocs = documents.filter((d) =>
    currentSession.selectedDocIds.includes(d.id)
  );

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-white dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 antialiased">
      {/* 1. Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        sessions={sessions}
        currentSessionId={currentSession.id}
        onSelectSession={handleSelectSession}
        onNewChat={handleNewChat}
        onDeleteSession={handleDeleteSession}
        onRenameSession={handleRenameSession}
        documents={documents}
        onOpenUpload={() => setIsUploadOpen(true)}
        onSelectDocumentDetail={(doc) => setSelectedDetailDoc(doc)}
      />

      {/* 2. Main Chat & Document Workspace */}
      <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative">
        {/* Header */}
        <ChatHeader
          currentSession={currentSession}
          totalDocCount={documents.length}
          isSplitViewOpen={isSplitViewOpen}
          onToggleSplitView={() => setIsSplitViewOpen(!isSplitViewOpen)}
          onNewChat={handleNewChat}
          onToggleSidebar={() => setIsSidebarOpen(true)}
          onOpenDocSelector={() => setIsScopeOpen(true)}
          onRenameSession={handleRenameSession}
        />

        {/* Center Canvas */}
        <div className="flex-1 flex min-h-0 relative overflow-hidden">
          {/* Main Chat Column (Messages + Pinned Bottom Input) */}
          <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative">
            {/* Scrollable Messages Area */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden min-h-0">
              {currentSession.messages.length === 0 ? (
                /* Calm Empty State */
                <div className="h-full flex flex-col items-center justify-center p-6 text-center max-w-lg mx-auto">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 flex items-center justify-center font-bold mb-3 border border-slate-200 dark:border-slate-800">
                    <FileText className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                    DocuMind Workspace
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm leading-relaxed">
                    Ask questions across your documents. Answers will cite specific source passages so you can verify information easily.
                  </p>

                  <div className="mt-6 flex flex-col gap-1.5 w-full text-left">
                    <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-0.5">
                      Example questions
                    </span>
                    {SUBTLE_PROMPTS.map((q, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(q)}
                        className="p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 hover:bg-slate-100 dark:bg-slate-900/40 dark:hover:bg-slate-900 text-xs text-slate-700 dark:text-slate-300 transition-colors text-left cursor-pointer"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                /* Messages List */
                <div className="max-w-3xl w-full mx-auto p-4 sm:p-6 space-y-4">
                  {currentSession.messages.map((message) => (
                    <ChatMessageItem
                      key={message.id}
                      message={message}
                      onSelectCitation={handleSelectCitation}
                    />
                  ))}
                  <div ref={messagesEndRef} className="h-2" />
                </div>
              )}
            </div>

            {/* Always Pinned Bottom Input Area */}
            <div className="shrink-0 w-full z-10">
              <ChatInputArea
                onSendMessage={handleSendMessage}
                isLoading={isLoading}
                onStopGeneration={handleStopGeneration}
                selectedDocs={activeScopedDocs}
                allDocs={documents}
                onOpenDocSelector={() => setIsScopeOpen(true)}
                onOpenUpload={() => setIsUploadOpen(true)}
                showSuggestions={currentSession.messages.length > 0}
              />
            </div>
          </div>

          {/* 3. Document Viewer Side Panel */}
          {isSplitViewOpen && (
            <SplitDocumentViewer
              documents={activeScopedDocs.length > 0 ? activeScopedDocs : documents}
              activeCitation={activeCitation}
              onClose={() => {
                setIsSplitViewOpen(false);
                setActiveCitation(null);
              }}
            />
          )}
        </div>
      </main>

      {/* Modals */}
      <DocumentUploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUploadSuccess={handleUploadSuccess}
      />

      <DocumentScopeModal
        isOpen={isScopeOpen}
        onClose={() => setIsScopeOpen(false)}
        documents={documents}
        selectedDocIds={currentSession.selectedDocIds}
        onToggleDoc={handleToggleDoc}
        onSelectAll={handleSelectAllDocs}
        onClearAll={handleClearAllDocs}
      />

      <DocumentDetailsModal
        isOpen={!!selectedDetailDoc}
        onClose={() => setSelectedDetailDoc(null)}
        document={selectedDetailDoc}
        onDelete={handleDeleteDocument}
        onPreview={handlePreviewDocument}
      />
    </div>
  );
}
