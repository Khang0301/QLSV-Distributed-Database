import { useState } from 'react';
import { X } from 'lucide-react';
import IconButton from '../ui/IconButton.jsx';

const emptyForm = { MA: '', HT: '', QQ: '', NS: '', GT: '', DT: '', TB: '' };
const fields = [
  ['MA', 'Mã sinh viên', 'text', 'VD: B22DCCN001'],
  ['HT', 'Họ và tên', 'text', 'Nhập họ và tên'],
  ['QQ', 'Quê quán', 'text', 'Nhập tỉnh hoặc thành phố'],
  ['NS', 'Năm sinh', 'number', 'VD: 2004'],
  ['GT', 'Giới tính', 'select', 'Chọn giới tính'],
  ['DT', 'Dân tộc', 'text', 'Nhập dân tộc'],
  ['TB', 'Điểm trung bình', 'number', 'Từ 0.00 đến 10.00'],
];

export default function StudentForm({ student, onClose, onSave, existingIds }) {
  const [draft, setDraft] = useState(student
    ? Object.fromEntries(Object.keys(emptyForm).map(key => [key, String(student[key] ?? '')]))
    : emptyForm);
  const [errors, setErrors] = useState({});
  const editing = Boolean(student);

  function update(key, value) {
    setDraft(current => ({ ...current, [key]: value }));
    setErrors(current => ({ ...current, [key]: '' }));
  }

  function submit(event) {
    event.preventDefault();
    const nextErrors = {};
    for (const [key, label] of [['MA', 'Mã sinh viên'], ['HT', 'Họ và tên'], ['QQ', 'Quê quán'], ['NS', 'Năm sinh'], ['GT', 'Giới tính'], ['DT', 'Dân tộc'], ['TB', 'Điểm trung bình']]) {
      if (!String(draft[key]).trim()) nextErrors[key] = label + ' là bắt buộc.';
    }
    if (draft.MA.length > 20) nextErrors.MA = 'Mã sinh viên tối đa 20 ký tự.';
    if (!editing && existingIds.has(draft.MA.trim().toUpperCase())) nextErrors.MA = 'Mã sinh viên này đã tồn tại.';
    if (draft.NS && (!Number.isInteger(Number(draft.NS)) || Number(draft.NS) < 1900 || Number(draft.NS) > 2100)) nextErrors.NS = 'Năm sinh phải nằm trong khoảng 1900–2100.';
    if (draft.TB && (!Number.isFinite(Number(draft.TB)) || Number(draft.TB) < 0 || Number(draft.TB) > 10)) nextErrors.TB = 'Điểm trung bình phải từ 0.00 đến 10.00.';
    if (draft.TB && !/^\d{1,2}(\.\d{1,2})?$/.test(draft.TB)) nextErrors.TB = 'Nhập tối đa hai chữ số thập phân.';
    if (Object.keys(nextErrors).length) { setErrors(nextErrors); return; }

    onSave({
      MA: draft.MA.trim().toUpperCase(), HT: draft.HT.trim(), QQ: draft.QQ.trim(),
      NS: Number(draft.NS), GT: draft.GT, DT: draft.DT.trim(), TB: Number(Number(draft.TB).toFixed(2)),
    });
  }

  return <div className="modal-backdrop" onMouseDown={event => event.target === event.currentTarget && onClose()}>
    <section className="student-form-modal" role="dialog" aria-modal="true" aria-labelledby="student-form-title">
      <div className="modal-heading"><div><span>HỒ SƠ QLSV</span><h2 id="student-form-title">{editing ? 'Chỉnh sửa sinh viên' : 'Thêm sinh viên mới'}</h2><p>Nhập thông tin theo schema QLSV.</p></div><IconButton label="Đóng biểu mẫu" onClick={onClose}><X size={18} /></IconButton></div>
      <form onSubmit={submit} noValidate>
        <div className="student-form-grid">{fields.map(([key, label, type, placeholder]) => <label className={'form-field ' + (errors[key] ? 'has-error' : '')} key={key}>
          <span>{label}<i>*</i></span>
          {type === 'select'
            ? <select value={draft[key]} onChange={event => update(key, event.target.value)}><option value="">{placeholder}</option><option>Nam</option><option>Nữ</option><option>Khác</option></select>
            : <input type={type} min={key === 'NS' ? 1900 : key === 'TB' ? 0 : undefined} max={key === 'NS' ? 2100 : key === 'TB' ? 10 : undefined} step={key === 'TB' ? 0.01 : 1} placeholder={placeholder} value={draft[key]} disabled={key === 'MA' && editing} maxLength={key === 'MA' ? 20 : undefined} onChange={event => update(key, event.target.value)} />}
          {errors[key] && <small className="field-error">{errors[key]}</small>}
        </label>)}</div>
        <div className="modal-footer"><button type="button" className="button-secondary" onClick={onClose}>Hủy</button><button type="submit" className="button-primary">{editing ? 'Lưu thay đổi' : 'Lưu sinh viên'}</button></div>
      </form>
    </section>
  </div>;
}
