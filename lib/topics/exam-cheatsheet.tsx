import { Callout, CodeBlock, SectionHeading, T, Table } from "@/components/ContentComponents";

export default function ExamCheatsheetContent() {
  return (
    <div className="space-y-1 text-slate-700 leading-relaxed">
      <Callout type="danger">
        This is the short-answer, high-yield revision page. Use it the night before and the hour before the exam. The practical walkthrough topics hold the full workings; this page holds the fastest recall points.
      </Callout>
      <p className="text-sm">
        Jump to full walkthroughs: <a href="/practical-linux-basics#w2-file-apis" className="text-teal-600 hover:underline">Linux</a>, <a href="/practical-web-security#w4-xss-game" className="text-teal-600 hover:underline">Web Security</a>, <a href="/practical-reverse-engineering#re-atbash" className="text-teal-600 hover:underline">Reverse Engineering</a>, <a href="/practical-forensics-labs#w6-scene-collection" className="text-teal-600 hover:underline">Forensics</a>.
      </p>

      <SectionHeading id="exam-strategy">Exam Strategy</SectionHeading>
      <Table
        headers={["Question type", "Best answer structure"]}
        rows={[
          ["Explain a concept", "Define it, say why it matters, give one concrete example"],
          ["Describe a practical workflow", "State the tool, list the steps in order, state how success is verified"],
          ["Interpret evidence", "Present artefacts first, then cautious interpretation"],
          ["Compare two things", "Give one clear difference per sentence, then one implication"],
          ["Mitigation question", "State primary control first, then defence-in-depth controls"],
        ]}
      />
      <CodeBlock lang="Safe phrasing for evidence questions">
        {`The artefact shows ...
This is consistent with ...
This suggests ...
This does not by itself prove ...`}
      </CodeBlock>

      <SectionHeading id="linux-cheatsheet">Linux Practical Cheatsheet</SectionHeading>
      <Table
        headers={["Task", "Answer to remember"]}
        rows={[
          ["Create a file", <T key="a">touch file.txt</T>],
          ["View permissions", <T key="b">ls -l file.txt</T>],
          ["Owner read/write/execute", <T key="c">chmod u+rwx file.txt</T>],
          ["Remove owner access", <T key="d">chmod u-rwx file.txt</T>],
          ["Read-only for everyone", <T key="e">chmod a-w file.txt</T>],
          ["Change owner", <T key="f">sudo chown user:user file.txt</T>],
          ["Nested directories", <T key="g">mkdir -p a/b/c</T>],
          ["Trace system calls", <T key="h">strace ./program</T>],
        ]}
      />
      <p className="text-sm">
        OFT answer: the Open File Table is the OS structure that stores the state of open files, including offset and access mode, while the process only holds file descriptor numbers.
      </p>
      <p className="text-xs text-slate-500">
        Full walkthroughs: <a href="/practical-linux-basics#w2-ex1" className="text-teal-600 hover:underline">Week 2 exercises 1-3</a>, <a href="/practical-linux-basics#w2-ex5" className="text-teal-600 hover:underline">mystat</a>, <a href="/practical-linux-basics#w3-ex1" className="text-teal-600 hover:underline">Week 3 permissions</a>.
      </p>

      <SectionHeading id="web-cheatsheet">Web Security Cheatsheet</SectionHeading>
      <Table
        headers={["Topic", "Fast answer"]}
        rows={[
          ["Reflected XSS", "Payload is reflected immediately in response; victim usually clicks crafted link"],
          ["Stored XSS", "Payload is stored server-side and served to later users"],
          ["DOM XSS", "Server may never see payload; client-side JS performs the unsafe injection"],
          ["Wireshark HTTP lesson", "HTTP credentials are visible in plaintext in captured packets"],
          ["Burp interception", "Intercept, modify request parameters, forward, observe changed server behavior"],
          ["Directory traversal", <span key="a"><T>../</T> escapes directories; success proves path validation failure</span>],
        ]}
      />
      <CodeBlock lang="Classic payloads">
        {`<script>alert(1)</script>
<img src=x onerror=alert(1)>
<svg onload=alert(1)>
../../../etc/passwd`}
      </CodeBlock>
      <p className="text-xs text-slate-500">
        Full walkthroughs: <a href="/practical-web-security#w4-method" className="text-teal-600 hover:underline">XSS methodology</a>, <a href="/practical-web-security#w5-wireshark-walkthrough" className="text-teal-600 hover:underline">Wireshark</a>, <a href="/practical-web-security#w5-burp-task2" className="text-teal-600 hover:underline">Burp interception</a>, <a href="/practical-web-security#w5-burp-task3" className="text-teal-600 hover:underline">Traversal</a>.
      </p>

      <SectionHeading id="reverse-cheatsheet">Reverse Engineering Cheatsheet</SectionHeading>
      <Table
        headers={["Task", "Fast answer"]}
        rows={[
          ["List imported symbols", <T key="a">nm --extern-only --dynamic binary</T>],
          ["Hijack shared function", <T key="b">LD_PRELOAD=./lib.so ./binary</T>],
          ["Why -fPIC?", "Makes shared-library code position-independent"],
          ["Monoalphabetic key space", <T key="c">26!</T>],
          ["Atbash", "Reverse alphabet substitution: A↔Z, B↔Y, ..."],
        ]}
      />
      <p className="text-xs text-slate-500">
        Full walkthroughs: <a href="/practical-reverse-engineering#re-symbols" className="text-teal-600 hover:underline">imported symbols</a>, <a href="/practical-reverse-engineering#re-library" className="text-teal-600 hover:underline">shared library build</a>, <a href="/practical-reverse-engineering#re-caesar" className="text-teal-600 hover:underline">key recovery</a>.
      </p>

      <SectionHeading id="forensics-cheatsheet">Forensics Cheatsheet</SectionHeading>
      <Table
        headers={["Topic", "Fast answer"]}
        rows={[
          ["ACPO Principle 1", "No action should change data on a device that may later be relied upon in court"],
          ["Order of volatility", "Collect most volatile evidence first, especially RAM on a live system"],
          ["Chain of custody", "Document who handled evidence, when, where, why, and in what condition"],
          ["NTFS time zone", "UTC"],
          ["FAT time zone", "Local time"],
          ["Zone.Identifier", "Mark of the Web ADS showing downloaded origin"],
          ["Event 4624", "Successful logon"],
          ["Logon type 10", "RemoteInteractive / RDP"],
          ["Event 4616", "System time manually changed"],
          ["UserAssist names", "Often ROT13-obfuscated"],
        ]}
      />
      <CodeBlock lang="Week 10 must-remember values">
        {`DE AD BE EF -> EF BE AD DE
UTF-8 for ⊕ -> E2 8A 95
UTF-8 for ⊻ -> E2 8A BB
0x000000E35525D001 -> 2015-01-01 00:00:00.4620288`}
      </CodeBlock>
      <p className="text-xs text-slate-500">
        Full walkthroughs: <a href="/practical-forensics-labs#w6-record-scene" className="text-teal-600 hover:underline">scene recording</a>, <a href="/practical-forensics-labs#w6-bios" className="text-teal-600 hover:underline">hardware and BIOS</a>, <a href="/practical-forensics-labs#w10-date-encoding" className="text-teal-600 hover:underline">date encoding</a>, <a href="/practical-forensics-labs#w10-timeline" className="text-teal-600 hover:underline">timeline reconstruction</a>.
      </p>

      <SectionHeading id="report-writing-cheatsheet">Reporting Cheatsheet</SectionHeading>
      <Table
        headers={["Report type", "Core structure"]}
        rows={[
          ["Forensic report", "Receipt, background, purpose, technical issues, examination/results, interpretation, conclusions"],
          ["Pentest report", "Executive summary, scope/methodology, technical background, findings, attack narrative, remediation roadmap, appendices"],
          ["CVSS point", "Explain the vector and then explain why context may raise or lower practical severity"],
        ]}
      />
      <Callout type="tip">
        If you are short on time in the exam, write the correct process in order and explain the verification step. Even if you forget one exact command, markers usually reward correct methodology and reasoning.
      </Callout>
    </div>
  );
}
