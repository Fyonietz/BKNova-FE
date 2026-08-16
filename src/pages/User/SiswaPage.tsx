// src/pages/User/SiswaPage.tsx
import { useEffect, useState } from 'react';
import { api, ApiError } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import DataTable, { type Column } from '@/components/ui/DataTable';
import Modal from '@/components/ui/Modal';
import { Plus, Eye, EyeOff, Upload } from 'lucide-react';

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
    render: (row) => `${row.tingkat ? row.tingkat + ' ' : ''}${row.kelas}`,
  },
  {
    key: 'kelamin',
    label: 'Kelamin',
    render: (row) => (row.kelamin === 'Laki' ? 'Laki-Laki' : row.kelamin),
  },
  { key: 'tempat_Tanggal_Lahir', label: 'TTL' },
];

// ─────────────────────────────────────────────
// 3. FORM STATE (Add/Edit)
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

// ─────────────────────────────────────────────
// 4. IMPORT SHAPES
// ─────────────────────────────────────────────
interface ImportRow {
  Nama: string;
  NISN: string;
  NIS: string;
  Kelamin: string;
  Tempat_Tanggal_Lahir: string;
}

interface ImportFailed {
  nama: string;
  reason: string;
}

interface ImportResultType {
  total: number;
  success: number;
  failed: ImportFailed[];
}

