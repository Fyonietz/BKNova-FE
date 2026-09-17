import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from '@/components/ProtectedRoutes';
import LoginPage from '@/pages/LoginPage';
import LandingPage from '@/pages/LandingPage';
import NotFoundPage from '@/pages/NotFoundPage';
import DashboardPage from '@/pages/DashboardMain';
import DashboardLayout from '@/components/layout/DashboardLayout';

//Instrumen
import AumPage from '@/pages/Instrumen/AumPage';

//User
import SiswaDashboard from '@/pages/User/SiswaPage';
import WaliMuridDashboard from '@/pages/User/WaliMuridPage';
import GuruBKDashboard from '@/pages/User/GuruBKPage';
import RiwayatKelasSiswaDashboard from '@/pages/User/RiwayatKelasPage';

//Academics
import KelasDashboard from '@/pages/Academics/KelasPage';
import JurusanDashboard from '@/pages/Academics/JurusanPage';
import TahunAjaranDashboard from '@/pages/Academics/TahunAjaranPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/404" element={<NotFoundPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/admin/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardPage />} />

            {/* Instrumen */}
            <Route path="instrumen/aum" element={<AumPage />} />

            {/* User */}
            <Route path="users/siswa" element={<SiswaDashboard />} />
            <Route path="users/wali-murid" element={<WaliMuridDashboard />} />
            <Route path="users/guru-bk" element={<GuruBKDashboard />} />
            <Route path="users/riwayat-kelas-siswa" element={<RiwayatKelasSiswaDashboard />} />

            {/* Academics */}
            <Route path="academics/kelas" element={<KelasDashboard />} />
            <Route path="academics/jurusan" element={<JurusanDashboard />} />
            <Route path="academics/tahun-ajaran" element={<TahunAjaranDashboard />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
