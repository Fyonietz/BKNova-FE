// src/pages/User/RiwayatKelasSiswaPage.tsx
import { useEffect, useState } from 'react';
import { api, ApiError } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Label } from '@/components/ui/Label';
import DataTable, { type Column } from '@/components/ui/DataTable';
import Modal from '@/components/ui/Modal';
import { Plus, ArrowUpCircle } from 'lucide-react';

// ─────────────────────────────────────────────
// 1. ENTITY SHAPES
// ─────────────────────────────────────────────
interface RiwayatKelasSiswa {
  id: string;
  id_User: number;
  nama_Siswa: string;
  id_Kelas: number;
  nama_Kelas: string;
  id_Tahun_Ajaran: number;
  is_Active: boolean;
}

interface SiswaOption {
  id: string; // ini Id_User siswa
  nama: string;
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

// ─────────────────────────────────────────────
// 2. TABLE COLUMNS
// ─────────────────────────────────────────────
const columns: Column<RiwayatKelasSiswa>[] = [
  { key: 'nama_Siswa', label: 'Nama Siswa' },
  { key: 'nama_Kelas', label: 'Kelas' },
  { key: 'id_Tahun_Ajaran', label: 'Tahun Ajaran' },
  {
    key: 'is_Active',
    label: 'Status',
    render: (row) => (row.is_Active ? 'Aktif' : 'Riwayat'),
  },
];

// ─────────────────────────────────────────────
// 3. FORM STATE
// ─────────────────────────────────────────────
interface RiwayatFormState {
  id_User: number | '';
  id_Kelas: number | '';
  id_Tahun_Ajaran: number | '';
  is_Active: boolean;
}

const emptyForm: RiwayatFormState = {
  id_User: '',
  id_Kelas: '',
  id_Tahun_Ajaran: '',
  is_Active: true,
};

// ─────────────────────────────────────────────
// 4. PROMOTE FORM STATE
// ─────────────────────────────────────────────
interface PromoteFormState {
  id_Kelas_Lama: number | '';
  id_Tahun_Ajaran_Baru: number | '';
}

const emptyPromoteForm: PromoteFormState = {
  id_Kelas_Lama: '',
  id_Tahun_Ajaran_Baru: '',
};

export default function RiwayatKelasSiswaPage() {
  const [riwayat, setRiwayat] = useState<RiwayatKelasSiswa[]>([]);
  const [siswaList, setSiswaList] = useState<SiswaOption[]>([]);
  const [kelasList, setKelasList] = useState<KelasOption[]>([]);
  const [tahunAjaranList, setTahunAjaranList] = useState<TahunAjaranOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Add/Edit modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<RiwayatFormState>(emptyForm);
  const [isSaving, setIsSaving] = useState(false);

  // Promote modal
  const [promoteModalOpen, setPromoteModalOpen] = useState(false);
  const [promoteForm, setPromoteForm] = useState<PromoteFormState>(emptyPromoteForm);
  const [isPromoting, setIsPromoting] = useState(false);
  const [promoteMessage, setPromoteMessage] = useState<string | null>(null);
  const [promoteSuccess, setPromoteSuccess] = useState(false);

  // ───────────────────────────────────────
  // 5. FETCH DATA
  // ───────────────────────────────────────
  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [riwayatRes, siswaRes, kelasRes, tahunRes] = await Promise.all([
        api.get<RiwayatKelasSiswa[]>('/api/v1/riwayat-kelas-siswa'),
        api.get<SiswaOption[]>('/api/v1/siswa'),
        api.get<KelasOption[]>('/api/v1/kelas'),
        api.get<TahunAjaranOption[]>('/api/v1/tahun-ajaran'),
      ]);
      setRiwayat(riwayatRes);
      setSiswaList(siswaRes);
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
  // 6. ADD/EDIT MODAL HANDLERS
  // ───────────────────────────────────────
  const openAddModal = () => {
    setEditingId(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEditModal = (row: RiwayatKelasSiswa) => {
    setEditingId(row.id);
    setForm({
      id_User: row.id_User,
      id_Kelas: row.id_Kelas,
      id_Tahun_Ajaran: row.id_Tahun_Ajaran,
      is_Active: row.is_Active,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      if (editingId) {
        await api.patch(`/api/v1/riwayat-kelas-siswa/${editingId}`, {
          Id_Kelas: Number(form.id_Kelas),
          Id_Tahun_Ajaran: Number(form.id_Tahun_Ajaran),
          Is_Active: form.is_Active,
        });
      } else {
        await api.post('/api/v1/riwayat-kelas-siswa', {
          Id_User: Number(form.id_User),
          Id_Kelas: Number(form.id_Kelas),
          Id_Tahun_Ajaran: Number(form.id_Tahun_Ajaran),
          Is_Active: form.is_Active,
        });
      }
      setModalOpen(false);
      fetchData();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to save riwayat.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (row: RiwayatKelasSiswa) => {
    if (!confirm(`Hapus riwayat kelas ${row.nama_Siswa} di ${row.nama_Kelas}?`)) return;
    try {
      await api.delete(`/api/v1/riwayat-kelas-siswa/${row.id}`);
      fetchData();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to delete riwayat.');
    }
  };

  // ───────────────────────────────────────
  // 7. PROMOTE HANDLERS
  // ───────────────────────────────────────
  const openPromoteModal = () => {
    setPromoteForm(emptyPromoteForm);
    setPromoteMessage(null);
    setPromoteSuccess(false);
    setPromoteModalOpen(true);
  };

  const closePromoteModal = () => {
    setPromoteModalOpen(false);
    setPromoteForm(emptyPromoteForm);
    setPromoteMessage(null);
    setPromoteSuccess(false);
  };

  const handlePromote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoteForm.id_Kelas_Lama || !promoteForm.id_Tahun_Ajaran_Baru) return;

    setIsPromoting(true);
    setPromoteMessage(null);
    try {
      const res = await api.post<{ message: string }>('/api/v1/riwayat-kelas-siswa/promote-kelas', {
        Id_Kelas_Lama: Number(promoteForm.id_Kelas_Lama),
        Id_Tahun_Ajaran_Baru: Number(promoteForm.id_Tahun_Ajaran_Baru),
      });
      setPromoteMessage(res.message);
      setPromoteSuccess(true);
      fetchData();
    } catch (err) {
      setPromoteMessage(err instanceof ApiError ? err.message : 'Gagal promote kelas.');
      setPromoteSuccess(false);
    } finally {
      setIsPromoting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Riwayat Kelas Siswa</h2>
          <p className="text-sm text-muted-foreground">
            Histori perpindahan kelas siswa per tahun ajaran.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={openPromoteModal}>
            <ArrowUpCircle className="mr-2 h-4 w-4" />
            Promote Kelas
          </Button>
          <Button onClick={openAddModal}>
            <Plus className="mr-2 h-4 w-4" />
            Tambah Riwayat
          </Button>
        </div>
      </div>

      {error && (
        <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </div>
      )}

      <DataTable
        columns={columns}
        data={riwayat}
        isLoading={isLoading}
        getRowId={(row) => row.id}
        onEdit={openEditModal}
        onDelete={handleDelete}
      />

      {/* ─────────────────────────────────────────────
          ADD / EDIT MODAL
      ───────────────────────────────────────────── */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? 'Edit Riwayat Kelas' : 'Tambah Riwayat Kelas'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {!editingId && (
            <div className="space-y-2">
              <Label htmlFor="riwayat_siswa">Siswa</Label>
              <select
                id="riwayat_siswa"
                value={form.id_User}
                onChange={(e) => setForm({ ...form, id_User: Number(e.target.value) })}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                required
              >
                <option value="">-- Pilih Siswa --</option>
                {siswaList.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.nama}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="riwayat_kelas">Kelas</Label>
            <select
              id="riwayat_kelas"
              value={form.id_Kelas}
              onChange={(e) => setForm({ ...form, id_Kelas: Number(e.target.value) })}
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
            <Label htmlFor="riwayat_tahun">Tahun Ajaran</Label>
            <select
              id="riwayat_tahun"
              value={form.id_Tahun_Ajaran}
              onChange={(e) => setForm({ ...form, id_Tahun_Ajaran: Number(e.target.value) })}
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

          <div className="flex items-center gap-2">
            <input
              id="riwayat_active"
              type="checkbox"
              checked={form.is_Active}
              onChange={(e) => setForm({ ...form, is_Active: e.target.checked })}
              className="h-4 w-4 rounded border-input"
            />
            <Label htmlFor="riwayat_active" className="cursor-pointer">
              Riwayat aktif (kelas saat ini)
            </Label>
          </div>

          <Button type="submit" className="w-full" isLoading={isSaving}>
            {editingId ? 'Simpan Perubahan' : 'Tambah'}
          </Button>
        </form>
      </Modal>

      {/* ─────────────────────────────────────────────
          PROMOTE KELAS MODAL
      ───────────────────────────────────────────── */}
      <Modal open={promoteModalOpen} onClose={closePromoteModal} title="Promote Kelas">
        <form onSubmit={handlePromote} className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Semua siswa di kelas terpilih akan otomatis dipindahkan ke tingkat berikutnya (jurusan
            tetap sama) untuk tahun ajaran baru.
          </p>

          <div className="space-y-2">
            <Label htmlFor="promote_kelas_lama">Kelas Saat Ini</Label>
            <select
              id="promote_kelas_lama"
              value={promoteForm.id_Kelas_Lama}
              onChange={(e) =>
                setPromoteForm({ ...promoteForm, id_Kelas_Lama: Number(e.target.value) })
              }
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
            <Label htmlFor="promote_tahun_baru">Tahun Ajaran Baru</Label>
            <select
              id="promote_tahun_baru"
              value={promoteForm.id_Tahun_Ajaran_Baru}
              onChange={(e) =>
                setPromoteForm({ ...promoteForm, id_Tahun_Ajaran_Baru: Number(e.target.value) })
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

          {promoteMessage && (
            <div
              className={`rounded-md px-3 py-2 text-sm ${
                promoteSuccess
                  ? 'bg-green-500/10 text-green-600'
                  : 'bg-destructive/10 text-destructive'
              }`}
            >
              {promoteMessage}
            </div>
          )}

          {promoteSuccess ? (
            <Button type="button" className="w-full" onClick={closePromoteModal}>
              Selesai
            </Button>
          ) : (
            <Button
              type="submit"
              className="w-full"
              isLoading={isPromoting}
              disabled={!promoteForm.id_Kelas_Lama || !promoteForm.id_Tahun_Ajaran_Baru}
            >
              Promote Sekarang
            </Button>
          )}
        </form>
      </Modal>
    </div>
  );
}
