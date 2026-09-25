export default function TopBar({ title }) {
  return <header className="topbar">
    <div className="crumb">QLSV <span>›</span> <b>{title}</b></div>
    <div className="top-right">
      <span className="environment"><i className="dot" /> LOCAL ENVIRONMENT　⌄</span>
      <button className="bell" aria-label="Thông báo">♧<i /></button>
      <span className="avatar">TK</span>
    </div>
  </header>;
}
