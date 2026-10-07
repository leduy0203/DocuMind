"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChatSession, DocumentItem } from "@/types";
import {
  FileText,
  Plus,
  Trash2,
  MessageSquare,
  Moon,
  Sun,
  X,
  Pencil,
  Check,
  LogOut,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  sessions: ChatSession[];
  currentSessionId: string;
  onSelectSession: (id: string) => void;
  onNewChat: () => void;
  onDeleteSession: (id: string) => void;
  onRenameSession: (id: string, newTitle: string) => void;
  documents: DocumentItem[];
  onOpenUpload: () => void;
  onSelectDocumentDetail: (doc: DocumentItem) => void;
}

export function Sidebar({
  isOpen,
  onClose,
  sessions,
  currentSessionId,
  onSelectSession,
  onNewChat,
  onDeleteSession,
  onRenameSession,
  documents,
  onOpenUpload,
  onSelectDocumentDetail,
}: SidebarProps) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const startRename = (session: ChatSession, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingSessionId(session.id);
    setEditingTitle(session.title);
  };

  const saveRename = (id: string, e?: React.FormEvent | React.MouseEvent) => {
    e?.stopPropagation();
    if (editingTitle.trim()) {
      onRenameSession(id, editingTitle.trim());
    }
    setEditingSessionId(null);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-30 lg:hidden"
        />
      )}

      <aside
        className={cn(
          "fixed lg:static top-0 bottom-0 left-0 z-40 w-72 bg-slate-50/80 dark:bg-slate-900/90 text-slate-800 dark:text-slate-200 flex flex-col border-r border-slate-200/80 dark:border-slate-800/80 transition-transform duration-150 ease-in-out shrink-0",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* App Logo + Name: DocuMind */}
        <div className="h-14 px-4 border-b border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 flex items-center justify-center font-bold text-sm">
              D
            </div>
            <span className="font-semibold text-sm tracking-tight text-slate-900 dark:text-slate-100">
              DocuMind
            </span>
          </Link>

          <button
            onClick={onClose}
            className="lg:hidden p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-md"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* New Chat Action */}
        <div className="p-3 border-b border-slate-200/60 dark:border-slate-800/60">
          <button
            onClick={() => {
              onNewChat();
              onClose();
            }}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:hover:bg-white dark:text-slate-900 text-xs font-medium transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Chat</span>
          </button>
        </div>

        {/* Scrollable Content: Documents + Recent Conversations */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-200/60 dark:divide-slate-800/60">
          {/* Section 1: Documents */}
          <div className="p-3">
            <div className="flex items-center justify-between px-1 pb-2">
              <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                Documents ({documents.length})
              </span>
              <button
                onClick={onOpenUpload}
                className="flex items-center gap-1 text-[11px] font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:underline cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                Upload
              </button>
            </div>

            <div className="space-y-1">
              {documents.length === 0 ? (
                <p className="text-xs text-slate-400 px-1 py-2 italic">
                  No documents uploaded yet.
                </p>
              ) : (
                documents.map((doc) => (
                  <div
                    key={doc.id}
                    onClick={() => onSelectDocumentDetail(doc)}
                    className="group flex items-start justify-between gap-2 p-2 rounded-lg hover:bg-slate-200/50 dark:hover:bg-slate-800/60 cursor-pointer transition-colors text-left"
                  >
                    <div className="flex items-start gap-2 min-w-0 flex-1">
                      <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium text-slate-800 dark:text-slate-200 truncate group-hover:text-slate-900 dark:group-hover:text-white">
                          {doc.name}
                        </p>
                        <p className="text-[11px] text-slate-400">
                          {doc.pageCount ? `${doc.pageCount} pages` : "Document"}
                        </p>
                      </div>
                    </div>

                    <span className="text-[10px] text-slate-400 dark:text-slate-500 shrink-0 mt-0.5">
                      {doc.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Section 2: Recent Conversations */}
          <div className="p-3">
            <div className="px-1 pb-2 text-[11px] font-medium text-slate-500 uppercase tracking-wider">
              Recent Conversations
            </div>

            <div className="space-y-0.5">
              {sessions.length === 0 ? (
                <p className="text-xs text-slate-400 px-1 py-2 italic">
                  No conversations yet.
                </p>
              ) : (
                sessions.map((session) => {
                  const isActive = session.id === currentSessionId;
                  const isEditingThis = editingSessionId === session.id;

                  if (isEditingThis) {
                    return (
                      <div
                        key={session.id}
                        className="flex items-center gap-1.5 p-1 rounded-lg bg-slate-200/80 dark:bg-slate-800 text-xs"
                      >
                        <input
                          type="text"
                          value={editingTitle}
                          onChange={(e) => setEditingTitle(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") saveRename(session.id, e);
                            if (e.key === "Escape") setEditingSessionId(null);
                          }}
                          autoFocus
                          className="w-full bg-white dark:bg-slate-900 px-2 py-1 rounded text-xs text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700 focus:outline-none"
                        />
                        <button
                          onClick={(e) => saveRename(session.id, e)}
                          className="p-1 text-slate-600 dark:text-slate-300 hover:text-emerald-600"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingSessionId(null);
                          }}
                          className="p-1 text-slate-400 hover:text-slate-600"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={session.id}
                      onClick={() => {
                        onSelectSession(session.id);
                        onClose();
                      }}
                      className={cn(
                        "group flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg text-xs cursor-pointer transition-colors",
                        isActive
                          ? "bg-slate-200/80 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium"
                          : "text-slate-600 dark:text-slate-400 hover:bg-slate-200/40 dark:hover:bg-slate-800/40"
                      )}
                    >
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <MessageSquare className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{session.title}</span>
                      </div>

                      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => startRename(session, e)}
                          className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded"
                          title="Rename title"
                        >
                          <Pencil className="w-3 h-3" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteSession(session.id);
                          }}
                          className="p-1 text-slate-400 hover:text-rose-500 rounded"
                          title="Delete conversation"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Footer: User Profile + Theme toggle */}
        <div className="p-3 border-t border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
          <Link
            href="/login"
            className="flex items-center gap-2 min-w-0 flex-1 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
            title="Account / Sign in"
          >
            <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center text-[10px] font-bold shrink-0">
              U
            </div>
            <div className="min-w-0 flex-1 truncate text-left">
              <p className="text-xs font-medium text-slate-800 dark:text-slate-200 truncate leading-tight">
                Duy Nguyen
              </p>
              <p className="text-[10px] text-slate-400 truncate">duy@documind.io</p>
            </div>
          </Link>

          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-md hover:bg-slate-200/60 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
              title="Toggle Theme"
            >
              {isDarkMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            </button>
            <Link
              href="/login"
              className="p-1.5 rounded-md hover:bg-slate-200/60 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
              title="Sign out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
