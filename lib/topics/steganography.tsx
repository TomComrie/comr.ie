import { Callout, Table, SectionHeading, SubHeading, T, CodeBlock } from "@/components/ContentComponents";

export default function SteganographyContent() {
  return (
    <div className="space-y-1 text-slate-700 leading-relaxed">

      <SectionHeading id="steg-intro">What is Steganography?</SectionHeading>
      <p>
        <strong>Steganography</strong> is the practice of hiding data <em>within</em> other data so that the very existence of the hidden message is concealed. Unlike encryption (which hides the <em>content</em>), steganography hides the <em>fact</em> that a message exists at all.
      </p>
      <p className="text-sm mt-2">
        The carrier file (the file containing the hidden data) is called the <strong>cover medium</strong>. After embedding, it becomes the <strong>stego medium</strong>.
      </p>
      <Callout type="info">
        Steganography ≠ cryptography. Crypto makes content unreadable; stego makes communication undetectable. They are often used together: encrypt then hide.
      </Callout>
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

      <SectionHeading id="steg-techniques">Techniques</SectionHeading>

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

      <SectionHeading id="steg-tools">Tools</SectionHeading>

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

      <SectionHeading id="steg-detection">Detection & Steganalysis</SectionHeading>

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
