import { Callout, CodeBlock, SectionHeading, SubHeading, T, Table } from "@/components/ContentComponents";

export default function PracticalWebSecurityContent() {
  return (
    <div className="space-y-1 text-slate-700 leading-relaxed">
      <Callout type="key">
        This page is your worked-answer guide for the Week 4 and Week 5 web labs. In an exam, always describe the observation, the manipulation, and the proof of success.
      </Callout>
      <p className="text-sm">
        Quick revision: <a href="/exam-cheatsheet#web-cheatsheet" className="text-teal-600 hover:underline">Web security cheatsheet</a>.
      </p>

      <SectionHeading id="w4-xss-game">Week 4: Cross-Site Scripting Game</SectionHeading>
      <p className="text-sm">
        The lab sheet for Week 4 does not define one fixed payload per question. It tells you to work through the XSS Game and understand why different payloads succeed. That means the examinable skill is methodology, not memorising one string.
      </p>
      <Table
        headers={["Step", "What to do", "What to write in an answer"]}
        rows={[
          ["1", "Identify the input point", "State where attacker-controlled input enters the application"],
          ["2", "Find the sink", "State whether the input lands in HTML, an attribute, JavaScript, or the DOM"],
          ["3", "Pick a context-matching payload", "Use a payload that matches the output context"],
          ["4", "Observe execution", "Show that JavaScript ran, for example with alert(1)"],
          ["5", "Explain why it worked", "Tie the success back to missing output encoding or unsafe DOM handling"],
        ]}
      />
      <SubHeading id="w4-method">Model method for any XSS game level</SubHeading>
      <CodeBlock lang="Common payload starting points">
        {`<script>alert(1)</script>
<img src=x onerror=alert(1)>
<svg onload=alert(1)>
" onmouseover="alert(1)
javascript:alert(1)`}
      </CodeBlock>
      <p className="text-sm">
        Worked answer template: "I first determined where my input was reflected. If it appeared directly in HTML body content, I used a script or event-handler payload. If it appeared inside an attribute, I attempted to break out of the attribute and inject my own event handler. If the sink was DOM-based, I targeted the client-side JavaScript path rather than the server response."
      </p>
      <Callout type="tip">
        If asked "What should you do if &lt;script&gt; is filtered?", the worked answer is: switch to event handlers such as <T>onerror</T>, <T>onload</T>, or other tags such as <T>svg</T>, depending on the context.
      </Callout>
      <Callout type="info" title="Transcript Sidenote">
        In the next-week transcript reflection on the XSS lab, the lecturer noted that levels 1 and 2 were very close to the lecture examples, level 3 used a broken-image <T>onerror</T> style payload, and level 4 was harder because it involved a redirect page that had not been covered directly in the slides.
      </Callout>

      <SectionHeading id="w5-wireshark">Week 5: Capturing Credentials with Wireshark</SectionHeading>
      <p className="text-sm">
        The objective is to prove that HTTP login credentials travel unencrypted and can be recovered from a packet capture.
      </p>
      <SubHeading id="w5-wireshark-walkthrough">Full walkthrough</SubHeading>
      <CodeBlock lang="Workflow">
        {`1. Open Wireshark in the EHAC VM
2. Choose the active network interface
3. Start packet capture
4. Browse to http://testphp.vulnweb.com/login.php
5. Submit any username and password
6. Stop the capture
7. Apply display filter: http
8. Find the POST request
9. Expand Hypertext Transfer Protocol
10. Expand HTML Form URL Encoded`}
      </CodeBlock>
      <p className="text-sm">
        Worked answer: after applying the <T>http</T> display filter, the number of visible packets drops sharply. The key packet is the HTTP <T>POST</T> request that carried the form submission. Expanding the parsed protocol view shows the form fields and therefore the submitted username and password in cleartext.
      </p>
      <p className="text-sm">
        If the examiner asks what proves success, answer: "The credentials were visible either in the decoded HTML Form URL Encoded section or directly in the raw packet bytes in the lower pane. This demonstrates that HTTP traffic is not encrypted."
      </p>
      <Callout type="warning">
        The core lesson is not "Wireshark steals passwords". The real answer is: any observer with access to the traffic path can read plaintext HTTP application data because the protocol provides no confidentiality.
      </Callout>

      <SectionHeading id="w5-burp-intercept">Week 5: Burp Interception</SectionHeading>
      <SubHeading id="w5-burp-task1">Task 1: start Burp correctly</SubHeading>
      <p className="text-sm">
        The lab expects you to use Burp Community Edition with a temporary project and Burp defaults. The relevant feature is the Proxy tab and the built-in browser.
      </p>
      <Callout type="info" title="Transcript Sidenote">
        A later transcript explicitly warned that interception only works if traffic is actually going through Burp. The safest beginner route is to use Burp&apos;s integrated browser. If you want to use your own browser, you must export Burp&apos;s CA certificate and configure the browser and proxy settings correctly.
      </Callout>
      <SubHeading id="w5-burp-task2">Task 2: intercept and modify a login request</SubHeading>
      <CodeBlock lang="Walkthrough">
        {`1. Launch Burp
2. Choose Temporary Project
3. Choose Use Burp defaults
4. Open Proxy tab
5. Turn Intercept OFF initially
6. Open Burp browser and go to http://testasp.vulnweb.com
7. Turn Intercept ON
8. Submit any username and password
9. Burp captures the request instead of sending it immediately
10. Edit the body parameters before forwarding`}
      </CodeBlock>
      <CodeBlock lang="Parameter change used in the lab">
        {`tfUName=admin
tfUPass=none`}
      </CodeBlock>
      <p className="text-sm">
        Worked answer: with interception enabled, Burp pauses the HTTP request before it reaches the server. That gives the tester the ability to alter form parameters. Replacing the submitted values with <T>tfUName=admin</T> and <T>tfUPass=none</T> causes the server to treat the request as a valid login and grant access.
      </p>
      <Callout type="tip" title="Transcript Sidenote">
        The same transcript said that once you capture the packet you usually want to send it to <strong>Repeater</strong> rather than repeatedly re-triggering it through the browser. Repeater is the efficient way to edit and resend the same request again and again.
      </Callout>

      <SectionHeading id="w5-burp-traversal">Week 5: Directory Traversal</SectionHeading>
      <SubHeading id="w5-burp-task3">Task 3: retrieve /etc/passwd through path traversal</SubHeading>
      <p className="text-sm">
        The lab answer sheet shows the vulnerable file path begins in <T>/var/www/images</T>. The exploit is to replace the expected image filename with a relative path that climbs out of that directory.
      </p>
      <CodeBlock lang="Traversal payload">
        {`../../../etc/passwd`}
      </CodeBlock>
      <CodeBlock lang="Reasoning">
        {`/var/www/images
../        -> /var/www
../../     -> /var
../../../  -> /
../../../etc/passwd -> /etc/passwd`}
      </CodeBlock>
      <p className="text-sm">
        Worked answer: after intercepting a request for a product image, replace the filename parameter with <T>../../../etc/passwd</T>. Send the edited request. If the application fails to validate the path correctly, the response body contains the contents of the system password file instead of the requested image. That proves arbitrary file read through directory traversal.
      </p>
      <Table
        headers={["Observation", "Meaning"]}
        rows={[
          ["Image request intercepted", "The server accepts a client-supplied path or filename parameter"],
          ["../ works", "Path traversal segments are not being neutralised"],
          ["/etc/passwd returned", "The application can be forced to read files outside the intended directory"],
        ]}
      />
      <Callout type="tip">
        A strong exam sentence is: "The vulnerability exists because the application trusts user-controlled path input and concatenates it into a filesystem access operation without canonicalisation and boundary checking."
      </Callout>

      <SectionHeading id="web-probable-questions">Probable Exam Questions</SectionHeading>
      <p className="text-sm"><strong>Question:</strong> Why is HTTP credential capture possible in Wireshark?</p>
      <p className="text-sm"><strong>Model answer:</strong> HTTP does not encrypt application data, so usernames and passwords submitted in forms travel in plaintext across the network and can be read by anyone able to capture the packets.</p>
      <p className="text-sm"><strong>Question:</strong> What does Burp Suite give an attacker or tester that a normal browser does not?</p>
      <p className="text-sm"><strong>Model answer:</strong> Burp acts as an intercepting proxy, allowing requests to be paused, inspected, modified, and forwarded before they reach the server.</p>
      <p className="text-sm"><strong>Question:</strong> What is the key difference between reflected and DOM-based XSS?</p>
      <p className="text-sm"><strong>Model answer:</strong> Reflected XSS involves the server returning attacker-controlled input in the HTTP response, while DOM-based XSS happens when client-side JavaScript injects untrusted data into the page without safe encoding.</p>
      <p className="text-sm"><strong>Question:</strong> Explain how you would prove an intercepted login request was modified successfully in Burp.</p>
      <p className="text-sm"><strong>Model answer:</strong> I would describe the original request being paused by Burp, show the edited parameters, forward the request, and then state that the server response or redirected page showed successful login. The proof is the changed server behavior after parameter manipulation.</p>
      <p className="text-sm"><strong>Question:</strong> Why is the path <T>../../../etc/passwd</T> effective in the traversal lab?</p>
      <p className="text-sm"><strong>Model answer:</strong> Because the vulnerable resource starts in <T>/var/www/images</T>. Each <T>../</T> moves one directory upward until the path reaches the filesystem root, after which <T>etc/passwd</T> addresses the sensitive file directly.</p>
      <p className="text-sm"><strong>Question:</strong> If <T>&lt;script&gt;</T> is filtered, what should you do next in an XSS challenge?</p>
      <p className="text-sm"><strong>Model answer:</strong> Reassess the context and switch to a different execution vector such as an event handler, quote breaking in an attribute, or a different tag like <T>svg</T>. The right move depends on where the input lands.</p>
      <p className="text-sm"><strong>Question:</strong> Why does seeing credentials in the decoded HTTP pane matter more than just seeing lots of packets?</p>
      <p className="text-sm"><strong>Model answer:</strong> Because it proves the application-layer data was intelligible in transit. The capture is not just noise; it contains recoverable sensitive information in human-readable form.</p>
      <p className="text-sm"><strong>Question:</strong> What is the core vulnerability behind the traversal exercise?</p>
      <p className="text-sm"><strong>Model answer:</strong> Improper validation of user-controlled file paths. The application allows relative path segments to escape the intended directory and access files elsewhere on the server.</p>

      <SectionHeading id="web-common-mistakes">Common Mistakes and Lost Marks</SectionHeading>
      <Table
        headers={["Mistake", "Why marks are lost"]}
        rows={[
          ["Writing a payload without naming the context", "XSS questions reward context-aware reasoning"],
          ["Saying Burp hacked the site", "Burp is the interception tool; the vulnerability is in the application behavior"],
          ["Describing traversal as SQL injection or command injection", "Mixing vulnerability classes loses precision marks"],
          ["Not stating how success was verified", "Markers expect evidence such as returned /etc/passwd content or visible credentials"],
          ["Treating all POST traffic as secure", "POST changes HTTP semantics, not confidentiality"],
          ["Calling DOM XSS server-side", "DOM XSS is driven by client-side script behavior"],
          ["Memorising one XSS payload and using it everywhere", "This misses the context-specific reasoning the practical is teaching"],
          ["Failing to mention plaintext when discussing Wireshark capture", "That confidentiality point is the core lesson"],
        ]}
      />
    </div>
  );
}
