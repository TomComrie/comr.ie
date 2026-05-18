import { Callout, Table, SectionHeading, SubHeading, T, CodeBlock } from "@/components/ContentComponents";

export default function ForensicsDeletedContent() {
  return (
    <div className="space-y-1 text-slate-700 leading-relaxed">

      <SectionHeading id="how-deletion-works">How Deletion Works</SectionHeading>
      <p>
        When you delete a file in Windows, the OS does <strong>not</strong> overwrite the file&apos;s contents. Instead it:
      </p>
      <ol className="list-decimal pl-5 space-y-1 text-sm">
        <li>Sets the MFT record flag to <strong>&quot;not in use&quot;</strong></li>
        <li>Marks the file&apos;s clusters as free in the <T>$Bitmap</T></li>
        <li>Removes the directory entry</li>
      </ol>
      <p className="text-sm mt-2">
        The actual data on disk is <strong>untouched</strong> and remains recoverable until those sectors are overwritten by new data.
      </p>
      <Callout type="key">
        Delete = mark as free. The data remains until overwritten. How long it survives depends on how much new data is written to the volume — a busy system overwrites data faster than an idle one.
      </Callout>
      <Table
        headers={["Action", "What Changes", "Data"]}
        rows={[
          ["Delete to Recycle Bin", "File moved to $Recycle.Bin, renamed", "Intact"],
          ["Shift+Delete (bypass Recycle Bin)", "MFT record flagged, clusters freed", "Intact until overwritten"],
          ["Empty Recycle Bin", "MFT records for $R files flagged, clusters freed", "Intact until overwritten"],
          ["Secure delete (overwrite)", "Data overwritten with zeros or random bytes", "Destroyed"],
          ["SSD TRIM", "SSD zeroes free blocks asynchronously", "May be destroyed quickly"],
        ]}
      />
      <Callout type="warning">
        SSDs with TRIM enabled can destroy evidence rapidly. On SSDs, &quot;deleted&quot; data may be gone within seconds. Always check whether the device is an SSD and whether TRIM is enabled before expecting recovery.
      </Callout>

      <SectionHeading id="mft-recovery">MFT Record Recovery</SectionHeading>
      <p className="text-sm">
        Even after deletion, the MFT record persists until the OS reuses it for a new file. The record still contains:
      </p>
      <ul className="list-disc pl-5 space-y-1 text-sm">
        <li>Filename and directory path</li>
        <li>All four MACB timestamps</li>
        <li>File size</li>
        <li>Data runs (cluster pointers) — if the clusters haven&apos;t been overwritten, the data is still there</li>
      </ul>
      <p className="text-sm mt-2">
        Tools like <strong>Autopsy</strong>, <strong>Recuva</strong>, and <strong>TestDisk</strong> parse the MFT for &quot;not in use&quot; records to recover deleted files.
      </p>

      <SectionHeading id="file-carving">File Carving</SectionHeading>
      <p className="text-sm">
        <strong>File carving</strong> reconstructs files directly from raw disk data, without relying on the filesystem metadata. It scans for known file <strong>headers</strong> (magic bytes) and <strong>footers</strong> in unallocated space.
      </p>
      <p className="text-sm mt-2">
        Useful when the MFT record has been reused (metadata gone) but the data clusters haven&apos;t been overwritten yet.
      </p>

      <SubHeading>Common Magic Bytes</SubHeading>
      <Table
        headers={["File Type", "Header (Hex)", "Footer (Hex)", "ASCII Hint"]}
        rows={[
          ["JPEG", "FF D8 FF", "FF D9", "—"],
          ["PNG", "89 50 4E 47 0D 0A 1A 0A", "49 45 4E 44 AE 42 60 82", "‌PNG"],
          ["PDF", "25 50 44 46", "25 25 45 4F 46", "%PDF ... %%EOF"],
          ["ZIP / Office (docx/xlsx)", "50 4B 03 04", "50 4B 05 06", "PK.."],
          ["GIF", "47 49 46 38", "00 3B", "GIF8"],
          ["Windows PE (EXE/DLL)", "4D 5A", "—", "MZ"],
          ["MP4 / MOV", "66 74 79 70", "—", "ftyp"],
          ["SQLite database", "53 51 4C 69 74 65", "—", "SQLite"],
        ]}
      />

      <SubHeading>File Carving Tools</SubHeading>
      <Table
        headers={["Tool", "Command"]}
        rows={[
          ["photorec", "photorec /d output/ disk.img — GUI-driven, recovers 480+ file types"],
          ["foremost", "foremost -t all -i disk.img -o output/"],
          ["scalpel", "scalpel -c /etc/scalpel/scalpel.conf disk.img -o output/"],
        ]}
      />
      <Callout type="warning">
        File carving cannot recover filenames or directory paths — only file content. It also generates false positives (random data that matches a header). All recovered files need manual verification.
      </Callout>

      <SectionHeading id="ads">Alternate Data Streams (ADS)</SectionHeading>
      <p className="text-sm">
        NTFS supports multiple named <strong>data streams</strong> per file. Every file has a default (unnamed) data stream. Additional named streams are called <strong>Alternate Data Streams</strong>.
      </p>
      <CodeBlock lang="Syntax">
        {`filename.txt           ← default stream (the visible file)
filename.txt:hidden    ← named alternate stream (invisible in Explorer)
filename.txt:payload   ← another ADS`}
      </CodeBlock>

      <SubHeading>Creating and Reading ADS</SubHeading>
      <CodeBlock lang="Command Prompt">
        {`# Write to an ADS
echo "hidden data" > document.txt:secret

# Read from an ADS
more < document.txt:secret

# Execute a binary hidden in ADS
wscript.exe document.txt:script.vbs

# List ADS (not shown by regular 'dir')
dir /r                          # shows :stream names
Get-Item file.txt -Stream *     # PowerShell`}
      </CodeBlock>
      <Callout type="danger">
        Malware commonly uses ADS to hide payloads within legitimate files. A small, innocent-looking text file might contain a full executable in an alternate stream.
      </Callout>
      <p className="text-sm">
        ADS exist <strong>only on NTFS</strong>. Copying a file to FAT, exFAT, or a network share that doesn&apos;t support ADS will strip all alternate streams silently.
      </p>

      <SectionHeading id="zone-identifier">Zone.Identifier (Mark of the Web)</SectionHeading>
      <p className="text-sm">
        When a file is downloaded from the internet, Windows automatically attaches a <T>Zone.Identifier</T> ADS. This is commonly called the <strong>Mark of the Web (MOTW)</strong>.
      </p>
      <CodeBlock lang="Example Zone.Identifier content">
        {`[ZoneTransfer]
ZoneId=3
ReferrerUrl=https://example.com/downloads/
HostUrl=https://example.com/downloads/file.exe`}
      </CodeBlock>
      <Table
        headers={["ZoneId", "Zone"]}
        rows={[
          ["0", "Local machine"],
          ["1", "Local intranet"],
          ["2", "Trusted sites"],
          ["3", "Internet"],
          ["4", "Restricted sites"],
        ]}
      />
      <Callout type="key">
        <T>ZoneId=3</T> tells Windows &quot;this file came from the internet&quot; — triggers security warnings when executing. Forensically, the ReferrerUrl and HostUrl can reveal exactly where a file was downloaded from.
      </Callout>
      <p className="text-sm">
        Windows Explorer&apos;s &quot;Unblock&quot; checkbox (in file properties) removes the Zone.Identifier ADS. In forensics, the absence of a Zone.Identifier on a suspicious executable could mean: (a) it was manually copied/unblocked, or (b) it arrived via a method that doesn&apos;t create MOTW (USB drive, network share, archive extraction).
      </p>

      <SectionHeading id="recycle-bin">Recycle Bin Forensics</SectionHeading>
      <p className="text-sm">
        When a file is deleted to the Recycle Bin, Windows creates two files:
      </p>
      <Table
        headers={["File", "Contents", "Example Name"]}
        rows={[
          ["$R[random]", "The actual file content — the deleted file itself", "$R8XZ3A.docx"],
          ["$I[random]", "Metadata: original full path, filename, deletion timestamp, original file size, user SID", "$I8XZ3A.docx"],
        ]}
      />
      <p className="text-sm mt-2">Location: <T>C:\$Recycle.Bin\[SID]\</T></p>
      <p className="text-sm">The SID in the path identifies <em>which user</em> deleted the file. Cross-reference with <T>HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\ProfileList</T> to map SID to username.</p>

      <CodeBlock lang="Recycle Bin path">
        {`C:\$Recycle.Bin\S-1-5-21-2098285884-1507967948-192251237-1000\$R8XZ3A.docx
                        └── SID of the user who deleted the file ──────────────┘`}
      </CodeBlock>
      <Callout type="tip">
        If you find a file in <T>$Recycle.Bin</T>, always look at the corresponding <T>$I</T> file — it contains the original path and deletion time, which is often more valuable than the file content itself.
      </Callout>

      <SectionHeading id="vss">Volume Shadow Copies (VSS)</SectionHeading>
      <p className="text-sm">
        Windows creates <strong>Volume Shadow Copies</strong> (snapshots) of volumes at certain events (System Restore, Windows Backup, Windows Update). These can preserve older versions of files that have since been deleted or modified.
      </p>
      <CodeBlock lang="PowerShell">
        {`# List shadow copies
vssadmin list shadows

# Access a shadow copy (forensic workstation)
mklink /d C:\\ShadowMount \\\\?\\GLOBALROOT\\Device\\HarddiskVolumeShadowCopy1`}
      </CodeBlock>
      <Callout type="tip">
        Ransomware attacks typically delete VSS snapshots first (<T>vssadmin delete shadows /all</T>). The absence of shadow copies on a system is itself a forensic artefact — it may indicate malicious activity.
      </Callout>

    </div>
  );
}
