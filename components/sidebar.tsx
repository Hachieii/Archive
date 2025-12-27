"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { BookOpen, Flag, User, ChevronLeft, ChevronRight } from "lucide-react";
import { useSidebar } from "./sidebar-context";
import { Button } from "@/components/ui/button";

const navItems = [
  { name: "Profile", href: "/", icon: User },
  { name: "CTF Writeups", href: "/ctf-writeup", icon: Flag },
  { name: "Learning Notes", href: "/notes", icon: BookOpen },
];

export function Sidebar() {
  const pathname = usePathname();
  const { isCollapsed, toggleSidebar } = useSidebar();

  return (
    <aside
      className={cn(
        "fixed top-0 left-0 z-50 h-screen flex flex-col border-r border-border/40 bg-background/60 backdrop-blur-xl transition-[width] duration-300 ease-m3-emphasized overflow-hidden",
        isCollapsed ? "w-20" : "w-80"
      )}
    >
      {/* 1. Header Area */}
      <div className="flex h-24 items-center relative flex-shrink-0 px-2">
        {/* Logo Text 
            - Thay left-20 thành left-16 (để khớp với độ rộng icon slot mới)
            - Thêm pl-2 để căn chỉnh với padding của Nav
        */}
        <div
          className={cn(
            "font-brand font-bold text-2xl text-primary tracking-tighter whitespace-nowrap transition-all duration-300 absolute left-16 pl-4",
            isCollapsed
              ? "opacity-0 -translate-x-4"
              : "opacity-100 translate-x-0"
          )}
        >
          Hachieii.
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className={cn(
            "absolute rounded-full h-8 w-8 bg-background/50 text-muted-foreground hover:text-foreground transition-all duration-300 z-50",
            isCollapsed ? "left-1/2 -translate-x-1/2 top-8" : "right-4"
          )}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* 2. Nav Items */}
      {/* UPDATE: Giảm px-3 xuống px-2 để chừa chỗ cho Icon Slot */}
      <nav className="flex-1 px-2 space-y-2 mt-2 overflow-y-auto overflow-x-hidden">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              title={isCollapsed ? item.name : ""}
              className={cn(
                // Base Styles
                "group flex items-center h-12 relative rounded-full overflow-hidden transition-all duration-300 ease-m3-emphasized",

                // Active Styles
                isActive
                  ? "bg-primary/15 text-primary shadow-none font-bold"
                  : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground font-medium"
              )}
            >
              {/* === UPDATE: ICON SLOT SIZE === 
                  - Đổi từ w-20 (80px) xuống w-16 (64px).
                  - Lý do: 64px (Slot) + 16px (Nav Padding trái phải) = 80px (Sidebar Width).
                  -> Icon sẽ nằm CHÍNH GIỮA tuyệt đối.
              */}
              <div className="w-16 shrink-0 flex items-center justify-center">
                <Icon
                  className={cn(
                    "w-5 h-5 transition-transform duration-300", // Icon nhỏ lại xíu (w-5) cho cân đối với slot w-16
                    isActive && "fill-current scale-105",
                    !isActive && "group-hover:scale-110"
                  )}
                />
              </div>

              {/* Text Label */}
              <div
                className={cn(
                  "overflow-hidden transition-all duration-500 ease-m3-emphasized",
                  // Update width cho khớp
                  isCollapsed ? "w-0" : "w-40"
                )}
              >
                <span
                  className={cn(
                    "block text-sm tracking-wide whitespace-nowrap transition-all ease-m3-emphasized pl-1", // Thêm pl-1 để tách nhẹ khỏi icon
                    isCollapsed
                      ? "duration-100 opacity-0 -translate-x-4"
                      : "duration-300 opacity-100 translate-x-0 delay-75"
                  )}
                >
                  {item.name}
                </span>
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="pb-8" />
    </aside>
  );
}
