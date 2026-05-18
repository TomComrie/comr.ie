import { SectionHeading, T } from "@/components/ContentComponents";
import { glossaryEntries } from "@/lib/glossary";

export default function GlossaryContent() {
  return (
    <div className="space-y-1 text-slate-700 leading-relaxed">
      <p className="text-sm text-slate-600">
        This glossary is the deep reference layer behind the hover tooltips used throughout the notes. Click glossary terms anywhere in the notes to open the side panel, or browse the full list here.
      </p>

      <SectionHeading id="all-terms">All Terms</SectionHeading>
      <div className="space-y-5">
        {glossaryEntries.map((entry) => (
          <section key={entry.canonical} id={`term-${entry.canonical.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`} className="rounded-xl border border-slate-200 bg-white p-4">
            <h3 className="text-lg font-semibold text-slate-900">{entry.canonical}</h3>
            {entry.aliases?.length ? (
              <p className="mt-1 text-xs text-slate-500">Also seen as: {entry.aliases.join(", ")}</p>
            ) : null}
            <p className="mt-3 text-sm leading-7 text-slate-700">{entry.definition}</p>
            {entry.details ? <p className="mt-3 text-sm leading-7 text-slate-700">{entry.details}</p> : null}
            {entry.examUse ? (
              <p className="mt-3 text-sm leading-7 text-slate-700">
                <strong>Exam use:</strong> {entry.examUse}
              </p>
            ) : null}
            {entry.examples?.length ? (
              <div className="mt-3 text-sm leading-7 text-slate-700">
                <strong>Examples:</strong>
                <ul className="mt-1 list-disc pl-5">
                  {entry.examples.map((example) => (
                    <li key={example}>{example}</li>
                  ))}
                </ul>
              </div>
            ) : null}
            {entry.related?.length ? (
              <p className="mt-3 text-sm leading-7 text-slate-700">
                <strong>Related:</strong> {entry.related.map((term, index) => (<span key={term}>{index > 0 ? ", " : ""}<T>{term}</T></span>))}
              </p>
            ) : null}
          </section>
        ))}
      </div>
    </div>
  );
}
