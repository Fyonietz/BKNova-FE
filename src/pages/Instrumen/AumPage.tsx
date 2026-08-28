// src/pages/Instrumen/AumPage.tsx
import { useEffect, useMemo, useState } from 'react';
import { api, ApiError } from '@/lib/api';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { ChevronDown, ListChecks } from 'lucide-react';
import { cn } from '@/lib/utils';

// ─────────────────────────────────────────────
// 1. ENTITY SHAPES — matches your actual API response
// ─────────────────────────────────────────────
interface BidangMasalah {
  id: number;
  kode: string;
  nama: string;
}

interface SoalMasalah {
  id: number;
  kode: string;
  bidangMasalah: string; // this is the bidang's NAME, not an id
  pertanyaan: string;
}

export default function AumPage() {
  const [bidang, setBidang] = useState<BidangMasalah[]>([]);
  const [soal, setSoal] = useState<SoalMasalah[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openKode, setOpenKode] = useState<string | null>(null);

  // ───────────────────────────────────────
  // 2. FETCH BOTH LISTS — adjust endpoints
  // ───────────────────────────────────────
  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [bidangData, soalData] = await Promise.all([
        api.get<BidangMasalah[]>('/api/v1/bidang-masalah'),
        api.get<SoalMasalah[]>('/api/v1/soal-masalah'),
      ]);
      setBidang(bidangData);
      setSoal(soalData);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to load AUM data.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ───────────────────────────────────────
  // 3. GROUP soal BY kode (each bidang gets its own list)
  // ───────────────────────────────────────
  const soalByKode = useMemo(() => {
    const map = new Map<string, SoalMasalah[]>();
    for (const s of soal) {
      if (!map.has(s.kode)) map.set(s.kode, []);
      map.get(s.kode)!.push(s);
    }
    return map;
  }, [soal]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">AUM</h2>
        <p className="text-sm text-muted-foreground">
          Alat Ungkap Masalah — grouped by bidang masalah.
        </p>
      </div>

      {error && (
        <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Overview stat cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Bidang
            </CardTitle>
            <ListChecks className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bidang.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Soal
            </CardTitle>
            <ListChecks className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{soal.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Per-bidang expandable sections */}
      {isLoading ? (
        <div className="py-10 text-center text-sm text-muted-foreground">Loading...</div>
      ) : (
        <div className="space-y-3">
          {bidang.map((b) => {
            const items = soalByKode.get(b.kode) ?? [];
            const isOpen = openKode === b.kode;

            return (
              <Card key={b.id}>
                <button
                  onClick={() => setOpenKode(isOpen ? null : b.kode)}
                  className="flex w-full items-center justify-between px-6 py-4 text-left"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-xs font-semibold text-primary">
                      {b.kode}
                    </span>
                    <div>
                      <div className="font-medium">{b.nama}</div>
                      <div className="text-xs text-muted-foreground">
                        {items.length} pertanyaan
                      </div>
                    </div>
                  </div>
                  <ChevronDown
                    className={cn('h-4 w-4 text-muted-foreground transition-transform', isOpen && 'rotate-180')}
                  />
                </button>

                {isOpen && (
                  <CardContent className="border-t pt-4">
                    {items.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No soal found.</p>
                    ) : (
                      <ol className="space-y-2 text-sm">
                        {items.map((item, idx) => (
                          <li key={item.id} className="flex gap-2">
                            <span className="text-muted-foreground">{idx + 1}.</span>
                            <span>{item.pertanyaan}</span>
                          </li>
                        ))}
                      </ol>
                    )}
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
