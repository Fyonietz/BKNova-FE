import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '@/components/ProtectedRoutes'
import LoginPage from '@/pages/LoginPage';
import DashboardPage from '@/pages/DashboardMain'
import DashboardLayout from '@/components/layout/DashboardLayout'

//User 
import SiswaDashboard from '@/pages/User/SiswaPage'
import WaliMuridDashboard from '@/pages/User/WaliMuridPage'
import GuruBKDashboard from '@/pages/User/GuruBKPage'

//Academics
import KelasDashboard from '@/pages/Academics/KelasPage'
import JurusanDashboard from '@/pages/Academics/JurusanPage'
import TahunAjaranDashboard from '@/pages/Academics/TahunAjaranPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Match exact path "/login" and render LoginPage */}
        <Route path="/login" element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/admin/dashboard" element={<DashboardLayout />}>
              <Route index element={<DashboardPage />} />
   
              //User
              <Route path="users/siswa" element={<SiswaDashboard />} />
              <Route path="users/wali-murid" element={<WaliMuridDashboard />} />
              <Route path="users/guru-bk" element={<GuruBKDashboard />} />
              
              //Academics
              <Route path="academics/kelas" element={<KelasDashboard />} />
              <Route path="academics/jurusan" element={<JurusanDashboard />} />
              <Route path="academics/tahun-ajaran" element={<TahunAjaranDashboard />} />
              
          </Route>
        </Route>
        {/* Catch-all route: Redirects any unknown URL back to "/" */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
