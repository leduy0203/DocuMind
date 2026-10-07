"use client";

import React from "react";
import { DocumentItem } from "@/types";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { CheckSquare, Square, FileText } from "lucide-react";

interface DocumentScopeModalProps {
  isOpen: boolean;
  onClose: () => void;
  documents: DocumentItem[];
  selectedDocIds: string[];
  onToggleDoc: (id: string) => void;
  onSelectAll: () => void;
  onClearAll: () => void;
}

export function DocumentScopeModal({
  isOpen,
  onClose,
  documents,
  selectedDocIds,
  onToggleDoc,
  onSelectAll,
  onClearAll,
}: DocumentScopeModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Document Scope"
      description="Select which documents the assistant should reference for this chat."
      maxWidth="md"
    >
      <div className="space-y-3 text-xs">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <span className="text-slate-500">
            {selectedDocIds.length > 0
              ? `${selectedDocIds.length} of ${documents.length} selected`
              : "All documents enabled"}
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={selectedDocIds.length === documents.length ? onClearAll : onSelectAll}
              className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:underline"
            >
              {selectedDocIds.length === documents.length ? "Reset to all" : "Select all"}
            </button>
          </div>
        </div>

        <div className="space-y-1.5 max-h-[40vh] overflow-y-auto">
          {documents.map((doc) => {
            const isSelected = selectedDocIds.includes(doc.id);
            return (
              <div
                key={doc.id}
                onClick={() => onToggleDoc(doc.id)}
                className={`flex items-center justify-between p-2.5 rounded-lg border cursor-pointer transition-colors ${
                  isSelected
                    ? "bg-slate-100 dark:bg-slate-800/80 border-slate-300 dark:border-slate-700"
                    : "border-slate-200/80 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <FileText className="w-4 h-4 text-slate-400 shrink-0" />
                  <div className="min-w-0">
                    <p className="font-medium text-slate-800 dark:text-slate-200 truncate">
                      {doc.name}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {doc.pageCount ? `${doc.pageCount} pages` : "Document"}
                    </p>
                  </div>
                </div>

                <div className="text-slate-600 dark:text-slate-400">
                  {isSelected ? (
                    <CheckSquare className="w-4 h-4 text-slate-900 dark:text-slate-100" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-300 dark:text-slate-600" />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-end pt-3 border-t border-slate-100 dark:border-slate-800">
          <Button variant="primary" size="sm" onClick={onClose}>
            Apply Scope
          </Button>
        </div>
      </div>
    </Modal>
  );
}
