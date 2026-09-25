import { Check, RotateCcw, Search } from 'lucide-react';
import Button from '../ui/Button.jsx';

const selectOptions = {
  QQ: ['Tất cả quê quán', 'Hà Nội', 'TP. Hồ Chí Minh', 'Đà Nẵng', 'Cần Thơ', 'Hải Phòng', 'Nghệ An'],
  GT: ['Tất cả giới tính', 'Nam', 'Nữ', 'Khác'],
  DT: ['Tất cả dân tộc', 'Kinh', 'Tày', 'Thái', 'Mường', 'Khmer'],
  TB: ['Mọi mức điểm', 'TB ≥ 8', 'TB < 8'],
  NS: ['Tất cả năm sinh', ...Array.from({ length: 10 }, (_, index) => String(2000 + index))],
};

export default function StudentFilters({ search, onSearch, filters, onFilter, onApply, onReset }) {
  return <section className="student-filter-card" aria-label="Tìm kiếm và lọc sinh viên">
    <label className="student-search">
      <Search size={17} />
      <input value={search} onChange={event => onSearch(event.target.value)} placeholder="Tìm theo mã sinh viên, họ tên, quê quán..." />
    </label>
    <div className="student-filter-controls">
      <select aria-label="Lọc quê quán" value={filters.QQ} onChange={event => onFilter('QQ', event.target.value)}>
        {selectOptions.QQ.map(option => <option key={option} value={option.startsWith('Tất cả') ? '' : option}>{option}</option>)}
      </select>
      <select aria-label="Lọc giới tính" value={filters.GT} onChange={event => onFilter('GT', event.target.value)}>
        {selectOptions.GT.map(option => <option key={option} value={option.startsWith('Tất cả') ? '' : option}>{option}</option>)}
      </select>
      <select aria-label="Lọc dân tộc" value={filters.DT} onChange={event => onFilter('DT', event.target.value)}>
        {selectOptions.DT.map(option => <option key={option} value={option.startsWith('Tất cả') ? '' : option}>{option}</option>)}
      </select>
      <select aria-label="Lọc năm sinh" value={filters.NS} onChange={event => onFilter('NS', event.target.value)}>
        {selectOptions.NS.map(option => <option key={option} value={option.startsWith('Tất cả') ? '' : option}>{option}</option>)}
      </select>
      <select aria-label="Lọc điểm trung bình" value={filters.TB} onChange={event => onFilter('TB', event.target.value)}>
        {selectOptions.TB.map(option => <option key={option} value={option === 'Mọi mức điểm' ? '' : option}>{option}</option>)}
      </select>
      <Button variant="primary" onClick={onApply}><Check size={15} /> Lọc</Button>
      <Button variant="reset" onClick={onReset}><RotateCcw size={14} /> Đặt lại</Button>
    </div>
  </section>;
}
