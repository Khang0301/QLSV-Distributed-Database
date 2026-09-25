import { X } from 'lucide-react';
import IconButton from '../ui/IconButton.jsx';

const fields = [['MA', 'Mã sinh viên'], ['HT', 'Họ và tên'], ['QQ', 'Quê quán'], ['NS', 'Năm sinh'], ['GT', 'Giới tính'], ['DT', 'Dân tộc'], ['TB', 'Điểm trung bình']];

export default function StudentDrawer({ student, onClose, onEdit }) {
  if (!student) return null;
  return <div className="drawer-backdrop" onMouseDown={event => event.target === event.currentTarget && onClose()}>
    <aside className="student-drawer" role="dialog" aria-modal="true" aria-labelledby="student-drawer-title">
      <div className="drawer-top"><span>HỒ SƠ SINH VIÊN</span><IconButton label="Đóng chi tiết" onClick={onClose}><X size={18} /></IconButton></div>
      <div className="drawer-profile"><span className="student-avatar">{student.HT.slice(-2)}</span><h2 id="student-drawer-title">{student.HT}</h2><span className="student-code">{student.MA}</span></div>
      <div className="drawer-score"><span>Điểm trung bình</span><strong>{student.TB.toFixed(2)}<small> / 10</small></strong></div>
      <div className="drawer-section"><h3>Thông tin sinh viên</h3><dl>{fields.map(([key, label]) => <div key={key}><dt>{label}</dt><dd>{key === 'TB' ? student[key].toFixed(2) : student[key]}</dd></div>)}</dl></div>
      <div className="drawer-actions"><button className="button-secondary" onClick={onClose}>Đóng</button><button className="button-primary" onClick={() => onEdit(student)}>Chỉnh sửa thông tin</button></div>
    </aside>
  </div>;
}
