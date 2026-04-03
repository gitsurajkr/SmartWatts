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
    <div className="h-screen bg-background text-foreground overflow-hidden flex flex-col relative">
      {/* Ambient mesh gradient background */}
      <div className="fixed inset-0 mesh-bg pointer-events-none z-0" />

      {/* Top Navbar */}
      <div className="flex-shrink-0 relative z-20">{topbar}</div>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden relative z-10">
        {/* Desktop Sidebar — animated slide */}
        <div
          className={`hidden md:block overflow-y-auto transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] border-r border-border ${
            sidebarOpen ? 'w-64 opacity-100' : 'w-0 opacity-0 overflow-hidden'
          }`}
          style={{ backgroundColor: 'var(--sidebar)' }}
        >
          <div className="w-64 glass-strong h-full">
            {sidebar}
          </div>
        </div>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-30 md:hidden">
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
              onClick={onCloseSidebar}
            />
            <div className="relative w-64 h-full glass-strong overflow-y-auto z-10 animate-slide-in-left shadow-2xl">
              {sidebar}
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 md:p-8 max-w-[1600px] mx-auto">{children}</div>
        </div>
      </div>
    </div>
  );
}
