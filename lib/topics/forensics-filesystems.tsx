import { Callout, Table, SectionHeading, SubHeading, T, CodeBlock } from "@/components/ContentComponents";

export default function ForensicsFilesystemsContent() {
  return (
    <div className="space-y-1 text-slate-700 leading-relaxed">

      <SectionHeading id="ntfs">NTFS (New Technology File System)</SectionHeading>
      <p>
        <strong>NTFS</strong> is the standard Windows filesystem since Windows NT. It&apos;s rich in forensic artefacts — far more so than FAT.
      </p>

      <SubHeading>Key Features</SubHeading>
      <ul className="list-disc pl-5 space-y-1 text-sm">
        <li>All metadata stored in the <strong>$MFT (Master File Table)</strong> — every file and directory has an MFT record</li>
        <li>Timestamps stored in <strong>UTC</strong> (not local time)</li>
        <li>Supports <strong>journalling</strong> (<T>$LogFile</T>) — records file system changes for crash recovery</li>
        <li>Supports <strong>Alternate Data Streams (ADS)</strong></li>
        <li>Supports <strong>hard links</strong> and <strong>symbolic links</strong></li>
        <li>Supports <strong>file permissions</strong> (ACLs)</li>
        <li>NTFS volumes use cluster addressing; typical cluster size: 4KB</li>
      </ul>

      <SubHeading>Key NTFS System Files</SubHeading>
      <Table
        headers={["File", "Purpose"]}
        rows={[
          ["$MFT", "Master File Table — metadata for every file and directory"],
          ["$MFTMirr", "Backup of first 4 MFT records (for recovery)"],
          ["$LogFile", "Transaction log for journalling (crash recovery, not a forensic audit log)"],
          ["$Bitmap", "Tracks which clusters are in use vs free (unallocated)"],
          ["$Volume", "Volume name, version, flags"],
          ["$Boot", "Boot sector — stored in MFT record 7"],
          ["$BadClus", "Marks bad clusters to prevent use"],
          ["$Secure", "Access control lists (ACLs)"],
          ["$UpCase", "Uppercase mapping table (case-insensitive filenames)"],
        ]}
      />

      <SectionHeading id="fat">FAT / FAT32</SectionHeading>
      <p className="text-sm">
        <strong>FAT (File Allocation Table)</strong> is an older filesystem used on USB drives, SD cards, and floppy disks. FAT32 supports volumes up to 2TB and files up to 4GB.
      </p>
      <Table
        headers={["Feature", "FAT/FAT32", "NTFS"]}
        rows={[
          ["Timestamps", "Local time", "UTC"],
          ["Journalling", "No", "Yes ($LogFile)"],
          ["ADS", "No", "Yes"],
          ["Permissions", "No", "Yes (ACLs)"],
          ["Max file size", "4GB (FAT32)", "16 EB (theoretical)"],
          ["Max volume size", "2TB (FAT32)", "256 TB"],
          ["Forensic artefacts", "Fewer", "Many more"],
          ["Timestamp precision", "2-second increments", "100-nanosecond intervals"],
        ]}
      />
      <Callout type="warning">
        FAT timestamps are stored in <strong>local time</strong>. When examining a FAT device, you must know the timezone the device was operating in to convert correctly. NTFS timestamps are always UTC — simpler.
      </Callout>

      <SectionHeading id="macb">MACB Timestamps</SectionHeading>
      <p>
        NTFS stores four timestamps per file. The acronym <strong>MACB</strong> is used to remember them:
      </p>

      <Table
        headers={["Letter", "Attribute", "Updated When"]}
        rows={[
          ["M", "Modified", "File content was written to (last data write)"],
          ["A", "Accessed", "File was last read — even just opened (unreliable on modern Windows — often disabled)"],
          ["C", "Changed (MFT Changed)", "The MFT record itself was changed — includes metadata changes like rename, permission change"],
          ["B", "Born (Created)", "File was created on this volume"],
        ]}
      />

      <SubHeading>Two Sets of Timestamps</SubHeading>
      <p className="text-sm">
        Each NTFS file actually has <em>two</em> sets of MACB timestamps stored in different MFT attributes:
      </p>
      <Table
        headers={["Attribute", "Location", "Modifiable by users?"]}
        rows={[
          ["$STANDARD_INFORMATION", "Always present; shown by Windows Explorer and most tools", "Yes — can be changed with standard tools (timestomping)"],
          ["$FILE_NAME", "Present in MFT; harder to access", "No — only updated by the NTFS kernel driver; cannot be modified by user-land tools"],
        ]}
      />
      <Callout type="key">
        If <T>$STANDARD_INFORMATION</T> timestamps predate <T>$FILE_NAME</T> timestamps, this is a strong indicator of <strong>timestomping</strong> — deliberate timestamp manipulation. The <T>$FILE_NAME</T> Born time is the reliable &quot;ground truth&quot; creation time.
      </Callout>

      <SubHeading>Common Timestamp Anomalies</SubHeading>
      <ul className="list-disc pl-5 space-y-1 text-sm">
        <li><strong>Modified &lt; Created:</strong> If a file is <em>copied</em> to a volume, the &quot;Born&quot; time is the copy time but the Modified time is from the original file. So Modified &lt; Created is <strong>completely normal</strong> for copied files.</li>
        <li><strong>Accessed &lt; Modified:</strong> Can indicate backdating.</li>
        <li><strong>All four timestamps identical:</strong> Suspicious — natural file usage almost never produces this. May indicate timestomping tools that set all four to the same value.</li>
        <li><strong>Timestamps in the future:</strong> Either clock was wrong or timestomping.</li>
      </ul>

      <Callout type="tip">
        Exam pattern: &quot;A file shows Modified = 2020-01-01, Created = 2024-05-01. Is this suspicious?&quot; — No! This is expected for a file copied from another volume. Modified inherits the original write time; Born is when it arrived on this volume.
      </Callout>

      <SectionHeading id="mft">Master File Table (MFT)</SectionHeading>
      <p className="text-sm">
        The MFT is a special file (<T>$MFT</T>) containing one 1KB record for every file and directory on the volume. Each record contains attributes describing that file.
      </p>
      <Table
        headers={["Attribute Type", "Content"]}
        rows={[
          ["$STANDARD_INFORMATION", "Timestamps, file attributes (read-only, hidden, system), link count"],
          ["$FILE_NAME", "Filename and directory timestamps. Stored redundantly for performance."],
          ["$DATA", "File contents (if small enough — 'resident') or pointer to data clusters"],
          ["$BITMAP", "For directories — which entries are in use"],
          ["$INDEX_ALLOCATION", "Directory index (B-tree) for large directories"],
          ["$SECURITY_DESCRIPTOR", "Permissions (ACL)"],
        ]}
      />
      <p className="text-sm mt-2">
        <strong>Resident data:</strong> If a file is small (roughly &lt;700 bytes), its actual content is stored directly within the MFT record in the <T>$DATA</T> attribute. This means the file is &quot;in the MFT&quot; and doesn&apos;t occupy separate clusters. This has important implications for slack space and recovery.
      </p>

      <SectionHeading id="slack-space">Slack Space</SectionHeading>
      <p className="text-sm">
        NTFS allocates disk space in <strong>clusters</strong> (typically 4KB). A file that doesn&apos;t fill its last cluster leaves <strong>slack space</strong> — the unused bytes between the end of the file and the end of the cluster.
      </p>
      <CodeBlock lang="Concept">
        {`File size:     3,500 bytes
Cluster size:  4,096 bytes
Slack space:   596 bytes (4096 - 3500)

The 596 bytes may contain remnant data from a previously deleted file
that occupied the same clusters.`}
      </CodeBlock>
      <p className="text-sm">
        Slack space can contain fragments of old files, partial documents, or intentionally hidden data. Forensic tools examine slack space routinely.
      </p>

      <SectionHeading id="timezone">Timezone Considerations</SectionHeading>
      <p className="text-sm">
        Getting timezones wrong is one of the most common errors in digital forensics.
      </p>
      <Table
        headers={["Filesystem", "Timestamp Storage", "Implication"]}
        rows={[
          ["NTFS", "UTC", "Reliable cross-timezone. Convert to local time using timezone offset from Registry."],
          ["FAT/FAT32", "Local time", "You must know the device's configured timezone to make sense of timestamps."],
          ["Linux ext4", "UTC", "Standard."],
          ["macOS HFS+/APFS", "UTC", "Standard."],
        ]}
      />
      <p className="text-sm mt-2">
        Verify the system&apos;s timezone from the Windows Registry: <T>SYSTEM\CurrentControlSet\Control\TimeZoneInformation</T>. Check the <T>StandardName</T> and <T>Bias</T> values.
      </p>
      <Callout type="warning">
        The Registry timezone is what Windows <em>believes</em> the timezone is. If the machine was moved or the clock was manually set, this may not reflect reality. Cross-reference with NTP sync events in Event Logs.
      </Callout>

    </div>
  );
}
