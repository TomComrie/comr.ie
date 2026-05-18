import { notFound } from "next/navigation";
import PasswordGate from "@/components/PasswordGate";
import DocsLayout from "@/components/DocsLayout";
import { getTopicBySlug, getAllSlugs } from "@/lib/notes-data";
import TopicContent from "./TopicContent";

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const topic = getTopicBySlug(slug);
  return { title: topic ? `${topic.title} — EHAC Notes` : "EHAC Notes" };
}

export default async function TopicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const topic = getTopicBySlug(slug);
  if (!topic) notFound();

  return (
    <PasswordGate>
      <DocsLayout>
        <TopicContent topic={topic} />
      </DocsLayout>
    </PasswordGate>
  );
}
