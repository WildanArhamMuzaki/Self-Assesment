import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import DisclaimerBanner from './components/common/DisclaimerBanner';
import BerandaPage from './pages/BerandaPage';
import PetunjukPage from './pages/PetunjukPage';
import PengisianPage from './pages/PengisianPage';
import PeriksaPage from './pages/PeriksaPage';
import KonfirmasiPage from './pages/KonfirmasiPage';
import RiwayatPage from './pages/RiwayatPage';
import HasilPage from './pages/HasilPage';
import StatusDetailPage from './pages/StatusDetailPage';
import CekUtsPage from './pages/CekUtsPage';

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <header className="navbar">
          <div className="container nav-inner">
            <span className="brand">Telehealth Self-Assessment</span>
            <nav className="nav-links">
              <NavLink to="/" end>Beranda</NavLink>
              <NavLink to="/riwayat">Riwayat</NavLink>
              <NavLink to="/uts">Cek Progres UTS</NavLink>
            </nav>
          </div>
        </header>

        <main className="container main-content">
          <DisclaimerBanner />

          <Routes>
            <Route path="/" element={<BerandaPage />} />
            <Route path="/forms/:formId/petunjuk" element={<PetunjukPage />} />
            <Route path="/assessments/:id/isi" element={<PengisianPage />} />
            <Route path="/assessments/:id/periksa" element={<PeriksaPage />} />
            <Route path="/assessments/:id/konfirmasi" element={<KonfirmasiPage />} />
            <Route path="/riwayat" element={<RiwayatPage />} />
            <Route path="/assessments/:id/hasil" element={<HasilPage />} />
            <Route path="/assessments/:id/status" element={<StatusDetailPage />} />
            <Route path="/uts" element={<CekUtsPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}