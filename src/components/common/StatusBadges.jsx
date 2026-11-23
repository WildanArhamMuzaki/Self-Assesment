const PENINJAUAN_COLOR = {
  belum_dikirim: 'badge-gray',
  menunggu_peninjauan: 'badge-blue',
  sedang_ditinjau: 'badge-indigo',
  perlu_klarifikasi: 'badge-amber',
  klarifikasi_dijawab: 'badge-cyan',
  sudah_ditinjau: 'badge-green',
};

export default function StatusBadges({ pengiriman, peninjauan }) {
  return (
    <div className="badge-group">
      {pengiriman && (
        <span className={`badge ${pengiriman.kode === 'terkirim' ? 'badge-teal' : 'badge-gray'}`}>
          Pengiriman: {pengiriman.label}
        </span>
      )}
      {peninjauan && (
        <span className={`badge ${PENINJAUAN_COLOR[peninjauan.kode] || 'badge-gray'}`}>
          Peninjauan: {peninjauan.label}
        </span>
      )}
    </div>
  );
}