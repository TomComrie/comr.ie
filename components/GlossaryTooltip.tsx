"use client";

import React from "react";
import { useGlossaryPanel } from "@/components/GlossaryPanel";

export default function GlossaryTooltip({
  term,
  canonical,
  definition,
}: {
  term: string;
  canonical: string;
  definition: string;
}) {
  const { openGlossary } = useGlossaryPanel();

  return (
    <button
      type="button"
      className="glossary-term"
      onClick={() => openGlossary(canonical)}
      aria-label={`${canonical}: ${definition}`}
    >
      {term}
      <span className="glossary-tooltip" role="tooltip">
        <span className="glossary-tooltip-title">{canonical}</span>
        <span>{definition}</span>
      </span>
    </button>
  );
}
