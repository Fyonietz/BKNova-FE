// src/pages/Academics/JurusanPage.tsx
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
interface Jurusan {
  id: number;
  nama: string;
  kode: string;
}

// ─────────────────────────────────────────────
// 2. TABLE COLUMNS
// ─────────────────────────────────────────────
const columns: Column<Jurusan>[] = [
  { key: 'kode', label: 'Kode Jurusan' },
  { key: 'nama', label: 'Nama Jurusan' },
];

// ─────────────────────────────────────────────
// 3. FORM STATE
// ─────────────────────────────────────────────
interface JurusanFormState {
  nama: string;
  kode: string;
}

const emptyForm: JurusanFormState = {
  nama: '',
  kode: '',
};

export default function JurusanPage() {
  const [jurusanList, setJurusanList] = useState<Jurusan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<JurusanFormState>(emptyForm);
  const [isSaving, setIsSaving] = useState(false);

  // ───────────────────────────────────────
  // 4. FETCH DATA
  // ───────────────────────────────────────
  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.get<Jurusan[]>('/api/v1/jurusan');
      setJurusanList(data);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to load jurusan.');
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

  const openEditModal = (row: Jurusan) => {
    setEditingId(row.id);
    setForm({
      nama: row.nama || '',
      kode: row.kode || '',
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
      Kode: form.kode,
    };

    try {
      if (editingId) {
        await api.patch(`/api/v1/jurusan/${editingId}`, payload);
      } else {
        await api.post('/api/v1/jurusan', payload);
      }
      setModalOpen(false);
      fetchData();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to save jurusan.');
    } finally {
      setIsSaving(false);
    }
  };

  // ───────────────────────────────────────
  // 7. DELETE
  // ───────────────────────────────────────
  const handleDelete = async (row: Jurusan) => {
    if (!confirm(`Delete Jurusan ${row.nama}?`)) return;
    try {
      await api.delete(`/api/v1/jurusan/${row.id}`);
      fetchData();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to delete jurusan.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Jurusan</h2>
          <p className="text-sm text-muted-foreground">Manage major/department records.</p>
        </div>
        <Button onClick={openAddModal}>
          <Plus className="mr-2 h-4 w-4" />
          Add Jurusan
        </Button>
      </div>

      {error && (
        <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </div>
      )}

      <DataTable
        columns={columns}
        data={jurusanList}
        isLoading={isLoading}
        getRowId={(row) => row.id.toString()}
        onEdit={openEditModal}
        onDelete={handleDelete}
      />

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? 'Edit Jurusan' : 'Add Jurusan'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nama">Nama Jurusan</Label>
            <Input
              id="nama"
              placeholder="Contoh: Rekayasa Perangkat Lunak"
              value={form.nama}
              onChange={(e) => setForm({ ...form, nama: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="kode">Kode Jurusan</Label>
            <Input
              id="kode"
              placeholder="Contoh: RPL"
              value={form.kode}
              onChange={(e) => setForm({ ...form, kode: e.target.value })}
              required
            />
          </div>

          <Button type="submit" className="w-full" isLoading={isSaving}>
            {editingId ? 'Save Changes' : 'Create Jurusan'}
          </Button>
        </form>
      </Modal>
    </div>
  );
}
