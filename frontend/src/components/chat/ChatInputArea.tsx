"use client";

import React, { useState, useRef, useEffect } from "react";
import { ArrowUp, Paperclip, Square, FileText } from "lucide-react";
import { SUBTLE_PROMPTS } from "@/mock/data";
import { DocumentItem } from "@/types";
import { cn } from "@/lib/utils";

interface ChatInputAreaProps {
  onSendMessage: (content: string) => void;
  isLoading: boolean;
  onStopGeneration?: () => void;
  selectedDocs: DocumentItem[];
  allDocs: DocumentItem[];
  onOpenDocSelector: () => void;
  onOpenUpload: () => void;
  showSuggestions?: boolean;
}

export function ChatInputArea({
  onSendMessage,
  isLoading,
  onStopGeneration,
  selectedDocs,
  allDocs,
  onOpenDocSelector,
  onOpenUpload,
  showSuggestions = false,
}: ChatInputAreaProps) {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        120
      )}px`;
    }
  }, [input]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;
    onSendMessage(input.trim());
    setInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const scopeLabel =
    selectedDocs.length > 0 && selectedDocs.length < allDocs.length
      ? `${selectedDocs.length} docs`
      : "All docs";

  return (
    <div className="px-4 py-2.5 bg-white/90 dark:bg-slate-950/90 backdrop-blur-xs border-t border-slate-200/80 dark:border-slate-800/80">
      <div className="max-w-3xl mx-auto space-y-1.5">
        {/* Subtle Suggested Questions */}
        {showSuggestions && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar text-[11px]">
            <span className="text-slate-400 font-normal shrink-0">Try:</span>
            {SUBTLE_PROMPTS.slice(0, 3).map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setInput(prompt);
                  textareaRef.current?.focus();
                }}
                className="shrink-0 px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-slate-400 transition-colors text-left truncate max-w-[240px]"
              >
                "{prompt}"
              </button>
            ))}
          </div>
        )}

        {/* Compact Input Box */}
        <div className="relative rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus-within:ring-1 focus-within:ring-slate-400 focus-within:border-slate-400 transition-all shadow-2xs">
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a question about your documents..."
            className="w-full px-3 py-2 bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400 text-xs sm:text-sm focus:outline-none resize-none min-h-[38px] max-h-[120px] leading-relaxed"
          />

          {/* Compact Bottom Controls */}
          <div className="flex items-center justify-between px-2.5 py-1 text-xs border-t border-slate-100 dark:border-slate-800/60">
            <div className="flex items-center gap-1.5 text-slate-500">
              <button
                type="button"
                onClick={onOpenUpload}
                className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                title="Upload document"
              >
                <Paperclip className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={onOpenDocSelector}
                className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] sm:text-[11px] hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
                title="Filter active documents"
              >
                <FileText className="w-3 h-3" />
                <span>{scopeLabel}</span>
              </button>
            </div>

            {/* Send or Stop */}
            <div>
              {isLoading ? (
                <button
                  type="button"
                  onClick={onStopGeneration}
                  className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-medium hover:bg-slate-300 transition-colors"
                >
                  <Square className="w-2.5 h-2.5 fill-current" />
                  <span>Stop</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleSubmit()}
                  disabled={!input.trim()}
                  className={cn(
                    "flex items-center justify-center w-6 h-6 rounded-md transition-colors",
                    input.trim()
                      ? "bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:hover:bg-white dark:text-slate-950 cursor-pointer"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-300 dark:text-slate-600 cursor-not-allowed"
                  )}
                  title="Send message"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
