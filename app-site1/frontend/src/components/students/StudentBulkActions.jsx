import { Download, Trash2, X } from 'lucide-react';

export default function StudentBulkActions({ count, onExport, onDelete, onClear }) {
  return <div className="bulk-actions"><strong>Đã chọn {count} sinh viên</strong>
    <button onClick={onExport}><Download size={15} /> Xuất CSV</button>
    <button className="bulk-delete" onClick={onDelete}><Trash2 size={15} /> Xóa</button>
    <button className="bulk-clear" onClick={onClear} aria-label="Bỏ chọn"><X size={16} /></button>
  </div>;
}
