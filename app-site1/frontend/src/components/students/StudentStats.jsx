import { GraduationCap, MapPinned, TrendingUp, Users } from 'lucide-react';

export default function StudentStats({ rows }) {
  const stats = [
    { label: 'Tổng sinh viên', value: rows.length, note: 'Tất cả bản ghi QLSV', Icon: Users, tone: 'red' },
    { label: 'Điểm TB từ 8 trở lên', value: rows.filter(student => student.TB >= 8).length, note: 'Nhóm điểm cao', Icon: TrendingUp, tone: 'green' },
    { label: 'Quê quán Hà Nội', value: rows.filter(student => student.QQ === 'Hà Nội').length, note: 'Thuộc fragment Hà Nội', Icon: MapPinned, tone: 'blue' },
    { label: 'Quê quán khác', value: rows.filter(student => student.QQ !== 'Hà Nội').length, note: 'Thuộc nhóm ngoài Hà Nội', Icon: GraduationCap, tone: 'purple' },
  ];
  return <section className="student-stats" aria-label="Thống kê sinh viên">
    {stats.map(({ label, value, note, Icon, tone }) => <article className="student-stat-card" key={label}>
      <span className={'student-stat-icon ' + tone}><Icon size={19} strokeWidth={1.8} /></span>
      <div className="student-stat-copy"><span>{label}</span><strong>{value.toLocaleString('vi-VN')}</strong><small>{note}</small></div>
    </article>)}
  </section>;
}
