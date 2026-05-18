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
  {
    slug: "programming-languages",
    shortTitle: "Languages",
    title: "Programming Languages in EHAC",
    description: "C, Python, PowerShell, JavaScript, SQL, Bash, Assembly, PHP, and Java — where each is used, essential commands, and exam relevance",
    badge: "Reference",
    sections: [
      { id: "overview", title: "Languages Overview", content: "c python powershell javascript sql bash assembly php java comparison table" },
      { id: "c", title: "C", content: "c system calls open read write close stat header files permissions ld_preload" },
      { id: "python", title: "Python", content: "python python-registry python-evtx plaso log2timeline psort custom exploit poc heartbleed" },
      { id: "powershell", title: "PowerShell", content: "powershell get-winevent event log filtering registry ads timestamps recycle bin" },
      { id: "javascript", title: "JavaScript", content: "javascript xss dom api document.cookie innerHTML payload cookie theft keylogger bypass" },
      { id: "sql", title: "SQL", content: "sql select insert injection or 1=1 parameterised query prepared statement" },
      { id: "bash", title: "Bash/Shell", content: "bash shell script chmod chown pipe redirect strings dd binwalk exiftool steghide" },
      { id: "assembly", title: "Assembly", content: "assembly gdb nm objdump reverse engineering disassembly stack frame buffer overflow" },
      { id: "php", title: "PHP", content: "php x-powered-by server banner expose_php server tokens" },
      { id: "java", title: "Java", content: "java owasp java encoder stegsolve gui steganalysis" },
    ],
  },
  {
    slug: "exam-cheatsheet",
    shortTitle: "Exam Cheatsheet",
    title: "Exam Cheatsheet",
    description: "High-yield recall points, answer structures, and must-remember commands, events, and concepts for the EHAC exam",
    badge: "Practical",
    sections: [
      { id: "exam-strategy", title: "Exam Strategy", content: "exam strategy answer structure methodology explain compare interpret evidence support consistent with" },
      { id: "linux-cheatsheet", title: "Linux Cheatsheet", content: "linux practical cheatsheet chmod chown ls strace open file table" },
      { id: "web-cheatsheet", title: "Web Security Cheatsheet", content: "xss burp wireshark http plaintext directory traversal cheatsheet" },
      { id: "reverse-cheatsheet", title: "Reverse Engineering Cheatsheet", content: "ld_preload nm imported symbols atbash monoalphabetic substitution 26 factorial" },
      { id: "forensics-cheatsheet", title: "Forensics Cheatsheet", content: "acpo chain of custody event ids ntfs fat userassist rot13 timeline forensics cheatsheet" },
      { id: "report-writing-cheatsheet", title: "Reporting Cheatsheet", content: "forensic report pentest report cvss reporting structure interpretation executive summary remediation roadmap" },
    ],
  },
  {
    slug: "exam-info",
    shortTitle: "Exam Info",
    title: "Exam and Assessment Information",
    description: "Transcript-derived guidance on the EHAC assessment format, CTF links, online vs offline components, and how to prepare strategically.",
    badge: "Reference",
    sections: [
      { id: "overview", title: "Assessment Overview", content: "assessment overview 60 40 exam split ctf practical format" },
      { id: "ctf-link", title: "CTFs and the Exam", content: "capture the flag ctf formative exam independence practical challenge" },
      { id: "exam-one", title: "Exam 1", content: "exam one online notes digital notes vle open resource lab" },
      { id: "exam-two", title: "Exam 2", content: "exam two offline hands-on one-page note 30 minutes individual assessment" },
      { id: "forensics-exam", title: "Forensics in the Exam", content: "forensics exam registry event logs acpo timeline reporting" },
      { id: "practical-advice", title: "Preparation Strategy", content: "preparation strategy open book offline memorise workflows command patterns" },
      { id: "what-to-memorise", title: "What To Memorise", content: "memorise commands workflows event ids artefacts verification" },
      { id: "transcript-highlights", title: "Transcript Highlights", content: "transcript highlights exam notes ctf open resource offline practical" },
    ],
  },
  {
    slug: "glossary",
    shortTitle: "Glossary",
    title: "Full Glossary",
    description: "A deep glossary for the technical terms, artefacts, tools, and acronyms used across the EHAC notes.",
    badge: "Reference",
    sections: [
      { id: "all-terms", title: "All Terms", content: "glossary acpo ads cvss ntfs registry xss tls tools acronyms definitions" },
    ],
  },
  {
    slug: "practical-linux-basics",
    shortTitle: "Lab: Linux Basics",
    title: "Practical Walkthrough: Linux Basics Labs",
    description: "Week 2 and Week 3 walkthroughs for file APIs, stat, ls, permissions, chmod, chown, shell scripts, and C-based permission changes",
    badge: "Practical",
    sections: [
      { id: "w2-file-apis", title: "Week 2: File System API and Monitoring", content: "week 2 file system api monitoring open read write close strace file descriptor open file table mystat myls stat opendir readdir walkthrough" },
      { id: "w3-permissions", title: "Week 3: File Protection and Access Control", content: "week 3 file permissions chmod chown ls -l touch mkdir shell script adduser read-only access control walkthrough" },
      { id: "linux-probable-questions", title: "Probable Exam Questions", content: "probable exam questions model answers file descriptor open file table permissions directory execute strace openat" },
      { id: "linux-common-mistakes", title: "Common Mistakes", content: "common mistakes lost marks chmod chown recursive execute verification practical linux" },
    ],
  },
  {
    slug: "practical-web-security",
    shortTitle: "Lab: Web Security",
    title: "Practical Walkthrough: Web Security Labs",
    description: "Week 4 and Week 5 walkthroughs for XSS Game, Wireshark credential capture, Burp interception, and directory traversal",
    badge: "Practical",
    sections: [
      { id: "w4-xss-game", title: "Week 4: Cross-Site Scripting Game", content: "xss game walkthrough reflected stored dom payload context event handler filter bypass" },
      { id: "w5-wireshark", title: "Week 5: Capturing Credentials with Wireshark", content: "wireshark http post credentials display filter html form url encoded plaintext password capture walkthrough" },
      { id: "w5-burp-intercept", title: "Week 5: Burp Interception", content: "burp suite intercept proxy request modify tfUName admin tfUPass none walkthrough" },
      { id: "w5-burp-traversal", title: "Week 5: Directory Traversal", content: "directory traversal burp repeater ../../../etc/passwd path traversal walkthrough" },
      { id: "web-probable-questions", title: "Probable Exam Questions", content: "probable exam questions xss wireshark burp traversal model answers" },
      { id: "web-common-mistakes", title: "Common Mistakes", content: "common mistakes lost marks xss burp post http traversal" },
    ],
  },
  {
    slug: "practical-reverse-engineering",
    shortTitle: "Lab: Reverse Eng",
    title: "Practical Walkthrough: Reverse Engineering Lab",
    description: "Week 8 workflow for imported symbol inspection, LD_PRELOAD hijacking, and substitution-cipher key recovery",
    badge: "Practical",
    sections: [
      { id: "re-atbash", title: "Atbash Binary Analysis", content: "atbash reverse engineering nm extern-only dynamic imported symbols puts ld_preload malicious shared library walkthrough" },
      { id: "re-substitution", title: "Substitution Cipher Recovery", content: "monoalphabetic substitution cipher key space 26 factorial decryptor caesar shift reverse engineering lab walkthrough" },
      { id: "re-probable-questions", title: "Probable Exam Questions", content: "probable exam questions ld_preload shared libraries 26 factorial imported symbols" },
      { id: "re-common-mistakes", title: "Common Mistakes", content: "common mistakes lost marks atbash caesar encryption decryption key reverse engineering practical" },
    ],
  },
  {
    slug: "practical-forensics-labs",
    shortTitle: "Lab: Forensics",
    title: "Practical Walkthrough: Forensics Labs",
    description: "Week 6 and Week 10 walkthroughs for scene collection, hardware inspection, hex encoding, timestamp decoding, and registry timeline work",
    badge: "Practical",
    sections: [
      { id: "w6-scene-collection", title: "Week 6: Scene Collection", content: "crime scene collection pde source exhibits officer continuity evidence entry log scene preservation walkthrough" },
      { id: "w6-hardware-exam", title: "Week 6: Hardware Examination", content: "hardware examination bios efi serial number drive model capacity boot order forensic lab walkthrough" },
      { id: "w10-hex-and-encoding", title: "Week 10: Hex and Encoding", content: "hex editor endianness utf-8 utf-16 xor symbol bytes week 10 digital forensics lab walkthrough" },
      { id: "w10-date-and-timeline", title: "Week 10: Dates and Timeline Reconstruction", content: "windows filetime dos timestamp unix timestamp ntuser.dat recentdocs usersassist wordpad timeline reconstruction walkthrough" },
      { id: "forensics-probable-questions", title: "Probable Exam Questions", content: "probable exam questions continuity contemporaneous notes bios time wall clock userassist rot13 forensics" },
      { id: "forensics-common-mistakes", title: "Common Mistakes", content: "common mistakes lost marks speculation ntfs utc fat local time continuity evidence handling" },
    ],
  },
];

export function getTopicBySlug(slug: string): Topic | undefined {
  return topics.find((t) => t.slug === slug);
}

export function getAllSlugs(): string[] {
  return topics.map((t) => t.slug);
}
