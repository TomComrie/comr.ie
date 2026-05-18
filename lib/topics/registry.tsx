import { Callout, Table, SectionHeading, SubHeading, T, CodeBlock, Steps } from "@/components/ContentComponents";

export default function RegistryContent() {
  return (
    <div className="space-y-1 text-slate-700 leading-relaxed">

      <SectionHeading id="registry-intro">What is the Windows Registry?</SectionHeading>
      <p>
        The <strong>Windows Registry</strong> is a centralised hierarchical database that stores configuration settings for almost every aspect of a Windows system — the OS itself, installed software, hardware devices, network settings, and a detailed record of user activity.
      </p>
      <Callout type="key">
        For a forensic examiner, the Registry is one of the richest evidence sources available. It records connected USB devices (ever), recently opened files, typed URLs, network connections, user accounts, autostart entries (malware persistence), time zone, installed software, and much more.
      </Callout>
      <p className="text-sm">
        <strong>Linux</strong> has no registry equivalent — configuration is distributed across <T>/etc</T> (system), <T>~/.config</T> (user), and application-specific locations.<br />
        <strong>macOS</strong> uses <T>.plist</T> XML files in <T>~/Library/Preferences</T>.
      </p>

      <SectionHeading id="root-keys">Root Keys (Hives)</SectionHeading>
      <p className="text-sm">
        The Registry is a tree of <strong>keys</strong>, <strong>sub-keys</strong>, and <strong>values</strong>. There are five top-level &quot;root&quot; keys:
      </p>
      <Table
        headers={["Root Key", "Abbreviation", "Contains"]}
        rows={[
          ["HKEY_LOCAL_MACHINE", "HKLM", "Machine-wide settings (hardware, OS, installed software, services)"],
          ["HKEY_CURRENT_USER", "HKCU", "Settings for the currently logged-in user (loaded from NTUSER.DAT)"],
          ["HKEY_USERS", "HKU", "All loaded user profiles (HKCU is a pointer into this hive)"],
          ["HKEY_CLASSES_ROOT", "HKCR", "File type associations and COM object registrations"],
          ["HKEY_CURRENT_CONFIG", "HKCC", "Current hardware profile (loaded from SYSTEM hive)"],
        ]}
      />
      <Callout type="info">
        In forensic work you typically work with HKLM (machine-wide) and HKU/NTUSER.DAT (user-specific). HKCR and HKCC are derived from HKLM and SYSTEM hive — they&apos;re virtual views.
      </Callout>

      <SectionHeading id="data-types">Registry Data Types</SectionHeading>
      <Table
        headers={["Type", "Description", "Use Case"]}
        rows={[
          ["REG_SZ", "Plain text string", "Most human-readable values: paths, names, descriptions"],
          ["REG_EXPAND_SZ", "String with expandable variables", "Paths like %USERPROFILE%\\Documents or %SystemRoot%\\system32"],
          ["REG_MULTI_SZ", "List of strings (null-separated)", "Multiple values: e.g., list of services"],
          ["REG_DWORD", "32-bit unsigned integer", "Flags (0/1), counts, sizes"],
          ["REG_QWORD", "64-bit unsigned integer", "Large numeric values"],
          ["REG_BINARY", "Raw binary data", "Hardware configuration, complex structs"],
        ]}
      />
      <Callout type="info">
        Negated key names: <T>NoInteractiveServices = 0x00000000 (0)</T> means interactive services <em>are</em> enabled (double negative). Watch for 0 = enabled patterns.
      </Callout>

      <SectionHeading id="hives">Registry Hives (Files on Disk)</SectionHeading>
      <p className="text-sm">
        The &quot;live&quot; registry is assembled from separate files called <strong>hives</strong>. In forensic work, you read these files directly from the disk image — this is called working with the <em>offline registry</em>.
      </p>

      <SubHeading>System Hives — <T>C:\Windows\System32\Config\</T></SubHeading>
      <Table
        headers={["File", "Contents", "Key Forensic Value"]}
        rows={[
          ["SAM", "User accounts and hashed passwords", "Account names, last login, password policy"],
          ["SECURITY", "Local security policy, cached domain credentials", "Security settings"],
          ["SYSTEM", "Startup, OS behaviour, device info, services, time zone", "USB devices, services, timezone"],
          ["SOFTWARE", "Installed applications, file associations, OS settings", "Installed software, autorun, network"],
        ]}
      />

      <SubHeading>User Hive — <T>%USERPROFILE%\NTUSER.DAT</T></SubHeading>
      <p className="text-sm">
        The most important user-specific file. Contains:
      </p>
      <ul className="list-disc pl-5 space-y-1 text-sm">
        <li>Recently opened files and folders (MRU lists)</li>
        <li>Typed URLs in Internet Explorer/Edge</li>
        <li>Search history</li>
        <li>Application-specific settings</li>
        <li>Recent documents, shellbags (folder navigation history)</li>
        <li>Last write times can reveal user activity timeline</li>
      </ul>

      <SubHeading>Tools for Reading Offline Hives</SubHeading>
      <Table
        headers={["Tool", "Use"]}
        rows={[
          ["Registry Explorer (Eric Zimmermann)", "GUI tool, load offline hives, browse and search"],
          ["RegRipper3", "Scripted extraction of forensic artefacts from hives"],
          ["regedit.exe", "Load hive: File → Load Hive (live analysis only)"],
          ["python-registry", "Python library for programmatic parsing"],
        ]}
      />

      <SectionHeading id="forensic-value">Forensic Value — Key Locations</SectionHeading>
      <Table
        headers={["Artefact", "Registry Path", "Data"]}
        rows={[
          ["User accounts", "SAM\\SAM\\Domains\\Account\\Users", "Username, SID, last login, password hash"],
          ["Autostart (Run keys)", "SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Run\nSOFTWARE\\Microsoft\\Windows\\CurrentVersion\\RunOnce", "Programs that execute at login — common malware persistence"],
          ["Time zone", "SYSTEM\\CurrentControlSet\\Control\\TimeZoneInformation", "Timezone bias — needed for timestamp conversion"],
          ["Recently opened files", "NTUSER.DAT\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\RecentDocs", "MRU list of recently opened files"],
          ["Typed URLs", "NTUSER.DAT\\Software\\Microsoft\\Internet Explorer\\TypedURLs", "URLs manually typed in IE/Edge"],
          ["Search history", "NTUSER.DAT\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\WordWheelQuery", "Explorer search terms"],
          ["Installed software", "SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Uninstall", "Installed programs, install dates"],
          ["Network history", "SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\NetworkList\\Profiles", "Networks connected to (including VPNs)"],
          ["USB devices (SYSTEM)", "SYSTEM\\CurrentControlSet\\Enum\\USBSTOR", "USB mass storage — friendly name, serial"],
          ["Computer name", "SYSTEM\\CurrentControlSet\\Control\\ComputerName\\ComputerName", "Machine hostname"],
          ["User profile SIDs", "SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\ProfileList", "Maps SIDs to profile paths/usernames"],
          ["Shellbags (folder nav)", "NTUSER.DAT\\Software\\Microsoft\\Windows\\Shell\\Bags", "Evidence of directory access, even for deleted folders"],
        ]}
      />

      <SectionHeading id="guids-sids">GUIDs and SIDs</SectionHeading>

      <SubHeading>GUID (Globally Unique Identifier)</SubHeading>
      <p className="text-sm">
        A 128-bit number in the format: <T>{`{xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx}`}</T>
      </p>
      <p className="text-sm mt-1">
        Used to identify software components, device classes, and known folder locations. When you see a GUID in the Registry, look it up in Microsoft&apos;s documentation or the MSDN Known Folder IDs list to decode it.
      </p>
      <CodeBlock lang="Example: USB disk device class GUID">
        {`{53f56307-b6bf-11d0-94f2-00a0c91efb8b}  →  Disk drives (USB mass storage)`}
      </CodeBlock>

      <SubHeading>SID (Security Identifier)</SubHeading>
      <p className="text-sm">Uniquely identifies a user account. Format:</p>
      <CodeBlock>
        {`S-1-5-21-2098285884-1507967948-192251237-1000
│ │ │  └──────────── Domain (3 sub-authorities) ──────────────┘ └── RID`}
      </CodeBlock>
      <Table
        headers={["RID", "Account"]}
        rows={[
          ["500", "Built-in Administrator"],
          ["501", "Guest"],
          ["503", "DefaultAccount"],
          ["1000+", "Normal user accounts (local)"],
        ]}
      />
      <p className="text-sm">
        SIDs appear in: the Registry ProfileList, <T>$Recycle.Bin</T> subfolders, event log entries, and NTFS ACLs.
      </p>
      <Callout type="tip">
        To map a SID to a username: <T>HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\ProfileList\[SID]</T> → look at <T>ProfileImagePath</T> value.
      </Callout>

      <SectionHeading id="usb-forensics">USB Device Forensics</SectionHeading>
      <p className="text-sm">
        The Registry permanently records <em>every</em> USB device ever connected — even after the device is removed, the record remains. This is one of the most powerful forensic artefacts in Windows.
      </p>
      <Callout type="key">
        The full USB picture requires correlating four Registry locations plus Event Logs and setupapi.dev.log to establish Who / What / When.
      </Callout>

      <Steps items={[
        {
          step: "Find VID and PID",
          desc: <>Registry key: <T>SYSTEM\ControlSet001\Enum\USB</T><br />VID = Vendor ID (16-bit hex), PID = Product ID (16-bit hex). The Select sub-key tells you which ControlSet is active.</>,
        },
        {
          step: "Look up the manufacturer",
          desc: <>Use the USB ID Repository at linux-usb.org/usb.ids. Example: VID 0781 = SanDisk Corp., PID 556B = Cruzer Edge.</>,
        },
        {
          step: "Find the serial number",
          desc: <>The serial number combines with VID and PID to uniquely identify this specific device. <strong>Warning:</strong> if the <em>second character</em> of the serial number is <T>&amp;</T>, Windows generated it — the device has no true serial number, and multiple identical devices may share the same generated serial.</>,
        },
        {
          step: "Find insertion timestamp",
          desc: <>Key: <T>SYSTEM\ControlSet001\Control\DeviceClasses\{"{53f56307-b6bf-11d0-94f2-00a0c91efb8b}"}</T><br />The Last Write time is updated when the device is physically inserted. <strong>Caveat:</strong> NOT always reliable on modern Windows — the enumerator may update keys independently. Always corroborate with Event Logs and <T>setupapi.dev.log</T>.</>,
        },
      ]} />

      <SubHeading>Full USB Evidence Map</SubHeading>
      <Table
        headers={["Source", "Provides"]}
        rows={[
          ["SYSTEM: Enum\\USB", "VID, PID, serial number"],
          ["SYSTEM: Enum\\USBSTOR", "Friendly device name (e.g., 'SanDisk Cruzer Edge USB Device')"],
          ["SYSTEM: DeviceClasses (GUID)", "Insertion timestamp (Last Write — with caveats)"],
          ["Event Logs", "USB insertion events"],
          ["setupapi.dev.log", "First installation time — the most reliable timestamp for first connection"],
        ]}
      />

      <SectionHeading id="registry-timestamps">Registry Timestamps</SectionHeading>
      <p className="text-sm">
        Every registry key has a <strong>&quot;Last Write&quot; timestamp</strong> — the time the key or any of its values was last modified. This is stored in UTC in Windows FILETIME format.
      </p>
      <Callout type="warning">
        Timestamps are <strong>per-key</strong>, not per-value. If a key has 50 values and one is changed, the key&apos;s Last Write time is updated — but you don&apos;t know <em>which</em> value changed. You know something changed; you don&apos;t know what.
      </Callout>
      <p className="text-sm">
        There is no &quot;created&quot; timestamp for registry keys — only Last Write. A key that has never been modified since creation has a Last Write time equal to its creation time, but you cannot distinguish these.
      </p>

    </div>
  );
}
