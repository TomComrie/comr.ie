import { Callout, CodeBlock, SectionHeading, SubHeading, T, Table } from "@/components/ContentComponents";

export default function PracticalForensicsLabsContent() {
  return (
    <div className="space-y-1 text-slate-700 leading-relaxed">
      <Callout type="key">
        This page is meant to be your practical exam assistant for the forensics labs. The highest-value habit is to separate observation, evidence recording, and interpretation. Write what you saw first. Explain what it means second.
      </Callout>
      <p className="text-sm">
        Quick revision: <a href="/exam-cheatsheet#forensics-cheatsheet" className="text-teal-600 hover:underline">Forensics cheatsheet</a>.
      </p>

      <SectionHeading id="w6-scene-collection">Week 6: Crime Scene Collection</SectionHeading>
      <p className="text-sm">
        The Week 6 exercise is about lawful, defensible handling of a potential evidence source. It is as much about procedure and notes as it is about technical skill.
      </p>

      <SubHeading id="w6-plan">Task 1: decide a plan of action</SubHeading>
      <p className="text-sm">
        Worked answer: before touching the device, the team should pause for a short scene assessment, agree objectives, and assign roles. At minimum you want a lead examiner, an exhibits officer, someone capturing contemporaneous notes, and ideally someone handling scene photography or sketching.
      </p>
      <Table
        headers={["Role", "Purpose"]}
        rows={[
          ["Lead examiner", "Directs collection decisions and ensures the plan is followed"],
          ["Exhibits officer", "Assigns exhibit IDs, maintains recovery log, and tracks continuity"],
          ["Note taker", "Records exact times, actions, and observations"],
          ["Photographer or sketch recorder", "Captures physical layout before anything is moved"],
        ]}
      />

      <SubHeading id="w6-record-scene">Task 1: what to record at the scene</SubHeading>
      <CodeBlock lang="Scene checklist">
        {`1. Record time of arrival
2. Record who is present
3. Start or update the scene entry log
4. Photograph the scene before touching anything
5. Record the machine power state
6. Record anything visible on the screen
7. Record attached media and peripheral devices
8. Record physical cable connections
9. Assign exhibit references before removal`}
      </CodeBlock>
      <p className="text-sm">
        If the device is powered on, the most important visual evidence may be transient. Record exactly what is displayed on the screen, visible usernames, open applications, time shown, and any inserted USB device or media. If available, photograph the display before changing anything.
      </p>
      <Callout type="info" title="Transcript Sidenote">
        The lecture transcript made this more concrete by saying you should explicitly write down things like the operating system shown on screen, the visible time, the applications open, and what is shown on the desktop. It also said to record which ports external devices are plugged into, because even the same USB device may be represented differently depending on the port used.
      </Callout>
      <Callout type="warning">
        A weak answer starts clicking through windows. A strong answer explains the evidential risk of changing a live system and justifies any action with ACPO-style reasoning.
      </Callout>

      <SubHeading id="w6-collect">Task 1: collecting the PDE source</SubHeading>
      <p className="text-sm">
        Worked answer: the team should collect the device and associated evidence in a way that preserves continuity. That means labelling items immediately, recording who recovered them, recording date and time, and logging every transfer between people or locations.
      </p>
      <p className="text-sm">
        The sample forms in the sheet tell you what the examiner is looking for: an evidence item recovery log, a PDE source record at scene, and a crime-scene entry sheet. Even if the exercise is simulated, your answer should mention these records explicitly.
      </p>

      <SectionHeading id="w6-hardware-exam">Week 6: Hardware Examination</SectionHeading>
      <SubHeading id="w6-external">Task 2: external inspection</SubHeading>
      <p className="text-sm">
        Before opening the case, record external condition: make, model, serial numbers, asset tags, labels, visible ports, obvious damage, and whether screws or panels appear to have been disturbed.
      </p>

      <SubHeading id="w6-internal">Task 2: internal inspection</SubHeading>
      <Table
        headers={["Item to record", "Examples from the hardware log"]}
        rows={[
          ["CPU", "Manufacturer, model, any obvious identifier"],
          ["Storage", "HDD or SSD number, interface type, model, serial, capacity"],
          ["Optical or removable media", "DVD/CD-ROM, ZIP, floppy, USB devices if present"],
          ["RAM and configuration", "Installed memory and slot arrangement if visible"],
          ["Other components", "Anything unusual such as add-in cards or adapters"],
        ]}
      />
      <p className="text-sm">
        Worked answer: open the machine carefully, inspect internal storage and connected components, and document them one by one in the hardware log. The key point is not speed, it is completeness and continuity.
      </p>
      <Callout type="tip" title="Transcript Sidenote">
        The transcript recommended bringing your own notebook or laptop for the lab so each team member could keep their own contemporaneous notes while maintaining scene integrity.
      </Callout>

      <SubHeading id="w6-bios">Task 2: BIOS or EFI inspection</SubHeading>
      <p className="text-sm">
        The practical sheet is explicit: re-install the case and get staff approval before applying power for BIOS or EFI inspection. That sentence is worth repeating in an exam answer because it shows you followed the procedural control.
      </p>
      <CodeBlock lang="BIOS or EFI values to record">
        {`BIOS type and version
BIOS date and time
Wall-clock date and time
CPU information
RAM amount
Boot device sequence
Detected hard drives and optical devices`}
      </CodeBlock>
      <p className="text-sm">
        Worked answer: record both BIOS time and real wall-clock time because time drift can matter later in forensic interpretation.
      </p>

      <SectionHeading id="w10-hex-and-encoding">Week 10: Number Format and Text Encoding</SectionHeading>
      <SubHeading id="w10-number-format">1. Number format and endianness</SubHeading>
      <p className="text-sm">
        The first exercise asks you to convert binary values into hexadecimal and then express them in both big-endian and little-endian byte order.
      </p>
      <CodeBlock lang="Worked answers">
        {`11011110 10101101 10111110 11101111
-> DE AD BE EF (big-endian)
-> EF BE AD DE (little-endian)

10001011 10101101 11110000 00001101
-> 8B AD F0 0D (big-endian)
-> 0D F0 AD 8B (little-endian)`}
      </CodeBlock>
      <p className="text-sm">
        Reasoning: split the bit string into groups of four, convert each nibble to one hex digit, then reverse by whole bytes rather than by individual hex digits when switching endianness.
      </p>

      <SubHeading id="w10-text-encoding">2. Text encoding exercise</SubHeading>
      <p className="text-sm">
        You create two versions of the same text file, one saved as UTF-16 and one as UTF-8, then compare size and byte layout.
      </p>
      <Table
        headers={["Question", "Worked answer"]}
        rows={[
          ["Which file is larger?", "UTF-16 is larger, roughly about twice the size for this content"],
          ["How is ⊕ stored in UTF-16?", "As 0x2295, which in little-endian byte order appears as 95 22"],
          ["How is ⊕ stored in UTF-8?", "As three bytes: E2 8A 95"],
          ["How do you encode ⊻ (0x22BB) in UTF-8?", "E2 8A BB"],
        ]}
      />
      <p className="text-sm">
        Worked explanation: UTF-8 is variable-length, so higher Unicode code points use multiple bytes with marker bits. UTF-16 in this case stores the code point more directly as a 16-bit unit, subject to little-endian ordering.
      </p>

      <SectionHeading id="w10-date-and-timeline">Week 10: Date Encoding and Timeline Reconstruction</SectionHeading>
      <SubHeading id="w10-date-encoding">3.1 Date encoding</SubHeading>
      <Table
        headers={["Value", "Interpretation", "Worked result"]}
        rows={[
          [<T key="a">0x000000E35525D001</T>, "Treat as Windows FILETIME", "2015-01-01 00:00:00.4620288"],
          [<T key="b">0x0048233E</T>, "Check as both UNIX timestamp and DOS timestamp", "UNIX gives 2003-01-13 23:13:03.99936 UTC; DOS gives 2011-01-03 09:00:00"],
        ]}
      />
      <p className="text-sm">
        In an exam, the key mark-winning point is not just the final date. It is showing that you recognised the likely timestamp family from the value size and encoding convention before converting it.
      </p>

      <SubHeading id="w10-timeline">3.2 Timeline reconstruction from NTUSER.DAT</SubHeading>
      <p className="text-sm">
        The task is to determine a timeline around <T>RecycleTestDocument.rtf</T> on 2 January 2015. The model solution uses registry artefacts rather than guessing from filename alone.
      </p>
      <CodeBlock lang="Artefacts identified in the model solution">
        {`Wordpad\Recent File List
Explorer\ComDlg32\OpenSavePidlMRU\*
Explorer\ComDlg32\OpenSavePidlMRU\rtf
Explorer\RecentDocs
Explorer\RecentDocs\.rtf
UserAssist entries for wordpad.exe and Wordpad.lnk`}
      </CodeBlock>
      <p className="text-sm">
        The model solution also reminds you that UserAssist stores names in ROT13 form, so <T>wordpad</T> appears as <T>jbeqcnq</T>. That is a classic exam point.
      </p>
      <CodeBlock lang="Worked timeline from the model solution">
        {`16:36:48  UserAssist -> Wordpad.lnk
16:38:52  OpenSavePidlMRU -> document selection/open action
22:49:35  RecentDocs + UserAssist -> wordpad.exe
22:49:44  Wordpad Recent File List -> RecycleTestDocument.rtf`}
      </CodeBlock>
      <p className="text-sm">
        Worked interpretation: the evidence is consistent with the document being accessed through WordPad, but the strongest answer keeps the distinction clear. You first present the artefacts and their timestamps. Only after that do you say the sequence is consistent with a user opening and editing the document in WordPad.
      </p>
      <Callout type="warning">
        The model solution explicitly warns against speculation. A first-class answer says "the evidence supports" or "is consistent with" rather than claiming absolute certainty where the artefacts do not justify it.
      </Callout>
      <Callout type="info" title="Transcript Sidenote">
        The final forensics lecture added a strong reminder that not all timestamps are UTC. NTFS commonly stores UTC, but FAT-like media may store local time, and BIOS battery state, timezone configuration, and NTP sync events can all affect how you should interpret a timeline.
      </Callout>

      <SectionHeading id="forensics-probable-questions">Probable Exam Questions</SectionHeading>
      <p className="text-sm"><strong>Question:</strong> Why must scene notes be contemporaneous in the Week 6 exercise?</p>
      <p className="text-sm"><strong>Model answer:</strong> Contemporaneous notes provide a defensible record of what was observed and done at the time, supporting credibility, continuity, and later testimony.</p>
      <p className="text-sm"><strong>Question:</strong> Why record both BIOS time and wall-clock time?</p>
      <p className="text-sm"><strong>Model answer:</strong> Comparing BIOS time with actual time helps identify clock drift or misconfiguration, which can affect later interpretation of timestamps.</p>
      <p className="text-sm"><strong>Question:</strong> Why is UserAssist search tricky in the timeline task?</p>
      <p className="text-sm"><strong>Model answer:</strong> Program names in UserAssist are commonly ROT13-obfuscated, so the examiner may need to search for the transformed string rather than the plain executable name.</p>
      <p className="text-sm"><strong>Question:</strong> Why should you avoid interacting casually with a live suspect machine?</p>
      <p className="text-sm"><strong>Model answer:</strong> Any interaction can alter volatile memory, logs, timestamps, or disk state, potentially contaminating evidence and making later interpretation more difficult or less defensible.</p>
      <p className="text-sm"><strong>Question:</strong> Why is FAT time handling more error-prone than NTFS time handling?</p>
      <p className="text-sm"><strong>Model answer:</strong> FAT stores times in local time, so interpretation depends on knowing the system’s timezone and daylight-saving context. NTFS stores timestamps in UTC, which is generally more consistent for later conversion.</p>
      <p className="text-sm"><strong>Question:</strong> Why is chain of custody important even in a classroom scenario?</p>
      <p className="text-sm"><strong>Model answer:</strong> Because the exercise is designed to test whether evidence would remain credible in a real investigation. Proper continuity demonstrates who handled the item, when, and for what purpose.</p>
      <p className="text-sm"><strong>Question:</strong> Why is the phrase "consistent with" valuable in timeline interpretation?</p>
      <p className="text-sm"><strong>Model answer:</strong> It allows the examiner to explain a likely interpretation without overstating certainty beyond what the artefacts actually prove.</p>
      <p className="text-sm"><strong>Question:</strong> Why is recognizing timestamp family before conversion important?</p>
      <p className="text-sm"><strong>Model answer:</strong> Because the same hexadecimal value may represent very different real-world dates depending on whether it is interpreted as FILETIME, UNIX time, or DOS time. Correct identification is part of the analysis, not an optional extra.</p>

      <SectionHeading id="forensics-common-mistakes">Common Mistakes and Lost Marks</SectionHeading>
      <Table
        headers={["Mistake", "Why marks are lost"]}
        rows={[
          ["Interpreting before presenting artefacts", "Forensics questions expect evidence-first structure"],
          ["Touching a live machine casually in the scene question", "Shows poor awareness of evidential contamination risk"],
          ["Confusing FAT local time with NTFS UTC", "This is a classic timestamp error"],
          ["Writing absolute claims from partial timeline evidence", "The model solution explicitly warns against speculation"],
          ["Forgetting continuity and logs during Week 6 answers", "Procedural integrity is a major part of the practical"],
          ["Treating BIOS time as automatically trustworthy", "Clock drift and misconfiguration must be considered"],
          ["Ignoring ROT13 when discussing UserAssist", "Misses an important practical complication"],
          ["Reversing bytes incorrectly in endianness questions", "You reverse by byte, not by individual bit or hex digit"],
        ]}
      />
    </div>
  );
}
