"use client";

import React, { useState } from "react";
import { ChatMessage, Citation } from "@/types";
import { SourcesList } from "./CitationCard";
import { Copy, Check } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

interface ChatMessageItemProps {
  message: ChatMessage;
  onSelectCitation?: (citation: Citation) => void;
}

export function ChatMessageItem({
  message,
  onSelectCitation,
}: ChatMessageItemProps) {
  const [copied, setCopied] = useState(false);
  const isAssistant = message.role === "assistant";

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div
      className={cn(
        "group py-4 px-3 sm:px-4 rounded-xl transition-colors",
        isAssistant
          ? "bg-slate-50/60 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/60"
          : "bg-transparent"
      )}
    >
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">
          {isAssistant ? "Assistant" : "You"}
        </span>

        {isAssistant && !message.isStreaming && (
          <button
            onClick={handleCopy}
            className="opacity-0 group-hover:opacity-100 flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-opacity"
            title="Copy answer"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-500" />
                <span className="text-emerald-500">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>Copy</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Message Content */}
      <div className="prose prose-sm dark:prose-invert max-w-none text-slate-800 dark:text-slate-200 text-sm leading-relaxed">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            p({ children }) {
              return <p className="mb-2.5 last:mb-0">{children}</p>;
            },
            ul({ children }) {
              return <ul className="list-disc pl-5 mb-2.5 space-y-1">{children}</ul>;
            },
            ol({ children }) {
              return <ol className="list-decimal pl-5 mb-2.5 space-y-1">{children}</ol>;
            },
            strong({ children }) {
              return <strong className="font-semibold text-slate-900 dark:text-slate-100">{children}</strong>;
            },
          }}
        >
          {message.content}
        </ReactMarkdown>

        {message.isStreaming && (
          <span className="inline-block w-1.5 h-3.5 ml-1 bg-slate-400 animate-pulse align-middle" />
        )}
      </div>

      {/* Sources Card */}
      {isAssistant && message.citations && (
        <SourcesList
          citations={message.citations}
          onSelectCitation={onSelectCitation}
        />
      )}
    </div>
  );
}
