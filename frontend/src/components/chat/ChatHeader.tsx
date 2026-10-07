"use client";

import React, { useState, useEffect, useRef } from "react";
import { ChatSession } from "@/types";
import { Plus, Menu, PanelRight, FileText, Pencil, Check, X } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface ChatHeaderProps {
  currentSession: ChatSession;
  totalDocCount: number;
  isSplitViewOpen: boolean;
  onToggleSplitView: () => void;
  onNewChat: () => void;
  onToggleSidebar?: () => void;
  onOpenDocSelector?: () => void;
  onRenameSession: (id: string, newTitle: string) => void;
}

export function ChatHeader({
  currentSession,
  totalDocCount,
  isSplitViewOpen,
  onToggleSplitView,
  onNewChat,
  onToggleSidebar,
  onOpenDocSelector,
  onRenameSession,
}: ChatHeaderProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(currentSession.title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setEditTitle(currentSession.title);
    setIsEditing(false);
  }, [currentSession.id, currentSession.title]);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  const handleSave = () => {
    if (editTitle.trim()) {
      onRenameSession(currentSession.id, editTitle.trim());
    } else {
      setEditTitle(currentSession.title);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSave();
    } else if (e.key === "Escape") {
      setEditTitle(currentSession.title);
      setIsEditing(false);
    }
  };

  const selectedCount = currentSession.selectedDocIds.length;
  const scopeText =
    selectedCount > 0 && selectedCount < totalDocCount
      ? `${selectedCount} documents selected`
      : "All documents";

  return (
    <header className="h-14 border-b border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-950/70 backdrop-blur-xs px-4 flex items-center justify-between shrink-0 z-20">
      {/* Left: Mobile menu toggle + Title + Subtle scope */}
      <div className="flex items-center gap-2.5 min-w-0 flex-1 max-w-xl">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-1.5 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 rounded-md"
        >
          <Menu className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 min-w-0 flex-1">
          {isEditing ? (
            <div className="flex items-center gap-1 min-w-0 max-w-xs sm:max-w-md">
              <input
                ref={inputRef}
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={handleSave}
                className="w-full text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md px-2 py-0.5 focus:outline-none focus:ring-1 focus:ring-slate-400"
              />
              <button
                onClick={handleSave}
                className="p-1 text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400"
                title="Save title"
              >
                <Check className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => {
                  setEditTitle(currentSession.title);
                  setIsEditing(false);
                }}
                className="p-1 text-slate-400 hover:text-slate-600"
                title="Cancel"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="group/title flex items-center gap-1.5 min-w-0">
              <h2
                onClick={() => setIsEditing(true)}
                className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 truncate cursor-pointer hover:underline"
                title="Click to rename"
              >
                {currentSession.title || "New Chat"}
              </h2>
              <button
                onClick={() => setIsEditing(true)}
                className="opacity-0 group-hover/title:opacity-100 p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-opacity"
                title="Rename title"
              >
                <Pencil className="w-3 h-3" />
              </button>
            </div>
          )}

          <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">•</span>

          <button
            onClick={onOpenDocSelector}
            className="hidden sm:inline-flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 shrink-0"
            title="Click to filter documents for this chat"
          >
            <FileText className="w-3 h-3" />
            <span>{scopeText}</span>
          </button>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-1.5 shrink-0">
        <Button
          variant={isSplitViewOpen ? "secondary" : "outline"}
          size="sm"
          onClick={onToggleSplitView}
          className="text-xs gap-1.5"
          title="Toggle document view"
        >
          <PanelRight className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Document Viewer</span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onNewChat}
          className="text-xs gap-1"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">New Chat</span>
        </Button>
      </div>
    </header>
  );
}
