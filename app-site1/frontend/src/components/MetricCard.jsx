export default function MetricCard({ title, value, note, color, icon }) {
  return <div className="metric">
    <span className={'metric-icon ' + color}>{icon}</span>
    <small>{title}</small><b>{value}</b><span>{note}</span>
    <i className={'spark ' + color}>⌁</i>
  </div>;
}