export default function SiswaPage() {
  const [siswa, setSiswa] = useState<Siswa[]>([]);
  const [kelasList, setKelasList] = useState<KelasOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Add/Edit modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<SiswaFormState>(emptyForm);
  const [isSaving, setIsSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Import modal state
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [importKelas, setImportKelas] = useState<number | ''>('');
  const [importRows, setImportRows] = useState<ImportRow[]>([]);
  const [importResult, setImportResult] = useState<ImportResultType | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [importFileName, setImportFileName] = useState<string>('');
  const [importPassword, setImportPassword] = useState('');
  const [showImportPassword, setShowImportPassword] = useState(false);

  // ───────────────────────────────────────
  // 5. FETCH DATA
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
  // 6. ADD/EDIT MODAL HANDLERS
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      if (editingId) {
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

  const handleDelete = async (row: Siswa) => {
    if (!confirm(`Delete ${row.nama}?`)) return;
    try {
      await api.delete(`/api/v1/siswa/${row.id}`);
      fetchData();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to delete siswa.');
    }
  };

  // ───────────────────────────────────────
  // 7. IMPORT CSV HANDLERS
  // ───────────────────────────────────────
  const parseCsvFile = (file: File) => {
    setImportFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text
        .replace(/\r/g, '')
        .trim()
        .split('\n')
        .filter((l) => l.trim().length > 0);

      if (lines.length < 2) {
        setImportRows([]);
        setError('File CSV kosong atau tidak punya data.');
        return;
      }

      const headers = lines[0].split(',').map((h) => h.trim());

      const rows: ImportRow[] = lines.slice(1).map((line) => {
        const values = line.split(',').map((v) => v.trim());
        const obj: Record<string, string> = {};
        headers.forEach((h, i) => (obj[h] = values[i] ?? ''));
        return {
          Nama: obj.Nama || '',
          NISN: obj.NISN || '',
          NIS: obj.NIS || '',
          Kelamin: obj.Kelamin || 'Laki',
          Tempat_Tanggal_Lahir: obj.Tempat_Tanggal_Lahir || '',
        };
      });

      setImportRows(rows);
      setImportResult(null);
      setError(null);
    };
    reader.readAsText(file);
  };

  const handleImport = async () => {
    if (!importKelas || importRows.length === 0 || !importPassword) return;
    setIsImporting(true);
    setError(null);
    try {
      const res = await api.post<ImportResultType>('/api/v1/siswa/import', {
        Id_Kelas: Number(importKelas),
        Password: importPassword,
        Data: importRows,
      });
      setImportResult(res);
      if (res.failed.length === 0) {
        fetchData();
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Gagal import CSV.');
    } finally {
      setIsImporting(false);
    }
  };

  const closeImportModal = () => {
    setImportModalOpen(false);
    setImportKelas('');
    setImportRows([]);
    setImportResult(null);
    setImportFileName('');
    setImportPassword('');
    setShowImportPassword(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Siswa</h2>
          <p className="text-sm text-muted-foreground">Manage student records.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setImportModalOpen(true)}>
            <Upload className="mr-2 h-4 w-4" />
            Import CSV
          </Button>
          <Button onClick={openAddModal}>
            <Plus className="mr-2 h-4 w-4" />
            Add Siswa
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
        data={siswa}
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

      {/* ─────────────────────────────────────────────
          IMPORT CSV MODAL
      ───────────────────────────────────────────── */}
      <Modal open={importModalOpen} onClose={closeImportModal} title="Import Siswa dari CSV">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="import_kelas">1. Pilih Kelas Tujuan</Label>
            <select
              id="import_kelas"
              value={importKelas}
              onChange={(e) => setImportKelas(e.target.value ? Number(e.target.value) : '')}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
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
            <Label htmlFor="import_password">2. Password Default (untuk semua siswa)</Label>
            <div className="relative">
              <Input
                id="import_password"
                type={showImportPassword ? 'text' : 'password'}
                value={importPassword}
                onChange={(e) => setImportPassword(e.target.value)}
                placeholder="Contoh: siswa123"
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowImportPassword(!showImportPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
              >
                {showImportPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <p className="text-xs text-muted-foreground">
              Semua siswa di batch ini akan pakai password yang sama — sarankan mereka ganti setelah login pertama.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="import_file">3. Upload File CSV</Label>
            <input
              id="import_file"
              type="file"
              accept=".csv"
              disabled={!importKelas}
              onChange={(e) => e.target.files?.[0] && parseCsvFile(e.target.files[0])}
              className="w-full text-sm text-muted-foreground file:mr-3 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-2 file:text-sm file:font-medium file:text-primary-foreground disabled:opacity-50"
            />
            <p className="text-xs text-muted-foreground">
              Format kolom (baris pertama header): Nama, NISN, NIS, Kelamin, Tempat_Tanggal_Lahir
            </p>
          </div>

          {importRows.length > 0 && !importResult && (
            <div className="rounded-md border p-3 text-sm">
              <p className="font-medium">
                {importFileName}: {importRows.length} baris siap diimport
              </p>
              <ul className="mt-2 max-h-32 space-y-0.5 overflow-y-auto text-xs text-muted-foreground">
                {importRows.slice(0, 5).map((r, i) => (
                  <li key={i}>
                    {r.Nama} — NISN: {r.NISN}
                  </li>
                ))}
                {importRows.length > 5 && <li>...dan {importRows.length - 5} lainnya</li>}
              </ul>
            </div>
          )}

          {importResult && (
            <div className="space-y-2 rounded-md border p-3 text-sm">
              <p>
                Berhasil:{' '}
                <span className="font-medium text-green-600">{importResult.success}</span> /{' '}
                {importResult.total}
              </p>
              {importResult.failed.length > 0 && (
                <div>
                  <p className="font-medium text-destructive">
                    Gagal ({importResult.failed.length}):
                  </p>
                  <ul className="mt-1 max-h-32 space-y-0.5 overflow-y-auto text-xs">
                    {importResult.failed.map((f, i) => (
                      <li key={i}>
                        {f.nama}: {f.reason}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          <div className="flex gap-2">
            {importResult ? (
              <Button className="w-full" onClick={closeImportModal}>
                Selesai
              </Button>
            ) : (
              <Button
                className="w-full"
                onClick={handleImport}
                isLoading={isImporting}
                disabled={!importKelas || !importPassword || importRows.length === 0}
              >
                Import {importRows.length > 0 ? `(${importRows.length} siswa)` : ''}
              </Button>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
}
