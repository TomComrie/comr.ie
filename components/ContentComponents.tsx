import React from "react";

type CalloutType = "info" | "warning" | "tip" | "danger" | "key";

const calloutConfig: Record<CalloutType, { bg: string; border: string; text: string; icon: string; label: string }> = {
  info:    { bg: "bg-blue-50",   border: "border-blue-300",  text: "text-blue-900",  icon: "ℹ",  label: "Note" },
  warning: { bg: "bg-amber-50",  border: "border-amber-300", text: "text-amber-900", icon: "⚠",  label: "Warning" },
  tip:     { bg: "bg-teal-50",   border: "border-teal-300",  text: "text-teal-900",  icon: "💡", label: "Exam Tip" },
  danger:  { bg: "bg-red-50",    border: "border-red-300",   text: "text-red-900",   icon: "🚨", label: "Critical" },
  key:     { bg: "bg-violet-50", border: "border-violet-300",text: "text-violet-900",icon: "🔑", label: "Key Point" },
};

export function Callout({ type = "info", title, children }: { type?: CalloutType; title?: string; children: React.ReactNode }) {
  const c = calloutConfig[type];
  return (
    <div className={`border-l-4 rounded-r-lg p-4 my-4 ${c.bg} ${c.border} ${c.text}`}>
      <div className="flex items-start gap-2">
        <span className="text-base leading-none mt-0.5">{c.icon}</span>
        <div className="flex-1 min-w-0">
          <span className="font-semibold text-sm">{title ?? c.label}:</span>{" "}
          <span className="text-sm">{children}</span>
        </div>
      </div>
    </div>
  );
}

export function Table({ headers, rows }: { headers: string[]; rows: (string | React.ReactNode)[][] }) {
  return (
    <div className="overflow-x-auto my-4 rounded-xl border border-slate-200">
      <table className="min-w-full text-sm border-collapse">
        <thead>
          <tr className="bg-slate-100">
            {headers.map((h, i) => (
              <th key={i} className="px-4 py-2.5 text-left font-semibold text-slate-700 text-xs uppercase tracking-wide whitespace-nowrap border-b border-slate-200">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-slate-50/60"}>
              {row.map((cell, j) => (
                <td key={j} className="px-4 py-2.5 text-slate-700 border-b border-slate-100 last-row:border-0 align-top">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function SectionHeading({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="text-xl font-semibold text-slate-900 mt-10 mb-4 pb-2 border-b border-slate-200 flex items-center gap-2 group scroll-mt-20">
      {children}
      <a href={`#${id}`} className="opacity-0 group-hover:opacity-40 text-teal-500 text-base font-normal hover:opacity-100 transition-opacity">#</a>
    </h2>
  );
}

export function SubHeading({ id, children }: { id?: string; children: React.ReactNode }) {
  return (
    <h3 id={id} className="text-base font-semibold text-slate-800 mt-6 mb-2 scroll-mt-20">
      {children}
    </h3>
  );
}

export function T({ children }: { children: React.ReactNode }) {
  return <code className="bg-slate-100 text-teal-800 px-1.5 py-0.5 rounded text-[0.85em] font-mono border border-slate-200">{children}</code>;
}

export function Steps({ items }: { items: { step: string; desc: React.ReactNode }[] }) {
  return (
    <ol className="my-4 space-y-3">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-3">
          <span className="shrink-0 w-6 h-6 rounded-full bg-teal-100 text-teal-700 text-xs font-semibold flex items-center justify-center mt-0.5">
            {i + 1}
          </span>
          <div>
            <span className="font-medium text-slate-800">{item.step}: </span>
            <span className="text-slate-600 text-sm">{item.desc}</span>
          </div>
        </li>
      ))}
    </ol>
  );
}

export function CodeBlock({ children, lang }: { children: string; lang?: string }) {
  return (
    <div className="my-4">
      {lang && (
        <div className="bg-slate-800 text-slate-400 text-[10px] font-mono px-4 py-1.5 rounded-t-xl border-b border-slate-700">
          {lang}
        </div>
      )}
      <pre className={`${lang ? "rounded-t-none rounded-b-xl" : "rounded-xl"} my-0`}>
        <code>{children.trim()}</code>
      </pre>
    </div>
  );
}
