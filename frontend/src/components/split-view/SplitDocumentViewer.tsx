"use client";

import React, { useState, useEffect } from "react";
import { DocumentItem, Citation } from "@/types";
import { X, FileText, Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface SplitDocumentViewerProps {
  documents: DocumentItem[];
  activeCitation: Citation | null;
  onClose: () => void;
}

export function SplitDocumentViewer({
  documents,
  activeCitation,
  onClose,
}: SplitDocumentViewerProps) {
  const [selectedDocId, setSelectedDocId] = useState<string>(
    activeCitation?.documentId || documents[0]?.id || ""
  );
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (activeCitation) {
      setSelectedDocId(activeCitation.documentId);
    }
  }, [activeCitation]);

  const currentDoc = documents.find((d) => d.id === selectedDocId) || documents[0];

  if (!currentDoc) return null;

  const passages = currentDoc.passages || [];
  const filteredPassages = passages.filter((p) =>
    p.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <aside className="w-full md:w-[400px] lg:w-[440px] xl:w-[480px] h-full border-l border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-950 flex flex-col z-10 shrink-0">
      {/* Header */}
      <div className="h-14 px-4 border-b border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <FileText className="w-4 h-4 text-slate-400 shrink-0" />
          <div className="min-w-0">
            <h3 className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
              {currentDoc.name}
            </h3>
            <p className="text-[11px] text-slate-400">
              {currentDoc.pageCount ? `${currentDoc.pageCount} pages` : "Document"}
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Close viewer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Doc Selector tabs & search */}
      <div className="p-3 border-b border-slate-200/60 dark:border-slate-800/60 space-y-2">
        {documents.length > 1 && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
            {documents.map((doc) => (
              <button
                key={doc.id}
                onClick={() => setSelectedDocId(doc.id)}
                className={cn(
                  "shrink-0 px-2.5 py-1 rounded-md text-xs font-medium truncate max-w-[140px] transition-colors border",
                  selectedDocId === doc.id
                    ? "bg-slate-900 text-white border-slate-900 dark:bg-slate-100 dark:text-slate-950 dark:border-slate-100"
                    : "bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-100"
                )}
              >
                {doc.name}
              </button>
            ))}
          </div>
        )}

        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search document content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400"
          />
        </div>
      </div>

      {/* Document Content Passages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filteredPassages.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-400">
            No matching passages found.
          </div>
        ) : (
          filteredPassages.map((passage, idx) => {
            const isHighlighted =
              activeCitation &&
              activeCitation.documentId === currentDoc.id &&
              activeCitation.passageText === passage.text;

            return (
              <div
                key={passage.id || idx}
                className={cn(
                  "p-3 rounded-lg border text-xs leading-relaxed transition-colors",
                  isHighlighted
                    ? "border-slate-900 dark:border-slate-100 bg-slate-50 dark:bg-slate-900 ring-1 ring-slate-900/10 dark:ring-slate-100/10"
                    : "border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-950"
                )}
              >
                <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5">
                  <span>{passage.page ? `Page ${passage.page}` : `Section ${idx + 1}`}</span>
                  {isHighlighted && (
                    <span className="font-semibold text-slate-900 dark:text-slate-100">
                      Cited Source
                    </span>
                  )}
                </div>
                <p className="text-slate-800 dark:text-slate-200 select-text">
                  {passage.text}
                </p>
              </div>
            );
          })
        )}
      </div>
    </aside>
  );
}
