import { Eye, Pencil, Trash2 } from 'lucide-react';
import { cn } from '../../lib/cn.js';
import IconButton from '../ui/IconButton.jsx';

export default function StudentRow({ student, selected, onToggle, onView, onEdit, onDelete }) {
  return <tr className={cn('student-data-row', selected && 'is-selected')} onDoubleClick={() => onView(student)}>
    <td><input type="checkbox" checked={selected} onChange={() => onToggle(student.MA)} aria-label={'Chọn ' + student.MA} /></td>
    <td><span className="student-code">{student.MA}</span></td>
    <td><button className="student-name-button" onClick={() => onView(student)}>{student.HT}</button></td>
    <td>{student.QQ}</td>
    <td>{student.NS}</td>
    <td>{student.GT}</td>
    <td>{student.DT}</td>
    <td><span className={'score-badge ' + (student.TB >= 8 ? 'score-high' : 'score-normal')}>{student.TB.toFixed(2)}</span></td>
    <td><div className="student-row-actions">
      <IconButton label="Xem chi tiết" onClick={() => onView(student)}><Eye size={16} /></IconButton>
      <IconButton label="Chỉnh sửa" onClick={() => onEdit(student)}><Pencil size={15} /></IconButton>
      <IconButton label="Xóa sinh viên" className="danger-action" onClick={() => onDelete(student)}><Trash2 size={15} /></IconButton>
    </div></td>
  </tr>;
}
