import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '@/pages/LoginPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Match exact path "/login" and render LoginPage */}
        <Route path="/login" element={<LoginPage />} />

        {/* Catch-all route: Redirects any unknown URL back to "/" */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
