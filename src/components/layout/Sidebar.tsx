// src/components/layout/Sidebar.tsx
import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { sidebarItems, type SidebarItem } from '@/config/sidebar';
import { cn } from '@/lib/utils';

function SidebarLink({ item, nested = false }: { item: SidebarItem; nested?: boolean }) {
  return (
    <NavLink
      to={item.path!}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
          nested && 'pl-9',
          isActive
            ? 'bg-primary text-primary-foreground'
            : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
        )
      }
    >
      <item.icon className="h-4 w-4" />
      {item.label}
    </NavLink>
  );
}

function SidebarGroup({ item }: { item: SidebarItem }) {
  const location = useLocation();
  const hasActiveChild = item.children?.some((c) => c.path === location.pathname);
  const [open, setOpen] = useState(!!hasActiveChild);

  return (
    <div>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
          hasActiveChild
            ? 'text-primary'
            : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
        )}
      >
        <item.icon className="h-4 w-4" />
        <span className="flex-1 text-left">{item.label}</span>
        <ChevronDown className={cn('h-4 w-4 transition-transform', open && 'rotate-180')} />
      </button>
      {open && (
        <div className="mt-1 space-y-1">
          {item.children!.map((child) => (
            <SidebarLink key={child.path} item={child} nested />
          ))}
        </div>
      )}
    </div>
  );
}

export default function Sidebar() {
  return (
    <aside className="flex h-screen w-64 flex-col border-r bg-card">
      <div className="flex h-16 items-center gap-2 border-b px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
          B
        </div>
        <span className="font-semibold">BK Nova</span>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {sidebarItems.map((item) =>
          item.children ? (
            <SidebarGroup key={item.label} item={item} />
          ) : (
            <SidebarLink key={item.path} item={item} />
          )
        )}
      </nav>
    </aside>
  );
}
