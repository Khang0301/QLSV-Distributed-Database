import { navigation } from '../data/navigation.js';

export default function Sidebar({ page, onNavigate }) {
  return <aside className="sidebar">
    <div className="brand"><span className="brand-mark">Q<i /></span><span><b>QLSV</b><small>DISTRIBUTED DB</small></span><button className="collapse" aria-label="Thu gọn menu">‹</button></div>
    <div className="site-switch"><span className="db-icon">▤</span><span><b>Site 1</b><small>Máy chủ chính</small></span><i className="dot" /></div>
    <nav aria-label="Điều hướng chính">{navigation.map(group => <section key={group[0]}>
      <p>{group[0]}</p>{group[1].map(([id, label, icon]) => <button key={id} title={label} className={'nav-link ' + (page === id ? 'selected' : '')} onClick={() => onNavigate(id)}>
        <span className="nav-icon" aria-hidden="true">{icon}</span><span className="nav-label">{label}</span>
        {id === 'distributed-query' && <small className="new-tag">NEW</small>}
      </button>)}
    </section>)}</nav>
    <div className="sidebar-bottom">
      <div className="phase"><span>✦</span><div><b>Đang xây dựng</b><small>Phase 9 · Allocation</small></div><i>↗</i></div>
      <div className="user"><span className="avatar">M1</span><div><b>Máy 1</b><small>Administrator</small></div><span className="dots">···</span></div>
    </div>
  </aside>;
}
