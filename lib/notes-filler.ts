const HEADINGS = [
  "## Core Concepts and Definitions",
  "## Theoretical Foundations",
  "## Practical Application",
  "## Analysis and Interpretation",
  "## Key Topics Overview",
  "## Fundamental Principles",
  "## Methodology and Approach",
  "## Technical Deep Dive",
  "## Context and Background",
  "## Summary of Key Ideas",
];

const SECTIONS = [
  // --- Forensics ---
  `### Evidence Acquisition
Forensic acquisition is the process of creating a bit-for-bit copy of a storage device. This is distinct from a standard file copy, which only captures accessible files and loses metadata, slack space, and deleted file remnants. The acquisition tool (e.g., FTK Imager, dd, Guymager) reads every sector of the source device and writes it to a forensic image file. A hash (MD5 or SHA-256) is computed before and after acquisition to verify integrity. The original device should never be modified after acquisition; all analysis is performed on the image.`,

  `### Chain of Custody
Chain of custody refers to the documented chronological trail of evidence from collection to presentation in court. Every transfer of evidence must record: who handled it, when, why, and what changes (if any) were made. The ACPO principles require that the person seizing the evidence is competent to do so, and that any action that may alter evidence is justified and recorded. A broken chain of custody does not automatically exclude evidence, but it provides grounds for the defence to argue tampering.`,

  `### Timeline Construction
Building a timeline requires collecting timestamps from multiple sources: file system metadata ($MFT MACB times), event logs (Security.evtx, System.evtx), registry keys (Last Write times), and application logs. The challenge is that each source may use a different clock or timezone reference. Before trusting any timestamp, verify the system clock accuracy using Event 4616 (manual time change), Event 35/37 (NTP sync), and the registry TimeZoneInformation key. A reliable timeline corroborates across at least two independent sources.`,

  `### ACPO Principles
The Association of Chief Police Officers (ACPO) defined three core principles for digital evidence handling. Principle 1: No action taken by investigators should change data held on a computer or storage media. Principle 2: In exceptional circumstances where access to original data is necessary, the person must be competent to do so and able to explain the impact. Principle 3: An audit trail of all actions applied to digital evidence must be created and preserved. Principle 4: The person in charge of the investigation is responsible for ensuring these principles are followed.`,

  // --- Registry ---
  `### Registry Hive Files
The Windows registry is assembled from separate files called hives, stored on disk. The system hives are located in \`C:\\Windows\\System32\\Config\\\` and include SAM (user accounts and password hashes), SECURITY (local security policy), SOFTWARE (installed applications and settings), and SYSTEM (hardware, services, and device configuration). User-specific settings are stored in \`%USERPROFILE%\\NTUSER.DAT\`. In forensic work, these files are read directly from the disk image using tools like RegRipper or Registry Explorer, without booting the suspect system.`,

  `### USB Device Forensics
Every USB device ever connected to a Windows system leaves traces in the registry. The key locations are: \`SYSTEM\\CurrentControlSet\\Enum\\USB\` — VID and PID identifying the manufacturer and model; \`SYSTEM\\CurrentControlSet\\Enum\\USBSTOR\` — the friendly name and unique serial number; \`SYSTEM\\CurrentControlSet\\Control\\DeviceClasses\\{53f56307-b6bf-11d0-94f2-00a0c91efb8b}\` — a GUID whose Last Write time may indicate insertion time. These should always be corroborated against \`setupapi.dev.log\` and Event Logs for a complete picture.`,

  `### Registry Timestamps
Registry keys have a single timestamp: the Last Write time. This records when the key or any of its values was last modified. There is no created or accessed timestamp for registry keys. A limitation of this is that if a key has multiple values, changing any one of them updates the Last Write time — you know something changed, but not which value. Additionally, the DeviceClasses GUID Last Write time is not always reliable as the enumerator may update keys independently on some Windows versions.`,

  // --- Event Logs ---
  `### Windows Event Log Channels
Event logs in Windows are stored as .evtx files in \`C:\\Windows\\System32\\winevt\\Logs\\\`. The most important channels are Security.evtx (logon/logoff, privilege use, account management), System.evtx (OS events, time synchronisation, device drivers), and Application.evtx (application-generated events). On domain-joined machines, the default retention is 7 days. After this, the oldest events are overwritten. Forwarded events can be sent to a central SIEM collector for longer retention.`,

  `### Logon Event IDs
Event 4624 indicates a successful logon and includes a critical Logon Type field. Type 2 is interactive (local keyboard), Type 3 is network (file share access — normal in corporate environments), Type 8 is NetworkCleartext (credentials sent unencrypted — always suspicious), and Type 10 is RemoteInteractive (RDP). Event 4625 indicates a failed logon. Event 4648 records logon with explicit credentials (Run As, PsExec). On a domain controller, Event 4768 (Kerberos TGT issued) and Event 4769 (service ticket requested) provide the authentication picture.`,

  `### Clock Verification Events
Before trusting any event log timestamp, verify the system clock. Event 4616 (Security.evtx) records manual time changes, including the old and new time values. Event 35 (System.evtx) indicates the NTP service was invoked. Event 37 (System.evtx) confirms a successful time update via NTP. A cluster of manual time changes near relevant events is suspicious. A single change at boot followed by an NTP sync within seconds is consistent with a CMOS battery failure.`,

  `### Event Log Retention
On standalone machines, event logs operate as a circular buffer — once the maximum size is reached, the oldest events are overwritten. On domain-joined machines, Group Policy defaults to 7-day retention. The retention settings are stored in the registry at \`SYSTEM\\CurrentControlSet\\Services\\Eventlog\\Security\`, with values for \`MaxSize\` and \`Retention\`. If logs have been forwarded to a SIEM, the local 7-day limit is less significant because the central collector retains a historical copy.`,

  // --- Steganography ---
  `### LSB Steganography
Least Significant Bit steganography works by replacing the lowest bit of each colour channel (Red, Green, Blue) in each pixel with a bit of the hidden message. In a 24-bit BMP image, each pixel uses 3 bytes (one per channel). Changing the LSB of a byte alters the pixel value by at most 1 out of 256 — imperceptible to the human eye. An 800×600 image can hide up to 800 × 600 × 3 = 1,440,000 bits = 180 KB of data. LSB is fragile: JPEG compression destroys the embedded data due to DCT quantisation.`,

  `### Steganalysis Workflow
The standard workflow for detecting hidden data starts with cheap checks before escalating. (1) Use \`file\` to confirm the real file type. (2) Run \`exiftool\` to inspect metadata for anomalies. (3) Use \`strings\` with grep to search for obvious text. (4) Run \`binwalk\` to detect embedded files or appended data. (5) Use format-specific tools: \`steghide info\` for JPEG/BMP/WAV, \`zsteg\` for PNG/BMP. (6) If nothing is found, move to statistical analysis (chi-squared test on LSB distributions) or manual hex inspection.`,

  `### Three Considerations for Stego Systems
Any steganography system involves a tradeoff between three factors. Capacity is the amount of data that can be hidden — determined by the carrier size and how many bits per byte are used. Security is how difficult it is for an adversary to detect the hidden data — using fewer bits per byte improves security at the cost of capacity. Robustness is how well the hidden data survives transformations (compression, resizing, re-encoding). Lossless formats like PNG and BMP prioritise robustness; JPEG sacrifices it for smaller file sizes.`,

  // --- File Systems ---
  `### NTFS $MFT
The Master File Table ($MFT) is the core of NTFS. Every file and directory on the volume has at least one entry (record) in the $MFT, typically 1024 bytes. Each record contains standard attributes including $STANDARD_INFORMATION (SI) and $FILE_NAME (FN), each with separate timestamp sets. The SI timestamps are modified by system operations (file open, write, metadata change), while FN timestamps reflect the original creation from the directory entry. This dual-timestamp structure is a key forensic artefact — discrepancies between SI and FN timestamps can indicate timestomping.`,

  `### MACB Timestamps
NTFS records four timestamps per file, referred to as MACB: Modified (M) — content last written; Access (A) — last read (not always updated); Changed (C) — metadata change (MFT record update); Born (B) — file creation. These are stored in UTC within the $MFT. The Created-later-than-Modified anomaly occurs when a file is copied: the copy has the original's last modified time preserved, but a new creation time. If Born is earlier than Modified, the file was modified after creation, which is expected. If Modified is earlier than Born, it suggests timestomping or a copy operation.`,

  `### File Slack
File slack is the unused space between the end of a file's data and the end of the last sector allocated to it. When a file does not fill its final sector exactly, the remaining bytes (RAM slack — filled with whatever was in memory) and the rest of the sector (drive slack — zeros or leftover data) can contain fragments of previous file content or in-memory data. Forensic tools can extract slack space to recover data that was not intentionally deleted but happens to be present in these gaps.`,

  `### Alternate Data Streams
ADS is an NTFS feature that allows additional data to be attached to a file as a hidden stream. The syntax is \`file.txt:hidden.txt\`. ADS was originally designed for compatibility with the Mac OS Hierarchical File System (resource forks). In forensic contexts, ADS can hide executable code or stolen data without affecting the file's displayed size or content. However, ADS also has legitimate uses — browsers use \`Zone.Identifier\` ADS to mark downloaded files as coming from the internet.`,

  // --- Network / Web Security ---
  `### SQL Injection
SQL injection occurs when user input is incorporated into a SQL query without proper sanitisation or parameterisation. The key vulnerability is dynamic string building — concatenating user input directly into query strings. If a login form constructs the query by joining user-controlled strings, an attacker can supply \`' OR 1=1 --\` to bypass authentication. Prevention uses parameterised queries (prepared statements), input validation, and principle of least privilege for database accounts.`,

  `### Cross-Site Scripting (XSS)
XSS allows an attacker to inject malicious JavaScript into a web page viewed by other users. Three types: Reflected XSS (payload is in the URL and reflected back immediately), Stored XSS (payload is saved on the server and served to all visitors), and DOM-based XSS (payload modifies the client-side DOM without server interaction). The core vulnerability is insufficient output encoding — user-supplied data is rendered as HTML/JavaScript rather than plain text. Prevention uses Content-Security-Policy headers, output encoding, and input validation.`,

  `### Three-Way TCP Handshake
TCP connections begin with a three-way handshake: (1) Client sends a SYN packet with an initial sequence number (ISN). (2) Server responds with SYN-ACK, acknowledging the client's ISN and sending its own ISN. (3) Client sends ACK, acknowledging the server's ISN. This establishes a bidirectional connection where both sides have confirmed reachability and synchronised sequence numbers. This is relevant to security because it allows detection of half-open connections (SYN flood attacks) and helps identify port scanning techniques like SYN scan vs connect scan.`,

  // --- Pentest Methodology ---
  `### Black Box vs White Box Testing
Black box testing provides the tester with no internal information — the test simulates an external attacker with no prior knowledge. White box testing provides full access — credentials, source code, architecture diagrams, and configuration files. Grey box testing is intermediate: the tester has limited knowledge, such as a low-privilege user account or network access but no architecture documentation. The testing methodology affects both the scope of findings and the report structure — black box findings demonstrate real-world attacker capability, while white box findings provide more comprehensive coverage.`,

  `### CVSS v3.1 Scoring
The Common Vulnerability Scoring System provides a standardised severity rating. Base metrics include: Attack Vector (Network, Adjacent, Local, Physical), Attack Complexity (Low, High), Privileges Required (None, Low, High), User Interaction (None, Required), Scope (Unchanged, Changed), and three impact metrics (Confidentiality, Integrity, Availability). The base score ranges from 0.0 (None) to 10.0 (Critical). Contextual metrics (Temporal, Environmental) can modify the score for specific deployments. Heartbleed (CVE-2014-0160) scores 7.5 (High) on base metrics but is treated as Critical in practice due to its stealth and impact.`,

  `### Remediation Roadmap
A penetration test report must include a prioritised remediation plan, not just a list of vulnerabilities. Immediate actions (24 hours) address actively exploited or critical issues — patch, rotate secrets, invalidate sessions. High priority (7 days) addresses vulnerabilities with known exploits. Medium priority (30 days) covers configuration hardening. Low priority (90 days) addresses defence-in-depth improvements. Strategic items (next quarter) address process failures such as patch management SLA definitions. Each item should include the finding ID, owner, and target completion date.`,

  // --- Pentest Findings ---
  `### Heartbleed (CVE-2014-0160)
Heartbleed is a memory disclosure vulnerability in OpenSSL 1.0.1 through 1.0.1f. The TLS Heartbeat Extension allows a peer to verify liveness by echoing a payload. The bug: OpenSSL allocates the response buffer based on an attacker-supplied length field without verifying it matches the actual payload length. By sending a short payload with a large declared length, the attacker reads up to 64 KB of adjacent heap memory per request. This can reveal private keys, session tokens, and plaintext credentials. The attack leaves no server-side logs.`,

  `### HTTP Security Headers
HTTP response headers provide browser-enforced security controls. Content-Security-Policy restricts which sources of content the browser can load, mitigating XSS. X-Frame-Options prevents clickjacking by controlling whether the page can be embedded in a frame. Strict-Transport-Security (HSTS) forces HTTPS connections and prevents SSL-stripping. X-Content-Type-Options (nosniff) prevents MIME-type confusion attacks. These headers are low-effort, high-impact mitigations recommended for all web applications. Their absence is a medium-severity finding in most pentest standards.`,

  `### TLS Protocol Versions
TLS 1.0 and 1.1 were deprecated by RFC 8996 in March 2021. TLS 1.0 is vulnerable to BEAST (CBC chosen-plaintext attack) and POODLE (padding oracle). TLS 1.1 lacks AEAD cipher suite support. TLS 1.2 with AEAD ciphers (AES-GCM, ChaCha20-Poly1305) is the current minimum standard. TLS 1.3 removes legacy ciphers, improves handshake performance with 0-RTT, and enforces forward secrecy. Modern server configurations should disable TLS 1.0 and 1.1 and prefer TLS 1.3 with TLS 1.2 as a fallback.`,

  // --- Reverse Engineering ---
  `### Buffer Overflow
A buffer overflow occurs when a program writes more data to a fixed-length buffer than it can hold, overwriting adjacent memory. On the stack, adjacent data typically includes the saved base pointer and the return address. If an attacker can control the overflowed data, they can overwrite the return address to redirect execution to arbitrary code (shellcode). Stack canaries detect this by placing a known value between the buffer and return address — if the canary is altered, the program terminates before returning.`,

  `### Static vs Dynamic Analysis
Static analysis examines a binary without executing it — disassembly (IDA Pro, Ghidra), string extraction, and PE header inspection (file type, imported/exported functions, section permissions). Dynamic analysis runs the binary in a controlled environment (sandbox, debugger) to observe behaviour — network connections, file system changes, registry modifications, and process creation. Static analysis provides full coverage but is time-consuming. Dynamic analysis is faster but may miss code paths that require specific triggers. Combining both is the standard approach.`,

  // --- Practical / General ---
  `### Common Lab Workflow
A general approach for practical labs: (1) identify the question or objective — what are you trying to find or demonstrate? (2) enumerate the environment — what tools are available, what is the target? (3) apply the relevant technique from lectures — exploitation, analysis, or extraction. (4) document every command and output — screenshots or terminal logs are essential for the report. (5) verify your result independently if possible — a finding confirmed by two different methods is more reliable than one.`,

  `### Practical Triage
When faced with an unknown file in a forensic practical: first identify the real file type with \`file\`. If it is an archive, extract it. If it is an image, check metadata with \`exiftool\` and scan for embedded data with \`binwalk\` and \`strings\`. If it is a binary, check its hash against known malware databases and examine its imports. If it is a document, check for macros and embedded objects. This triage workflow prioritises the highest-value checks first and avoids wasting time on unlikely possibilities.`,

  `### Report Writing for Practicals
A practical report should document: the objective, the environment, the step-by-step procedure with commands and outputs, the analysis of results, and the conclusion. Use screenshots sparingly — include only those that show critical evidence. Format code blocks with the command language label. Explain why each step was taken, not just what was done. A good practical report allows a reader (or examiner) to reproduce your results exactly.`,

  `### Burp Suite Usage
Burp Suite is an intercepting proxy for web application testing. The Proxy tab captures and displays HTTP/S traffic between the browser and server, allowing requests to be modified before forwarding. Repeater resends individual requests for manual testing. Intruder automates parameter fuzzing for brute-force, SQL injection, and parameter discovery. In the EHAC practicals, the lab environment uses Burp's self-signed certificate, which requires configuring the browser to trust it. Without this, HTTPS traffic will not be intercepted.`,

  `### Tool Reference
Common commands: \`nmap -sV -p- target\` for full port and service scan; \`steghide extract -sf file.jpg -p ""\` for extracting hidden data with a blank passphrase; \`binwalk -e file.bin\` for extracting embedded files; \`exiftool file.jpg\` for metadata inspection; \`reg query HKLM\\SYSTEM\\CurrentControlSet\\Enum\\USBSTOR\` for querying USB device registry entries on a live system; \`Get-WinEvent -FilterHashtable @{LogName='Security'; Id=4624}\` for PowerShell event log filtering.`,
];

export function pickSections(count: number): string[] {
  const shuffled = [...SECTIONS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function randomHeading(): string {
  return HEADINGS[Math.floor(Math.random() * HEADINGS.length)];
}
