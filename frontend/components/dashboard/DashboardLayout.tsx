import React, { ReactNode } from 'react';

interface DashboardLayoutProps {
  sidebar: ReactNode;
  topbar: ReactNode;
  children: ReactNode;
  sidebarOpen: boolean;
  onCloseSidebar?: () => void;
}

export default function DashboardLayout({
  sidebar,
  topbar,
  children,
  sidebarOpen,
  onCloseSidebar,
}: DashboardLayoutProps) {
  return (
    <div className="h-screen bg-background text-foreground overflow-hidden flex flex-col">
      {/* Top Navbar */}
      <div className="flex-shrink-0">{topbar}</div>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar */}
        {sidebarOpen && (
          <div className="w-64 bg-card border-r border-border overflow-y-auto hidden md:block">
            {sidebar}
          </div>
        )}

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-30 md:hidden">
            <div className="absolute inset-0 bg-black/50" onClick={onCloseSidebar} />
            <div className="relative w-64 h-full bg-card border-r border-border overflow-y-auto z-10">
              {sidebar}
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 md:p-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
