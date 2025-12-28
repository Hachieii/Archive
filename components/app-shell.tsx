"use client";

import { useSidebar } from "../lib/sidebar-context";
import { cn } from "@/lib/utils";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useSidebar();

  return (
    <main
      className={cn(
        "min-h-screen transition-[padding] duration-300 ease-m3-emphasized",
        // Điều chỉnh padding-left dựa theo trạng thái sidebar
        isCollapsed ? "pl-20" : "pl-20 lg:pl-64"
      )}
    >
      {children}
    </main>
  );
}
