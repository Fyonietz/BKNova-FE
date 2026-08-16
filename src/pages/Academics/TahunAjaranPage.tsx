 // src/pages/Academics/TahunAjaranPage.tsx
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
interface TahunAjaran {
  id: number;
  nama: string;
  semester: string;
  is_Active: boolean;
}

// ─────────────────────────────────────────────
// 2. TABLE COLUMNS
// ─────────────────────────────────────────────
const columns: Column<TahunAjaran>[] = [
  { key: 'nama', label: 'Tahun Ajaran' },
  { key: 'semester', label: 'Semester' },
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
        {row.is_Active ? 'Aktif' : 'Tidak Aktif'}
      </span>
    ),
  },
];

// ─────────────────────────────────────────────
// 3. FORM STATE
// ─────────────────────────────────────────────
interface TahunAjaranFormState {
  nama: string;
  semester: string;
  is_Active: boolean;
}

const emptyForm: TahunAjaranFormState = {
  nama: '',
  semester: 'Ganjil',
  is_Active: true,
};

export default function TahunAjaranPage() {
  const [tahunAjaranList, setTahunAjaranList] = useState<TahunAjaran[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<TahunAjaranFormState>(emptyForm);
  const [isSaving, setIsSaving] = useState(false);

  // ───────────────────────────────────────
  // 4. FETCH DATA
  // ───────────────────────────────────────
  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.get<TahunAjaran[]>('/api/v1/tahun-ajaran');
      setTahunAjaranList(data);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to load tahun ajaran.');
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

  const openEditModal = (row: TahunAjaran) => {
    setEditingId(row.id);
    setForm({
      nama: row.nama || '',
      semester: row.semester || 'Ganjil',
      is_Active: row.is_Active ?? false,
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
      Semester: form.semester,
      Is_Active: form.is_Active,
    };

    try {
      if (editingId) {
        await api.patch(`/api/v1/tahun-ajaran/${editingId}`, payload);
      } else {
        await api.post('/api/v1/tahun-ajaran', payload);
      }
      setModalOpen(false);
      fetchData();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to save tahun ajaran.');
    } finally {
      setIsSaving(false);
    }
  };

  // ───────────────────────────────────────
  // 7. DELETE
  // ───────────────────────────────────────
  const handleDelete = async (row: TahunAjaran) => {
    if (!confirm(`Delete Tahun Ajaran ${row.nama} - ${row.semester}?`)) return;
    try {
      await api.delete(`/api/v1/tahun-ajaran/${row.id}`);
      fetchData();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to delete tahun ajaran.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Tahun Ajaran</h2>
          <p className="text-sm text-muted-foreground">Manage academic year records.</p>
        </div>
        <Button onClick={openAddModal}>
          <Plus className="mr-2 h-4 w-4" />
          Add Tahun Ajaran
        </Button>
      </div>

      {error && (
        <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </div>
      )}

      <DataTable
        columns={columns}
        data={tahunAjaranList}
        isLoading={isLoading}
        getRowId={(row) => row.id.toString()}
        onEdit={openEditModal}
        onDelete={handleDelete}
      />

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? 'Edit Tahun Ajaran' : 'Add Tahun Ajaran'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nama">Tahun Ajaran</Label>
            <Input
              id="nama"
              placeholder="Contoh: 2026/2027"
              value={form.nama}
              onChange={(e) => setForm({ ...form, nama: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="semester">Semester</Label>
            <select
              id="semester"
              value={form.semester}
              onChange={(e) => setForm({ ...form, semester: e.target.value })}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              required
            >
              <option value="Ganjil">Ganjil</option>
              <option value="Genap">Genap</option>
            </select>
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <input
              type="checkbox"
              id="is_Active"
              checked={form.is_Active}
              onChange={(e) => setForm({ ...form, is_Active: e.target.checked })}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <Label htmlFor="is_Active" className="cursor-pointer">
              Set sebagai Tahun Ajaran Aktif
            </Label>
          </div>

          <Button type="submit" className="w-full" isLoading={isSaving}>
            {editingId ? 'Save Changes' : 'Create Tahun Ajaran'}
          </Button>
        </form>
      </Modal>
    </div>
  );
}
