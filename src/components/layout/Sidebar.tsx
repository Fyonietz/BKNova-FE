import { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { ChevronDown, LogOut, X } from 'lucide-react';
import { sidebarItems, type SidebarItem } from '@/config/sidebar';
import { cn } from '@/lib/utils';

interface SidebarProps {
  onClose?: () => void;
  open?: boolean;
}

function SidebarLink({ item, nested = false, onClose }: { item: SidebarItem; nested?: boolean; onClose?: () => void }) {
  return (
    <NavLink
      to={item.path || '#'}
      end
      onClick={onClose}
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

function SidebarGroup({ item, onClose }: { item: SidebarItem; onClose?: () => void }) {
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
          {item.children!.map((child, index) => (
            // Fallback to label or index if path is undefined
            <SidebarLink key={child.label || child.path || index} item={child} nested onClose={onClose} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function Sidebar({ onClose, open }: SidebarProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    navigate('/login', { replace: true });
  };

  // Desktop sidebar (visible on large screens)
  const DesktopSidebar = (
    <div className="hidden lg:flex h-full w-64 flex-col border-r bg-card shadow-sm">
      <div className="flex h-16 items-center justify-between border-b px-6">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">B</div>
          <span className="font-semibold">BK Nova</span>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {sidebarItems.map((item, index) =>
          item.children ? (
            <SidebarGroup key={item.label || index} item={item} onClose={onClose} />
          ) : (
            <SidebarLink key={item.label || item.path || index} item={item} onClose={onClose} />
          )
        )}
      </nav>

      <div className="border-t p-3">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </div>
  );

  // Mobile / overlay sidebar when `open` is true
  const MobileSidebar = open ? (
    <div className="fixed inset-0 z-50 flex">
      <div className="fixed inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-50 w-72 h-full flex flex-col border-r bg-card shadow-lg">
        <div className="flex h-16 items-center justify-between border-b px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">B</div>
            <span className="font-semibold">BK Nova</span>
          </div>
          {onClose && (
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {sidebarItems.map((item, index) =>
            item.children ? (
              <SidebarGroup key={item.label || index} item={item} onClose={onClose} />
            ) : (
              <SidebarLink key={item.label || item.path || index} item={item} onClose={onClose} />
            )
          )}
        </nav>

        <div className="border-t p-3">
          <button
            onClick={() => {
              handleLogout();
              onClose?.();
            }}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <>
      {MobileSidebar}
      {DesktopSidebar}
    </>
  );
}
