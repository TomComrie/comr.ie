import { Callout, Table, SectionHeading, SubHeading, T, CodeBlock } from "@/components/ContentComponents";
import { slideReferences } from "@/lib/slide-references";

export default function SteganographyContent() {
  const refs = slideReferences.steganography;

  return (
    <div className="space-y-1 text-slate-700 leading-relaxed">

      <Callout type="info">
        Beginner mental model: encryption hides <em>meaning</em>; steganography hides <em>existence</em>. If encryption is a locked box, steganography is hiding the box inside something innocent-looking.
      </Callout>

      <SectionHeading id="steg-intro" slideRef={refs["steg-intro"]}>What is Steganography?</SectionHeading>
      <p>
        <strong>Steganography</strong> is the practice of hiding data <em>within</em> other data so that the very existence of the hidden message is concealed. Unlike encryption (which hides the <em>content</em>), steganography hides the <em>fact</em> that a message exists at all.
      </p>
      <p className="text-sm mt-2">
        The carrier file (the file containing the hidden data) is called the <strong>cover medium</strong>. After embedding, it becomes the <strong>stego medium</strong>.
      </p>
      <Callout type="info">
        Steganography ≠ cryptography. Crypto makes content unreadable; stego makes communication undetectable. They are often used together: encrypt then hide.
      </Callout>
      <Callout type="info" title="Transcript Sidenote">
        The transcript frames stego systems around <strong>three considerations</strong>: (1) <strong>capacity</strong> — how much data can be embedded? (you cannot hide a 4K image in an emoji), (2) <strong>security</strong> — how hard is it for an adversary to detect hidden data?, (3) <strong>robustness</strong> — how much modification can the carrier endure before the hidden data is lost? This is a useful exam framework for evaluating stego techniques.
      </Callout>
      <Callout type="info" title="Transcript Sidenote">
        <strong>Number-of-bits tradeoff:</strong> Using 1 LSB per channel keeps the stego image nearly identical to the cover, but the recovered hidden image is barely recognisable. Using 4 bits gives a good balance — both images are reasonably preserved. Using 7 bits destroys the cover image entirely, making the steganography obvious. In the lab, students are expected to experiment with this tradeoff.
      </Callout>
      <Callout type="info" title="Transcript Sidenote">
        <strong>Download, don't copy:</strong> A common practical pitfall — copying an image through the browser interface re-encodes it, destroying LSB-embedded data. You must download the image directly (right-click → save, or use <T>wget</T>). This is a known lab issue students are expected to figure out themselves.
      </Callout>
      <p className="text-sm mt-2">
        This distinction matters in exams. If a hidden message is discovered but not encrypted, the secrecy is gone. If it is encrypted but obviously present, an attacker still knows something suspicious exists. Combining both gives confidentiality and concealment.
      </p>
      <Table
        headers={["Concept", "Definition"]}
        rows={[
          ["Cover medium", "The original carrier file (e.g., an innocent image)"],
          ["Stego medium", "The carrier file with hidden data embedded"],
          ["Payload", "The secret data being hidden"],
          ["Key / passphrase", "Used to embed and extract (in tools like steghide)"],
          ["Steganalysis", "The detection of hidden data"],
        ]}
      />

      <Callout type="info" title="Transcript Sidenote">
        <strong>Threat model difference (crypto vs stego):</strong> The lecture contrasts the two assumptions. Cryptography assumes the adversary sees everything on the channel and attacks continuously — security rests on mathematical hardness. Steganography assumes the adversary <em>doesn't even know communication is happening</em> — security rests on concealment. If an encrypted message is intercepted, the adversary knows <em>something</em> is being hidden. Stego adds deniability: you can claim the carrier is innocent.
      </Callout>

      <SectionHeading id="steg-techniques" slideRef={refs["steg-techniques"]}>Techniques</SectionHeading>
      <p className="text-sm">
        A useful way to think about steganography techniques is to ask <em>what part of the carrier can be changed without humans noticing?</em> In images that is often low-order pixel data; in compressed formats it may be transform coefficients; in audio it may be faint echo or tiny sample changes.
      </p>

      <SubHeading>LSB (Least Significant Bit) — Spatial Domain</SubHeading>
      <p className="text-sm">
        The most common image steganography technique. Each pixel is represented by bytes (e.g., RGB). The <em>least significant bit</em> of each byte contributes minimally to the visual colour. Replacing it with payload bits changes pixel values by at most 1 — imperceptible to the human eye.
      </p>
      <CodeBlock lang="Concept">
        {`Original pixel R: 11001010  (202)
Hide bit '1':   11001011  (203)  ← changed by 1, invisible
Hide bit '0':   11001010  (202)  ← unchanged

An 800×600 RGB image has 800×600×3 = 1,440,000 bytes
→ can hide up to 1,440,000 bits = 180,000 bytes ≈ 176 KB`}
      </CodeBlock>
      <Callout type="warning">
        LSB works best on lossless formats (BMP, PNG). JPEG compression destroys LSB-embedded data because DCT quantisation alters low-order bits.
      </Callout>

      <SubHeading>Frequency Domain (DCT) — JPEG</SubHeading>
      <p className="text-sm">
        JPEG compression uses Discrete Cosine Transform (DCT). Steganography tools like <strong>OutGuess</strong> and <strong>F5</strong> embed data in DCT coefficients, making it more resilient to JPEG compression than LSB.
      </p>
      <p className="text-sm mt-2">
        This is a good exam contrast: LSB is intuitive and easy but fragile; frequency-domain hiding is more technically involved but usually survives normal JPEG processing better.
      </p>

      <SubHeading>Audio Steganography</SubHeading>
      <p className="text-sm">
        Same LSB principle applied to audio samples. Can also use <strong>echo hiding</strong> — adding a faint echo at specific intervals to encode bits. The echo is inaudible but statistically detectable.
      </p>

      <SubHeading>Text Steganography</SubHeading>
      <p className="text-sm">
        Hiding data in text via whitespace manipulation, first-letter encoding, or invisible Unicode characters. Less capacity but very covert in plaintext channels.
      </p>

      <SubHeading>File System / NTFS ADS</SubHeading>
      <p className="text-sm">
        On NTFS, Alternate Data Streams can hide files within files. A 100MB video could be attached invisibly to a 1KB text file. See the <a href="/forensics-deleted#ads" className="text-teal-600 hover:underline">ADS section in Deleted Files</a>.
      </p>

      <SectionHeading id="steg-tools" slideRef={refs["steg-tools"]}>Tools</SectionHeading>
      <p className="text-sm">
        In practical work, steganography is often solved by workflow rather than brilliance. The fastest path is to start with cheap checks, then escalate only if needed: identify the file type, inspect metadata, search for strings, check for embedded files, then test stego-specific tools.
      </p>

      <Table
        headers={["Tool", "Purpose", "Key Commands"]}
        rows={[
          [
            "steghide",
            "Embed/extract in JPEG, BMP, WAV, AU. Supports passphrase encryption.",
            <code key="s" className="text-xs">steghide embed -cf cover.jpg -sf secret.txt\nsteghide extract -sf stego.jpg</code>,
          ],
          [
            "binwalk",
            "Scan files for embedded signatures. Great for finding files-within-files.",
            <code key="b" className="text-xs">binwalk file.jpg\nbinwalk -e file.jpg  # extract</code>,
          ],
          [
            "exiftool",
            "Read/write metadata. Useful for spotting unusual metadata or checking file structure.",
            <code key="e" className="text-xs">exiftool file.jpg</code>,
          ],
          [
            "strings",
            "Extract printable strings from any binary. Quick check for hidden text.",
            <code key="st" className="text-xs">strings file.jpg | grep -i flag</code>,
          ],
          [
            "zsteg",
            "LSB steganalysis for PNG and BMP files.",
            <code key="z" className="text-xs">zsteg file.png</code>,
          ],
          [
            "stegsolve",
            "GUI tool — visualise bit planes, channel analysis, frame browser.",
            "Java GUI application",
          ],
        ]}
      />

      <Callout type="tip">
        CTF/exam workflow: (1) <T>file</T> to check real type. (2) <T>exiftool</T> for metadata. (3) <T>strings | grep</T> for obvious text. (4) <T>binwalk</T> for embedded files. (5) <T>steghide extract</T> with blank passphrase first, then try obvious passwords. (6) <T>zsteg</T> for PNG/BMP.
      </Callout>

      <CodeBlock lang="Common workflow">
        {`file suspicious.jpg
exiftool suspicious.jpg
strings suspicious.jpg | grep -i "flag\|password\|secret\|key"
binwalk suspicious.jpg
binwalk -e suspicious.jpg
steghide extract -sf suspicious.jpg -p ""
steghide info suspicious.jpg`}
      </CodeBlock>

      <SectionHeading id="steg-detection" slideRef={refs["steg-detection"]}>Detection & Steganalysis</SectionHeading>
      <p className="text-sm">
        Steganalysis is difficult because success often means <em>proving something subtle about normality</em>. You are often not recovering the message immediately; you are building confidence that the carrier is statistically or structurally unusual.
      </p>

      <SubHeading>Visual Inspection</SubHeading>
      <p className="text-sm">
        Compare original and stego image visually and via bit-plane analysis (stegsolve). LSB planes of natural images have pseudo-random appearance; embedded data creates geometric patterns.
      </p>

      <SubHeading>Statistical Analysis (Chi-Squared Test)</SubHeading>
      <p className="text-sm">
        In a natural image, the frequency of pixel value pairs (2n, 2n+1) should be roughly equal due to random noise. LSB embedding forces specific values, making the distribution suspiciously uniform — detectable by chi-squared test.
      </p>

      <SubHeading>File Size Anomaly</SubHeading>
      <p className="text-sm">
        A stego file is often slightly larger than the original. Significant size increase relative to visual complexity is suspicious.
      </p>
      <SubHeading>Operational workflow for unknown files</SubHeading>
      <ol className="list-decimal pl-5 space-y-1 text-sm">
        <li>Identify the real file type with <T>file</T></li>
        <li>Check metadata with <T>exiftool</T></li>
        <li>Search for obvious strings and embedded markers</li>
        <li>Run <T>binwalk</T> for nested or appended data</li>
        <li>Use format-specific tools such as <T>zsteg</T> or <T>steghide</T></li>
        <li>Only then move to deeper statistical analysis or manual hex inspection</li>
      </ol>

      <SubHeading>Metadata Examination</SubHeading>
      <p className="text-sm">
        Comment fields, EXIF data, creation timestamps, and GPS data can contain hidden text or reveal manipulation software (e.g., steghide leaves no obvious trace, but unusual software names in EXIF are suspicious).
      </p>

      <SubHeading>Histogram Analysis</SubHeading>
      <p className="text-sm">
        Natural images have smooth pixel value histograms. LSB embedding creates a characteristic &quot;pairs of values&quot; pattern in the histogram — paired peaks at (2n, 2n+1).
      </p>

      <Callout type="key">
        In forensics: the absence of detectable steganography is not proof there is none. Sophisticated techniques (spread-spectrum, perceptual models) leave minimal statistical traces. Report absence of evidence, not evidence of absence.
      </Callout>

    </div>
  );
}
