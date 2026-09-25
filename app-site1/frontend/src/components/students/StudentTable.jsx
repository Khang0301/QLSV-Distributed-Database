import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import StudentRow from './StudentRow.jsx';

const columns = [
  ['MA', 'MÃ SINH VIÊN'], ['HT', 'HỌ VÀ TÊN'], ['QQ', 'QUÊ QUÁN'],
  ['NS', 'NĂM SINH'], ['GT', 'GIỚI TÍNH'], ['DT', 'DÂN TỘC'], ['TB', 'ĐIỂM TB'],
];

export default function StudentTable({ rows, selectedIds, sort, onSort, onToggle, onView, onEdit, onDelete, allVisibleSelected, onToggleAll }) {
  return <div className="student-table-scroll">
    <table className="student-table">
      <thead><tr>
        <th className="select-column"><input type="checkbox" checked={allVisibleSelected} onChange={onToggleAll} aria-label="Chọn tất cả sinh viên đang hiển thị" /></th>
        {columns.map(([key, label]) => <th key={key}>
          {['MA', 'HT', 'NS', 'TB'].includes(key)
            ? <button className="sort-button" onClick={() => onSort(key)}>{label}{sort.key === key ? sort.direction === 'asc' ? <ArrowUp size={13} /> : <ArrowDown size={13} /> : <ArrowUpDown size={13} />}</button>
            : label}
        </th>)}
        <th className="actions-column">THAO TÁC</th>
      </tr></thead>
      <tbody>{rows.length ? rows.map(student => <StudentRow key={student.MA}
        student={student} selected={selectedIds.includes(student.MA)} onToggle={onToggle}
        onView={onView} onEdit={onEdit} onDelete={onDelete} />)
        : <tr><td className="empty-state" colSpan={9}>Không tìm thấy sinh viên phù hợp với điều kiện lọc.</td></tr>}
      </tbody>
    </table>
  </div>;
}
