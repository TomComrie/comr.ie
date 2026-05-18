"use client";

import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import { getGlossaryEntry, type GlossaryEntry } from "@/lib/glossary";

type GlossaryPanelContextValue = {
  openGlossary: (term: string) => void;
  closeGlossary: () => void;
};

const GlossaryPanelContext = createContext<GlossaryPanelContextValue | null>(null);

function GlossaryPanelBody({ entry, onClose }: { entry: GlossaryEntry; onClose: () => void }) {
  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-xl border-l border-slate-200 bg-white shadow-2xl">
      <div className="flex h-full flex-col">
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-teal-600">Glossary</p>
            <h2 className="mt-1 text-2xl font-bold text-slate-900">{entry.canonical}</h2>
            {entry.aliases?.length ? (
              <p className="mt-2 text-xs text-slate-500">Also seen as: {entry.aliases.join(", ")}</p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
          >
            Close
          </button>
        </div>

        <div className="overflow-y-auto px-5 py-5 space-y-6">
          <section>
            <h3 className="text-sm font-semibold text-slate-900">Definition</h3>
            <p className="mt-2 text-sm leading-7 text-slate-700">{entry.definition}</p>
          </section>

          {entry.details ? (
            <section>
              <h3 className="text-sm font-semibold text-slate-900">Deeper Explanation</h3>
              <p className="mt-2 text-sm leading-7 text-slate-700">{entry.details}</p>
            </section>
          ) : null}

          {entry.examUse ? (
            <section>
              <h3 className="text-sm font-semibold text-slate-900">How To Use In An Exam Answer</h3>
              <p className="mt-2 text-sm leading-7 text-slate-700">{entry.examUse}</p>
            </section>
          ) : null}

          {entry.examples?.length ? (
            <section>
              <h3 className="text-sm font-semibold text-slate-900">Examples</h3>
              <ul className="mt-2 list-disc space-y-2 pl-5 text-sm leading-7 text-slate-700">
                {entry.examples.map((example) => (
                  <li key={example}>{example}</li>
                ))}
              </ul>
            </section>
          ) : null}

          {entry.related?.length ? (
            <section>
              <h3 className="text-sm font-semibold text-slate-900">Related Terms</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {entry.related.map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => {
                      const nextEntry = getGlossaryEntry(term);
                      if (nextEntry) window.dispatchEvent(new CustomEvent("opencode-glossary-open", { detail: nextEntry.canonical }));
                    }}
                    className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-600 transition hover:border-teal-300 hover:text-teal-700"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export function GlossaryPanelProvider({ children }: { children: React.ReactNode }) {
  const [activeTerm, setActiveTerm] = useState<string | null>(null);

  const openGlossary = useCallback((term: string) => {
    const entry = getGlossaryEntry(term);
    if (entry) setActiveTerm(entry.canonical);
  }, []);

  const closeGlossary = useCallback(() => {
    setActiveTerm(null);
  }, []);

  React.useEffect(() => {
    const listener = (event: Event) => {
      const customEvent = event as CustomEvent<string>;
      if (customEvent.detail) openGlossary(customEvent.detail);
    };

    window.addEventListener("opencode-glossary-open", listener);
    return () => window.removeEventListener("opencode-glossary-open", listener);
  }, [openGlossary]);

  const value = useMemo(() => ({ openGlossary, closeGlossary }), [openGlossary, closeGlossary]);
  const activeEntry = activeTerm ? getGlossaryEntry(activeTerm) : undefined;

  return (
    <GlossaryPanelContext.Provider value={value}>
      {children}
      {activeEntry ? <GlossaryPanelBody entry={activeEntry} onClose={closeGlossary} /> : null}
    </GlossaryPanelContext.Provider>
  );
}

export function useGlossaryPanel() {
  const context = useContext(GlossaryPanelContext);
  if (!context) throw new Error("useGlossaryPanel must be used within a GlossaryPanelProvider");
  return context;
}
