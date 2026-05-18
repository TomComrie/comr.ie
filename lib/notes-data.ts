export type Section = {
  id: string;
  title: string;
  content: string;
};

export type Topic = {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  badge?: string;
  sections: Section[];
};

export const topics: Topic[] = [
  {
    slug: "xss",
    shortTitle: "XSS",
    title: "Cross-Site Scripting (XSS)",
    description: "Types, payloads, bypass techniques, encoding, and mitigations",
    badge: "Web Security",
    sections: [
      { id: "what-is-xss", title: "What is XSS?", content: "Cross-site scripting injection malicious scripts web pages users victim browser execute attacker client-side" },
      { id: "xss-types", title: "Types of XSS", content: "reflected stored persistent DOM-based non-persistent URL database server client" },
      { id: "xss-payloads", title: "Common Payloads", content: "script alert onerror img src cookie document theft payload javascript" },
      { id: "xss-bypass", title: "Filter Bypass Techniques", content: "encoding HTML entity URL unicode case variation bypass filter WAF" },
      { id: "xss-context", title: "Injection Contexts", content: "HTML attribute JavaScript URL context-aware injection event handler" },
      { id: "xss-mitigation", title: "Mitigations", content: "CSP Content Security Policy HttpOnly output encoding input validation escaping sanitisation" },
    ],
  },
  {
    slug: "steganography",
    shortTitle: "Steganography",
    title: "Steganography",
    description: "Hiding data within carrier files — techniques, tools, and detection",
    badge: "Covert Comms",
    sections: [
      { id: "steg-intro", title: "What is Steganography?", content: "steganography hiding data carrier file concealment covert channel secret message" },
      { id: "steg-techniques", title: "Techniques", content: "LSB least significant bit spatial domain frequency domain DCT echo hiding text steganography" },
      { id: "steg-tools", title: "Tools", content: "steghide binwalk exiftool strings zsteg outguess stegsolve passphrase extract embed" },
      { id: "steg-detection", title: "Detection & Steganalysis", content: "chi-squared analysis histogram visual inspection steganalysis detection metadata" },
    ],
  },
  {
    slug: "forensics-foundations",
    shortTitle: "DF: Foundations",
    title: "Digital Forensics: Foundations",
    description: "ACPO principles, chain of custody, evidence types, order of volatility",
    badge: "Forensics",
    sections: [
      { id: "acpo", title: "ACPO Principles", content: "ACPO Association Chief Police Officers principles no action change data competent audit trail chain custody" },
      { id: "evidence-types", title: "Types of Evidence", content: "volatile non-volatile RAM disk running processes network connections swap paging" },
      { id: "order-volatility", title: "Order of Volatility", content: "order volatility CPU cache registers RAM swap network processes disk removable media backup" },
      { id: "chain-custody", title: "Chain of Custody", content: "chain of custody documentation who handled evidence when where integrity" },
      { id: "acquisition", title: "Forensic Acquisition", content: "write blocker hash MD5 SHA256 bit-for-bit copy dd FTK Imager Autopsy imaging" },
      { id: "locard", title: "Locard's Principle", content: "Locard exchange principle every contact leaves trace physical digital evidence" },
    ],
  },
  {
    slug: "forensics-filesystems",
    shortTitle: "DF: File Systems",
    title: "Digital Forensics: File Systems & Timestamps",
    description: "NTFS, FAT, MFT, MACB timestamps, slack space, timestomping",
    badge: "Forensics",
    sections: [
      { id: "ntfs", title: "NTFS", content: "NTFS New Technology File System MFT Master File Table record journal attributes resident data UTC" },
      { id: "fat", title: "FAT / FAT32", content: "FAT File Allocation Table linked list local time no journalling 8.3 filename" },
      { id: "macb", title: "MACB Timestamps", content: "MACB Modified Accessed Changed Born created timestamps STANDARD_INFORMATION FILE_NAME timestomping forensics" },
      { id: "mft", title: "Master File Table (MFT)", content: "MFT Master File Table 1KB record resident data attributes system files $MFT $Bitmap $LogFile" },
      { id: "slack-space", title: "Slack Space", content: "slack space cluster unused remnant data file slack drive slack" },
      { id: "timezone", title: "Timezone Considerations", content: "timezone UTC local time NTFS FAT registry verify timezone conversion" },
    ],
  },
  {
    slug: "forensics-deleted",
    shortTitle: "DF: Deleted Files",
    title: "Digital Forensics: Deleted Files & Recovery",
    description: "How deletion works, MFT records, file carving, ADS, Recycle Bin",
    badge: "Forensics",
    sections: [
      { id: "how-deletion-works", title: "How Deletion Works", content: "deletion mark free unallocated not wipe data remains MFT flag clusters bitmap" },
      { id: "mft-recovery", title: "MFT Record Recovery", content: "MFT record in use not reused recovery unallocated clusters overwritten" },
      { id: "file-carving", title: "File Carving", content: "file carving magic bytes header footer JPEG PNG PDF ZIP photorec foremost scalpel raw disk scan" },
      { id: "ads", title: "Alternate Data Streams (ADS)", content: "ADS Alternate Data Streams NTFS hidden payload Zone.Identifier dir /r Get-Item stream" },
      { id: "zone-identifier", title: "Zone.Identifier", content: "Zone.Identifier ADS download internet zone origin mark of the web MOTW security zone" },
      { id: "recycle-bin", title: "Recycle Bin Forensics", content: "Recycle Bin $R $I metadata original path deletion time SID user identify file size" },
      { id: "vss", title: "Volume Shadow Copies", content: "VSS Volume Shadow Copies snapshot older file versions recovery" },
    ],
  },
  {
    slug: "registry",
    shortTitle: "Windows Registry",
    title: "Windows Registry",
    description: "Hives, keys, data types, USB forensics, SIDs, GUIDs, forensic value",
    badge: "Forensics",
    sections: [
      { id: "registry-intro", title: "What is the Registry?", content: "Windows Registry centralised hierarchical database configuration OS software hardware network user activity" },
      { id: "root-keys", title: "Root Keys", content: "HKLM HKEY_LOCAL_MACHINE HKCU HKEY_CURRENT_USER HKU HKEY_USERS HKCR HKEY_CLASSES_ROOT HKCC root keys" },
      { id: "data-types", title: "Data Types", content: "REG_SZ REG_EXPAND_SZ REG_MULTI_SZ REG_DWORD REG_BINARY data types string integer binary" },
      { id: "hives", title: "Registry Hives", content: "SAM SECURITY SYSTEM SOFTWARE NTUSER.DAT hives files C:\\Windows\\System32\\Config user profile" },
      { id: "forensic-value", title: "Forensic Value", content: "USB connected devices typed URLs search history recently opened files autostart persistence user accounts time zone network connections" },
      { id: "guids-sids", title: "GUIDs and SIDs", content: "GUID Globally Unique Identifier SID Security Identifier user account 128-bit RID 500 Administrator 501 Guest 1000 normal" },
      { id: "usb-forensics", title: "USB Device Forensics", content: "USB VID vendor ID PID product ID serial number USBSTOR DeviceClasses insertion timestamp SYSTEM ControlSet001 Enum setupapi" },
      { id: "registry-timestamps", title: "Registry Timestamps", content: "Last Write time per-key not per-value FILETIME UTC changed unknown what changed" },
    ],
  },
  {
    slug: "event-logs",
    shortTitle: "Windows Event Logs",
    title: "Windows Event Logs",
    description: "Log files, event IDs, logon types, channel types, clock verification",
    badge: "Forensics",
    sections: [
      { id: "event-log-intro", title: "Overview", content: "Windows event logs framework recording auditing events logon logoff account creation time synchronisation application errors service USB" },
      { id: "log-files", title: "Log File Locations", content: "Security.evtx System.evtx Application.evtx Setup.evtx C:\\Windows\\System32\\winevt\\Logs" },
      { id: "channels", title: "Channels and Log Types", content: "serviced channel admin operational SIEM forwarded direct channel analytic debug local event viewer" },
      { id: "event-structure", title: "Event Structure", content: "source level information warning error critical user impersonation ID timestamp UTC event ID correlation ID" },
      { id: "logon-events", title: "Logon Events", content: "4624 successful logon 4647 logoff user 4634 session closed system 4648 alternate credentials 4776 SAM auth 4768 Kerberos domain controller" },
      { id: "logon-types", title: "Logon Types", content: "logon type 2 interactive keyboard 3 network remote share 4 batch 5 service 7 unlock 8 NetworkCleartext unencrypted 10 RemoteInteractive RDP 11 CachedInteractive offline" },
      { id: "session-events", title: "Session & System Events", content: "4608 startup 4609 shutdown 4778 reconnected 4779 disconnected 4800 locked 4801 unlocked 4802 screen saver started 4803 dismissed" },
      { id: "clock-verification", title: "Clock Verification", content: "clock timestamps reliable Event 35 NTP service 37 time updated 4616 system time manually changed manipulation System.evtx" },
      { id: "limitations", title: "Limitations & Retention", content: "7-day default retention domain machines size-limited standalone absent evidence not evidence of absence SIEM overwritten" },
    ],
  },
  {
    slug: "forensics-reporting",
    shortTitle: "DF: Reporting",
    title: "Digital Forensics: Interpretation & Reporting",
    description: "Analysis vs interpretation, 5WH framework, report structure, SOPs",
    badge: "Forensics",
    sections: [
      { id: "analysis-vs-interpretation", title: "Analysis vs Interpretation", content: "analysis what on system interpretation what it means distinction evidence significance" },
      { id: "5wh", title: "The 5WH Framework", content: "5WH What happened Where machine account directory When timeline How mechanism USB remote login email Why motive Who account" },
      { id: "attribution", title: "The Attribution Problem", content: "attribution account person someone else used my password physical access CCTV mobile data witness statements corroborate" },
      { id: "golden-rule", title: "Golden Rule", content: "assume nothing believe nothing challenge everything follow evidence do not seek prove hypothesis" },
      { id: "report-structure", title: "Report Structure", content: "receipt items background circumstances purpose examination technical issues examination results interpretation findings conclusion disclosure SOPs" },
      { id: "plain-language", title: "Plain Language Requirement", content: "plain language judge jury opposing counsel technical background explain report" },
      { id: "planning", title: "Planning & SOPs", content: "incident-based planning source-based planning confirmation bias SOP Standard Operating Procedures ISO IEC 27042 SWGDE recipe" },
    ],
  },
  {
    slug: "pentest-methodology",
    shortTitle: "Pentest Methodology",
    title: "Penetration Testing: Methodology",
    description: "PTES phases, OSINT tools, scanning, exploitation, responsible disclosure",
    badge: "Pentest",
    sections: [
      { id: "pentest-intro", title: "What is a Penetration Test?", content: "penetration test authorised simulated attack vulnerabilities before real attackers black-box white-box grey-box" },
      { id: "ptes-phases", title: "PTES Phases", content: "PTES Penetration Testing Execution Standard planning reconnaissance scanning enumeration exploitation post-exploitation reporting phases" },
      { id: "osint", title: "Passive Reconnaissance (OSINT)", content: "OSINT Shodan Censys theHarvester crt.sh Wayback Machine banner grabbing TLS certificate subdomain email enumeration" },
      { id: "scanning", title: "Active Scanning & Enumeration", content: "Nmap port scanning service fingerprinting Nikto web misconfiguration testssl.sh TLS SSL OpenVAS vulnerability scanning NSE scripts" },
      { id: "exploitation", title: "Exploitation", content: "exploitation manual confirm scanner findings proof of concept Metasploit custom Python PoC Burp Suite real-world impact" },
      { id: "post-exploitation", title: "Post-Exploitation", content: "lateral movement data exposure privilege escalation scope agreed compromise demonstrate severity" },
      { id: "responsible-disclosure", title: "Responsible Disclosure", content: "responsible disclosure notify immediately critical finding interim mitigations session invalidation document timestamps CISO" },
    ],
  },
  {
    slug: "pentest-reporting",
    shortTitle: "Pentest Reporting",
    title: "Penetration Testing: Reports & Risk Rating",
    description: "Report structure, CVSS scoring, finding format, remediation roadmap",
    badge: "Pentest",
    sections: [
      { id: "report-structure-pt", title: "Report Structure", content: "executive summary engagement scope methodology technical background detailed findings attack narrative remediation roadmap appendices" },
      { id: "cvss", title: "CVSS v3.1 Scoring", content: "CVSS Common Vulnerability Scoring System attack vector complexity privileges required user interaction scope confidentiality integrity availability base score" },
      { id: "finding-format", title: "Finding Format", content: "finding ID severity CVE CVSS score affected host port service authentication remediation effort description discovery proof of concept risk analysis" },
      { id: "remediation-roadmap", title: "Remediation Roadmap", content: "remediation roadmap priority immediate high medium low strategic timelines 24 hours 7 days 30 days 90 days owner target" },
      { id: "patch-management", title: "Patch Management SLA", content: "patch management SLA critical 24 hours high 7 days medium 30 days low 90 days asset inventory CMDB vulnerability scanning" },
    ],
  },
  {
    slug: "vuln-reference",
    shortTitle: "Vuln Reference",
    title: "Vulnerability Reference",
    description: "Heartbleed, TLS 1.0/1.1, HTTP security headers, HSTS — from the PizzaPineapple case study",
    badge: "Reference",
    sections: [
      { id: "heartbleed", title: "CVE-2014-0160: Heartbleed", content: "Heartbleed CVE-2014-0160 OpenSSL 1.0.1 1.0.1f TLS DTLS Heartbeat Extension bounds check payload_length memory disclosure 64KB session token credentials private key" },
      { id: "tls-deprecated", title: "TLS 1.0/1.1 (YORK-002)", content: "TLS 1.0 1.1 deprecated RFC 8996 BEAST POODLE attack cipher suite MD5 SHA-1 PRF AEAD modern browsers" },
      { id: "http-headers", title: "HTTP Security Headers (YORK-003)", content: "Content-Security-Policy X-Frame-Options X-Content-Type-Options Referrer-Policy Permissions-Policy XSS clickjacking MIME sniffing missing headers" },
      { id: "server-banner", title: "Verbose Server Banner (YORK-004)", content: "server banner X-Powered-By version disclosure ServerTokens Prod ServerSignature Off expose_php reconnaissance CVE" },
      { id: "hsts", title: "HSTS (YORK-005)", content: "HSTS HTTP Strict Transport Security includeSubDomains preload SSL stripping subdomain max-age preload list" },
      { id: "pizzapineapple", title: "PizzaPineapple Case Study", content: "PizzaPineapple EHAC Security Consulting penetration test Heartbleed JWT session token admin credential RSA private key memory dump attack narrative" },
    ],
  },
];

export function getTopicBySlug(slug: string): Topic | undefined {
  return topics.find((t) => t.slug === slug);
}

export function getAllSlugs(): string[] {
  return topics.map((t) => t.slug);
}
