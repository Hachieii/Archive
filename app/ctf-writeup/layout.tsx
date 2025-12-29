import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CTF Writeups | Archive",
  description:
    "Explore detailed CTF writeups and solutions from KCSC Recruitment 2026 and other cybersecurity competitions. Learn from comprehensive technical walkthroughs.",
  openGraph: {
    title: "CTF Writeups | Archive",
    description:
      "Explore detailed CTF writeups and solutions from KCSC Recruitment 2026 and other cybersecurity competitions.",
    url: "https://archive-hachieli.vercel.app/ctf-writeup",
    type: "website",
  },
};

export default function CTFWriteupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
