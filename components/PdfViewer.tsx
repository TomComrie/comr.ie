"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

type PdfViewerContextValue = {
  openViewer: (page: number, label?: string) => void;
  closeViewer: () => void;
};

const MASTER_PDF_PATH = "/ehac-master-lecture-slides.pdf";

const PdfViewerContext = createContext<PdfViewerContextValue | null>(null);

export function PdfViewerProvider({ children }: { children: React.ReactNode }) {
  const [viewerState, setViewerState] = useState<{ page: number; label?: string } | null>(null);

  const openViewer = useCallback((page: number, label?: string) => {
    setViewerState({ page, label });
  }, []);

  const closeViewer = useCallback(() => {
    setViewerState(null);
  }, []);

  useEffect(() => {
    if (!viewerState) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeViewer();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [closeViewer, viewerState]);

  const value = useMemo(() => ({ openViewer, closeViewer }), [closeViewer, openViewer]);

  return (
    <PdfViewerContext.Provider value={value}>
      {children}
      {viewerState ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-3 sm:p-6">
          <div className="flex h-[92vh] w-full max-w-7xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
            <div className="flex items-center justify-between gap-4 border-b border-slate-200 px-4 py-3">
              <div>
                <p className="text-sm font-semibold text-slate-900">Master PDF</p>
                <p className="text-xs text-slate-500">{viewerState.label ?? `Slide ${viewerState.page}`}</p>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={`${MASTER_PDF_PATH}#page=${viewerState.page}`}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:border-teal-300 hover:text-teal-700"
                >
                  Open in tab
                </a>
                <button
                  type="button"
                  onClick={closeViewer}
                  className="rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:border-slate-300 hover:text-slate-900"
                >
                  Close
                </button>
              </div>
            </div>
            <iframe
              key={viewerState.page}
              title="EHAC master lecture slides"
              src={`${MASTER_PDF_PATH}#page=${viewerState.page}&view=FitH`}
              className="h-full w-full bg-slate-100"
            />
          </div>
        </div>
      ) : null}
    </PdfViewerContext.Provider>
  );
}

export function usePdfViewer() {
  const context = useContext(PdfViewerContext);

  if (!context) {
    throw new Error("usePdfViewer must be used within a PdfViewerProvider");
  }

  return context;
}
