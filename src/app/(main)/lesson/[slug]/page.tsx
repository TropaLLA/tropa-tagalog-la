import { notFound } from "next/navigation";
import Conversation from "@/components/Conversation";
import { getLesson } from "@/lib/lessons";

export default async function LessonConversationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const lesson = getLesson(slug);
  if (!lesson) notFound();
  return <Conversation key={lesson.slug} lesson={lesson} />;
}