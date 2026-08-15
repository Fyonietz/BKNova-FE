
import { useEffect, useState } from 'react';
import { api, ApiError } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import DataTable, { type Column } from '@/components/ui/DataTable';
import Modal from '@/components/ui/Modal';
import { Plus } from 'lucide-react';

// ─────────────────────────────────────────────
// 1. ENTITY SHAPES — Updated to match new Kelas model
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
  tingkat: string; // Updated from backend
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
  { key: 'kelamin', label: 'Kelamin' },
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
  kelamin: 'Laki-Laki',
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
      kelamin: row.kelamin || 'Laki-Laki',
      tempat_Tanggal_Lahir: row.tempat_Tanggal_Lahir || '',
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

    try {
      if (editingId) {
        await api.put(`/api/v1/siswa/${editingId}`, payload);
      } else {
        await api.post('/api/v1/siswa', payload);
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
            <Input
              id="password"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required={!editingId}
              placeholder={editingId ? 'Kosongkan jika tidak ingin mengubah' : ''}
            />
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

          {/* Label Opsi Kelas sekarang langsung menampilkan Tingkat, Nama, dan Jurusan */}
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
              placeholder="Contoh: Malika,07-06-2008"
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
