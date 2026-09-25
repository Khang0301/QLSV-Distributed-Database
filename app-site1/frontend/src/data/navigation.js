export const navigation = [
  ['TỔNG QUAN', [['dashboard', 'Dashboard', '◫']]],
  ['DATABASE', [['students', 'Sinh viên', '♙'], ['predicates', 'Simple Predicates', '⌕'], ['com-min', 'COM_MIN', '▱'], ['minterms', 'Minterms', '◇'], ['fragments', 'Fragments', '▤']]],
  ['TRUY VẤN', [['local-query', 'Local Query', '⌘'], ['distributed-query', 'Distributed Query', '⇄']]],
  ['HỆ THỐNG', [['database-status', 'Trạng thái Database', '◉']]],
];

export const pageDescriptions = {
  students: 'Tìm kiếm, lọc và quản lý hồ sơ sinh viên theo schema QLSV.',
  predicates: 'Điều kiện truy vấn ứng viên từ workload giả định.',
  'com-min': 'Tập predicate đầy đủ và tối thiểu theo workload demo.',
  minterms: 'Bốn vị từ hội sơ cấp tạo từ p1 và p2.',
  fragments: 'Phân mảnh ngang theo quê quán và điểm trung bình.',
  'local-query': 'Truy vấn cục bộ trên dữ liệu Site 1.',
  'distributed-query': 'Truy vấn SQL Server qua Linked Server khi Site 2 sẵn sàng.',
  'database-status': 'Tình trạng kết nối các thành phần cơ sở dữ liệu.',
};
