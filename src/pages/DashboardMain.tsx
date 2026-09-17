// src/pages/DashboardMain.tsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, ApiError } from '@/lib/api';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import {
  GraduationCap,
  UserCheck,
  School,
  Calendar,
  Binoculars,
  ArrowRight,
  Check,
  ShieldCheck,
  Sparkles,
  Info,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ─────────────────────────────────────────────
// 1. STAT ENDPOINTS
// ─────────────────────────────────────────────
async function fetchCounts() {
  const [siswa, guruBk, kelas, jurusan, tahunAjaran] = await Promise.all([
    api.get<unknown[]>('/api/v1/siswa').catch(() => []),
    api.get<unknown[]>('/api/v1/bk').catch(() => []),
    api.get<unknown[]>('/api/v1/kelas').catch(() => []),
    api.get<unknown[]>('/api/v1/jurusan').catch(() => []),
    api.get<unknown[]>('/api/v1/tahun-ajaran').catch(() => []),
  ]);
  return {
    siswa: siswa.length,
    guruBk: guruBk.length,
    kelas: kelas.length,
    jurusan: jurusan.length,
    tahunAjaran: tahunAjaran.length,
  };
}

const quickActions = [
  {
    label: 'Manajemen Siswa',
    description: 'Tambah satuan atau import Excel',
    path: '/admin/dashboard/users/siswa',
    icon: GraduationCap,
  },
  {
    label: 'Manajemen Guru',
    description: 'Kelola akun & penugasan kelas',
    path: '/admin/dashboard/users/guru-bk',
    icon: UserCheck,
  },
  {
    label: 'Data Kelas',
    description: 'Atur angkatan & kelompok kelas',
    path: '/admin/dashboard/academics/kelas',
    icon: School,
  },
  {
    label: 'Jurusan',
    description: 'Kelola Data Jurusan',
    path: '/admin/dashboard/academics/jurusan',
    icon: Binoculars,
  },
];

