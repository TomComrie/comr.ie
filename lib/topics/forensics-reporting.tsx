import { Callout, Table, SectionHeading, SubHeading, T, CodeBlock } from "@/components/ContentComponents";
import { slideReferences } from "@/lib/slide-references";

export default function ForensicsReportingContent() {
  const refs = slideReferences["forensics-reporting"];

  return (
    <div className="space-y-1 text-slate-700 leading-relaxed">

      <SectionHeading id="analysis-vs-interpretation" slideRef={refs["analysis-vs-interpretation"]}>Analysis vs Interpretation</SectionHeading>
      <p>
        Two distinct phases of digital forensics work:
      </p>
      <Table
        headers={["Phase", "Question", "Example"]}
        rows={[
          ["Analysis", "What is on the system?", "The USB device with serial X was connected at 14:32 on 3 Jan"],
          ["Interpretation", "What does it mean?", "This device was connected 20 minutes before 5GB was transferred to an external location — suggests intentional data exfiltration"],
        ]}
      />
      <Callout type="key">
        Analysis is objective. Interpretation is where expert judgement is applied. You must clearly distinguish the two in a report — present findings first, then interpretations.
      </Callout>
      <CodeBlock lang="Useful reporting workflow commands">
        {`# Hash evidence for report appendix
sha256sum disk01.img

# Build body of evidence from commands already run
log2timeline.py timeline.plaso mounted_image/
psort.py -o l2tcsv timeline.plaso > timeline.csv`}
      </CodeBlock>

      <SectionHeading id="5wh" slideRef={refs["5wh"]}>The 5WH Framework</SectionHeading>
      <p className="text-sm">
        The 5WH questions form the framework for synthesising evidence into a coherent narrative:
      </p>
      <div className="grid grid-cols-1 gap-3 my-4">
        {[
          { q: "What", desc: "What happened? — the event itself", example: "A large file transfer occurred from the finance server" },
          { q: "Where", desc: "Which machine, account, directory, or network path was involved?", example: "Server at 192.168.1.50, share \\\\finance\\accounts, user account J.Smith" },
          { q: "When", desc: "Reconstructed timeline — when did each action occur?", example: "Files copied between 14:32 and 14:58 on 3 January 2025" },
          { q: "How", desc: "The mechanism — USB drive, remote login, email, cloud sync?", example: "USB device VID 0781 / PID 556B (SanDisk Cruzer Edge) connected at 14:30" },
          { q: "Why", desc: "Motive — often requires non-technical evidence (HR, emails, interviews)", example: "Subject was under disciplinary investigation; resignation tendered same day" },
          { q: "Who", desc: "The account — not necessarily the person (see attribution problem)", example: "Account J.Smith; physical presence corroborated by access card swipe" },
        ].map((item) => (
          <div key={item.q} className="flex gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="shrink-0 w-10 h-8 rounded-lg bg-teal-100 text-teal-700 text-sm font-bold flex items-center justify-center">
              {item.q}?
            </span>
            <div>
              <p className="text-sm font-medium text-slate-800">{item.desc}</p>
              <p className="text-xs text-slate-500 mt-0.5 italic">{item.example}</p>
            </div>
          </div>
        ))}
      </div>

      <SectionHeading id="attribution" slideRef={refs.attribution}>The Attribution Problem</SectionHeading>
      <p className="text-sm">
        Digital evidence is very good at showing <em>which account</em> performed an action. It is far weaker at proving <em>which person</em> was using that account at the time.
      </p>
      <Callout type="danger">
        <strong>&quot;Someone else used my password&quot;</strong> is a legitimate defence. You cannot assume the account holder was the one sitting at the keyboard. Digital evidence alone cannot place a person at a device.
      </Callout>
      <p className="text-sm">
        To attribute account activity to a specific person, corroborate with:
      </p>
      <ul className="list-disc pl-5 space-y-1 text-sm">
        <li><strong>Physical access records</strong> — building entry/exit logs, key card swipes</li>
        <li><strong>CCTV footage</strong> — who was physically at the workstation</li>
        <li><strong>Mobile phone data</strong> — location history (cell tower, GPS)</li>
        <li><strong>Witness statements</strong> — who was seen at the location</li>
        <li><strong>Biometric data</strong> — fingerprint/face ID logon if available</li>
      </ul>

      <SectionHeading id="golden-rule" slideRef={refs["golden-rule"]}>The Golden Rule</SectionHeading>
      <div className="my-4 p-6 bg-slate-900 text-white rounded-2xl text-center">
        <p className="text-lg font-semibold mb-1">Assume nothing.</p>
        <p className="text-lg font-semibold mb-1">Believe nothing.</p>
        <p className="text-lg font-semibold mb-3">Challenge everything.</p>
        <p className="text-sm text-slate-400">Follow the evidence. Do not seek to prove a hypothesis.</p>
      </div>
      <p className="text-sm">
        Confirmation bias — starting with a conclusion and looking for evidence to support it — is a serious professional risk. A forensic examiner who sets out to &quot;prove&quot; guilt may miss exculpatory evidence and fail under cross-examination.
      </p>

      <SectionHeading id="report-structure" slideRef={refs["report-structure"]}>Report Structure</SectionHeading>
      <p className="text-sm">
        A forensic report (lab report or expert witness report) follows a standard structure:
      </p>
      <div className="space-y-2 my-4">
        {[
          { num: 1, section: "Receipt of Items", detail: "What was received, from whom, when, in what condition. Hash values of received items." },
          { num: 2, section: "Background and Circumstances", detail: "Why was this examination requested? What is the context of the case?" },
          { num: 3, section: "Purpose of Examination", detail: "What specific questions is this examination trying to answer?" },
          { num: 4, section: "Technical Issues", detail: "Encryption, damaged media, non-standard formats, limitations encountered." },
          { num: 5, section: "Examination and Results", detail: "Structured logically — by individual, by scene, by evidence type, or by chronology. Items ordered by evidential weight (most significant first)." },
          { num: 6, section: "Interpretation of Findings", detail: "What do the findings mean? Expert opinion and inference. Clearly distinguished from factual findings." },
          { num: 7, section: "Conclusion(s)", detail: "Summary answer to the questions posed in section 3." },
        ].map((s) => (
          <div key={s.num} className="flex gap-3">
            <span className="shrink-0 w-7 h-7 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center mt-0.5">
              {s.num}
            </span>
            <div>
              <span className="font-medium text-slate-800 text-sm">{s.section}</span>
              <p className="text-xs text-slate-500 mt-0.5">{s.detail}</p>
            </div>
          </div>
        ))}
      </div>

      <SubHeading>Other Required Inclusions</SubHeading>
      <ul className="list-disc pl-5 space-y-1 text-sm">
        <li>Use of assistants and their role</li>
        <li>Disclosure obligations (exculpatory material)</li>
        <li>Evidence submitted but not examined, and why</li>
        <li>References to scene photographs or other scientists&apos; statements</li>
        <li>The examiner&apos;s qualifications and experience</li>
      </ul>
      <CodeBlock lang="Practical report artefact collection">
        {`# Common evidence outputs to preserve for reporting
sha256sum evidence.img > hashes.txt
wevtutil qe Security /f:text > security-log.txt
reg query HKLM\SYSTEM > system-registry.txt`}
      </CodeBlock>

      <SectionHeading id="plain-language" slideRef={refs["plain-language"]}>Plain Language Requirement</SectionHeading>
      <Callout type="key">
        Your report may be read by a judge, a jury, and opposing counsel — none of whom have a technical background. You must explain every finding in plain language. If you cannot explain it plainly, you do not yet fully understand it.
      </Callout>
      <p className="text-sm">
        Practical rules:
      </p>
      <ul className="list-disc pl-5 space-y-1 text-sm">
        <li>Define every technical term the first time you use it</li>
        <li>Use analogies to explain complex concepts</li>
        <li>Avoid jargon, abbreviations, and vendor-specific terminology without explanation</li>
        <li>State conclusions clearly — avoid hedging language that obscures your opinion</li>
        <li>State uncertainty explicitly — &quot;This is consistent with X&quot; vs &quot;This proves X&quot;</li>
      </ul>

      <SectionHeading id="planning" slideRef={refs.planning}>Planning & Preparation</SectionHeading>
      <SubHeading>Why Plan Before an Incident?</SubHeading>
      <p className="text-sm">
        An organisation that only starts thinking about forensic readiness after an incident is at a serious disadvantage. Evidence may be lost, staff may panic, and legal obligations may be missed.
      </p>
      <Table
        headers={["Approach", "Description", "Risk"]}
        rows={[
          ["Incident-based planning", "Prepare a response plan for each predicted incident type (data breach, ransomware, insider threat, etc.)", "Confirmation bias — you may try to fit an unusual incident into a plan that doesn't quite apply"],
          ["Source-based planning", "Work through every potential evidence source and devise procedures for each", "More systematic, more labour-intensive, but handles unexpected incidents better"],
        ]}
      />

      <SubHeading>Standard Operating Procedures (SOPs)</SubHeading>
      <p className="text-sm">
        SOPs are simple, step-by-step, <em>non-branching</em> procedures for specific forensic tasks.
      </p>
      <p className="text-sm mt-2">
        Think of SOPs as <strong>recipes in a restaurant kitchen</strong>. The kitchen can&apos;t predict exactly what diners will order — but it has a recipe for every dish. Any combination of dishes can be produced quickly by following the right recipes.
      </p>
      <p className="text-sm mt-2">
        Standards bodies: <strong>ISO/IEC 27042</strong> (guidelines for digital evidence analysis) and <strong>SWGDE</strong> (Scientific Working Group on Digital Evidence) publish example SOPs.
      </p>
      <Callout type="tip">
        SOPs must be written and tested <em>before</em> an incident — not improvised under pressure. Regular drills/tabletop exercises validate that SOPs work in practice.
      </Callout>

    </div>
  );
}
