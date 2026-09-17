import { ArrowLeft, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-xl rounded-[2rem] border border-slate-200 bg-white p-8 text-center shadow-xl shadow-slate-200/60 sm:p-12">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 text-3xl font-black text-blue-700">
          404
        </div>

        <h1 className="mt-6 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
          Halaman tidak ditemukan
        </h1>

        <p className="mt-4 text-base text-slate-600">
          URL yang Anda masukkan tidak tersedia atau sudah dipindahkan. Silakan kembali ke halaman utama atau masuk ke dashboard.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button onClick={() => navigate('/')}>
            <Home className="mr-2 h-4 w-4" />
            Ke Landing Page
          </Button>
          <Button variant="outline" onClick={() => navigate('/login')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Ke Login
          </Button>
        </div>
      </div>
    </div>
  );
}