export default function DashboardMain() {
  const [counts, setCounts] = useState({
    siswa: 0,
    guruBk: 0,
    kelas: 0,
    jurusan: 0,
    tahunAjaran: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCounts()
      .then(setCounts)
      .catch((err) => setError(err instanceof ApiError ? err.message : 'Failed to load data.'))
      .finally(() => setIsLoading(false));
  }, []);

  const stats = [
    { label: 'Total Siswa', value: counts.siswa, icon: GraduationCap, path: '/admin/dashboard/users/siswa' },
    { label: 'Total Guru / Pembimbing', value: counts.guruBk, icon: UserCheck, path: '/admin/dashboard/users/guru-bk' },
    { label: 'Jumlah Kelas', value: counts.kelas, icon: School, path: '/admin/dashboard/academics/kelas' },
    { label: 'Total Kegiatan', value: 1, icon: Calendar, path: '/admin/dashboard/academics/jurusan' },
  ];

  // ─────────────────────────────────────────────
  // Dynamic setup flow based on real backend count data
  // ─────────────────────────────────────────────
  const setupSteps = [
    {
      step: 1,
      label: 'Tahun Ajaran',
      path: '/admin/dashboard/academics/tahun-ajaran',
      done: counts.tahunAjaran > 0,
      icon: Calendar,
    },
    {
      step: 2,
      label: 'Jurusan',
      path: '/admin/dashboard/academics/jurusan',
      done: counts.jurusan > 0,
      icon: Binoculars,
    },
    {
      step: 3,
      label: 'Kelas',
      path: '/admin/dashboard/academics/kelas',
      done: counts.kelas > 0,
      icon: School,
    },
    {
      step: 4,
      label: 'Guru BK',
      path: '/admin/dashboard/users/guru-bk',
      done: counts.guruBk > 0,
      icon: UserCheck,
    },
  ];

  return (
    <div className="flex flex-col gap-6 pb-6">
      {error && (
        <div className="rounded-md bg-destructive/10 px-3 py-1.5 text-xs text-destructive shrink-0">
          {error}
        </div>
      )}

      {/* Prominent Welcome Banner (Compact) */}
      <div className="relative overflow-hidden rounded-xl bg-primary px-6 py-4 text-primary-foreground shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1 z-10">
          <div className="inline-flex items-center gap-1 rounded-full bg-primary-foreground/10 px-2.5 py-0.5 text-[11px] font-medium border border-primary-foreground/20">
            <ShieldCheck className="h-3 w-3" />
            <span>Administrator Panel</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
            Selamat Datang, Admin!
          </h1>
          <p className="text-xs text-primary-foreground/80 max-w-xl">
            Kelola data satuan pendidikan, pemantauan kegiatan Bimbingan Konseling, dan manajemen pengguna secara terpusat.
          </p>
        </div>

        {/* Status Sistem Badge */}
        <div className="z-10 shrink-0 self-start sm:self-auto">
          <div className="flex items-center gap-2.5 rounded-lg bg-card/10 px-3.5 py-2 backdrop-blur-md border border-primary-foreground/15">
            <div className="space-y-0.5">
              <div className="text-[9px] uppercase tracking-wider text-primary-foreground/70 font-semibold">
                Status Sistem
              </div>
              <div className="text-xs font-semibold flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                Online & Terhubung
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stat Cards Grid (Mobile: 1 col, Tablet: 2 cols, Desktop: 4 cols) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((stat) => (
          <Link key={stat.label} to={stat.path} className="block group">
            <Card className="transition-all hover:shadow-sm py-1 h-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 pt-3 px-4">
                <div className="p-1.5 rounded-md bg-primary/10 text-primary">
                  <stat.icon className="h-3.5 w-3.5" />
                </div>
                <span className="text-[11px] font-medium text-muted-foreground flex items-center gap-0.5 group-hover:text-primary transition-colors">
                  Kelola <ArrowRight className="h-2.5 w-2.5" />
                </span>
              </CardHeader>
              <CardContent className="px-4 pb-3">
                <div className="text-[11px] font-medium text-muted-foreground">{stat.label}</div>
                <div className="text-xl font-bold mt-0.5">{isLoading ? '—' : stat.value}</div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Main Content Grid: Quick Actions & Live Setup Flow */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Aksi & Pintasan Cepat (2 Columns) */}
        <div className="lg:col-span-2">
          <Card className="h-full flex flex-col">
            <CardHeader className="py-3 px-4">
              <CardTitle className="text-sm font-semibold">Aksi & Pintasan Cepat</CardTitle>
              <p className="text-[11px] text-muted-foreground">
                Pilih menu di bawah untuk langsung menuju ke halaman pengelolaan data.
              </p>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3 px-4 pb-4">
              {quickActions.map((action) => (
                <Link
                  key={action.path}
                  to={action.path}
                  className="group flex flex-col justify-between rounded-lg border bg-card p-3 transition-all hover:border-primary/50 hover:shadow-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold group-hover:text-primary transition-colors">
                        {action.label}
                      </span>
                      <ArrowRight className="h-3.5 w-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-tight">{action.description}</p>
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Dynamic Setup Flow Guide (1 Column) */}
        <div>
          <Card className="h-full flex flex-col border-primary/20 bg-gradient-to-br from-primary/5 via-card to-card shadow-xs">
            <CardHeader className="py-3 px-4">
              <div className="flex items-center gap-1.5">
                <div className="p-1 rounded bg-primary text-primary-foreground">
                  <Sparkles className="h-3 w-3" />
                </div>
                <CardTitle className="text-xs font-semibold">Panduan Setup Akademik</CardTitle>
              </div>
              <p className="text-[10px] text-muted-foreground">
                Urutan: Tahun Ajaran → Jurusan → Kelas → Guru BK
              </p>
            </CardHeader>
            <CardContent className="space-y-2 px-4 pb-4">
              {setupSteps.map((s, idx) => (
                <Link
                  key={s.step}
                  to={s.path}
                  className={cn(
                    'group flex items-center justify-between rounded-lg border bg-card px-3 py-2 transition-all hover:border-primary/50',
                    s.done && 'border-emerald-500/30 bg-emerald-500/[0.02]'
                  )}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={cn(
                        'flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold transition-all',
                        s.done
                          ? 'bg-emerald-600 text-white'
                          : 'bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground'
                      )}
                    >
                      {s.done ? <Check className="h-3 w-3" /> : `0${s.step}`}
                    </div>
                    <span className="text-xs font-medium truncate group-hover:text-primary transition-colors">
                      {s.label}
                    </span>
                  </div>
                  <span className={cn(
                    'text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0',
                    s.done ? 'bg-emerald-500/10 text-emerald-600' : 'bg-muted text-muted-foreground'
                  )}>
                    {s.done ? 'Selesai' : 'Belum'}
                  </span>
                </Link>
              ))}
            </CardContent>

            {/* Compact Admin Tip */}
            <div className="p-2.5 mx-4 mb-4 rounded-lg bg-primary/5 border border-primary/10 text-[10px] space-y-0.5 mt-auto">
              <div className="font-semibold text-primary flex items-center gap-1">
                <Info className="h-3 w-3" />
                Tips Admin
              </div>
              <p className="text-muted-foreground leading-tight">
                Gunakan fitur <span className="font-medium text-foreground">Import Excel</span> pada menu Siswa untuk pendaftaran masal.
              </p>
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
}
