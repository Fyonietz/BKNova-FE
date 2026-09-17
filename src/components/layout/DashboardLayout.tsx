// src/components/layout/DashboardLayout.tsx
import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import { Menu } from 'lucide-react';
import Sidebar from './Sidebar';

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="flex h-screen bg-background">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 items-center justify-between border-b bg-card px-6">
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(true)}
              className="mr-3 inline-flex items-center rounded-md p-2 text-muted-foreground hover:bg-accent/10 md:hidden"
              aria-label="Open sidebar"
            >
              <Menu className="h-5 w-5" />
            </button>
            <h1 className="text-lg font-semibold">Dashboard</h1>
          </div>
          {/* Add topbar items here: user menu, notifications, etc. */}
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          {/* Nested route pages render here */}
          <Outlet />
        </main>
      </div>
    </div>
  );
}
