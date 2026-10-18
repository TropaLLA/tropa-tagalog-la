import { notFound } from "next/navigation";
import VocabList from "@/components/VocabList";
import { getTheme } from "@/lib/vocab";

export default async function VocabThemePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const theme = getTheme(slug);
  if (!theme) notFound();
  return <VocabList theme={theme} />;
}