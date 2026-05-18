import { Callout, Table, SectionHeading, SubHeading, T, CodeBlock } from "@/components/ContentComponents";

export default function VulnReferenceContent() {
  return (
    <div className="space-y-1 text-slate-700 leading-relaxed">

      <Callout type="info">
        This is a quick-reference page for vulnerabilities covered in the EHAC course, primarily from the PizzaPineapple penetration test case study.
      </Callout>

      <SectionHeading id="heartbleed">CVE-2014-0160: Heartbleed</SectionHeading>

      <SubHeading>Overview</SubHeading>
      <p className="text-sm">
        <strong>Heartbleed</strong> (CVE-2014-0160) is a critical memory disclosure vulnerability in the OpenSSL cryptographic library. Publicly disclosed on <strong>7 April 2014</strong>.
      </p>
      <Table
        headers={["Field", "Value"]}
        rows={[
          ["CVE", "CVE-2014-0160"],
          ["Affected versions", "OpenSSL 1.0.1 through 1.0.1f (inclusive); OpenSSL 1.0.2-beta"],
          ["Not affected", "OpenSSL 0.9.8 (no Heartbeat ext.), OpenSSL ≥1.0.1g (patched), OpenSSL 1.0.2 stable+"],
          ["CVSS v3.1", "7.5 HIGH (real-world: Critical)"],
          ["Authentication required", "None — fully unauthenticated"],
          ["Server-side logging", "None — the attack leaves NO log entries"],
        ]}
      />

      <SubHeading>Technical Root Cause</SubHeading>
      <p className="text-sm">
        The vulnerability is in the <strong>TLS/DTLS Heartbeat Extension</strong> (RFC 6520) — a keep-alive mechanism. The Heartbeat protocol works like this:
      </p>
      <ol className="list-decimal pl-5 space-y-1 text-sm">
        <li>Peer A sends a Heartbeat Request containing a <em>payload</em> and a <em>payload_length</em> field</li>
        <li>Peer B is expected to echo back exactly the same payload to confirm liveness</li>
      </ol>
      <p className="text-sm mt-2">
        The bug: OpenSSL allocated the response buffer based on the attacker-controlled <T>payload_length</T> field <em>without verifying this value matches the actual payload length</em>. It then copied <T>payload_length</T> bytes from the payload buffer — reading into adjacent heap memory.
      </p>
      <CodeBlock lang="Simplified vulnerable code (OpenSSL ≤ 1.0.1f)">
        {`/* payload_length is attacker-controlled — NOT VALIDATED */
n2s(p, payload);  // reads 2-byte length from request

/* Allocates response based on attacker-supplied length */
buffer = OPENSSL_malloc(1 + 2 + payload + padding);

/* VULNERABILITY: copies 'payload' bytes regardless of actual data length
   Reads beyond the heartbeat payload into adjacent heap memory */
memcpy(bp, p, payload);`}
      </CodeBlock>
      <p className="text-sm">
        By sending a <strong>zero-byte payload</strong> but declaring <T>payload_length = 65535</T>, an attacker causes the server to copy up to <strong>64KB of its own heap memory</strong> into the response. This is repeatable indefinitely.
      </p>

      <SubHeading>Data Exposed</SubHeading>
      <Table
        headers={["Data Type", "Impact"]}
        rows={[
          ["Private key material (RSA/DSA/ECDSA)", "Allows retrospective decryption of captured TLS sessions + impersonation"],
          ["Session tokens / cookies", "Allows session hijacking without credentials"],
          ["Plaintext credentials", "Usernames and passwords recently processed in memory"],
          ["Application data", "HTTP request fragments, database query results"],
          ["Memory layout", "Useful for bypassing ASLR in chained exploit scenarios"],
        ]}
      />
      <Callout type="danger">
        The attack leaves <strong>no server-side log entries</strong>. There is typically no indication on the server that memory has been read. It is impossible to determine retrospectively how many times the vulnerability was exploited or what data was exfiltrated.
      </Callout>

      <SubHeading>Detection & Verification</SubHeading>
      <CodeBlock lang="Nmap NSE script">
        {`nmap -sV -p 443 --script ssl-heartbleed 185.220.34.10
# Returns: | ssl-heartbleed: VULNERABLE`}
      </CodeBlock>
      <CodeBlock lang="testssl.sh">
        {`testssl.sh --heartbleed 185.220.34.10
# Returns: Heartbleed (CVE-2014-0160)    VULNERABLE (NOT ok)`}
      </CodeBlock>

      <SubHeading>Remediation</SubHeading>
      <ol className="list-decimal pl-5 space-y-1 text-sm">
        <li><strong>Upgrade OpenSSL</strong> to ≥1.0.1g. Preferred: OpenSSL 3.x (currently 3.3.x). Verify: <T>openssl version -a</T></li>
        <li><strong>Reissue all TLS certificates</strong> — existing cert and private key are considered compromised. Generate new key pair, issue new cert, revoke old via CRL/OCSP.</li>
        <li><strong>Invalidate all active sessions</strong> — rotate JWT signing secret or session secret. Force all users to re-login.</li>
        <li><strong>Rotate all secrets in memory</strong> — database passwords, API keys, any secrets that may have been in heap memory during exposure window.</li>
        <li><strong>GDPR breach assessment</strong> — given no server logs exist, treat as if exploited from provisioning date. Notify DPA if &gt;72 hours (GDPR Article 33).</li>
      </ol>

      <SectionHeading id="tls-deprecated">TLS 1.0/1.1 (YORK-002) — High</SectionHeading>
      <p className="text-sm">
        TLS 1.0 and 1.1 were deprecated by <strong>RFC 8996</strong> in March 2021 and are no longer supported by modern browsers.
      </p>
      <Table
        headers={["Protocol", "Vulnerability", "Issue"]}
        rows={[
          ["TLS 1.0", "BEAST (CVE-2011-3389)", "CBC mode vulnerability allowing chosen-plaintext attack"],
          ["TLS 1.0", "POODLE (CVE-2014-3566)", "Padding oracle attack (with certain cipher suites)"],
          ["TLS 1.1", "No AEAD support", "Uses MD5/SHA-1 PRF function, lacks AEAD cipher suites"],
          ["TLS 1.2", "Acceptable", "Supports AEAD (AES-GCM, ChaCha20-Poly1305)"],
          ["TLS 1.3", "Recommended", "Removed legacy ciphers, 0-RTT option, improved handshake"],
        ]}
      />
      <CodeBlock lang="Apache remediation (httpd.conf / ssl.conf)">
        {`SSLProtocol -all +TLSv1.2 +TLSv1.3
SSLCipherSuite ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:\
               ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:\
               ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305
SSLHonorCipherOrder on`}
      </CodeBlock>

      <SectionHeading id="http-headers">HTTP Security Headers (YORK-003) — Medium</SectionHeading>
      <Table
        headers={["Header", "Risk if Absent", "Example Value"]}
        rows={[
          ["Content-Security-Policy", "XSS, data injection", `default-src 'self'; script-src 'self'`],
          ["X-Frame-Options", "Clickjacking", "DENY or SAMEORIGIN"],
          ["X-Content-Type-Options", "MIME-type confusion attacks", "nosniff"],
          ["Referrer-Policy", "Information leakage via Referer header", "strict-origin-when-cross-origin"],
          ["Permissions-Policy", "Browser feature abuse (camera, mic, geolocation)", `geolocation=(), microphone=(), camera=()`],
          ["Strict-Transport-Security", "SSL-stripping, insecure connections", "max-age=63072000; includeSubDomains; preload"],
        ]}
      />
      <CodeBlock lang="Apache virtual host configuration">
        {`Header always set X-Content-Type-Options "nosniff"
Header always set X-Frame-Options "DENY"
Header always set Referrer-Policy "strict-origin-when-cross-origin"
Header always set Content-Security-Policy "default-src 'self'; script-src 'self'"
Header always set Permissions-Policy "geolocation=(), microphone=(), camera=()"`}
      </CodeBlock>

      <SectionHeading id="server-banner">Verbose Server Banner (YORK-004) — Medium</SectionHeading>
      <p className="text-sm">
        All web servers return verbose <T>Server:</T> and <T>X-Powered-By:</T> response headers disclosing exact software versions to unauthenticated clients.
      </p>
      <CodeBlock lang="Evidence (HTTP response headers)">
        {`Server: Apache/2.2.22 (Ubuntu)
X-Powered-By: PHP/5.5.9-1ubuntu4.21`}
      </CodeBlock>
      <p className="text-sm">
        This information significantly reduces the reconnaissance effort required by an attacker — they know exactly which CVEs to look for.
      </p>
      <CodeBlock lang="Apache remediation (httpd.conf)">
        {`ServerTokens Prod          # Shows only "Apache" — no version
ServerSignature Off         # Removes version from error pages`}
      </CodeBlock>
      <CodeBlock lang="PHP remediation (php.ini)">
        {`expose_php = Off`}
      </CodeBlock>

      <SectionHeading id="hsts">HSTS Not Enforced on Subdomains (YORK-005) — Low</SectionHeading>
      <p className="text-sm">
        The primary portal sends an <T>HTTP Strict-Transport-Security</T> header, but without <T>includeSubDomains</T> or <T>preload</T> directives. Subdomains remain vulnerable to SSL-stripping attacks.
      </p>
      <CodeBlock lang="Current (insufficient)">
        {`Strict-Transport-Security: max-age=31536000`}
      </CodeBlock>
      <CodeBlock lang="Recommended">
        {`Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`}
      </CodeBlock>
      <p className="text-sm mt-2">
        After deploying the fixed header with <T>preload</T>, submit the domain to the HSTS preload list at <strong>hstspreload.org</strong>. This bakes the rule into browsers — HTTPS is enforced even on first visit, before any HTTP response is received.
      </p>

      <SectionHeading id="pizzapineapple">PizzaPineapple Case Study Summary</SectionHeading>
      <p className="text-sm">
        A synthetic but technically realistic penetration test conducted by <strong>EHAC Security Consulting Ltd (ESC)</strong> against PizzaPineapple Ltd&apos;s public-facing infrastructure.
      </p>
      <Table
        headers={["Detail", "Value"]}
        rows={[
          ["Assessment type", "External Black-Box Penetration Test"],
          ["Scope", "5 public IP addresses, 3 web app hostnames, TLS endpoints"],
          ["Duration", "03–07 March 2025 (5 days)"],
          ["Lead", "Sarah Chen, OSCP CEH"],
          ["Critical finding", "CVE-2014-0160 (Heartbleed) on primary HTTPS server"],
          ["Overall risk", "CRITICAL"],
        ]}
      />

      <SubHeading>Attack Chain Summary</SubHeading>
      <ol className="list-decimal pl-5 space-y-2 text-sm">
        <li><strong>Passive Recon (Shodan):</strong> Apache/2.2.22 at 185.220.34.10, OpenSSL banner 1.0.1e visible. TLS cert last renewed 2021. crt.sh revealed additional subdomains.</li>
        <li><strong>Active Scanning (Nmap):</strong> Port 443 open, ssl-heartbleed NSE returned VULNERABLE. TLS 1.0 and 1.1 accepted.</li>
        <li><strong>Exploitation (Metasploit + custom Python PoC):</strong> Sent 50+ Heartbeat requests over 10 minutes, collected 3.1MB memory dump.</li>
        <li><strong>Memory Analysis:</strong> Found: (a) valid JWT belonging to admin user j.brown@pizzapineapple.co.uk, (b) login POST body with credentials, (c) partial RSA private key material.</li>
        <li><strong>Session Hijacking:</strong> Used recovered JWT to authenticate to <T>/api/admin/users</T> — accessed 4,721 registered user accounts without credentials.</li>
        <li><strong>Responsible Disclosure:</strong> Notified CISO James Whitmore at 11:30 same day. All credentials/tokens reported immediately and not retained by ESC.</li>
      </ol>

      <Callout type="key">
        The key lesson from PizzaPineapple: a single publicly-known, decade-old vulnerability allowed full administrative access to 4,721 user accounts with zero authentication, zero logs, and zero indication the server was being exploited.
      </Callout>

    </div>
  );
}
