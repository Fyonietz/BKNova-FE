// src/pages/User/WaliKelasPage.tsx
import { useEffect, useState } from 'react';
import { api, ApiError } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import DataTable, { type Column } from '@/components/ui/DataTable';
import Modal from '@/components/ui/Modal';
import { Plus, Eye, EyeOff } from 'lucide-react';

// ─────────────────────────────────────────────
// 1. ENTITY SHAPES
// ─────────────────────────────────────────────
interface WaliKelas {
  id: string;
  nama: string;
  id_Kelas?: number;
  kelas?: string;
  tingkat?: string;
  id_Tahun_Ajaran?: number;
  tahun_Ajaran?: string;
  semester?: string;
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
const columns: Column<WaliKelas>[] = [
  { key: 'nama', label: 'Nama Wali Kelas' },
  { 
    key: 'kelas', 
    label: 'Kelas',
    render: (row) => `${row.tingkat ? row.tingkat + ' ' : ''}${row.kelas || '-'}` 
  },
  { 
    key: 'tahun_Ajaran', 
    label: 'Tahun Ajaran',
    render: (row) => `${row.tahun_Ajaran || '-'} (${row.semester || '-'})`
  },
];

// ─────────────────────────────────────────────
// 3. FORM STATE
// ─────────────────────────────────────────────
interface WaliKelasFormState {
  nama: string;
  password: string;
  id_Kelas: number | '';
  id_Tahun_Ajaran: number | '';
}

const emptyForm: WaliKelasFormState = {
  nama: '',
  password: '',
  id_Kelas: '',
  id_Tahun_Ajaran: '',
};

export default function WaliKelasPage() {
  const [waliKelas, setWaliKelas] = useState<WaliKelas[]>([]);
  const [kelasList, setKelasList] = useState<KelasOption[]>([]);
  const [tahunAjaranList, setTahunAjaranList] = useState<TahunAjaranOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<WaliKelasFormState>(emptyForm);
  const [isSaving, setIsSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // ───────────────────────────────────────
  // 4. FETCH DATA
  // ───────────────────────────────────────
  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [waliKelasRes, kelasRes, tahunAjaranRes] = await Promise.all([
        api.get<WaliKelas[]>('/api/v1/wali-kelas'),
        api.get<KelasOption[]>('/api/v1/kelas'),
        api.get<TahunAjaranOption[]>('/api/v1/tahun-ajaran'),
      ]);
      setWaliKelas(waliKelasRes);
      setKelasList(kelasRes);
      setTahunAjaranList(tahunAjaranRes);
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
  // 5. OPEN MODAL
  // ───────────────────────────────────────
  const openAddModal = () => {
    setEditingId(null);
    const activeTA = tahunAjaranList.find((t) => t.is_Active);
    setForm({
      ...emptyForm,
      id_Tahun_Ajaran: activeTA ? activeTA.id : '',
    });
    setShowPassword(false);
    setModalOpen(true);
  };

  const openEditModal = (row: WaliKelas) => {
    setEditingId(row.id);
    setForm({
      nama: row.nama || '',
      password: '',
      id_Kelas: row.id_Kelas || '',
      id_Tahun_Ajaran: row.id_Tahun_Ajaran || '',
    });
    setShowPassword(false);
    setModalOpen(true);
  };

  // ───────────────────────────────────────
  // 6. SUBMIT FORM
  // ───────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      if (editingId) {
        // Payload PATCH (Flat Object)
        const patchPayload: Record<string, any> = {
          Nama: form.nama,
          Id_Kelas: Number(form.id_Kelas),
          Id_Tahun_Ajaran: Number(form.id_Tahun_Ajaran),
        };

        if (form.password) {
          patchPayload.Password = form.password;
        }

        await api.patch(`/api/v1/wali-kelas/${editingId}`, patchPayload);
      } else {
        // Payload POST (Nested Object)
        const postPayload = {
          user: {
            Nama: form.nama,
            Password: form.password,
          },
          wali_kelas: {
            Id_Kelas: Number(form.id_Kelas),
            Id_Tahun_Ajaran: Number(form.id_Tahun_Ajaran),
          },
        };

        await api.post('/api/v1/wali-kelas', postPayload);
      }

      setModalOpen(false);
      fetchData();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to save wali kelas.');
    } finally {
      setIsSaving(false);
    }
  };

  // ───────────────────────────────────────
  // 7. DELETE
  // ───────────────────────────────────────
  const handleDelete = async (row: WaliKelas) => {
    if (!confirm(`Delete Wali Kelas ${row.nama}?`)) return;
    try {
      await api.delete(`/api/v1/wali-kelas/${row.id}`);
      fetchData();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to delete wali kelas.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Wali Kelas</h2>
          <p className="text-sm text-muted-foreground">Manage homeroom teacher records.</p>
        </div>
        <Button onClick={openAddModal}>
          <Plus className="mr-2 h-4 w-4" />
          Add Wali Kelas
        </Button>
      </div>

      {error && (
        <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </div>
      )}

      <DataTable
        columns={columns}
        data={waliKelas}
        isLoading={isLoading}
        getRowId={(row) => row.id}
        onEdit={openEditModal}
        onDelete={handleDelete}
      />

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? 'Edit Wali Kelas' : 'Add Wali Kelas'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nama">Nama Wali Kelas</Label>
            <Input
              id="nama"
              value={form.nama}
              onChange={(e) => setForm({ ...form, nama: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required={!editingId}
                placeholder={editingId ? 'Kosongkan jika tidak ingin mengubah' : ''}
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

          <div className="space-y-2">
            <Label htmlFor="id_Kelas">Kelas</Label>
            <select
              id="id_Kelas"
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
            <Label htmlFor="id_Tahun_Ajaran">Tahun Ajaran</Label>
            <select
              id="id_Tahun_Ajaran"
              value={form.id_Tahun_Ajaran}
              onChange={(e) => setForm({ ...form, id_Tahun_Ajaran: Number(e.target.value) })}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              required
            >
              <option value="">-- Pilih Tahun Ajaran --</option>
              {tahunAjaranList.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.nama} - {t.semester} {t.is_Active ? '(Aktif)' : ''}
                </option>
              ))}
            </select>
          </div>

          <Button type="submit" className="w-full" isLoading={isSaving}>
            {editingId ? 'Save Changes' : 'Create Wali Kelas'}
          </Button>
        </form>
      </Modal>
    </div>
  );
}
