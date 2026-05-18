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
import PracticalLinuxBasicsContent from "@/lib/topics/practical-linux-basics";
import PracticalWebSecurityContent from "@/lib/topics/practical-web-security";
import PracticalReverseEngineeringContent from "@/lib/topics/practical-reverse-engineering";
import PracticalForensicsLabsContent from "@/lib/topics/practical-forensics-labs";
import ExamCheatsheetContent from "@/lib/topics/exam-cheatsheet";
import ExamInfoContent from "@/lib/topics/exam-info";
import GlossaryContent from "@/lib/topics/glossary";
import ProgrammingLanguagesContent from "@/lib/topics/programming-languages";
import Glossaryify from "@/components/Glossaryify";

type TopicRenderer = () => React.ReactNode;

const contentMap: Record<string, TopicRenderer> = {
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
  "practical-linux-basics": PracticalLinuxBasicsContent,
  "practical-web-security": PracticalWebSecurityContent,
  "practical-reverse-engineering": PracticalReverseEngineeringContent,
  "practical-forensics-labs": PracticalForensicsLabsContent,
  "exam-cheatsheet": ExamCheatsheetContent,
  "exam-info": ExamInfoContent,
  glossary: GlossaryContent,
  "programming-languages": ProgrammingLanguagesContent,
};

export default function TopicContent({ topic }: { topic: Topic }) {
  const Content = contentMap[topic.slug];
  const renderedContent = Content ? Content() : null;

  return (
    <article>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">{topic.title}</h1>
        <p className="text-slate-500 text-sm">{topic.description}</p>
      </div>
      {renderedContent ? (
        <Glossaryify>{renderedContent}</Glossaryify>
      ) : (
        <p className="text-slate-400">Content coming soon.</p>
      )}
    </article>
  );
}
