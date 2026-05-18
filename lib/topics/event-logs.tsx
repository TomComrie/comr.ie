import { Callout, Table, SectionHeading, SubHeading, T, CodeBlock } from "@/components/ContentComponents";

export default function EventLogsContent() {
  return (
    <div className="space-y-1 text-slate-700 leading-relaxed">

      <SectionHeading id="event-log-intro">Overview</SectionHeading>
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
      <p className="text-sm">
        Linux equivalents: authentication events → <T>/var/log/auth.log</T>; general events → <T>/var/log/syslog</T>. Query with <T>journalctl</T>. Linux SYSLOG has historically been more mature than Windows Event Logs.
      </p>

      <SectionHeading id="log-files">Log File Locations</SectionHeading>
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

      <SectionHeading id="channels">Channels and Log Types</SectionHeading>
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

      <SectionHeading id="event-structure">Event Structure</SectionHeading>
      <p className="text-sm">Each event record contains:</p>
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

      <SectionHeading id="logon-events">Logon Events</SectionHeading>
      <p className="text-sm">Two separate processes occur at logon: <strong>authentication</strong> (who are you?) and <strong>session creation</strong> (set up your environment).</p>

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

      <SectionHeading id="logon-types">Logon Types (Event 4624)</SectionHeading>
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

      <SectionHeading id="session-events">Session & System Events</SectionHeading>
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

      <SectionHeading id="clock-verification">Clock Verification</SectionHeading>
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

      <SectionHeading id="limitations">Limitations & Retention</SectionHeading>
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
