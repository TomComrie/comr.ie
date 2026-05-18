import React from "react";
import type { Topic } from "@/lib/notes-data";
import XssContent from "@/lib/topics/xss";
import SteganographyContent from "@/lib/topics/steganography";
import ForensicsFoundationsContent from "@/lib/topics/forensics-foundations";
import ForensicsFilesystemsContent from "@/lib/topics/forensics-filesystems";
import ForensicsDeletedContent from "@/lib/topics/forensics-deleted";
import RegistryContent from "@/lib/topics/registry";
import EventLogsContent from "@/lib/topics/event-logs";
import ForensicsReportingContent from "@/lib/topics/forensics-reporting";
import PentestMethodologyContent from "@/lib/topics/pentest-methodology";
import PentestReportingContent from "@/lib/topics/pentest-reporting";
import VulnReferenceContent from "@/lib/topics/vuln-reference";

const contentMap: Record<string, React.ComponentType> = {
  xss: XssContent,
  steganography: SteganographyContent,
  "forensics-foundations": ForensicsFoundationsContent,
  "forensics-filesystems": ForensicsFilesystemsContent,
  "forensics-deleted": ForensicsDeletedContent,
  registry: RegistryContent,
  "event-logs": EventLogsContent,
  "forensics-reporting": ForensicsReportingContent,
  "pentest-methodology": PentestMethodologyContent,
  "pentest-reporting": PentestReportingContent,
  "vuln-reference": VulnReferenceContent,
};

export default function TopicContent({ topic }: { topic: Topic }) {
  const Content = contentMap[topic.slug];

  return (
    <article>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">{topic.title}</h1>
        <p className="text-slate-500 text-sm">{topic.description}</p>
      </div>
      {Content ? (
        <Content />
      ) : (
        <p className="text-slate-400">Content coming soon.</p>
      )}
    </article>
  );
}
