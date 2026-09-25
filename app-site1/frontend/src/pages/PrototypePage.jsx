import StatusCard from '../components/StatusCard.jsx';

function PredicateCards() {
  const predicates = [
    ['p1', 'QQ = N’Hà Nội’', 'Phân biệt nhóm phục vụ Site 1'],
    ['p2', 'TB ≥ 8', 'Nhóm điểm cao'],
    ['p3', 'TB < 8', 'Phủ định của p2'],
  ];
  return <div className="three-cards">{predicates.map(item =>
    <section className="panel info-card" key={item[0]}><span>{item[0]}</span><h2>{item[1]}</h2><p>{item[2]}</p></section>
  )}</div>;
}

function ComMinPage() {
  return <section className="panel info-panel">
    <div className="success"><b>✓　COM_MIN hoàn tất</b><span>Hai predicate tạo đủ bốn lớp truy cập đồng nhất.</span></div>
    <h2>Tập tối thiểu</h2>
    <p><b>Giữ:</b> p1 · p2　　<b>Loại:</b> p3 · p4–p7</p>
    <p>Không thể bỏ p1 hoặc p2 mà vẫn giữ tính đầy đủ theo workload giả định.</p>
  </section>;
}

function MintermsPage() {
  const minterms = [
    ['m1', 'p1 AND p2', 'Hà Nội · TB ≥ 8', 'F1'],
    ['m2', 'p1 AND NOT p2', 'Hà Nội · TB < 8', 'F2'],
    ['m3', 'NOT p1 AND p2', 'Ngoài Hà Nội · TB ≥ 8', 'F3'],
    ['m4', 'NOT p1 AND NOT p2', 'Ngoài Hà Nội · TB < 8', 'F4'],
  ];
  return <section className="panel info-panel"><h2>Bốn vị từ hội sơ cấp</h2>
    {minterms.map(item => <div className="minterm" key={item[0]}><b>{item[0]}</b><code>{item[1]}</code><span>{item[2]}</span><small>{item[3]}</small></div>)}
  </section>;
}

function FragmentsPage() {
  const fragments = [
    ['F1', 'Hà Nội · TB ≥ 8', '0', 'Site 1'], ['F2', 'Hà Nội · TB < 8', '10', 'Site 1'],
    ['F3', 'Ngoài Hà Nội · TB ≥ 8', '25', 'Site 2'], ['F4', 'Ngoài Hà Nội · TB < 8', '25', 'Site 2'],
  ];
  return <div className="fragment-grid">{fragments.map(item =>
    <section className="panel info-card" key={item[0]}><span>{item[0]}　·　{item[3]}</span><p>{item[1]}</p><h2>{item[2]} <small>sinh viên</small></h2></section>
  )}</div>;
}

function QueryPage({ distributed, ran, onRun, onNavigate }) {
  const sql = distributed
    ? 'SELECT * FROM dbo.Fragment_1\nUNION ALL SELECT * FROM dbo.Fragment_2\nUNION ALL SELECT * FROM [SITE2_SQL].QLSV_SITE2.dbo.Fragment_3\nUNION ALL SELECT * FROM [SITE2_SQL].QLSV_SITE2.dbo.Fragment_4;'
    : 'SELECT * FROM dbo.Fragment_1\nUNION ALL SELECT * FROM dbo.Fragment_2;';
  return <section className="panel query-panel">
    <small>{distributed ? 'DISTRIBUTED QUERY · LINKED SERVER' : 'LOCAL QUERY · SITE 1'}</small>
    <h2>{distributed ? 'Tái dựng toàn bộ sinh viên' : 'Đọc các fragment cục bộ'}</h2>
    <pre>{sql}</pre>
    <div className="query-bottom"><span>⚙　SQL Server execution</span>
      <button className="primary-button" onClick={distributed ? () => onNavigate('database-status') : onRun}>{distributed ? 'Kiểm tra Site 2' : '▶　Chạy truy vấn'}</button>
    </div>
    {ran && <p className="success">Local query sẵn sàng · F1 + F2 · 10 dòng trong seed.</p>}
  </section>;
}

function DatabaseStatusPage() {
  return <div className="status-detail">
    <StatusCard title="SQL Server Site 1" subtitle="QLSV_SITE1 · localhost" detail="ĐANG HOẠT ĐỘNG" kind="good" />
    <StatusCard title="SQL Server Site 2" subtitle="QLSV_SITE2 · Máy 2" detail="CHƯA KHỞI TẠO" kind="wait" />
    <StatusCard title="Linked Server" subtitle="SITE2_SQL" detail="CHƯA CẤU HÌNH" kind="quiet" />
  </div>;
}

export default function PrototypePage({ page, ran, onRun, onNavigate }) {
  switch (page) {
    case 'predicates': return <PredicateCards />;
    case 'com-min': return <ComMinPage />;
    case 'minterms': return <MintermsPage />;
    case 'fragments': return <FragmentsPage />;
    case 'local-query': return <QueryPage ran={ran} onRun={onRun} />;
    case 'distributed-query': return <QueryPage distributed ran={ran} onNavigate={onNavigate} />;
    default: return <DatabaseStatusPage />;
  }
}
