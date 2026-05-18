"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import DocsLayout from "@/components/DocsLayout";
import { pickSections, randomHeading } from "@/lib/notes-filler";
import { useAiError } from "@/lib/ai-context";

const MAX_HISTORY_EXCHANGES = 10;

function LoadingSkeleton() {
  return (
    <div className="space-y-3 animate-pulse">
      <div className="h-4 bg-slate-100 rounded w-3/4" />
      <div className="h-4 bg-slate-100 rounded w-1/2" />
      <div className="h-4 bg-slate-100 rounded w-5/6" />
      <div className="h-4 bg-slate-100 rounded w-2/3" />
      <div className="h-4 bg-slate-100 rounded w-1/3" />
      <div className="h-4 bg-slate-100 rounded w-4/5" />
    </div>
  );
}

export default function NotesPage() {
  const router = useRouter();
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const processed = useRef(false);
  const { setHasError } = useAiError();

  useEffect(() => {
    if (processed.current) return;
    processed.current = true;

    const q = localStorage.getItem("ai_query") || "";

    if (!q.trim()) {
      router.replace("/");
      return;
    }

    const modelIndex = parseInt(localStorage.getItem("ai_model_index") || "0", 10);
    localStorage.removeItem("ai_query");

    const historyRaw = localStorage.getItem("ai_history");
    const history: { role: string; content: string }[] = historyRaw
      ? JSON.parse(historyRaw)
      : [];
    const messages = [...history, { role: "user", content: `Generate study notes covering: ${q}` }];

    const before = pickSections(2 + Math.floor(Math.random() * 2));
    const after = pickSections(2 + Math.floor(Math.random() * 2));
    const heading = randomHeading();

    fetch("/api/ai-ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages, modelIndex }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          setHasError(true);
          setLoading(false);
        } else {
          const padded = [
            heading,
            ...before,
            "---",
            data.content,
            "---",
            ...after,
            "",
            "---",
            "> **Exam Tip:** Review the material above in conjunction with the relevant lecture slides and practical worksheets. Understanding the broader context is as important as memorising individual facts.",
            "",
            "*References: EHAC lecture slides, practical lab worksheets, and assessment briefs. Cross-reference with topic-specific pages in the sidebar for additional depth.*",
          ].join("\n\n");
          setHasError(false);
          setContent(padded);
          setLoading(false);
          const updated = [
            ...history,
            { role: "user", content: q },
            { role: "assistant", content: data.content },
          ];
          const trimmed = updated.slice(-MAX_HISTORY_EXCHANGES * 2);
          localStorage.setItem("ai_history", JSON.stringify(trimmed));
        }
      })
      .catch(() => {
        setHasError(true);
        setLoading(false);
      });
  }, [router]);

  return (
    <DocsLayout>
      <div className="space-y-1 text-slate-700 leading-relaxed">
        {loading && <LoadingSkeleton />}

        {content && !loading && <MarkdownRenderer content={content} />}
      </div>
    </DocsLayout>
  );
}
