import StudentTable from '../components/StudentTable.jsx';

export default function StudentsPage({ rows, search, onSearch }) {
  return <>
    <div className="toolbar">
      <input value={search} onChange={event => onSearch(event.target.value)} placeholder="⌕　Tìm mã, họ tên, quê quán..." aria-label="Tìm sinh viên" />
      <button className="light-button">☷　Lọc</button><span>60 bản ghi</span>
    </div>
    <section className="panel table-panel"><StudentTable rows={rows} />
      <div className="pagination">Hiển thị {rows.length} trong 60 sinh viên　　‹　 <b>1</b>　2　3　…　8　›</div>
    </section>
    <p className="prototype-note">Bản xem trước dùng dữ liệu mẫu tĩnh; bảng sẽ đọc từ API Site 1 ở phase backend.</p>
  </>;
}
