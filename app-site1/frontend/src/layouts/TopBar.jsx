import { Bell, ChevronDown, Menu, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function TopBar({ title, search, onSearch, onOpenMenu }) {
  const navigate = useNavigate();
  return <header className="topbar">
    <button className="mobile-menu-button" onClick={onOpenMenu} aria-label="Mở menu"><Menu size={20} /></button>
    <label className="global-search"><Search size={17} /><input value={search}
      onFocus={() => navigate('/students')} onChange={event => onSearch(event.target.value)}
      placeholder="Tìm sinh viên theo mã, họ tên, quê quán..." aria-label="Tìm kiếm sinh viên" />
    </label>
    <div className="top-right">
      <button className="notification-button" aria-label="Thông báo"><Bell size={18} /><i /></button>
      <span className="top-divider" />
      <span className="avatar user-avatar">NA</span>
      <span className="top-user"><b>Nguyễn Văn A</b><small>Quản trị viên</small></span>
      <button className="account-menu" aria-label="Tùy chọn tài khoản"><ChevronDown size={16} /></button>
    </div>
  </header>;
}
