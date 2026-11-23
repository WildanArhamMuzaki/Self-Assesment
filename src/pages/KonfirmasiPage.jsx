import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { telehealthService } from '../services/telehealthService';
import StatusBadges from '../components/common/StatusBadges';

export default function KonfirmasiPage() {
  const { id } = useParams();
  const [statusData, setStatusData] = useState(null);

  useEffect(() => {
    telehealthService.getAssessmentStatus(id).then((res) => setStatusData(res.data));
  }, [id]);

  return (
    <div className="card stack text-center">
      <h2>Formulir Anda Telah Diterima</h2>
      <p>ID Laporan: <strong>{id}</strong></p>

      <div className="center-flex">
        <StatusBadges
          pengiriman={statusData?.status_pengiriman}
          peninjauan={statusData?.status_peninjauan}
        />
      </div>

      <p className="muted">
        {statusData?.pesan || 'Laporan Anda masuk antrean peninjauan petugas kesehatan.'}
      </p>

      <div className="center-flex gap-12">
        <Link to={`/assessments/${id}/status`} className="btn btn-primary">
          Lacak Status Peninjauan
        </Link>
        <Link to={`/assessments/${id}/hasil`} className="btn btn-secondary">
          Lihat Hasil Assessment
        </Link>
      </div>
    </div>
  );
}