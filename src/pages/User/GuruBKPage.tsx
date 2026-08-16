// src/pages/User/GuruBKPage.tsx
import { useEffect, useState } from 'react';
import { api, ApiError } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import DataTable, { type Column } from '@/components/ui/DataTable';
import Modal from '@/components/ui/Modal';
import { Plus, Eye, EyeOff, UserPlus, ClipboardList } from 'lucide-react';

// ─────────────────────────────────────────────
// 1. ENTITY SHAPES
// ─────────────────────────────────────────────
interface BK {
  id: string;
  nama: string;
  role: string;
}

interface KelasOption {
  id: number;
  nama: string;
  jurusan: string;
  tingkat: string;
}

interface TahunAjaranOption {
  id: number;
  nama: string;
  semester: string;
  is_Active: boolean;
}

interface TugasBK {
  id: string;
  id_User_BK: number;
  nama_BK: string;
  id_Kelas: number;
  nama_Kelas: string;
  tingkat: string;
  id_Tahun_Ajaran: number;
  tahunAjaran: string;
  is_Active: boolean;
  assigned_At: string;
}

// ─────────────────────────────────────────────
// 2. TABLE COLUMNS
// ─────────────────────────────────────────────
const bkColumns: Column<BK>[] = [
  { key: 'nama', label: 'Nama' },
  { key: 'role', label: 'Role' },
];

