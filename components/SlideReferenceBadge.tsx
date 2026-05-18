"use client";

import { usePdfViewer } from "@/components/PdfViewer";
import type { SlideReference } from "@/lib/slide-references";

export default function SlideReferenceBadge({
  slideRef,
  className = "",
}: {
  slideRef: SlideReference;
  className?: string;
}) {
  const { openViewer } = usePdfViewer();

  return (
    <button
      type="button"
      onClick={() => openViewer(slideRef.page, slideRef.label)}
      className={`rounded-full border border-teal-200 bg-teal-50 px-2 py-0.5 text-[11px] font-medium text-teal-700 transition hover:border-teal-300 hover:bg-teal-100 hover:text-teal-800 ${className}`}
      aria-label={`Open master PDF at ${slideRef.label}`}
      title={`Open master PDF at ${slideRef.label}`}
    >
      {slideRef.label}
    </button>
  );
}
