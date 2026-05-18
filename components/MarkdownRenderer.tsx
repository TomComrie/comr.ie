"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";

const components: Components = {
  h2: ({ children, id, ...rest }) => (
    <h2
      id={id}
      className="text-xl font-semibold text-slate-900 mt-10 mb-4 pb-2 border-b border-slate-200 flex items-center gap-2 group scroll-mt-20"
      {...rest}
    >
      <span>{children}</span>
      {id && (
        <a href={`#${id}`} className="opacity-0 group-hover:opacity-40 text-teal-500 text-base font-normal hover:opacity-100 transition-opacity">#</a>
      )}
    </h2>
  ),
  h3: ({ children, id, ...rest }) => (
    <h3
      id={id}
      className="text-base font-semibold text-slate-800 mt-6 mb-2 scroll-mt-20"
      {...rest}
    >
      {children}
    </h3>
  ),
  p: ({ children, ...rest }) => (
    <p className="text-sm text-slate-700 leading-relaxed my-1.5" {...rest}>
      {children}
    </p>
  ),
  ul: ({ children, ...rest }) => (
    <ul className="list-disc pl-5 space-y-1 text-sm my-1.5" {...rest}>
      {children}
    </ul>
  ),
  ol: ({ children, ...rest }) => (
    <ol className="list-decimal pl-5 space-y-1 text-sm my-1.5" {...rest}>
      {children}
    </ol>
  ),
  li: ({ children, ...rest }) => (
    <li className="text-slate-700" {...rest}>
      {children}
    </li>
  ),
  code: ({ children, className, ...rest }) => {
    const isInline = !className;
    if (isInline) {
      return (
        <code
          className="bg-slate-100 text-teal-800 px-1.5 py-0.5 rounded text-[0.85em] font-mono border border-slate-200"
          {...rest}
        >
          {children}
        </code>
      );
    }
    const lang = (className || "").replace("language-", "");
    return (
      <div className="my-4">
        {lang && (
          <div className="bg-slate-800 text-slate-400 text-[10px] font-mono px-4 py-1.5 rounded-t-xl border-b border-slate-700">
            {lang}
          </div>
        )}
        <pre className={`${lang ? "rounded-t-none rounded-b-xl" : "rounded-xl"} bg-slate-900 text-slate-100 text-xs p-4 my-0 overflow-x-auto font-mono leading-relaxed`}>
          <code className={className} {...rest}>
            {children}
          </code>
        </pre>
      </div>
    );
  },
  blockquote: ({ children, ...rest }) => {
    const text = extractText(children);
    let bg = "bg-blue-50";
    let border = "border-blue-300";
    let icon = "ℹ";
    let label = "Note";
    if (/^\*\*Warning\*\*/.test(text)) {
      bg = "bg-amber-50"; border = "border-amber-300"; icon = "⚠"; label = "Warning";
    } else if (/^\*\*Danger\*\*/.test(text)) {
      bg = "bg-red-50"; border = "border-red-300"; icon = "🚨"; label = "Critical";
    } else if (/^\*\*Key Point\*\*/.test(text)) {
      bg = "bg-violet-50"; border = "border-violet-300"; icon = "🔑"; label = "Key Point";
    } else if (/^\*\*Tip\*\*/.test(text)) {
      bg = "bg-teal-50"; border = "border-teal-300"; icon = "💡"; label = "Exam Tip";
    } else if (/^\*\*Info\*\*/.test(text)) {
      bg = "bg-blue-50"; border = "border-blue-300"; icon = "ℹ"; label = "Note";
    }
    return (
      <div className={`border-l-4 rounded-r-lg p-4 my-4 ${bg} ${border}`}>
        <div className="flex items-start gap-2">
          <span className="text-base leading-none mt-0.5">{icon}</span>
          <div className="flex-1 min-w-0">
            <span className="font-semibold text-sm">{label}:</span>{" "}
            <span className="text-sm">{children}</span>
          </div>
        </div>
      </div>
    );
  },
  table: ({ children, ...rest }) => (
    <div className="overflow-x-auto my-4 rounded-xl border border-slate-200">
      <table className="min-w-full text-sm border-collapse" {...rest}>
        {children}
      </table>
    </div>
  ),
  thead: ({ children, ...rest }) => (
    <thead className="bg-slate-100 text-left" {...rest}>
      {children}
    </thead>
  ),
  th: ({ children, ...rest }) => (
    <th className="px-4 py-2.5 text-left font-semibold text-slate-700 text-xs uppercase tracking-wide whitespace-nowrap border-b border-slate-200" {...rest}>
      {children}
    </th>
  ),
  td: ({ children, ...rest }) => (
    <td className="px-4 py-2.5 text-slate-700 border-b border-slate-100 align-top" {...rest}>
      {children}
    </td>
  ),
  a: ({ children, href, ...rest }) => (
    <a
      className="text-teal-600 hover:underline"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      {...rest}
    >
      {children}
    </a>
  ),
  hr: () => <hr className="border-slate-200 my-4" />,
};

function extractText(children: React.ReactNode): string {
  if (typeof children === "string") return children;
  if (Array.isArray(children)) return children.map(extractText).join("");
  if (children && typeof children === "object" && "props" in children)
    return extractText((children as React.ReactElement).props.children);
  return "";
}

export default function MarkdownRenderer({ content }: { content: string }) {
  return (
    <div className="space-y-1 text-slate-700 leading-relaxed">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