// Menghilangkan kolom nama_BK karena akan digunakan sebagai Group Header
const tugasColumns: Column<TugasBK>[] = [
  {
    key: 'nama_Kelas',
    label: 'Kelas',
    render: (row) => `${row.tingkat} ${row.nama_Kelas}`,
  },
  { key: 'tahunAjaran', label: 'Tahun Ajaran' },
  {
    key: 'is_Active',
    label: 'Status',
    render: (row) => (
      <span
        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
          row.is_Active
            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
            : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
        }`}
      >
        {row.is_Active ? 'Aktif' : 'Nonaktif'}
      </span>
    ),
  },
];

// ─────────────────────────────────────────────
// 3. FORM STATE
// ─────────────────────────────────────────────
interface BKFormState {
  nama: string;
  password: string;
}

const emptyBKForm: BKFormState = {
  nama: '',
  password: '',
};

interface TugasFormState {
  id_User_BK: number | '';
  id_Kelas: number | '';
  id_Tahun_Ajaran: number | '';
}

const emptyTugasForm: TugasFormState = {
  id_User_BK: '',
  id_Kelas: '',
  id_Tahun_Ajaran: '',
};

export default function GuruBKPage() {
  const [bkList, setBkList] = useState<BK[]>([]);
  const [tugasList, setTugasList] = useState<TugasBK[]>([]);
  const [kelasList, setKelasList] = useState<KelasOption[]>([]);
  const [tahunAjaranList, setTahunAjaranList] = useState<TahunAjaranOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Add BK modal
  const [bkModalOpen, setBkModalOpen] = useState(false);
  const [bkForm, setBkForm] = useState<BKFormState>(emptyBKForm);
  const [isSavingBK, setIsSavingBK] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Assign Tugas modal
  const [tugasModalOpen, setTugasModalOpen] = useState(false);
  const [editingTugasId, setEditingTugasId] = useState<string | null>(null);
  const [tugasForm, setTugasForm] = useState<TugasFormState>(emptyTugasForm);
  const [tugasActive, setTugasActive] = useState(true);
  const [isSavingTugas, setIsSavingTugas] = useState(false);

  // ───────────────────────────────────────
  // 4. FETCH DATA
  // ───────────────────────────────────────
  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [bkRes, tugasRes, kelasRes, tahunRes] = await Promise.all([
        api.get<BK[]>('/api/v1/bk'),
        api.get<TugasBK[]>('/api/v1/bk/tugas'),
        api.get<KelasOption[]>('/api/v1/kelas'),
        api.get<TahunAjaranOption[]>('/api/v1/tahun-ajaran'),
      ]);
      setBkList(bkRes);
      setTugasList(tugasRes);
      setKelasList(kelasRes);
      setTahunAjaranList(tahunRes);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to load data.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ───────────────────────────────────────
  // 5. BK MODAL HANDLERS
  // ───────────────────────────────────────
  const openAddBKModal = () => {
    setBkForm(emptyBKForm);
    setShowPassword(false);
    setBkModalOpen(true);
  };

  const handleSubmitBK = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingBK(true);
    setError(null);
    try {
      await api.post('/api/v1/bk', {
        Nama: bkForm.nama,
        Password: bkForm.password,
      });
      setBkModalOpen(false);
      fetchData();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Gagal menambahkan Guru BK.');
    } finally {
      setIsSavingBK(false);
    }
  };

  // ───────────────────────────────────────
  // 6. TUGAS BK MODAL HANDLERS
  // ───────────────────────────────────────
  const openAddTugasModal = () => {
    setEditingTugasId(null);
    setTugasForm(emptyTugasForm);
    setTugasActive(true);
    setTugasModalOpen(true);
  };

  const openEditTugasModal = (row: TugasBK) => {
    setEditingTugasId(row.id);
    setTugasForm({
      id_User_BK: row.id_User_BK,
      id_Kelas: row.id_Kelas,
      id_Tahun_Ajaran: row.id_Tahun_Ajaran,
    });
    setTugasActive(row.is_Active);
    setTugasModalOpen(true);
  };

  const handleSubmitTugas = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingTugas(true);
    setError(null);
    try {
      if (editingTugasId) {
        await api.patch(`/api/v1/bk/tugas/${editingTugasId}`, {
          Id_Kelas: Number(tugasForm.id_Kelas),
          Id_Tahun_Ajaran: Number(tugasForm.id_Tahun_Ajaran),
          Is_Active: tugasActive,
        });
      } else {
        await api.post('/api/v1/bk/tugas', {
          Id_User_BK: Number(tugasForm.id_User_BK),
          Id_Kelas: Number(tugasForm.id_Kelas),
          Id_Tahun_Ajaran: Number(tugasForm.id_Tahun_Ajaran),
          Is_Active: true,
        });
      }
      setTugasModalOpen(false);
      fetchData();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Gagal menyimpan penugasan.');
    } finally {
      setIsSavingTugas(false);
    }
  };

  const handleDeleteTugas = async (row: TugasBK) => {
    if (!confirm(`Hapus penugasan ${row.nama_BK} di kelas ${row.tingkat} ${row.nama_Kelas}?`)) return;
    try {
      await api.delete(`/api/v1/bk/tugas/${row.id}`);
      fetchData();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Gagal menghapus penugasan.');
    }
  };

  // ───────────────────────────────────────
  // 7. DATA GROUPING (Guru BK -> Tugas)
  // ───────────────────────────────────────
  const groupedTugas = tugasList.reduce((acc, curr) => {
    const key = curr.id_User_BK;
    if (!acc[key]) {
      acc[key] = {
        nama_BK: curr.nama_BK,
        tugas: [],
      };
    }
    acc[key].tugas.push(curr);
    return acc;
  }, {} as Record<number, { nama_BK: string; tugas: TugasBK[] }>);


  return (
    <div className="space-y-10">
      {/* ─────────────────────────────────────────────
          SECTION: GURU BK
      ───────────────────────────────────────────── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Guru BK</h2>
            <p className="text-sm text-muted-foreground">Kelola akun guru bimbingan konseling.</p>
          </div>
          <Button onClick={openAddBKModal}>
            <UserPlus className="mr-2 h-4 w-4" />
            Tambah Guru BK
          </Button>
        </div>

        {error && (
          <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </div>
        )}

        <DataTable
          columns={bkColumns}
          data={bkList}
          isLoading={isLoading}
          getRowId={(row) => row.id}
        />
      </div>

      {/* ─────────────────────────────────────────────
          SECTION: PENUGASAN KELAS (GROUPED)
      ───────────────────────────────────────────── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Penugasan Kelas</h2>
            <p className="text-sm text-muted-foreground">
              Tentukan kelas mana yang ditangani setiap guru BK. Guru BK hanya dapat melihat hasil
              AUM dari kelas yang ditugaskan.
            </p>
          </div>
          <Button onClick={openAddTugasModal}>
            <ClipboardList className="mr-2 h-4 w-4" />
            Assign Kelas
          </Button>
        </div>

        {isLoading ? (
          <div className="text-center text-sm text-muted-foreground py-8 border rounded-md">Loading...</div>
        ) : Object.keys(groupedTugas).length === 0 ? (
          <div className="text-center text-sm text-muted-foreground py-8 border rounded-md border-dashed">
            Belum ada penugasan kelas untuk Guru BK.
          </div>
        ) : (
          <div className="space-y-6">
            {Object.values(groupedTugas).map((group) => (
              <div key={group.nama_BK} className="rounded-md border bg-card text-card-foreground shadow-sm">
                <div className="px-4 py-3 border-b bg-muted/30">
                  <h3 className="font-semibold text-base flex items-center gap-2">
                    <UserPlus className="h-4 w-4 text-primary" />
                    {group.nama_BK}
                  </h3>
                </div>
                <div className="p-4">
                  <DataTable
                    columns={tugasColumns}
                    data={group.tugas}
                    isLoading={false}
                    getRowId={(row) => row.id}
                    onEdit={openEditTugasModal}
                    onDelete={handleDeleteTugas}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ─────────────────────────────────────────────
          MODAL: TAMBAH GURU BK
      ───────────────────────────────────────────── */}
      <Modal open={bkModalOpen} onClose={() => setBkModalOpen(false)} title="Tambah Guru BK">
        <form onSubmit={handleSubmitBK} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="bk_nama">Nama</Label>
            <Input
              id="bk_nama"
              value={bkForm.nama}
              onChange={(e) => setBkForm({ ...bkForm, nama: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bk_password">Password</Label>
            <div className="relative">
              <Input
                id="bk_password"
                type={showPassword ? 'text' : 'password'}
                value={bkForm.password}
                onChange={(e) => setBkForm({ ...bkForm, password: e.target.value })}
                required
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <Button type="submit" className="w-full" isLoading={isSavingBK}>
            Simpan
          </Button>
        </form>
      </Modal>

      {/* ─────────────────────────────────────────────
          MODAL: ASSIGN / EDIT PENUGASAN KELAS
      ───────────────────────────────────────────── */}
      <Modal
        open={tugasModalOpen}
        onClose={() => setTugasModalOpen(false)}
        title={editingTugasId ? 'Edit Penugasan' : 'Assign Kelas ke Guru BK'}
      >
        <form onSubmit={handleSubmitTugas} className="space-y-4">
          {!editingTugasId && (
            <div className="space-y-2">
              <Label htmlFor="tugas_bk">Guru BK</Label>
              <select
                id="tugas_bk"
                value={tugasForm.id_User_BK}
                onChange={(e) =>
                  setTugasForm({ ...tugasForm, id_User_BK: Number(e.target.value) })
                }
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                required
              >
                <option value="">-- Pilih Guru BK --</option>
                {bkList.map((bk) => (
                  <option key={bk.id} value={bk.id}>
                    {bk.nama}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="tugas_kelas">Kelas</Label>
            <select
              id="tugas_kelas"
              value={tugasForm.id_Kelas}
              onChange={(e) => setTugasForm({ ...tugasForm, id_Kelas: Number(e.target.value) })}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              required
            >
              <option value="">-- Pilih Kelas --</option>
              {kelasList.map((k) => (
                <option key={k.id} value={k.id}>
                  {k.tingkat} {k.nama} ({k.jurusan})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tugas_tahun">Tahun Ajaran</Label>
            <select
              id="tugas_tahun"
              value={tugasForm.id_Tahun_Ajaran}
              onChange={(e) =>
                setTugasForm({ ...tugasForm, id_Tahun_Ajaran: Number(e.target.value) })
              }
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              required
            >
              <option value="">-- Pilih Tahun Ajaran --</option>
              {tahunAjaranList.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.nama} ({t.semester}) {t.is_Active ? '• Aktif' : ''}
                </option>
              ))}
            </select>
          </div>

          {editingTugasId && (
            <div className="flex items-center gap-2">
              <input
                id="tugas_active"
                type="checkbox"
                checked={tugasActive}
                onChange={(e) => setTugasActive(e.target.checked)}
                className="h-4 w-4 rounded border-input"
              />
              <Label htmlFor="tugas_active" className="cursor-pointer">
                Penugasan aktif
              </Label>
            </div>
          )}

          <Button type="submit" className="w-full" isLoading={isSavingTugas}>
            {editingTugasId ? 'Simpan Perubahan' : 'Assign'}
          </Button>
        </form>
      </Modal>
    </div>
  );
}
