"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { topics } from "@/lib/notes-data";

type Result = {
  topicSlug: string;
  topicTitle: string;
  sectionId: string;
  sectionTitle: string;
  snippet: string;
};

export default function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const search = useCallback((q: string) => {
    if (!q.trim()) { setResults([]); return; }
    const lower = q.toLowerCase();
    const found: Result[] = [];
    for (const topic of topics) {
      for (const section of topic.sections) {
        const inTitle = section.title.toLowerCase().includes(lower);
        const inContent = section.content.toLowerCase().includes(lower);
        if (inTitle || inContent) {
          const src = inContent ? section.content : section.title;
          const idx = src.toLowerCase().indexOf(lower);
          const snippet = src.slice(Math.max(0, idx - 30), idx + 60);
          found.push({
            topicSlug: topic.slug,
            topicTitle: topic.shortTitle,
            sectionId: section.id,
            sectionTitle: section.title,
            snippet,
          });
          if (found.length >= 8) break;
        }
      }
      if (found.length >= 8) break;
    }
    setResults(found);
    setFocused(0);
  }, []);

  useEffect(() => { search(query); }, [query, search]);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    function keydown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        setOpen(true);
      }
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", keydown);
    return () => document.removeEventListener("keydown", keydown);
  }, []);

  const navigate = (r: Result) => {
    router.push(`/${r.topicSlug}#${r.sectionId}`);
    setOpen(false);
    setQuery("");
  };

  return (
    <div ref={ref} className="relative w-full max-w-sm">
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          ref={inputRef}
          type="search"
          placeholder="Search notes…"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") setFocused((f) => Math.min(f + 1, results.length - 1));
            if (e.key === "ArrowUp") setFocused((f) => Math.max(f - 1, 0));
            if (e.key === "Enter" && results[focused]) navigate(results[focused]);
          }}
          className="w-full border border-slate-200 rounded-xl pl-9 pr-16 py-2 text-sm bg-white outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent placeholder:text-slate-400"
        />
        <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 border border-slate-200 rounded px-1.5 py-0.5 font-mono hidden sm:block">
          ⌘K
        </kbd>
      </div>

      {open && results.length > 0 && (
        <div className="absolute top-full mt-1.5 w-full min-w-[360px] bg-white border border-slate-200 rounded-xl shadow-xl shadow-slate-200/50 z-50 overflow-hidden">
          {results.map((r, i) => (
            <button
              key={i}
              onClick={() => navigate(r)}
              className={`w-full text-left px-4 py-3 transition-colors border-b border-slate-100 last:border-0 ${
                i === focused ? "bg-teal-50" : "hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[10px] font-semibold text-teal-600 bg-teal-50 px-1.5 py-0.5 rounded">
                  {r.topicTitle}
                </span>
                <span className="text-xs font-medium text-slate-700">{r.sectionTitle}</span>
              </div>
              <div className="text-xs text-slate-400 truncate font-mono">…{r.snippet}…</div>
            </button>
          ))}
        </div>
      )}

      {open && query.trim() && results.length === 0 && (
        <div className="absolute top-full mt-1.5 w-full bg-white border border-slate-200 rounded-xl shadow-xl z-50 px-4 py-3">
          <p className="text-sm text-slate-400">No results for &ldquo;{query}&rdquo;</p>
        </div>
      )}
    </div>
  );
}
