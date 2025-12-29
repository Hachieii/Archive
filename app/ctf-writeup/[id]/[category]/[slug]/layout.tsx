import type { Metadata } from "next";
import { competitionsData } from "@/lib/ctf-data";

export async function generateMetadata({
  params,
}: {
  params: { id: string; category: string; slug: string };
}): Promise<Metadata> {
  const competition = competitionsData.find((c) => c.id === params.id);
  const challenge = competition?.challenges?.find(
    (ch: any) => ch.slug === params.slug && ch.category === params.category
  );

  if (!challenge) {
    return {
      title: "Challenge Not Found | Archive",
      description: "The challenge writeup you are looking for does not exist.",
    };
  }

  const title = `${challenge.title} - ${params.category} | ${
    competition?.name ?? "Archive"
  } | Archive`;
  const description = `Detailed writeup for ${challenge.title} (${
    challenge.points
  } points) from ${
    competition?.name ?? "Archive"
  }. Learn the solution to this ${
    params.category
  } challenge with step-by-step explanations.`;

  return {
    title,
    description,
    keywords: [
      challenge.title,
      params.category,
      "CTF",
      "writeup",
      "solution",
      competition?.name ?? "Archive",
    ],
    openGraph: {
      title,
      description,
      url: `https://archive-hachieli.vercel.app/ctf-writeup/${params.id}/${params.category}/${params.slug}`,
      type: "article",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export default function ChallengeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
