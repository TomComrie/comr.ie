import { Callout, CodeBlock, SectionHeading, SubHeading, T, Table } from "@/components/ContentComponents";

export default function PracticalReverseEngineeringContent() {
  return (
    <div className="space-y-1 text-slate-700 leading-relaxed">
      <Callout type="warning">
        Only the Week 8 model-solution sheet was available, not the original worksheet. This page is therefore built from the model answer itself and is designed as an exam-ready reconstruction of the required method.
      </Callout>
      <p className="text-sm">
        Quick revision: <a href="/exam-cheatsheet#reverse-cheatsheet" className="text-teal-600 hover:underline">Reverse-engineering cheatsheet</a>.
      </p>

      <SectionHeading id="re-atbash">Reverse Engineering: a case of poor configuration</SectionHeading>
      <SubHeading id="re-scouting">1.1 Initial scouting</SubHeading>
      <p className="text-sm">
        The model solution’s first conclusion is that the target binary applies the Atbash substitution cipher. In other words, it maps the alphabet in reverse order: A↔Z, B↔Y, C↔X, and so on.
      </p>
      <p className="text-sm">
        Worked answer: "By executing the binary on sample input and observing that letters were consistently mirrored through the alphabet while non-letter structure survived, I inferred that the transformation was Atbash rather than a random substitution or Caesar shift."
      </p>

      <SubHeading id="re-symbols">1.2 Find the weak link: imported symbols</SubHeading>
      <CodeBlock lang="Command">
        {`nm --extern-only --dynamic atbash`}
      </CodeBlock>
      <p className="text-sm">
        The imported symbols shown in the model solution include <T>printf</T>, <T>putchar</T>, <T>puts</T>, and <T>strlen</T>. These are attractive attack points because they are resolved from external libraries rather than being implemented inside the binary itself.
      </p>
      <p className="text-sm">
        Worked reasoning: <T>puts</T> is the simplest target because it has a straightforward signature and obvious visible side effects on program output.
      </p>

      <SubHeading id="re-ghost">1.3 Ghost in the code: recreate the function signature</SubHeading>
      <CodeBlock lang="Manual lookup">
        {`man puts`}
      </CodeBlock>
      <CodeBlock lang="Signature">
        {`int puts(const char *s);`}
      </CodeBlock>
      <p className="text-sm">
        This matters because a preload attack only works reliably if your replacement function uses the correct name and calling convention.
      </p>

      <SubHeading id="re-library">1.4 Build the malicious shared library</SubHeading>
      <CodeBlock lang="maliciouslib.c">
        {`#include <stdio.h>

int puts(const char *s) {
  return printf("%s\n\n --- [deadbeef]\r\n", s);
}`}
      </CodeBlock>
      <CodeBlock lang="Compile">
        {`cc -fPIC -Wall -shared -Wl,-soname,maliciouslib.so -o maliciouslib.so maliciouslib.c`}
      </CodeBlock>
      <Table
        headers={["Flag", "Meaning"]}
        rows={[
          [<T key="a">-fPIC</T>, "Generate position-independent code suitable for a shared library"],
          [<T key="b">-Wall</T>, "Enable common warnings"],
          [<T key="c">-shared</T>, "Produce a shared object rather than a normal executable"],
          [<T key="d">-Wl,-soname,...</T>, "Pass shared-library naming information to the linker"],
        ]}
      />
      <Callout type="key">
        The underlying concept is dynamic linking. If a program imports a symbol from a shared library, the runtime loader can be influenced to resolve that symbol from attacker-controlled code first.
      </Callout>

      <SubHeading id="re-execution">1.5 Execution flip with LD_PRELOAD</SubHeading>
      <CodeBlock lang="Commands">
        {`./atbash ciao a tutti
LD_PRELOAD=./maliciouslib.so ./atbash ciao a tutti`}
      </CodeBlock>
      <p className="text-sm">
        Worked answer: the second command forces the dynamic loader to load <T>maliciouslib.so</T> before the standard libraries. As a result, calls to <T>puts</T> resolve to the attacker-supplied function, which appends the <T>--- [deadbeef]</T> marker to the program output.
      </p>

      <SectionHeading id="re-substitution">Decrypt the old code: monoalphabetic substitution</SectionHeading>
      <SubHeading id="re-keyspace">2.1 Key format and key space</SubHeading>
      <p className="text-sm">
        The model solution treats a substitution key as a 26-character mapping over the English alphabet. Because each plaintext letter must map to a different ciphertext letter, the number of valid keys is <T>26!</T>.
      </p>
      <p className="text-sm">
        Worked answer: "The key space of a monoalphabetic substitution cipher over the 26-letter English alphabet is 26!, approximately 4 × 10^26, which is too large for naive brute force."
      </p>

      <SubHeading id="re-decryptor">2.2 Develop a decryption algorithm</SubHeading>
      <CodeBlock lang="Core substitution function">
        {`char subst(char c, const char *key) {
  if (isalpha(c)) {
    if (isupper(c))
      return toupper(key[tolower(c) - 'A']);
    return tolower(key[toupper(c) - 'A']);
  }
  return c;
}`}
      </CodeBlock>
      <p className="text-sm">
        What this does: letters are mapped through the key, uppercase and lowercase are preserved, and non-alphabetic characters are passed through unchanged. That is exactly the behavior you usually want in a substitution-cipher tool.
      </p>

      <SubHeading id="re-clue">2.3 Interpret the clue string</SubHeading>
      <CodeBlock lang="Suspicious value">
        {`3CYTKULMWBHPOIADRJXZGVQNESF`}
      </CodeBlock>
      <p className="text-sm">
        The solution notes that the string is 27 characters long: a leading digit <T>3</T> plus 26 letters. The natural interpretation is that the digit is a Caesar-shift clue and the letters are a substitution mapping candidate.
      </p>

      <SubHeading id="re-caesar">2.4 Apply the Caesar transformation and test candidates</SubHeading>
      <CodeBlock lang="Caesar helper idea">
        {`char encrypt_caesar(char c, char key) {
  if (isalpha(c)) {
    if (isupper(c)) return ((c - 'A') + key + 26) % 26 + 'A';
    return ((c - 'a') + key + 26) % 26 + 'a';
  }
  return c;
}`}
      </CodeBlock>
      <p className="text-sm">
        The model solution explains that after generating Caesar-shifted forms, you still need to consider whether you have an encryption key or a decryption key. That is why it constructs multiple candidate keys.
      </p>
      <CodeBlock lang="Candidate generation from the model solution">
        {`C1=$(./caesar CYTKULMWBHPOIADRJXZGVQNESF 3 2> /dev/null)
C2=$(./caesar CYTKULMWBHPOIADRJXZGVQNESF -3 2> /dev/null)
C3=$(./rvmap $C1 2> /dev/null)
C4=$(./rvmap $C2 2> /dev/null)`}
      </CodeBlock>
      <p className="text-sm">
        Worked answer: "I generated both +3 and -3 Caesar interpretations of the candidate alphabet, then reversed each mapping where necessary to obtain decryption keys. I tested each candidate by decrypting the ciphertext and selecting the one that produced meaningful plaintext."
      </p>
      <Callout type="tip">
        In an exam, explain the uncertainty explicitly. The marker will usually reward the fact that you considered both encryption and decryption direction rather than blindly assuming one.
      </Callout>

      <SectionHeading id="re-probable-questions">Probable Exam Questions</SectionHeading>
      <p className="text-sm"><strong>Question:</strong> Why does <T>LD_PRELOAD</T> work?</p>
      <p className="text-sm"><strong>Model answer:</strong> It influences the dynamic linker to load attacker-specified shared libraries before the standard ones, so imported symbols can resolve to attacker-controlled implementations first.</p>
      <p className="text-sm"><strong>Question:</strong> Why is <T>puts</T> a better target than an internal function defined in the binary?</p>
      <p className="text-sm"><strong>Model answer:</strong> <T>puts</T> is externally imported and dynamically resolved, so it can be replaced through preload hijacking. Internal functions compiled directly into the binary are harder to replace because they are not necessarily resolved through external symbol lookup.</p>
      <p className="text-sm"><strong>Question:</strong> Why is brute force impractical against a monoalphabetic substitution cipher key space?</p>
      <p className="text-sm"><strong>Model answer:</strong> The key space is 26!, around 4 × 10^26 possibilities, which is far too large for naive exhaustive search.</p>
      <p className="text-sm"><strong>Question:</strong> Why is matching the replacement function signature important in a preload attack?</p>
      <p className="text-sm"><strong>Model answer:</strong> The binary expects the imported function to use a particular name, parameters, and calling convention. If the replacement does not match, the process may crash or behave incorrectly instead of executing the attacker-controlled logic.</p>
      <p className="text-sm"><strong>Question:</strong> Why is <T>-fPIC</T> relevant when building a shared object?</p>
      <p className="text-sm"><strong>Model answer:</strong> Position-independent code can be loaded at varying memory addresses without relocation assumptions tied to one fixed address, which is important for dynamically loaded shared libraries.</p>
      <p className="text-sm"><strong>Question:</strong> Why did the model solution generate four key candidates in the cipher exercise?</p>
      <p className="text-sm"><strong>Model answer:</strong> Because there was uncertainty about both Caesar direction and whether the resulting alphabet represented an encryption mapping or a decryption mapping. Testing all plausible combinations is a disciplined way to avoid a false assumption.</p>
      <p className="text-sm"><strong>Question:</strong> What is the difference between Atbash and a generic monoalphabetic substitution?</p>
      <p className="text-sm"><strong>Model answer:</strong> Atbash is a specific fixed substitution using the reversed alphabet. A generic monoalphabetic substitution can use any one-to-one permutation of the alphabet as its key.</p>
      <p className="text-sm"><strong>Question:</strong> Why is process explanation especially important in reverse-engineering answers?</p>
      <p className="text-sm"><strong>Model answer:</strong> Because reverse engineering is an investigative discipline. Markers often award substantial credit for the reasoning path, tools chosen, and elimination of alternatives even before the final conclusion is reached.</p>

      <SectionHeading id="re-common-mistakes">Common Mistakes and Lost Marks</SectionHeading>
      <Table
        headers={["Mistake", "Why marks are lost"]}
        rows={[
          ["Calling Atbash a Caesar cipher", "They are different substitution schemes"],
          ["Ignoring whether a candidate key is for encryption or decryption", "That distinction is central in the Week 8 workflow"],
          ["Giving a preload idea without matching the function signature", "Shows incomplete understanding of symbol replacement"],
          ["Forgetting why -fPIC matters", "Misses the shared-library runtime loading point"],
          ["Presenting only the final answer without the reasoning path", "Reverse-engineering marks often reward the process more than the outcome"],
          ["Assuming imported symbols are always exploitable", "You still need an attack surface like dynamic linking and symbol override"],
          ["Treating 26! as a small brute-force space", "This loses mathematical reasoning marks"],
          ["Not separating Caesar-shift logic from substitution-key inversion", "These are distinct steps in the model workflow"],
        ]}
      />
    </div>
  );
}
