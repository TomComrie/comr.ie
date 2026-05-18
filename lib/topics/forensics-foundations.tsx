import { Callout, Table, SectionHeading, SubHeading, T, Steps } from "@/components/ContentComponents";

export default function ForensicsFoundationsContent() {
  return (
    <div className="space-y-1 text-slate-700 leading-relaxed">

      <SectionHeading id="acpo">ACPO Principles</SectionHeading>
      <p>
        The <strong>ACPO Guidelines</strong> (Association of Chief Police Officers) are the foundational principles governing digital forensics in the UK. They establish what investigators must do to ensure evidence is admissible and integrity is maintained.
      </p>
      <Callout type="key">
        These four principles are foundational — expect exam questions about them. Know them verbatim and know why each matters.
      </Callout>

      <div className="space-y-4 my-4">
        {[
          {
            num: 1,
            principle: "No action taken by law enforcement or their agents should change data held on a digital device.",
            why: "Any modification could invalidate evidence or constitute tampering. Write blockers ensure this.",
          },
          {
            num: 2,
            principle: "In exceptional circumstances where it is necessary to access original data, the person doing so must be competent and able to give evidence explaining the relevance and implications of their actions.",
            why: "If original data must be touched, the examiner must be able to defend their actions under cross-examination.",
          },
          {
            num: 3,
            principle: "An audit trail or other record of all processes applied to digital evidence should be created and preserved. An independent third party should be able to examine those processes and achieve the same results.",
            why: "Reproducibility. The defence should be able to repeat your analysis and get the same result. This principle underpins hash verification.",
          },
          {
            num: 4,
            principle: "The person in charge of the investigation has overall responsibility for ensuring that the law and these principles are adhered to.",
            why: "Accountability sits with the SIO (Senior Investigating Officer), not just the forensic examiner.",
          },
        ].map((p) => (
          <div key={p.num} className="flex gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <span className="shrink-0 w-8 h-8 rounded-full bg-teal-100 text-teal-700 text-sm font-bold flex items-center justify-center">
              {p.num}
            </span>
            <div>
              <p className="text-sm font-medium text-slate-800 mb-1">{p.principle}</p>
              <p className="text-xs text-slate-500"><span className="font-medium">Why it matters:</span> {p.why}</p>
            </div>
          </div>
        ))}
      </div>

      <SectionHeading id="evidence-types">Types of Digital Evidence</SectionHeading>

      <Table
        headers={["Category", "Examples", "Lifespan"]}
        rows={[
          ["Volatile", "RAM, CPU cache, running processes, network connections, open files, clipboard contents", "Lost on power-off"],
          ["Non-volatile", "Hard disk, SSD, USB drives, optical discs, flash memory, NVRAM", "Persists without power"],
          ["Semi-volatile", "Swap/page file, hibernation file (hiberfil.sys), crash dumps", "May survive reboot"],
          ["Networked", "Router logs, DHCP leases, firewall logs, cloud storage", "Varies by retention policy"],
        ]}
      />

      <SectionHeading id="order-volatility">Order of Volatility</SectionHeading>
      <p className="text-sm">
        Evidence must be collected in order from most volatile (lost soonest) to least volatile. <strong>Always collect volatile evidence first</strong> before powering off the device.
      </p>

      <div className="my-4 space-y-1">
        {[
          { order: 1, item: "CPU registers & cache", detail: "Nanoseconds — lost instantly" },
          { order: 2, item: "RAM (memory)", detail: "Lost on power-off; can be captured while running" },
          { order: 3, item: "Swap / paging file", detail: "On disk but reflects RAM content" },
          { order: 4, item: "Network state", detail: "Active connections, ARP table — gone when connection closes" },
          { order: 5, item: "Running processes", detail: "Process list, open handles — gone on termination" },
          { order: 6, item: "Disk / filesystem", detail: "Survives power-off; copy before analysis" },
          { order: 7, item: "Removable media", detail: "USB drives, CDs — relatively stable" },
          { order: 8, item: "Backups / off-site data", detail: "Most stable; may be weeks/months old" },
        ].map((v) => (
          <div key={v.order} className="flex items-center gap-3 text-sm">
            <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold flex items-center justify-center shrink-0">
              {v.order}
            </span>
            <span className="font-medium text-slate-800 w-44 shrink-0">{v.item}</span>
            <span className="text-slate-500">{v.detail}</span>
          </div>
        ))}
      </div>

      <Callout type="tip">
        Exam question pattern: &quot;A server is powered on and running. In what order should you collect evidence?&quot; — answer with the volatility order above, starting with RAM capture before disk imaging.
      </Callout>

      <SectionHeading id="chain-custody">Chain of Custody</SectionHeading>
      <p className="text-sm">
        The <strong>chain of custody</strong> is the documented record of every person who handled the evidence, when they handled it, where it was, and what they did with it. A broken chain of custody can make evidence inadmissible.
      </p>
      <p className="text-sm mt-2">The chain of custody documentation must record:</p>
      <ul className="list-disc pl-5 space-y-1 text-sm">
        <li>Evidence identifier (case number, exhibit number)</li>
        <li>Description of the item (make, model, serial number)</li>
        <li>Who seized it, when, and where</li>
        <li>Every transfer: from whom, to whom, date/time, reason</li>
        <li>Storage conditions</li>
        <li>Hash values (before and after any examination)</li>
      </ul>

      <SectionHeading id="acquisition">Forensic Acquisition</SectionHeading>

      <SubHeading>Write Blockers</SubHeading>
      <p className="text-sm">
        A <strong>write blocker</strong> is a hardware or software device that allows reading from a storage device while preventing any writes. This satisfies ACPO Principle 1.
      </p>
      <ul className="list-disc pl-5 space-y-1 text-sm">
        <li><strong>Hardware:</strong> Tableau, WiebeTech, Forensic Talon — physical device between evidence drive and forensic workstation</li>
        <li><strong>Software:</strong> Windows registry write-blocking (not as reliable as hardware)</li>
      </ul>

      <SubHeading>Forensic Imaging</SubHeading>
      <p className="text-sm">
        A <strong>forensic image</strong> is a bit-for-bit (sector-by-sector) copy of the entire storage medium, including unallocated space and slack space. Analysis is performed on the image, never the original.
      </p>
      <Table
        headers={["Tool", "Type", "Notes"]}
        rows={[
          ["dd", "CLI (Linux/macOS)", "dd if=/dev/sdb of=/mnt/evidence.img bs=4M — copies every sector"],
          ["FTK Imager", "GUI (Windows)", "Creates E01 (EnCase) or AFF images, verifies hash automatically"],
          ["Autopsy", "GUI (cross-platform)", "Full forensic suite — imaging, analysis, reporting"],
          ["dcfldd", "CLI", "Enhanced dd with hash verification and progress"],
        ]}
      />

      <SubHeading>Hash Verification</SubHeading>
      <p className="text-sm">
        After imaging, compute a cryptographic hash (MD5, SHA-1, or SHA-256) of both the original and the image. They must match. Re-verify after examination to prove the image was not modified.
      </p>
      <Callout type="key">
        MD5 for legacy compatibility; SHA-256 is preferred for new investigations. A matching hash proves the image is an exact copy. Any modification — even 1 bit — produces a completely different hash.
      </Callout>

      <SectionHeading id="locard">Locard&apos;s Exchange Principle</SectionHeading>
      <p className="text-sm">
        Edmond Locard (French criminologist) stated: <em>&quot;Every contact leaves a trace.&quot;</em> In physical forensics, a criminal leaves traces at the scene and takes traces away.
      </p>
      <p className="text-sm mt-2">
        The digital equivalent: <em>every action on a computer leaves traces</em> — in log files, registry keys, filesystem timestamps, memory, network traffic. Even a viewer touching a scene (the investigator booting a live system) leaves traces.
      </p>
      <Callout type="warning">
        Booting a suspect machine normally modifies it — it writes to the filesystem (last-access times, swap file, event logs). Always use write blockers and forensic boot environments. Running any program modifies memory, page file, and potentially filesystem.
      </Callout>

    </div>
  );
}
