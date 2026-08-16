// src/pages/Academics/KelasPage.tsx
import { useEffect, useState } from 'react';
import { api, ApiError } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import DataTable, { type Column } from '@/components/ui/DataTable';
import Modal from '@/components/ui/Modal';
import { Plus } from 'lucide-react';

// ─────────────────────────────────────────────
// 1. ENTITY SHAPES
// ─────────────────────────────────────────────
interface Kelas {
  id: number;
  nama: string;
  jurusan: string;
  id_Jurusan?: number;
  tingkat: string;
}

interface JurusanOption {
  id: number;
  nama: string;
  kode: string;
}

const TINGKAT_OPTIONS = ['X', 'XI', 'XII'];

// ─────────────────────────────────────────────
// 2. TABLE COLUMNS
// ─────────────────────────────────────────────
const columns: Column<Kelas>[] = [
  { key: 'tingkat', label: 'Tingkat' },
  { key: 'nama', label: 'Nama Kelas' },
  { key: 'jurusan', label: 'Jurusan' },
];

// ─────────────────────────────────────────────
// 3. FORM STATE
// ─────────────────────────────────────────────
interface KelasFormState {
  nama: string;
  tingkat: string;
  id_Jurusan: number | '';
}

const emptyForm: KelasFormState = {
  nama: '',
  tingkat: 'X',
  id_Jurusan: '',
};

export default function KelasPage() {
  const [kelasList, setKelasList] = useState<Kelas[]>([]);
  const [jurusanList, setJurusanList] = useState<JurusanOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<KelasFormState>(emptyForm);
  const [isSaving, setIsSaving] = useState(false);

  // ───────────────────────────────────────
  // 4. FETCH DATA
  // ───────────────────────────────────────
  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [kelasRes, jurusanRes] = await Promise.all([
        api.get<Kelas[]>('/api/v1/kelas'),
        api.get<JurusanOption[]>('/api/v1/jurusan'),
      ]);
      setKelasList(kelasRes);
      setJurusanList(jurusanRes);
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
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEditModal = (row: Kelas) => {
    setEditingId(row.id);
    setForm({
      nama: row.nama || '',
      tingkat: row.tingkat || 'X',
      id_Jurusan: row.id_Jurusan || '',
    });
    setModalOpen(true);
  };

  // ───────────────────────────────────────
  // 6. SUBMIT FORM
  // ───────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const payload = {
      Nama: form.nama,
      Tingkat: form.tingkat,
      Id_Jurusan: Number(form.id_Jurusan),
    };

    try {
      if (editingId) {
        await api.patch(`/api/v1/kelas/${editingId}`, payload);
      } else {
        await api.post('/api/v1/kelas', payload);
      }
      setModalOpen(false);
      fetchData();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to save kelas.');
    } finally {
      setIsSaving(false);
    }
  };

  // ───────────────────────────────────────
  // 7. DELETE
  // ───────────────────────────────────────
  const handleDelete = async (row: Kelas) => {
    if (!confirm(`Delete Kelas ${row.tingkat} ${row.nama}?`)) return;
    try {
      await api.delete(`/api/v1/kelas/${row.id}`);
      fetchData();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to delete kelas.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Kelas</h2>
          <p className="text-sm text-muted-foreground">Manage class records.</p>
        </div>
        <Button onClick={openAddModal}>
          <Plus className="mr-2 h-4 w-4" />
          Add Kelas
        </Button>
      </div>

      {error && (
        <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </div>
      )}

      <DataTable
        columns={columns}
        data={kelasList}
        isLoading={isLoading}
        getRowId={(row) => row.id.toString()}
        onEdit={openEditModal}
        onDelete={handleDelete}
      />

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? 'Edit Kelas' : 'Add Kelas'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tingkat">Tingkat</Label>
            <select
              id="tingkat"
              value={form.tingkat}
              onChange={(e) => setForm({ ...form, tingkat: e.target.value })}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              required
            >
              {TINGKAT_OPTIONS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="nama">Nama Kelas</Label>
            <Input
              id="nama"
              placeholder="Contoh: RPL 1"
              value={form.nama}
              onChange={(e) => setForm({ ...form, nama: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="id_Jurusan">Jurusan</Label>
            <select
              id="id_Jurusan"
              value={form.id_Jurusan}
              onChange={(e) => setForm({ ...form, id_Jurusan: Number(e.target.value) })}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              required
            >
              <option value="">-- Pilih Jurusan --</option>
              {jurusanList.map((j) => (
                <option key={j.id} value={j.id}>
                  {j.nama} ({j.kode})
                </option>
              ))}
            </select>
          </div>

          <Button type="submit" className="w-full" isLoading={isSaving}>
            {editingId ? 'Save Changes' : 'Create Kelas'}
          </Button>
        </form>
      </Modal>
    </div>
  );
}
