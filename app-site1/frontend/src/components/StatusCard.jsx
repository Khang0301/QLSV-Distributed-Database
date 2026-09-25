export default function StatusCard({ title, subtitle, detail, kind }) {
  return <div className="status-card">
    <span className={'status-icon ' + kind}>▤</span>
    <div><small>{subtitle}</small><b>{title}</b><span>{detail}</span></div>
    <i className={'indicator ' + kind} />
  </div>;
}
