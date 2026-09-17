import { 
  BarChart3, 
  Camera, 
  CheckCircle2, 
  FileSpreadsheet, 
  FileText, 
  LineChart, 
  PieChart, 
  ShieldCheck, 
  Ticket, 
  Users,
  Activity
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

const mainFeatures = [
  {
    icon: FileText,
    badge: 'Instrumen Asesmen',
    title: 'AUM (Alat Ungkap Masalah)',
    description: 'Permudah pengungkapan masalah dan kebutuhan siswa secara digital. Data langsung terintegrasi dan siap dianalisis.',
    highlights: ['Pengisian digital interaktif', 'Analisis otomatis per bidang masalah', 'Identifikasi kebutuhan siswa lebih cepat']
  },
  {
    icon: Ticket,
    badge: 'Layanan Konseling',
    title: 'Tiket Konseling',
    description: 'Sistem penjadwalan dan tiket konseling terstruktur yang memudahkan siswa mengajukan sesi dan BK meresponsnya.',
    highlights: ['Manajemen antrean konseling', 'Catatan tindak lanjut terorganisir', 'Histori sesi konseling terarsip rapi']
  },
  {
    icon: Users,
    badge: 'Pemetaan Siswa',
    title: 'Kuesioner Sosiografis',
    description: 'Gali data sosiografis dan latar belakang siswa secara komprehensif untuk mendukung perencanaan program BK.',
    highlights: ['Profil sosiografis lengkap', 'Pemetaan latar belakang keluarga & sosial', 'Data valid dan mudah diakses']
  },
];

const analyticsFeatures = [
  {
    icon: BarChart3,
    title: 'Grafik Visual Interaktif',
    description: 'Semua instrumen dan tiket konseling dilengkapi visualisasi grafik yang menarik serta mudah dipahami.',
  },
  {
    icon: FileSpreadsheet,
    title: 'Rekapitulasi Otomatis',
    description: 'Tidak perlu rekap manual lagi. Sistem otomatis menyusun laporan ringkas maupun detail per kelas/siswa.',
  },
  {
    icon: LineChart,
    title: 'Monitoring Trend Masalah',
    description: 'Pantau perkembangan dan tren permasalahan siswa di sekolah secara real-time untuk intervensi yang tepat.',
  },
];

const highlights = [
  'Rekapitulasi & Grafik otomatis untuk AUM, Tiket, dan Sosiografis',
  'Dashboard Guru BK & Siswa terintegrasi dengan akses modern',
  'Keamanan data siswa terjamin dengan penyimpanan cloud terstruktur',
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Header / Navbar */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <img 
              src="/logo.jpeg" 
              alt="Logo BK Nova" 
              className="h-9 w-9 rounded-full object-cover ring-2 ring-blue-500/20" 
            />
            <div>
              <p className="text-base font-black tracking-tight text-blue-700 leading-none">BK Nova</p>
              <p className="text-[10px] font-medium text-slate-500 mt-0.5">Bimbingan Konseling Digital</p>
            </div>
          </div>

          <nav aria-label="Navigasi utama" className="hidden items-center gap-7 text-sm font-semibold text-slate-600 md:flex">
            <a href="#fitur-utama" className="transition hover:text-blue-700">Fitur Utama</a>
            <a href="#preview-grafik" className="transition hover:text-blue-700">Visual Grafik</a>
            <a href="#rekap-grafik" className="transition hover:text-blue-700">Analytics</a>
            <a href="#kontak" className="transition hover:text-blue-700">Kontak</a>
          </nav>

          <a 
            href="#kontak"
            className="rounded-lg bg-blue-50 px-4 py-2 text-xs font-bold text-blue-700 hover:bg-blue-100 transition"
          >
            Hubungi Admin
          </a>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="absolute inset-x-0 top-0 -z-10 h-96 bg-gradient-to-br from-blue-100/70 via-indigo-50/50 to-sky-100/60" />
          
          <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-12">
            {/* Sisi Kiri: Teks & Informasi */}
            <div className="lg:col-span-7">
              <span className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 shadow-sm">
                <ShieldCheck className="mr-1.5 h-3.5 w-3.5" />
                Sistem Informasi BK Terpadu
              </span>

              <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl lg:text-5xl lg:leading-[1.15]">
                Kelola Layanan BK Lebih Cepat, Tepat, dan Terukur.
              </h1>

              <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base">
                Platform BK Nova memfasilitasi instrumen <strong>AUM (Alat Ungkap Masalah)</strong> — instrumen BK untuk membantu siswa mengungkapkan permasalahan pribadi atau akademik; juga menyediakan <strong>Tiket Konseling</strong> dan <strong>Kuesioner Sosiografis</strong>, lengkap dengan rekapitulasi otomatis dan visualisasi grafik instan.
              </p>

              <div className="mt-7 flex flex-wrap gap-3.5">
                <Button 
                  size="lg" 
                  onClick={() => document.getElementById('fitur-utama')?.scrollIntoView({ behavior: 'smooth' })} 
                  className="text-sm font-semibold shadow-md shadow-blue-500/25"
                >
                  Jelajahi Fitur Utama
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  onClick={() => document.getElementById('preview-grafik')?.scrollIntoView({ behavior: 'smooth' })} 
                  className="text-sm font-semibold border-slate-300 hover:bg-slate-100"
                >
                  Lihat Hasil Grafik
                </Button>
              </div>

              <ul className="mt-8 space-y-2.5 text-sm font-medium text-slate-700">
                {highlights.map((item) => (
                  <li key={item} className="flex items-center gap-2.5">
                    <CheckCircle2 className="h-4.5 w-4.5 shrink-0 text-blue-600" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Sisi Kanan: Frame Smartphone Mockup */}
            <div className="flex justify-center lg:col-span-5">
              <div className="relative w-full max-w-[280px] sm:max-w-[310px]">
                <div className="absolute -inset-2 rounded-[2.5rem] bg-gradient-to-tr from-blue-500/30 to-indigo-500/30 blur-2xl opacity-70" />
                
                <div className="relative overflow-hidden rounded-[2.2rem] border-[6px] border-slate-900 bg-slate-900 shadow-2xl">
                  <div className="absolute top-0 inset-x-0 z-20 flex justify-center pt-1.5">
                    <div className="h-3.5 w-24 rounded-full bg-slate-900" />
                  </div>

                  <div className="relative aspect-[9/18] w-full overflow-hidden rounded-[1.8rem] bg-white">
                    <img
                      src="/Halaman Siswa.jpg"
                      alt="Tampilan Halaman Siswa BK Nova"
                      className="h-full w-full object-cover object-top"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section Fitur Utama */}
        <section id="fitur-utama" className="px-4 py-14 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-12 text-center">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-blue-700">Fitur Utama Platform</p>
              <h2 className="mt-2 text-2xl font-black text-slate-900 sm:text-3xl">Tiga Pilar Instrumen & Layanan BK Digital</h2>
              <p className="mt-2 text-sm text-slate-600 max-w-2xl mx-auto">
                Semua instrumen utama BK dikumpulkan dalam satu aplikasi tanpa ribet mengelola berkas fisik.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {mainFeatures.map(({ icon: Icon, badge, title, description, highlights }) => (
                <article key={title} className="flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-100/50">
                  <div>
                    <div className="mb-4 flex items-center justify-between">
                      <div className="inline-flex rounded-xl bg-blue-100/80 p-3 text-blue-700">
                        <Icon className="h-6 w-6" />
                      </div>
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
                        {badge}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-slate-900">{title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">{description}</p>
                  </div>

                  <ul className="mt-6 space-y-2 border-t border-slate-100 pt-4 text-xs font-medium text-slate-600">
                    {highlights.map((point) => (
                      <li key={point} className="flex items-center gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Section Pratinjau Grafik Aplikasi Asli */}
        <section id="preview-grafik" className="px-4 py-14 bg-white border-t border-slate-200/80 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 text-center">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                <Activity className="h-3.5 w-3.5" /> Visualisasi Real Aplikasi
              </span>
              <h2 className="mt-3 text-2xl font-black text-slate-900 sm:text-3xl">
                Laporan & Grafik Statistik Aplikasi
              </h2>
              <p className="mt-2 text-sm text-slate-600 max-w-2xl mx-auto">
                Tampilan grafik langsung dari aplikasi BK Nova yang menyajikan analisis data AUM, Tiket Konseling, dan Sosiografis.
              </p>
            </div>

            {/* Showcase Gambar Grafik dari Folder Public */}
            <div className="grid gap-6 md:grid-cols-3">
              {/* Gambar 1: Donut Statistik */}
              <div className="group rounded-2xl border border-slate-200 bg-slate-50/50 p-4 shadow-sm hover:shadow-md transition">
                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white p-2">
                  <img 
                    src="/Donut Statistik.png" 
                    alt="Statistik Donut BK Nova" 
                    className="h-48 w-full object-contain transition duration-300 group-hover:scale-105"
                  />
                </div>
                  <h3 className="mt-4 text-sm font-bold text-slate-800">Persentase Bidang & Proporsi Data (AUM)</h3>
                  <p className="mt-1 text-xs text-slate-500">Visualisasi komposisi masalah siswa dari hasil AUM (Alat Ungkap Masalah).</p>
              </div>

              {/* Gambar 2: Block Statistik */}
              <div className="group rounded-2xl border border-slate-200 bg-slate-50/50 p-4 shadow-sm hover:shadow-md transition">
                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white p-2">
                  <img 
                    src="/Block Statistik.png" 
                    alt="Perbandingan kategori & kelas (AUM)" 
                    className="h-48 w-full object-contain transition duration-300 group-hover:scale-105"
                  />
                </div>
                <h3 className="mt-4 text-sm font-bold text-slate-800">Perbandingan Kategori & Kelas (AUM)</h3>
                <p className="mt-1 text-xs text-slate-500">Memudahkan evaluasi komparatif hasil AUM dan keterlibatan konseling per kelas.</p>
              </div>

              {/* Gambar 3: Line Statistik */}
              <div className="group rounded-2xl border border-slate-200 bg-slate-50/50 p-4 shadow-sm hover:shadow-md transition">
                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white p-2">
                  <img 
                    src="/Line Statistik.png" 
                    alt="Tren waktu & konseling berkala (AUM)" 
                    className="h-48 w-full object-contain transition duration-300 group-hover:scale-105"
                  />
                </div>
                <h3 className="mt-4 text-sm font-bold text-slate-800">Tren Waktu & Konseling Berkala (AUM)</h3>
                <p className="mt-1 text-xs text-slate-500">Memantau riwayat pengajuan tiket konseling dan dinamika masalah tiap bulan berdasarkan data AUM.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Section Rekapitulasi & Analytics */}
        <section id="rekap-grafik" className="bg-slate-100/80 border-y border-slate-200/80 px-4 py-14 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-12 text-center">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                <PieChart className="h-3.5 w-3.5" /> Rekapitulasi & Visualisasi Data
              </span>
              <h2 className="mt-3 text-2xl font-black text-slate-900 sm:text-3xl">
                Semua Fitur Dilengkapi Grafik & Rekap Otomatis
              </h2>
              <p className="mt-2 text-sm text-slate-600 max-w-2xl mx-auto">
                Hemat waktu pembuatan laporan bulanan atau semesteran. Sistem menyajikan hasil AUM, Tiket Konseling, dan Kuesioner Sosiografis dalam bentuk tabel rekap serta diagram visual yang intuitif.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {analyticsFeatures.map(({ icon: Icon, title, description }) => (
                <div key={title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="mb-4 inline-flex rounded-xl bg-indigo-100/80 p-3 text-indigo-700">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">{title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-600">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section Kontak */}
        <section id="kontak" className="px-4 py-14 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl rounded-[1.8rem] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/50 sm:p-8">
            <div className="text-center sm:text-left">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-blue-700">Hubungi Kami</p>
              <h2 className="mt-1 text-2xl font-black text-slate-900">Tertarik Menggunakan BK Nova?</h2>
              <p className="mt-1 text-sm text-slate-600">
                Silakan hubungi pengembang untuk informasi lebih lanjut, demo aplikasi, atau akses pengujian sistem.
              </p>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-4 rounded-2xl bg-blue-50/70 border border-blue-100 p-4 text-slate-800">
              <div className="rounded-full bg-white p-3 text-blue-700 shadow-sm">
                <Camera className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold text-slate-500">Instagram Resmi Pengembang</p>
                <div className="flex flex-wrap gap-4">
                  <a 
                    href="https://instagram.com/h.hrdsh" 
                    target="_blank" 
                    rel="noreferrer" 
                    className="text-base font-bold text-blue-700 hover:underline inline-flex items-center gap-1"
                  >
                    @h.hrdsh
                  </a>
                  <span className="text-slate-300">•</span>
                  <a 
                    href="https://instagram.com/fadligustio" 
                    target="_blank" 
                    rel="noreferrer" 
                    className="text-base font-bold text-blue-700 hover:underline inline-flex items-center gap-1"
                  >
                    @fadligustio
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white px-4 py-6 text-center text-xs text-slate-500 sm:px-6 lg:px-8">
        © 2026 BK Nova — Bimbingan Konseling Digital & Analytics Platform. All rights reserved.
      </footer>
    </div>
  );
}