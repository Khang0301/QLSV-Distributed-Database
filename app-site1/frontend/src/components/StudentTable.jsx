export default function StudentTable({ rows, compact = false }) {
  return <div className="table-scroll"><table className={compact ? 'compact' : ''}>
    <thead><tr><th>□</th><th>MÃ SINH VIÊN</th><th>HỌ TÊN</th><th>QUÊ QUÁN</th><th>NĂM SINH</th><th>GIỚI TÍNH</th><th>ĐIỂM TB</th></tr></thead>
    <tbody>{rows.map(row => <tr key={row[0]}>
      <td>□</td><td className="student-id">{row[0]}</td>
      <td><b className="student-name"><i>{row[1].split(' ').at(-1)}</i>{row[1]}</b></td>
      <td>{row[2]}</td><td>{row[3]}</td><td><span className="gender">{row[4]}</span></td>
      <td className={Number(row[5]) >= 8 ? 'high-score' : ''}>{row[5]}</td>
    </tr>)}</tbody>
  </table></div>;
}
