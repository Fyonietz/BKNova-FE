// src/pages/User/SiswaPage.tsx
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
interface Siswa {
  id: string;
  nama: string;
  nis: string;
  nisn: string;
  kelas: string;
  tingkat: string;
  id_Kelas?: number;
  kelamin: string;
  tempat_Tanggal_Lahir: string;
}

interface KelasOption {
  id: number;
  nama: string;
  jurusan: string;
  tingkat: string;
}

// ─────────────────────────────────────────────
// 2. TABLE COLUMNS
// ─────────────────────────────────────────────
const columns: Column<Siswa>[] = [
  { key: 'nama', label: 'Nama' },
  { key: 'nis', label: 'NIS' },
  { key: 'nisn', label: 'NISN' },
  { 
    key: 'kelas', 
    label: 'Kelas',
    render: (row) => `${row.tingkat ? row.tingkat + ' ' : ''}${row.kelas}` 
  },
  { 
    key: 'kelamin', 
    label: 'Kelamin',
    render: (row) => (row.kelamin === 'Laki' ? 'Laki-Laki' : row.kelamin)
  },
  { key: 'tempat_Tanggal_Lahir', label: 'TTL' },
];

// ─────────────────────────────────────────────
// 3. FORM STATE
// ─────────────────────────────────────────────
interface SiswaFormState {
  nama: string;
  password: string;
  id_Kelas: number | '';
  nisn: string;
  nis: string;
  kelamin: string;
  tempat_Tanggal_Lahir: string;
}

const emptyForm: SiswaFormState = {
  nama: '',
  password: '',
  id_Kelas: '',
  nisn: '',
  nis: '',
  kelamin: 'Laki',
  tempat_Tanggal_Lahir: '',
};

export default function SiswaPage() {
  const [siswa, setSiswa] = useState<Siswa[]>([]);
  const [kelasList, setKelasList] = useState<KelasOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<SiswaFormState>(emptyForm);
  const [isSaving, setIsSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // ───────────────────────────────────────
  // 4. FETCH DATA
  // ───────────────────────────────────────
  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [siswaRes, kelasRes] = await Promise.all([
        api.get<Siswa[]>('/api/v1/siswa'),
        api.get<KelasOption[]>('/api/v1/kelas'),
      ]);
      setSiswa(siswaRes);
      setKelasList(kelasRes);
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
    setShowPassword(false);
    setModalOpen(true);
  };

  const openEditModal = (row: Siswa) => {
    setEditingId(row.id);
    setForm({
      nama: row.nama || '',
      password: '',
      id_Kelas: row.id_Kelas || '',
      nisn: row.nisn || '',
      nis: row.nis || '',
      kelamin: row.kelamin === 'Laki-Laki' ? 'Laki' : row.kelamin || 'Laki',
      tempat_Tanggal_Lahir: row.tempat_Tanggal_Lahir || '',
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
        // Payload PATCH (Flat object)
        const patchPayload: Record<string, any> = {
          Nama: form.nama,
          Nisn: form.nisn,
          Nis: form.nis,
          Kelamin: form.kelamin,
          Tempat_Tanggal_Lahir: form.tempat_Tanggal_Lahir,
          Id_Kelas: Number(form.id_Kelas),
        };

        if (form.password) {
          patchPayload.Password = form.password;
        }

        await api.patch(`/api/v1/siswa/${editingId}`, patchPayload);
      } else {
        // Payload POST (Nested object)
        const postPayload = {
          user: {
            Nama: form.nama,
            Password: form.password,
          },
          siswa: {
            Id_Kelas: Number(form.id_Kelas),
            NISN: form.nisn,
            NIS: form.nis,
            Kelamin: form.kelamin,
            Tempat_Tanggal_Lahir: form.tempat_Tanggal_Lahir,
          },
        };

        await api.post('/api/v1/siswa', postPayload);
      }

      setModalOpen(false);
      fetchData();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to save siswa.');
    } finally {
      setIsSaving(false);
    }
  };

  // ───────────────────────────────────────
  // 7. DELETE
  // ───────────────────────────────────────
  const handleDelete = async (row: Siswa) => {
    if (!confirm(`Delete ${row.nama}?`)) return;
    try {
      await api.delete(`/api/v1/siswa/${row.id}`);
      fetchData();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to delete siswa.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Siswa</h2>
          <p className="text-sm text-muted-foreground">Manage student records.</p>
        </div>
        <Button onClick={openAddModal}>
          <Plus className="mr-2 h-4 w-4" />
          Add Siswa
        </Button>
      </div>

      {error && (
        <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </div>
      )}

      <DataTable
        columns={columns}
        data={siswa}
        isLoading={isLoading}
        getRowId={(row) => row.id}
        onEdit={openEditModal}
        onDelete={handleDelete}
      />

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? 'Edit Siswa' : 'Add Siswa'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nama">Nama</Label>
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nis">NIS</Label>
              <Input
                id="nis"
                value={form.nis}
                onChange={(e) => setForm({ ...form, nis: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nisn">NISN</Label>
              <Input
                id="nisn"
                value={form.nisn}
                onChange={(e) => setForm({ ...form, nisn: e.target.value })}
                required
              />
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
            <Label htmlFor="kelamin">Jenis Kelamin</Label>
            <select
              id="kelamin"
              value={form.kelamin}
              onChange={(e) => setForm({ ...form, kelamin: e.target.value })}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              required
            >
              <option value="Laki">Laki-Laki</option>
              <option value="Perempuan">Perempuan</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="ttl">Tempat, Tanggal Lahir</Label>
            <Input
              id="ttl"
              placeholder="Contoh: Payakumbuh,07-Juni-2008"
              value={form.tempat_Tanggal_Lahir}
              onChange={(e) => setForm({ ...form, tempat_Tanggal_Lahir: e.target.value })}
              required
            />
          </div>

          <Button type="submit" className="w-full" isLoading={isSaving}>
            {editingId ? 'Save Changes' : 'Create Siswa'}
          </Button>
        </form>
      </Modal>
    </div>
  );
}
