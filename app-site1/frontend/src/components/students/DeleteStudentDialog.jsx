import { AlertTriangle, X } from 'lucide-react';

export default function DeleteStudentDialog({ students, onCancel, onConfirm }) {
  const bulk = students.length > 1;
  return <div className="modal-backdrop" onMouseDown={event => event.target === event.currentTarget && onCancel()}>
    <section className="confirm-dialog" role="alertdialog" aria-modal="true" aria-labelledby="delete-title">
      <button className="dialog-close" onClick={onCancel} aria-label="Đóng"><X size={18} /></button>
      <span className="warning-icon"><AlertTriangle size={21} /></span>
      <h2 id="delete-title">{bulk ? 'Xóa các sinh viên đã chọn?' : 'Xóa sinh viên?'}</h2>
      <p>{bulk ? 'Bạn có chắc muốn xóa ' + students.length + ' sinh viên đã chọn?' : 'Bạn có chắc muốn xóa sinh viên ' + students[0]?.HT + ' (' + students[0]?.MA + ')?'} Thao tác này không thể hoàn tác trong phiên prototype.</p>
      <div className="modal-footer"><button className="button-secondary" onClick={onCancel}>Hủy</button><button className="button-danger" onClick={onConfirm}>Xóa sinh viên</button></div>
    </section>
  </div>;
}
