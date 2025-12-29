import type { Metadata } from "next";
import { Roboto, Roboto_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Sidebar } from "@/components/sidebar";
import { SidebarProvider } from "@/lib/sidebar-context";
import { AppShell } from "@/components/app-shell";
import { cookies } from "next/headers";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
  variable: "--font-roboto",
  display: "swap",
});

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-roboto-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Archive | CTF Writeups & Learning Notes",
  description:
    "Comprehensive collection of CTF writeups, cybersecurity solutions, and technical learning notes. Explore detailed walkthroughs for KCSC Recruitment 2026 competitions.",
  keywords: [
    "CTF",
    "writeups",
    "cybersecurity",
    "KCSC",
    "learning notes",
    "hacking",
  ],
  authors: [{ name: "Hachieii" }],
  creator: "Hachieii",
  robots: "index, follow",
  alternates: {
    canonical: "https://archive-hachieli.vercel.app",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://archive-hachieli.vercel.app",
    siteName: "Archive",
    title: "Archive | CTF Writeups & Learning Notes",
    description:
      "Comprehensive collection of CTF writeups, cybersecurity solutions, and technical learning notes.",
    images: [
      {
        url: "https://archive-hachieli.vercel.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "Archive - CTF Writeups & Learning Notes",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Archive | CTF Writeups & Learning Notes",
    description:
      "Comprehensive collection of CTF writeups, cybersecurity solutions, and technical learning notes.",
    images: ["https://archive-hachieli.vercel.app/og-image.png"],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // 1. Dùng await cookies() (Bắt buộc ở Next.js 15)
  const cookieStore = await cookies();

  // 2. Đọc đúng tên cookie mới: sidebar_collapsed
  const defaultCollapsed =
    cookieStore.get("sidebar_collapsed")?.value === "true";

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Archive",
              description: "CTF Writeups & Learning Notes",
              url: "https://archive-hachieli.vercel.app",
              potentialAction: {
                "@type": "SearchAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate:
                    "https://archive-hachieli.vercel.app/ctf-writeup?search={search_term_string}",
                },
                query_input: "required name=search_term_string",
              },
            }),
          }}
        />
      </head>
      <body
        className={`
          ${roboto.variable} 
          ${robotoMono.variable} 
          antialiased
          bg-background text-foreground
        `}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* Truyền trạng thái đã đọc được vào Provider */}
          <SidebarProvider defaultCollapsed={defaultCollapsed}>
            <Sidebar />
            <AppShell>{children}</AppShell>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
