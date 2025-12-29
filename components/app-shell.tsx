"use client";

import { useSidebar } from "@/lib/sidebar-context";
import { cn } from "@/lib/utils";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useSidebar();

  return (
    <main
      className={cn(
        "min-h-screen transition-[padding] duration-300 ease-[cubic-bezier(0.2,0.0,0,1.0)]",
        // Mobile: luôn pl-0
        "pl-0",
        // Desktop: pl-20 (80px) hoặc pl-64 (256px)
        isCollapsed ? "lg:pl-20" : "lg:pl-64"
      )}
    >
      {children}
    </main>
  );
}
