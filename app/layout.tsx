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
  title: "Hachieii notebook",
  description: "A collection of my CTF Writeups and learning notes",
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
