import PasswordGate from "@/components/PasswordGate";
import DocsLayout from "@/components/DocsLayout";
import Link from "next/link";
import { topics } from "@/lib/notes-data";

const badgeColors: Record<string, string> = {
  "Web Security": "bg-orange-50 text-orange-600 border-orange-200",
  "Covert Comms": "bg-violet-50 text-violet-600 border-violet-200",
  Forensics: "bg-blue-50 text-blue-600 border-blue-200",
  Pentest: "bg-rose-50 text-rose-600 border-rose-200",
  Reference: "bg-slate-100 text-slate-600 border-slate-200",
  Practical: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

export default function Home() {
  return (
    <PasswordGate>
      <DocsLayout>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">EHAC Course Notes</h1>
          <p className="text-slate-500 text-sm">
            University of York · 2025/26 ·{" "}
            <span className="font-mono text-xs bg-slate-100 px-1.5 py-0.5 rounded">
              {topics.length} topics
            </span>
          </p>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <a
            href="/ehac-master-lecture-slides.pdf"
            target="_blank"
            rel="noreferrer"
            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm transition hover:border-teal-300 hover:bg-teal-50"
          >
            <span className="block font-semibold text-slate-900">Master Lecture PDF</span>
            <span className="block text-xs text-slate-500 mt-1">Open the combined lecture slides in a new tab.</span>
          </a>
          <a
            href="/ehac-master-practicals-and-solutions.pdf"
            target="_blank"
            rel="noreferrer"
            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm transition hover:border-emerald-300 hover:bg-emerald-50"
          >
            <span className="block font-semibold text-slate-900">Master Practicals PDF</span>
            <span className="block text-xs text-slate-500 mt-1">Week-ordered lab sheets and available solutions, including the converted Week 6 PDF.</span>
          </a>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {topics.map((topic) => (
            <Link
              key={topic.slug}
              href={`/${topic.slug}`}
              className="group flex items-start gap-4 p-4 border border-slate-200 rounded-xl bg-white hover:border-teal-300 hover:shadow-sm hover:shadow-teal-100 transition-all"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h2 className="font-semibold text-slate-900 text-sm group-hover:text-teal-800 transition-colors">
                    {topic.title}
                  </h2>
                  {topic.badge && (
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${badgeColors[topic.badge] ?? "bg-slate-100 text-slate-600 border-slate-200"}`}>
                      {topic.badge}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500">{topic.description}</p>
              </div>
              <span className="text-slate-300 group-hover:text-teal-400 transition-colors text-lg mt-0.5">→</span>
            </Link>
          ))}
        </div>
      </DocsLayout>
    </PasswordGate>
  );
}
