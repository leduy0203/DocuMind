"use client";

import React from "react";
import { Citation } from "@/types";
import { FileText, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface SourcesListProps {
  citations?: Citation[];
  onSelectCitation?: (citation: Citation) => void;
}

export function SourcesList({ citations, onSelectCitation }: SourcesListProps) {
  if (!citations || citations.length === 0) return null;

  return (
    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80">
      <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
        Sources
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {citations.map((c) => (
          <div
            key={c.id}
            onClick={() => onSelectCitation?.(c)}
            className="group flex flex-col p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 hover:bg-slate-100/80 dark:hover:bg-slate-800/60 transition-colors cursor-pointer text-left"
          >
            <div className="flex items-center justify-between gap-1 mb-1">
              <div className="flex items-center gap-1.5 font-medium text-xs text-slate-800 dark:text-slate-200 truncate">
                <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate group-hover:text-slate-900 dark:group-hover:text-white">
                  {c.documentName}
                </span>
              </div>
              <ArrowUpRight className="w-3 h-3 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
              {c.page ? `Page ${c.page} · ` : ""}{c.passageText}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
