"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  BookOpen,
  Flag,
  User,
  PanelLeftClose,
  PanelLeftOpen,
  Menu,
  X,
} from "lucide-react";
import { useSidebar } from "@/lib/sidebar-context";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { name: "Profile", href: "/", icon: User },
  { name: "CTF Writeups", href: "/ctf-writeup", icon: Flag },
  { name: "Learning Notes", href: "/notes", icon: BookOpen },
];

export function Sidebar() {
  const pathname = usePathname();
  const { isCollapsed, toggleSidebar } = useSidebar();

  const [isMobile, setIsMobile] = useState(false);
  const [openMobile, setOpenMobile] = useState(false);

  // Logic Mobile Check
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const SidebarContent = ({ mobileMode = false }: { mobileMode?: boolean }) => (
    <div className="flex flex-col h-full w-full py-4">
      {/* HEADER */}
      <div className="flex h-12 items-center relative shrink-0 px-2 mb-4">
        {/* Logo */}
        <div
          className={cn(
            "font-brand font-bold text-2xl text-primary tracking-tighter whitespace-nowrap transition-all duration-300 ease-[cubic-bezier(0.2,0.0,0,1.0)] absolute left-16 pl-4",
            !mobileMode && isCollapsed
              ? "opacity-0 -translate-x-2 pointer-events-none"
              : "opacity-100 translate-x-0"
          )}
        >
          Hachieii.
        </div>

        {/* Desktop Toggle Button */}
        {!mobileMode && (
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className={cn(
              "absolute rounded-full h-8 w-8 text-muted-foreground hover:text-foreground transition-all duration-300 ease-[cubic-bezier(0.2,0.0,0,1.0)] z-50",
              isCollapsed ? "left-1/2 -translate-x-1/2" : "right-2"
            )}
          >
            {isCollapsed ? (
              <PanelLeftOpen className="h-5 w-5" />
            ) : (
              <PanelLeftClose className="h-5 w-5" />
            )}
          </Button>
        )}

        {/* Mobile Close Button */}
        {mobileMode && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setOpenMobile(false)}
            className="absolute right-2 rounded-full h-8 w-8 text-muted-foreground hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>

      {/* NAV ITEMS */}
      <nav className="flex-1 px-2 space-y-1 overflow-y-auto overflow-x-hidden">
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => mobileMode && setOpenMobile(false)}
              title={!mobileMode && isCollapsed ? item.name : ""}
              className={cn(
                // Base styles
                "group flex items-center h-12 relative rounded-full transition-all duration-200",
                // Hover effect (chỉ khi không active)
                !isActive && "hover:bg-foreground/5",
                // Click Effect: Nhấn xuống sẽ co lại (active:scale-95) -> Tạo cảm giác mượt mà vật lý
                "active:scale-95",
                // Text colors
                isActive
                  ? "text-primary font-bold"
                  : "text-muted-foreground hover:text-foreground font-medium"
              )}
            >
              {/* --- STATIC ACTIVE PILL (GIẢI PHÁP ỔN ĐỊNH NHẤT) --- */}
              {/* Thay vì animate, chúng ta chỉ render nó ra ngay lập tức.
                  Điều này đảm bảo khi reload trang, nó "đã ở đó" rồi, không bị pop-in.
              */}
              {isActive && (
                <div className="absolute inset-0 bg-primary/15 rounded-full z-0" />
              )}
              {/* -------------------------------------------------- */}

              {/* ICON */}
              <div className="w-16 shrink-0 flex items-center justify-center h-full relative z-10">
                <Icon
                  className={cn(
                    "w-5 h-5 transition-transform duration-300",
                    isActive && "fill-current scale-105",
                    !isActive && "group-hover:scale-110"
                  )}
                />
              </div>

              {/* TEXT */}
              <div
                className={cn(
                  "overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.2,0.0,0,1.0)] flex items-center relative z-10",
                  mobileMode || !isCollapsed
                    ? "w-40 opacity-100"
                    : "w-0 opacity-0"
                )}
              >
                <span className="block text-sm tracking-wide whitespace-nowrap pl-2">
                  {item.name}
                </span>
              </div>
            </Link>
          );
        })}
      </nav>
    </div>
  );

  return (
    <>
      {/* MOBILE DRAWER */}
      <div className="lg:hidden">
        <div className="fixed top-4 left-4 z-50">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setOpenMobile(true)}
            className="bg-background/80 backdrop-blur-md shadow-sm border-primary/20 h-10 w-10 rounded-full"
          >
            <Menu className="w-5 h-5" />
          </Button>
        </div>

        <AnimatePresence>
          {openMobile && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setOpenMobile(false)}
                className="fixed inset-0 bg-black/60 z-[60] backdrop-blur-sm"
              />
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed top-0 left-0 bottom-0 w-72 bg-background/95 backdrop-blur-xl border-r border-border/40 z-[70] shadow-2xl"
              >
                <SidebarContent mobileMode={true} />
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* DESKTOP SIDEBAR */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-screen flex-col border-r border-border/40 bg-background/60 backdrop-blur-xl overflow-hidden hidden lg:flex",
          "transition-[width] duration-300 ease-[cubic-bezier(0.2,0.0,0,1.0)]",
          isCollapsed ? "w-20" : "w-64"
        )}
      >
        <SidebarContent mobileMode={false} />
      </aside>
    </>
  );
}
