"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { topics } from "@/lib/notes-data";

const badgeColors: Record<string, string> = {
  "Web Security": "bg-orange-50 text-orange-600",
  "Covert Comms": "bg-violet-50 text-violet-600",
  Forensics: "bg-blue-50 text-blue-600",
  Pentest: "bg-rose-50 text-rose-600",
  Reference: "bg-slate-100 text-slate-600",
};

export default function Sidebar() {
  const pathname = usePathname();

  const groups = [
    { label: "Web Security", slugs: ["xss", "steganography"] },
    {
      label: "Digital Forensics",
      slugs: [
        "forensics-foundations",
        "forensics-filesystems",
        "forensics-deleted",
        "registry",
        "event-logs",
        "forensics-reporting",
      ],
    },
    {
      label: "Penetration Testing",
      slugs: ["pentest-methodology", "pentest-reporting", "vuln-reference"],
    },
  ];

  return (
    <aside className="w-[272px] shrink-0 h-screen sticky top-0 overflow-y-auto bg-slate-50 border-r border-slate-200 flex flex-col">
      <div className="px-5 py-5 border-b border-slate-200">
        <Link href="/" className="block group">
          <span className="font-semibold text-slate-900 text-sm tracking-tight group-hover:text-teal-700 transition-colors">
            EHAC Notes
          </span>
          <span className="block text-xs text-slate-400 mt-0.5 font-mono">
            notes.comr.ie
          </span>
        </Link>
      </div>

      <nav className="flex-1 px-3 py-4">
        {groups.map((group) => (
          <div key={group.label} className="mb-4">
            <div className="px-3 mb-1">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
                {group.label}
              </span>
            </div>
            <div className="space-y-0.5">
              {group.slugs.map((slug) => {
                const topic = topics.find((t) => t.slug === slug);
                if (!topic) return null;
                const isActive = pathname === `/${slug}`;
                return (
                  <Link
                    key={slug}
                    href={`/${slug}`}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all ${
                      isActive
                        ? "bg-teal-50 text-teal-800 font-medium"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-500 shrink-0" />
                    )}
                    <span className={isActive ? "" : "pl-3.5"}>
                      {topic.shortTitle}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="px-5 py-4 border-t border-slate-200 flex items-center justify-between">
        <a
          href="https://comr.ie"
          className="text-xs text-slate-400 hover:text-teal-600 transition-colors flex items-center gap-1"
        >
          <span>←</span> comr.ie
        </a>
        <button
          onClick={() => {
            localStorage.removeItem("notes_auth");
            window.location.reload();
          }}
          className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
          title="Lock"
        >
          🔒
        </button>
      </div>
    </aside>
  );
}
