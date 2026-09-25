import AllocationSite from '../components/AllocationSite.jsx';
import MetricCard from '../components/MetricCard.jsx';
import PhaseRow from '../components/PhaseRow.jsx';
import StatusCard from '../components/StatusCard.jsx';
import StudentTable from '../components/StudentTable.jsx';
import { students } from '../data/students.js';

export default function DashboardPage({ onNavigate }) {
  return <>
    <div className="status-grid">
      <StatusCard title="Đang hoạt động" subtitle="SQL SERVER · SITE 1" detail="QLSV_SITE1 · localhost" kind="good" />
      <StatusCard title="Đang chuẩn bị" subtitle="SQL SERVER · SITE 2" detail="Chờ khởi tạo QLSV_SITE2" kind="wait" />
      <StatusCard title="Chưa cấu hình" subtitle="LINKED SERVER" detail="Sẵn sàng sau Phase 10" kind="quiet" />
    </div>
    <div className="metrics">
      <MetricCard title="SINH VIÊN NGUỒN" value="60" note="Dữ liệu seed Phase 4" color="blue" icon="♙" />
      <MetricCard title="FRAGMENTS" value="04" note="Đã kiểm chứng phân hoạch" color="purple" icon="▱" />
      <MetricCard title="PREDICATES TỐI THIỂU" value="02" note="QQ · TB" color="orange" icon="⌕" />
      <MetricCard title="TỶ LỆ TÁI DỰNG" value="100%" note="60 / 60 bản ghi" color="green" icon="◉" />
    </div>
    <div className="dashboard-grid">
      <section className="panel allocation">
        <div className="panel-heading"><div><h2>Phân bổ dữ liệu</h2><p>Phân mảnh ngang theo quê quán và điểm trung bình</p></div><button className="link-button" onClick={() => onNavigate('fragments')}>Xem fragments ↗</button></div>
        <AllocationSite number="01" title="SQL Server · Site 1" subtitle="Máy 1 · localhost" state="ONLINE" fragments={ [['F1', 'Hà Nội · TB ≥ 8', '0'], ['F2', 'Hà Nội · TB < 8', '10']] } />
        <div className="connector"><span />⇄<span /></div>
        <AllocationSite number="02" title="SQL Server · Site 2" subtitle="Máy 2 · chưa kết nối" state="CHUẨN BỊ" fragments={ [['F3', 'Ngoài Hà Nội · TB ≥ 8', '25'], ['F4', 'Ngoài Hà Nội · TB < 8', '25']] } />
        <div className="note"><b>i</b> F3 và F4 đang staging tại Site 1 cho đến khi Site 2 sẵn sàng.</div>
      </section>
      <section className="panel progress">
        <div className="panel-heading"><div><h2>Tiến độ dự án</h2><p>Các mốc database-first</p></div><strong>9<small> / 18</small></strong></div>
        <div className="track"><i /></div>
        <PhaseRow name="QLSV Schema" phase="Phase 3" done />
        <PhaseRow name="Test Data" phase="Phase 4" done />
        <PhaseRow name="COM_MIN & Minterms" phase="Phase 6–7" done />
        <PhaseRow name="Horizontal Fragmentation" phase="Phase 8" done />
        <PhaseRow name="Fragment Allocation" phase="Phase 9" current />
      </section>
    </div>
    <section className="panel recent">
      <div className="panel-heading"><div><h2>Sinh viên gần đây</h2><p>Một vài bản ghi từ QLSV_SITE1</p></div><button className="link-button" onClick={() => onNavigate('students')}>Tất cả sinh viên ↗</button></div>
      <StudentTable rows={students} compact />
    </section>
  </>;
}
