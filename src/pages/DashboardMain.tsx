// src/pages/DashboardMain.tsx
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Users, Wallet, TrendingUp, FileText } from 'lucide-react';

// ─────────────────────────────────────────────
// Replace with real data from your API (e.g. fetch in useEffect,
// or React Query later). This is just placeholder structure.
// ─────────────────────────────────────────────
const stats = [
  { label: 'Total Users', value: '1,204', icon: Users },
  { label: 'AUM', value: 'Rp 4.2M', icon: Wallet },
  { label: 'NAV Growth', value: '+3.8%', icon: TrendingUp },
  { label: 'Reports', value: '38', icon: FileText },
];

export default function DashboardMain() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Overview</h2>
        <p className="text-sm text-muted-foreground">Summary of your data at a glance.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add charts, tables, or recent activity below as needed */}
    </div>
  );
}
