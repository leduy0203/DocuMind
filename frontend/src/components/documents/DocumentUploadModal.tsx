"use client";

import React, { useState, useRef } from "react";
import { DocumentItem, FileType } from "@/types";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { UploadCloud, File, CheckCircle2, Loader2 } from "lucide-react";
import { formatFileSize } from "@/lib/utils";

interface DocumentUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: (newDoc: DocumentItem) => void;
}

export function DocumentUploadModal({
  isOpen,
  onClose,
  onUploadSuccess,
}: DocumentUploadModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsProcessing(true);
    await new Promise((r) => setTimeout(r, 900));

    const ext = file.name.split(".").pop()?.toLowerCase() || "pdf";
    const fileType: FileType = ["pdf", "docx", "txt", "md", "csv", "xlsx"].includes(ext)
      ? (ext as FileType)
      : "pdf";

    const newDoc: DocumentItem = {
      id: `doc-${Date.now()}`,
      name: file.name,
      type: fileType,
      size: file.size,
      status: "Indexed",
      pageCount: Math.max(1, Math.floor(file.size / 90000)),
      createdAt: new Date().toISOString(),
      category: "Uploaded Documents",
      summary: `Indexed document ${file.name}. Ready for queries.`,
      passages: [
        {
          id: `p-${Date.now()}-1`,
          page: 1,
          text: `Sample content extracted from ${file.name}: The document has been processed and is ready for question answering.`,
        },
      ],
    };

    setIsProcessing(false);
    onUploadSuccess(newDoc);
    setFile(null);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        if (!isProcessing) {
          setFile(null);
          onClose();
        }
      }}
      title="Upload Document"
      description="Add documents (PDF, DOCX, TXT, Markdown, XLSX) to your workspace."
      maxWidth="md"
    >
      <div className="space-y-4 text-xs">
        {!file ? (
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-slate-50/50 dark:bg-slate-900/30"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,.txt,.md,.csv,.xlsx"
              className="hidden"
              onChange={handleFileChange}
            />
            <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center mb-2.5">
              <UploadCloud className="w-5 h-5" />
            </div>
            <p className="font-semibold text-slate-800 dark:text-slate-200">
              Click to select or drag and drop files
            </p>
            <p className="text-[11px] text-slate-400 mt-1">
              Supports PDF, DOCX, TXT, Markdown, XLSX
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
              <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center shrink-0">
                <File className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-slate-800 dark:text-slate-100 truncate">
                  {file.name}
                </p>
                <p className="text-[11px] text-slate-400">{formatFileSize(file.size)}</p>
              </div>
              {!isProcessing && (
                <button
                  onClick={() => setFile(null)}
                  className="text-[11px] text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                >
                  Change
                </button>
              )}
            </div>

            {isProcessing && (
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 text-xs">
                <Loader2 className="w-4 h-4 animate-spin text-slate-700 dark:text-slate-300" />
                <span>Processing and indexing document...</span>
              </div>
            )}
          </div>
        )}

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setFile(null);
              onClose();
            }}
            disabled={isProcessing}
          >
            Cancel
          </Button>

          {file && (
            <Button
              variant="primary"
              size="sm"
              onClick={handleUpload}
              isLoading={isProcessing}
            >
              Upload & Index
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
}
