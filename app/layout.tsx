import type { Metadata } from "next";
// 1. Import Roboto và Roboto Mono
import { Roboto, Roboto_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

// 2. Cấu hình Roboto (Font chính & Brand)
const roboto = Roboto({
  subsets: ["latin"],
  // Roboto chuẩn cần khai báo weight cụ thể
  weight: ["100", "300", "400", "500", "700", "900"],
  variable: "--font-roboto",
  display: "swap",
});

// 3. Cấu hình Roboto Mono (Font Code)
const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-roboto-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Gấu's Portfolio",
  description: "Portfolio built with Next.js, Tailwind v4 and Shadcn UI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`
          ${roboto.variable} 
          ${robotoMono.variable} 
          antialiased
        `}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
