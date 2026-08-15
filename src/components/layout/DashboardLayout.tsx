// src/components/layout/DashboardLayout.tsx
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function DashboardLayout() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 items-center justify-between border-b bg-card px-6">
          <h1 className="text-lg font-semibold">Dashboard</h1>
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
