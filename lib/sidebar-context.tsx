"use client";

import React, { createContext, useContext, useState } from "react";

type SidebarContextType = {
  isCollapsed: boolean;
  toggleSidebar: () => void;
};

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({
  children,
  defaultCollapsed = false,
}: {
  children: React.ReactNode;
  defaultCollapsed?: boolean;
}) {
  // Khởi tạo state từ giá trị Server truyền xuống
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  const toggleSidebar = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);

    // CẬP NHẬT TÊN COOKIE: sidebar_collapsed
    // Thêm SameSite=Lax để đảm bảo an toàn và lưu ổn định hơn
    document.cookie = `sidebar_collapsed=${newState}; path=/; max-age=31536000; SameSite=Lax`;
  };

  return (
    <SidebarContext.Provider value={{ isCollapsed, toggleSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}
