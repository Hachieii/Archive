import type { Metadata } from "next";
import { competitionsData } from "@/lib/ctf-data";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const competition = competitionsData.find((c) => c.id === params.id);

  if (!competition) {
    return {
      title: "Competition Not Found | Archive",
      description: "The competition you are looking for does not exist.",
    };
  }

  return {
    title: `${competition.name} | Archive`,
    description: `Explore ${competition.name} CTF writeups and solutions. Browse challenges across multiple categories with detailed explanations.`,
    openGraph: {
      title: `${competition.name} | Archive`,
      description: `Explore ${competition.name} CTF writeups and solutions.`,
      url: `https://archive-hachieli.vercel.app/ctf-writeup/${params.id}`,
      type: "website",
    },
  };
}

export default function CompetitionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
