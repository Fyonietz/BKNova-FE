// src/config/sidebar.ts
import {
  LayoutDashboard,
  Users,
  LineChart,
  Wallet,
  TrendingUp,
  School,
  GraduationCap,
  UserCheck,
  Calendars,
  Binoculars,
  HistoryIcon,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface SidebarItem {
  label: string;
  path?: string;         // omit if this item only expands children
  icon: LucideIcon;
  children?: SidebarItem[];
}

export const sidebarItems: SidebarItem[] = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  {
    label: 'Instrumen',
    icon: LineChart,
    children: [
      { label: 'AUM', path: '/dashboard/instrumen/aum', icon: Wallet },
      { label: 'NAV', path: '/dashboard/instrumen/nav', icon: TrendingUp },
    ],
  },
  {
    label: 'Users',
    icon: Users,
    children: [
      { label: 'Siswa', path: '/admin/dashboard/users/siswa', icon: GraduationCap },
      { label: 'Wali Murid', path: '/admin/dashboard/users/wali-murid', icon: Users },
      { label: 'Guru BK', path: '/admin/dashboard/users/guru-bk', icon: UserCheck },
      { label: 'Riwayat Kelas Siswa', path: '/admin/dashboard/users/riwayat-kelas-siswa', icon: HistoryIcon },
    ],
  },
  {
    label: 'Academics',
    icon: School,
    children: [
      { label: 'Tahun Ajaran', path: '/admin/dashboard/academics/tahun-ajaran', icon: Calendars },
      { label: 'Jurusan', path: '/admin/dashboard/academics/jurusan', icon: Binoculars },
      { label: 'Kelas', path: '/admin/dashboard/academics/kelas', icon: School },
    ],
  },
];
