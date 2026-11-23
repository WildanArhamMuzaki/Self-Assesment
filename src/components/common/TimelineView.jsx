export default function TimelineView({ timeline = [] }) {
  if (!timeline.length) return <p className="muted">Belum ada riwayat aktivitas.</p>;

  return (
    <ul className="timeline-list">
      {timeline.map((item, idx) => (
        <li key={idx} className="timeline-item">
          <div className="timeline-dot" />
          <div>
            <div className="timeline-title">{item.keterangan || item.event}</div>
            {item.waktu && (
              <small className="muted">{new Date(item.waktu).toLocaleString('id-ID')}</small>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}