import { Callout, Table, SectionHeading, SubHeading, T, CodeBlock } from "@/components/ContentComponents";
import { slideReferences } from "@/lib/slide-references";

export default function EventLogsContent() {
  const refs = slideReferences["event-logs"];

  return (
    <div className="space-y-1 text-slate-700 leading-relaxed">

      <Callout type="info">
        Beginner mental model: Windows Event Logs are the operating system&apos;s diary. They do not record everything, and they can be incomplete, but they often tell you that a significant event happened, when it happened, and which component reported it.
      </Callout>

      <SectionHeading id="event-log-intro" slideRef={refs["event-log-intro"]}>Overview</SectionHeading>
      <p>
        Windows maintains a framework for recording and auditing <strong>events</strong> — things that happen on the machine. Event logs are a critical forensic source for reconstructing what happened on a system.
      </p>
      <SubHeading>Events that may be logged</SubHeading>
      <ul className="list-disc pl-5 space-y-1 text-sm columns-2">
        <li>Logon and logoff</li>
        <li>Account creation and modification</li>
        <li>Time synchronisation</li>
        <li>Application errors and actions</li>
        <li>Service start/stop</li>
        <li>File access (if auditing enabled)</li>
        <li>USB device insertion</li>
        <li>System startup and shutdown</li>
      </ul>
      <Callout type="warning">
        Limitations: Default retention is <strong>7 days</strong> on domain machines; standalone machines are size-limited. Not all auditing is enabled by default. <strong>Absent evidence ≠ evidence of absence</strong> — missing log entries may mean the event didn&apos;t happen, or the log was rotated/cleared.
      </Callout>
      <p className="text-sm mt-2">
        That last sentence is exam gold. A missing log entry may mean the event never happened, but it may also mean the relevant logging was disabled, the log was overwritten, or the activity occurred somewhere else such as a domain controller or SIEM.
      </p>
      <p className="text-sm">
        Linux equivalents: authentication events → <T>/var/log/auth.log</T>; general events → <T>/var/log/syslog</T>. Query with <T>journalctl</T>. Linux SYSLOG has historically been more mature than Windows Event Logs.
      </p>

      <SectionHeading id="log-files" slideRef={refs["log-files"]}>Log File Locations</SectionHeading>
      <p className="text-sm">Location: <T>C:\Windows\System32\winevt\Logs\</T></p>
      <Table
        headers={["File", "Contents"]}
        rows={[
          ["Security.evtx", "Logon/logoff, privilege use, object access, account management"],
          ["System.evtx", "OS events, time synchronisation, device driver events"],
          ["Application.evtx", "Application-generated events"],
          ["Setup.evtx", "System setup events"],
          ["+ many others", "Application-specific channels (e.g., Microsoft-Windows-PowerShell/Operational)"],
        ]}
      />
      <Callout type="tip">
        Security.evtx is almost always the most valuable log for user activity investigation. System.evtx is key for clock manipulation and shutdown/startup times.
      </Callout>
      <Callout type="danger">
        <T>.evtx</T> files are <strong>binary tokenised XML</strong> — not plain text. Never <T>cat</T> them. Use Event Viewer (GUI), <T>python-evtx</T>, or a forensic tool like Autopsy/KAPE.
      </Callout>
      <CodeBlock lang="Event log access commands">
        {`# Windows CLI
wevtutil el
wevtutil qe Security /c:10 /f:text

# PowerShell
Get-WinEvent -LogName Security -MaxEvents 20
Get-WinEvent -FilterHashtable @{LogName='Security'; Id=4624}

# File location
dir C:\Windows\System32\winevt\Logs`}
      </CodeBlock>

      <SectionHeading id="channels" slideRef={refs.channels}>Channels and Log Types</SectionHeading>
      <p className="text-sm">Individual log files are called <strong>channels</strong>. Two types:</p>
      <Table
        headers={["Type", "Description", "Examples"]}
        rows={[
          ["Serviced channels", "Contain admin or operational events. Can be forwarded to a central collector (SIEM). Security and System logs.", "Security.evtx, System.evtx"],
          ["Direct channels", "Local logs only — may not be centralised. Include analytic and debug events (very verbose).", "Microsoft-Windows-Ntfs/Diagnostic"],
        ]}
      />
      <p className="text-sm mt-2">
        In managed corporate environments, serviced channels are sent to a <strong>SIEM</strong> (Security Information and Event Management) in near-real-time. The local copy may be overwritten (7-day default), but the SIEM retains it indefinitely.
      </p>

      <SectionHeading id="event-structure" slideRef={refs["event-structure"]}>Event Structure</SectionHeading>
      <p className="text-sm">Each event record contains:</p>
      <p className="text-sm mt-2">
        For interpretation, the most important fields are usually Event ID, timestamp, user or security context, and machine name. Correlation IDs become more useful in bigger investigations where many events belong to the same session or workflow.
      </p>
      <Table
        headers={["Field", "Description"]}
        rows={[
          ["Event ID", "Numeric identifier for the event type"],
          ["Source", "The software or OS component that generated the event"],
          ["Level", "Information / Warning / Error / Critical"],
          ["Timestamp", "UTC timestamp (always UTC in .evtx format)"],
          ["User", "The account associated with the event"],
          ["Computer", "The machine name"],
          ["Correlation ID", "Links related events together (e.g., all events from one login session)"],
        ]}
      />

      <SectionHeading id="logon-events" slideRef={refs["logon-events"]}>Logon Events</SectionHeading>
      <p className="text-sm">Two separate processes occur at logon: <strong>authentication</strong> (who are you?) and <strong>session creation</strong> (set up your environment).</p>
      <p className="text-sm mt-2">
        This distinction explains why one &quot;login&quot; may generate several different records. Authentication and session creation are related but not identical steps.
      </p>

      <SubHeading>Local (Standalone) Logon</SubHeading>
      <ol className="list-decimal pl-5 space-y-1 text-sm">
        <li>User submits name and password</li>
        <li>Local SAM authenticates → <strong>Event 4776</strong> (credential validation)</li>
        <li>User session created → <strong>Event 4624</strong> (successful logon)</li>
      </ol>

      <SubHeading>Domain (Active Directory) Logon</SubHeading>
      <ol className="list-decimal pl-5 space-y-1 text-sm">
        <li>User submits name and password</li>
        <li>Domain Controller authenticates via Kerberos → <strong>Event 4768</strong> on DC (TGT issued)</li>
        <li>Workstation creates session → <strong>Event 4624</strong> on workstation</li>
      </ol>
      <Callout type="warning">
        For domain logons, events appear on <em>two different machines</em>. Event 4768 is on the DC; Event 4624 is on the workstation. You need logs from both to get the full picture.
      </Callout>

      <SubHeading>Key Logon Event IDs</SubHeading>
      <Table
        headers={["Event ID", "Meaning"]}
        rows={[
          ["4624", "Successful logon — contains the critical logon type code"],
          ["4625", "Failed logon attempt"],
          ["4634", "Logoff — session closed by system"],
          ["4647", "Logoff — user-initiated (more reliable indicator)"],
          ["4648", "Logon using alternate credentials (e.g., Run As Admin, PsExec)"],
          ["4768", "Kerberos TGT request — authentication on DC (domain logon step 1)"],
          ["4769", "Kerberos service ticket request"],
          ["4776", "SAM credential validation — local logon authentication"],
          ["4720", "User account created"],
          ["4722", "User account enabled"],
          ["4726", "User account deleted"],
          ["4732", "User added to security-enabled group"],
        ]}
      />
      <CodeBlock lang="Filtering for key logon events">
        {`# PowerShell examples
Get-WinEvent -FilterHashtable @{LogName='Security'; Id=4624}
Get-WinEvent -FilterHashtable @{LogName='Security'; Id=4625}
Get-WinEvent -FilterHashtable @{LogName='Security'; Id=4648}
Get-WinEvent -FilterHashtable @{LogName='Security'; Id=4768}`}
      </CodeBlock>

      <SectionHeading id="logon-types" slideRef={refs["logon-types"]}>Logon Types (Event 4624)</SectionHeading>
      <p className="text-sm">
        Every Event 4624 carries a crucial <strong>logon type code</strong>. This tells you <em>how</em> the logon occurred.
      </p>
      <Table
        headers={["Type", "Name", "Description", "Suspicious?"]}
        rows={[
          ["2", "Interactive", "User at physical keyboard and monitor", "Normal"],
          ["3", "Network", "Remote access to a share or service on this computer", "Not inherently — see below"],
          ["4", "Batch", "Scheduled task execution", "Check what ran"],
          ["5", "Service", "A Windows service starting", "Check what service"],
          ["7", "Unlock", "Password-protected screen saver dismissed", "Normal"],
          ["8", "NetworkCleartext", "Network logon with UNENCRYPTED credentials", "Very suspicious"],
          ["10", "RemoteInteractive", "Remote Desktop (RDP) or Remote Assistance", "Investigate source IP"],
          ["11", "CachedInteractive", "Domain logon using cached credentials (machine offline)", "Normal for laptops offline"],
        ]}
      />
      <Callout type="info">
        <strong>Type 3 is not inherently suspicious.</strong> In a normal corporate day, Type 3 events occur <em>dozens of times per hour</em> — every time a workstation accesses a file server, or Group Policy refreshes (every 90 minutes).
      </Callout>
      <Callout type="danger">
        <strong>Type 8 (NetworkCleartext)</strong> is always suspicious in a modern network. Credentials were sent over the network unencrypted — possible misconfigured application, legacy protocol, or attacker with a packet capture.
      </Callout>

      <SectionHeading id="session-events" slideRef={refs["session-events"]}>Session & System Events</SectionHeading>
      <Table
        headers={["Event ID", "Meaning"]}
        rows={[
          ["4608", "System startup"],
          ["4609", "System shutdown"],
          ["4778", "Session reconnected (e.g., RDP session resumed)"],
          ["4779", "Session disconnected (e.g., RDP session disconnected, not logged off)"],
          ["4800", "Workstation locked"],
          ["4801", "Workstation unlocked"],
          ["4802", "Screen saver started"],
          ["4803", "Screen saver dismissed"],
        ]}
      />
      <SubHeading>Subtle Behaviours</SubHeading>
      <ul className="list-disc pl-5 space-y-2 text-sm">
        <li><strong>Screen saver ≠ locked workstation.</strong> The workstation is not technically locked while the screen saver runs — only after the saver is dismissed and the password prompt appears. Event 4800 (locked) may appear later than the screen saver start.</li>
        <li><strong>Cannot distinguish</strong> automatic from manual locking via events alone.</li>
        <li><strong>Event pairing</strong> (logon/logoff) requires care — on a busy domain machine, many logon events interleave and must be matched using correlation IDs, not just order.</li>
      </ul>
      <Callout type="info" title="Transcript Sidenote">
        <strong>Lock timestamp quirk:</strong> The transcript explains that when you walk away from a machine, the screensaver comes on after a timeout, but the machine is <em>not yet locked</em>. Only when someone interacts with the machine (moves the mouse, presses a key) does Windows lock it — and <em>that</em> interaction is when the Event 4800 timestamp is recorded. This means the lock timestamp can appear <strong>minutes after</strong> the user actually left. You cannot distinguish "user walked away and the machine auto-locked" from "user hit Win+L and walked away" just from the log.
      </Callout>
      <Callout type="info" title="Transcript Sidenote">
        <strong>CMOS battery death → time reset:</strong> If the motherboard battery dies, the system clock may default to 1 January 1970 on boot. The user then manually corrects the time, generating Event 4616 (manual time change). This looks like tampering but could be a hardware fault. Always check if there are NTP sync events (Event 35/37) near the time change to determine whether it was a correction or deliberate manipulation.
      </Callout>
      <Callout type="info" title="Transcript Sidenote">
        <strong>Dual-boot time confusion:</strong> Linux stores system time as UTC; Windows (for legacy MS-DOS compatibility) stores it as local time. If a machine dual-boots, each OS will "correct" the CMOS clock every time it boots. This creates repeated Event 4616 entries and timestamps that jump back and forth until NTP syncs. A timeline from such a machine can appear to have events in the wrong order or from the "future" — useful exam context for questioning timestamp reliability.
      </Callout>

      <SectionHeading id="clock-verification" slideRef={refs["clock-verification"]}>Clock Verification</SectionHeading>
      <p className="text-sm">
        Timestamps in event logs are only reliable if the <em>system clock was reliable</em>. These events help you assess that:
      </p>
      <Table
        headers={["Event ID", "Log", "Meaning"]}
        rows={[
          ["35", "System.evtx", "Network Time Service invoked — shows NTP sync is active"],
          ["37", "System.evtx", "Time updated via NTP — confirms clock was corrected by a time server"],
          ["4616", "Security.evtx", "System time manually changed — possible clock manipulation"],
        ]}
      />
      <Callout type="tip">
        Does a sudden Event 4616 with a large time jump necessarily indicate tampering? No — it could also be: VM snapshot restore, timezone change, time server correction, DST adjustment. Consider context. But it warrants investigation.
      </Callout>
      <p className="text-sm">
        Check log properties to see the log&apos;s creation date, last access date, and whether events were overwritten. The first event in a log being later than the log creation date suggests earlier events were overwritten.
      </p>
      <CodeBlock lang="Time-related log queries">
        {`# Look for time changes and sync events
Get-WinEvent -FilterHashtable @{LogName='Security'; Id=4616}
Get-WinEvent -FilterHashtable @{LogName='System'; Id=35}
Get-WinEvent -FilterHashtable @{LogName='System'; Id=37}`}
      </CodeBlock>
      <p className="text-sm mt-2">
        This is a subtle but important reasoning step: before trusting a timeline, ask whether the clock itself was trustworthy and whether the log still contains the full period you care about.
      </p>

      <SectionHeading id="limitations" slideRef={refs.limitations}>Limitations & Retention</SectionHeading>
      <p className="text-sm">
        Retention settings: <T>SYSTEM\ControlSet001\Services\Eventlog\Security</T> — values <T>MaxSize</T> and <T>Retention</T>.
      </p>
      <Table
        headers={["Setting", "Default Behaviour"]}
        rows={[
          ["Standalone machine", "Overwrite oldest events when size limit reached (circular buffer)"],
          ["Domain-joined machine", "Default group policy: 7 days only. After 7 days, oldest events are deleted."],
        ]}
      />
      <Callout type="danger">
        If you do not examine logs promptly on a domain-joined machine, the relevant events <em>may be gone</em>. 7-day default means evidence of an incident a fortnight ago may no longer exist locally. Always check whether logs are forwarded to a SIEM.
      </Callout>
      <Callout type="info" title="Transcript Sidenote">
        <strong>WannaCry triage edge case:</strong> The 2017 WannaCry ransomware had a built-in killswitch — it checked a specific domain on the internet. Standard advice is "disconnect everything from the network immediately". But when researcher Marcus Hutchins registered the unclaimed domain, the killswitch <em>activated</em>. New advice went out: reconnect machines so they could reach the killswitch domain and stop encrypting. This illustrates that triage decisions are not always straightforward — you must balance evidence preservation against harm reduction, and document your reasoning (ACPO Principle 2).
      </Callout>
      <Callout type="info" title="Transcript Sidenote">
        <strong>Attribution is the hardest problem:</strong> The transcript warns that even with a device in front of you, you cannot know beyond reasonable doubt who was at the keyboard. The "someone else used my password" defence is common. You must corroborate across sources — event logs, registry, file access times, CCTV, email timings, writing style. A single log tells you <em>credentials were used</em>; it does not tell you <em>who</em> used them. This is why the forensic mindset of not making assumptions is critical.
      </Callout>

      <SubHeading>Filtering in Event Viewer</SubHeading>
      <p className="text-sm">
        Filter by time period and Event ID. Prefixing an ID with <T>-</T> <em>excludes</em> those events (e.g., filter out Type 3 logons to find only interactive/remote logons).
      </p>
      <p className="text-sm mt-2">
        <strong>Custom Views</strong> allow combining events from multiple logs and saving filter configurations for repeated use — useful for building a unified timeline across channels.
      </p>

    </div>
  );
}
