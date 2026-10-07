"use client";

import React from "react";
import { DocumentItem } from "@/types";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { FileText, Trash2, RotateCw, ExternalLink } from "lucide-react";
import { formatFileSize, formatDate } from "@/lib/utils";

interface DocumentDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: DocumentItem | null;
  onDelete: (id: string) => void;
  onPreview: (doc: DocumentItem) => void;
}

export function DocumentDetailsModal({
  isOpen,
  onClose,
  document,
  onDelete,
  onPreview,
}: DocumentDetailsModalProps) {
  if (!document) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={document.name}
      description={document.category || "Document Details"}
      maxWidth="md"
    >
      <div className="space-y-4 text-xs">
        {/* Basic metadata grid */}
        <div className="grid grid-cols-2 gap-3 p-3.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
          <div>
            <span className="text-slate-400 block mb-0.5">File Type:</span>
            <span className="font-semibold uppercase text-slate-800 dark:text-slate-200">
              {document.type}
            </span>
          </div>

          <div>
            <span className="text-slate-400 block mb-0.5">File Size:</span>
            <span className="font-medium text-slate-800 dark:text-slate-200">
              {formatFileSize(document.size)}
            </span>
          </div>

          <div>
            <span className="text-slate-400 block mb-0.5">Pages / Length:</span>
            <span className="font-medium text-slate-800 dark:text-slate-200">
              {document.pageCount ? `${document.pageCount} pages` : "Standard"}
            </span>
          </div>

          <div>
            <span className="text-slate-400 block mb-0.5">Status:</span>
            <Badge variant="success">{document.status}</Badge>
          </div>
        </div>

        {/* Summary (if available) */}
        {document.summary && (
          <div>
            <span className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Summary
            </span>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed bg-slate-50/50 dark:bg-slate-900/40 p-3 rounded-lg border border-slate-200/60 dark:border-slate-800">
              {document.summary}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              onDelete(document.id);
              onClose();
            }}
            className="text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Document</span>
          </Button>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                onClose();
                onPreview(document);
              }}
              className="gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Preview</span>
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
