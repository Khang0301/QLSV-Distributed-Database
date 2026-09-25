import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function StudentPagination({ page, pageSize, total, onPage, onPageSize }) {
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const first = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const last = Math.min(page * pageSize, total);
  const start = Math.max(1, Math.min(page - 2, pageCount - 4));
  const pages = Array.from({ length: Math.min(5, pageCount) }, (_, index) => start + index);
  return <div className="student-pagination">
    <span>Hiển thị <b>{first}–{last}</b> trong tổng số <b>{total.toLocaleString('vi-VN')}</b> sinh viên</span>
    <div className="pagination-controls">
      <label>Dòng mỗi trang <select value={pageSize} onChange={event => onPageSize(Number(event.target.value))}><option>10</option><option>20</option><option>50</option><option>100</option></select></label>
      <button disabled={page <= 1} onClick={() => onPage(page - 1)} aria-label="Trang trước"><ChevronLeft size={16} /></button>
      {pages.map(number => <button key={number} className={page === number ? 'page-active' : ''} onClick={() => onPage(number)}>{number}</button>)}
      {pageCount > 5 && <span className="page-ellipsis">…</span>}
      {pageCount > 5 && <button onClick={() => onPage(pageCount)} className={page === pageCount ? 'page-active' : ''}>{pageCount}</button>}
      <button disabled={page >= pageCount} onClick={() => onPage(page + 1)} aria-label="Trang sau"><ChevronRight size={16} /></button>
    </div>
  </div>;
}
