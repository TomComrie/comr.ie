import { Callout, CodeBlock, SectionHeading, SubHeading, Table } from "@/components/ContentComponents";

export default function ExamInfoContent() {
  return (
    <div className="space-y-1 text-slate-700 leading-relaxed">
      <Callout type="warning">
        This page is built from the lecture transcripts and is intended as a revision aid. If anything here conflicts with the official VLE, timetable, handbook, or released assessment brief, the official assessment information wins.
      </Callout>

      <SectionHeading id="overview">Assessment Overview</SectionHeading>
      <p className="text-sm">
        The introductory transcript described the assessment as split <strong>60/40</strong> across two exam-style settings. It also made clear that the practical capture-the-flag work and the later exam tasks are linked in style: the labs are designed to build the same kind of independent problem solving expected under assessment conditions.
      </p>
      <Table
        headers={["Assessment area", "Transcript-derived summary"]}
        rows={[
          ["Overall split", "60 marks + 40 marks"],
          ["Exam style", "Practical / lab-based rather than purely essay-based"],
          ["CTF relevance", "Formative CTFs train the same style of problem solving expected later"],
          ["Forensics relevance", "At least one part is expected to include a forensics-related question"],
        ]}
      />

      <SectionHeading id="ctf-link">CTFs and the Exam</SectionHeading>
      <p className="text-sm">
        The week 1 transcript explicitly said the exam would involve working on a <strong>capture-the-flag style exercise</strong> and that this would be based on the same kind of formative challenges used during the module. The lecturer stressed that the point of those formative challenges was to become <strong>independent</strong> at solving them.
      </p>
      <Callout type="key">
        Transcript takeaway: the CTFs are not just bonus practice. They are rehearsal for the assessment style.
      </Callout>

      <SectionHeading id="exam-one">Exam 1</SectionHeading>
      <p className="text-sm">
        According to the transcript, the first exam setting happens in the lab and allows online access. The lecturer specifically said that digital notes, VLE materials, and online material could be used, while paper notes were not allowed.
      </p>
      <SubHeading>Implication for revision</SubHeading>
      <p className="text-sm">
        This means your notes should be organised for fast lookup. Searchability, clean headings, and quick-reference command blocks matter more than beautifully memorised prose.
      </p>

      <SectionHeading id="exam-two">Exam 2</SectionHeading>
      <p className="text-sm">
        The transcript described the second exam setting as split into <strong>two parts</strong>, including a short <strong>offline hands-on challenge</strong> of around <strong>30 minutes</strong>. The lecturer emphasised that this part is offline, with no ordinary internet access and with challenge isolation between students.
      </p>
      <SubHeading>Why this matters</SubHeading>
      <p className="text-sm">
        This is where pure memory, a compact prepared workflow, and calm troubleshooting matter. If you cannot remember the exact flag or syntax for one small step, you can lose a large percentage of a short practical task.
      </p>

      <SubHeading>One-page note idea</SubHeading>
      <p className="text-sm">
        The transcript explained that the <strong>topic</strong> of the offline challenge could be released in advance, allowing you to prepare a <strong>one-page note</strong> for yourself. Even if that note is unmarked, it remains part of an individual assessment and must not be copied or shared.
      </p>
      <CodeBlock lang="Best one-page structure">
        {`1. Core commands
2. Workflow order
3. Common failure points
4. One or two mini examples
5. Verification checks
6. Values / flags / syntax you forget under pressure`}
      </CodeBlock>

      <SectionHeading id="forensics-exam">Forensics in the Exam</SectionHeading>
      <p className="text-sm">
        The forensics transcripts reinforced more than once that you should expect a forensics-related question in the assessment. This means the following areas are especially worth preparing:
      </p>
      <ul className="list-disc pl-5 space-y-1 text-sm">
        <li>ACPO-style evidence handling logic</li>
        <li>Scene notes, continuity, and chain of custody</li>
        <li>Imaging, write blockers, and hashing</li>
        <li>Timestamps, FAT vs NTFS time handling</li>
        <li>Registry artefacts and Event Logs</li>
        <li>Interpretation vs speculation in reporting</li>
      </ul>

      <SectionHeading id="practical-advice">Practical Preparation Strategy</SectionHeading>
      <Table
        headers={["Situation", "Best move"]}
        rows={[
          ["Open-resource practical", "Build structured digital notes you can navigate quickly"],
          ["Offline practical", "Memorise command patterns and workflow order"],
          ["Forensics question", "Lead with evidence handling and reasoning discipline"],
          ["Web / CTF task", "Practise modifying, testing, and verifying requests independently"],
        ]}
      />

      <SectionHeading id="what-to-memorise">What To Memorise vs What To Look Up</SectionHeading>
      <Table
        headers={["Memorise", "Keep in notes"]}
        rows={[
          ["Core command patterns", "Longer explanations and worked examples"],
          ["Typical workflow order", "Background context paragraphs"],
          ["High-value artefacts and event IDs", "Larger reference tables"],
          ["How to verify success", "Extended notes and transcript-derived sidenotes"],
        ]}
      />

      <SectionHeading id="transcript-highlights">Transcript Highlights</SectionHeading>
      <ul className="list-disc pl-5 space-y-1 text-sm">
        <li>The formative CTFs are intended to build independence for the exam.</li>
        <li>One part of the assessment is effectively open-resource and rewards good digital note organisation.</li>
        <li>Another part is offline and rewards memorised workflows and preparation.</li>
        <li>Forensics was explicitly flagged as exam-relevant.</li>
        <li>The lecturer&apos;s concern was not just subject knowledge, but students wasting assessment time on tiny forgotten details. That is exactly what a well-prepared open-book aid should solve.</li>
      </ul>
    </div>
  );
}
