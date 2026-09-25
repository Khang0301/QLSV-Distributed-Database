import { Activity, BookOpen, Database, Filter, GraduationCap, LayoutDashboard, Layers3, Network, Settings, UsersRound, Wallet, X } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { navigation } from '../data/navigation.js';

const paths = {
  dashboard: '/', students: '/students', predicates: '/predicates', 'com-min': '/com-min',
  minterms: '/minterms', fragments: '/fragments', 'local-query': '/local-query',
  'distributed-query': '/distributed-query', 'database-status': '/database-status',
};
const icons = {
  dashboard: LayoutDashboard, students: UsersRound, predicates: Filter, 'com-min': Layers3,
  minterms: Network, fragments: Database, 'local-query': Activity,
  'distributed-query': Network, 'database-status': Database,
};

export default function Sidebar({ open, onClose }) {
  return <>
    <button className={'sidebar-scrim ' + (open ? 'visible' : '')} onClick={onClose} aria-label="Đóng menu" />
    <aside className={'sidebar ' + (open ? 'mobile-open' : '')}>
      <div className="brand">
        <span className="brand-mark">P</span>
        <span className="brand-copy"><b>PTIT</b><small>HỌC VIỆN CÔNG NGHỆ<br />BƯU CHÍNH VIỄN THÔNG</small></span>
        <button className="sidebar-close" onClick={onClose} aria-label="Đóng menu"><X size={18} /></button>
      </div>
      <div className="site-switch"><span className="db-icon"><Database size={17} /></span><span><b>Site 1</b><small>Máy chủ chính</small></span><i className="dot" /></div>
      <nav aria-label="Điều hướng chính">{navigation.map(group => <section key={group[0]}>
        <p>{group[0]}</p>{group[1].map(([id, label]) => {
          const Icon = icons[id] || BookOpen;
          return <NavLink key={id} to={paths[id]} end={id === 'dashboard'} title={label}
            className={({ isActive }) => 'nav-link ' + (isActive ? 'selected' : '')}
            onClick={onClose}>
            <Icon className="nav-icon" size={18} strokeWidth={1.8} /><span className="nav-label">{label}</span>
            {id === 'distributed-query' && <small className="new-tag">NEW</small>}
          </NavLink>;
        })}</section>)}</nav>
      <div className="sidebar-bottom">
        <div className="phase"><span><Wallet size={16} /></span><div><b>Đang xây dựng</b><small>Phase 9 · Allocation</small></div><i>↗</i></div>
        <div className="user"><span className="avatar">NA</span><div><b>Nguyễn Văn A</b><small>Quản trị viên</small></div><Settings className="user-settings" size={16} /></div>
      </div>
    </aside>
  </>;
}
