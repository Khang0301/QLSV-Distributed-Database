import { useMemo, useState } from 'react';
import { Download, Plus, UsersRound } from 'lucide-react';
import { toast } from 'sonner';
import StudentBulkActions from '../../components/students/StudentBulkActions.jsx';
import DeleteStudentDialog from '../../components/students/DeleteStudentDialog.jsx';
import StudentDrawer from '../../components/students/StudentDrawer.jsx';
import StudentFilters from '../../components/students/StudentFilters.jsx';
import StudentForm from '../../components/students/StudentForm.jsx';
import StudentPagination from '../../components/students/StudentPagination.jsx';
import StudentStats from '../../components/students/StudentStats.jsx';
import StudentTable from '../../components/students/StudentTable.jsx';
import Button from '../../components/ui/Button.jsx';
import { students as seedStudents } from '../../data/students.js';
import { useOutletContext } from 'react-router-dom';

const noFilters = { QQ: '', GT: '', DT: '', NS: '', TB: '' };

function exportCsv(records) {
  if (!records.length) {
    toast.info('Không có sinh viên để xuất.');
    return;
  }
  const columns = ['MA', 'HT', 'QQ', 'NS', 'GT', 'DT', 'TB'];
  const quote = value => '"' + String(value).replaceAll('"', '""') + '"';
  const csv = '\uFEFF' + [columns, ...records.map(student => columns.map(key => student[key]))]
    .map(row => row.map(quote).join(',')).join('\r\n');
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'qlsv-students.csv';
  anchor.click();
  URL.revokeObjectURL(url);
  toast.success(records.length + ' sinh viên đã được xuất ra CSV.');
}

export default function StudentsPage() {
  const { search, setSearch } = useOutletContext();
  const [students, setStudents] = useState(seedStudents);
  const [draftFilters, setDraftFilters] = useState(noFilters);
  const [filters, setFilters] = useState(noFilters);
  const [sort, setSort] = useState({ key: 'MA', direction: 'asc' });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedIds, setSelectedIds] = useState([]);
  const [activeStudent, setActiveStudent] = useState(null);
  const [formStudent, setFormStudent] = useState(undefined);
  const [deleteTargets, setDeleteTargets] = useState(null);

  const filteredRows = useMemo(() => {
    const term = search.trim().toLocaleLowerCase('vi');
    return students.filter(student => {
      const matchesSearch = !term || [student.MA, student.HT, student.QQ, student.GT, student.DT]
        .some(value => String(value).toLocaleLowerCase('vi').includes(term));
      const matchesScore = !filters.TB || (filters.TB === 'TB ≥ 8' ? student.TB >= 8 : student.TB < 8);
      return matchesSearch
        && (!filters.QQ || student.QQ === filters.QQ)
        && (!filters.GT || student.GT === filters.GT)
        && (!filters.DT || student.DT === filters.DT)
        && (!filters.NS || String(student.NS) === filters.NS)
        && matchesScore;
    }).sort((left, right) => {
      const a = left[sort.key];
      const b = right[sort.key];
      const order = typeof a === 'number' ? a - b : String(a).localeCompare(String(b), 'vi');
      return sort.direction === 'asc' ? order : -order;
    });
  }, [students, search, filters, sort]);

  const pageCount = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  const pageRows = filteredRows.slice((page - 1) * pageSize, page * pageSize);
  const allVisibleSelected = pageRows.length > 0 && pageRows.every(student => selectedIds.includes(student.MA));
  const selectedStudents = students.filter(student => selectedIds.includes(student.MA));

  function updateSearch(value) { setSearch(value); setPage(1); }
  function updateDraftFilter(key, value) { setDraftFilters(current => ({ ...current, [key]: value })); }
  function applyFilters() {
    setFilters(draftFilters);
    setPage(1);
    setSelectedIds([]);
  }
  function resetFilters() {
    setSearch('');
    setDraftFilters(noFilters);
    setFilters(noFilters);
    setPage(1);
    setSelectedIds([]);
  }
  function toggleSort(key) {
    setSort(current => ({ key, direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc' }));
  }
  function toggleStudent(id) {
    setSelectedIds(current => current.includes(id) ? current.filter(value => value !== id) : [...current, id]);
  }
  function toggleVisible() {
    const visibleIds = pageRows.map(student => student.MA);
    setSelectedIds(current => allVisibleSelected
      ? current.filter(id => !visibleIds.includes(id))
      : [...new Set([...current, ...visibleIds])]);
  }
  function saveStudent(student) {
    if (formStudent === null) {
      setStudents(current => [student, ...current]);
      setPage(1);
      toast.success('Đã thêm sinh viên vào dữ liệu prototype.');
    } else {
      setStudents(current => current.map(item => item.MA === student.MA ? student : item));
      toast.success('Đã cập nhật sinh viên trong dữ liệu prototype.');
    }
    setFormStudent(undefined);
  }
  function confirmDelete() {
    const ids = new Set(deleteTargets.map(student => student.MA));
    setStudents(current => current.filter(student => !ids.has(student.MA)));
    setSelectedIds(current => current.filter(id => !ids.has(id)));
    if (activeStudent && ids.has(activeStudent.MA)) setActiveStudent(null);
    toast.success('Đã xóa ' + ids.size + ' sinh viên khỏi dữ liệu prototype.');
    setDeleteTargets(null);
  }

  return <div className="students-page flex flex-col gap-4">
    <StudentStats rows={students} />
    <StudentFilters search={search} onSearch={updateSearch} filters={draftFilters}
      onFilter={updateDraftFilter} onApply={applyFilters} onReset={resetFilters} />
    <section className="student-list-card">
      <div className="student-list-heading">
        <div className="student-list-title"><span className="list-title-icon"><UsersRound size={18} /></span><div><h2>Danh sách sinh viên</h2><p>{filteredRows.length.toLocaleString('vi-VN')} kết quả phù hợp</p></div></div>
        <div className="student-list-actions">
          <Button onClick={() => exportCsv(filteredRows)}><Download size={15} /> Xuất CSV</Button>
          <Button variant="primary" onClick={() => setFormStudent(null)}><Plus size={16} /> Thêm sinh viên</Button>
        </div>
      </div>
      {selectedIds.length > 0 && <StudentBulkActions count={selectedIds.length}
        onExport={() => exportCsv(selectedStudents)}
        onDelete={() => setDeleteTargets(selectedStudents)}
        onClear={() => setSelectedIds([])} />}
      <StudentTable rows={pageRows} selectedIds={selectedIds} sort={sort} onSort={toggleSort}
        onToggle={toggleStudent} onToggleAll={toggleVisible} allVisibleSelected={allVisibleSelected}
        onView={setActiveStudent} onEdit={student => setFormStudent(student)}
        onDelete={student => setDeleteTargets([student])} />
      <StudentPagination page={page} pageSize={pageSize} total={filteredRows.length}
        onPage={setPage} onPageSize={size => { setPageSize(size); setPage(1); }} />
    </section>
    <p className="prototype-note">Thao tác thêm, sửa và xóa chỉ thay đổi dữ liệu trong phiên trình duyệt. Chưa kết nối SQL Server.</p>

    <StudentDrawer student={activeStudent} onClose={() => setActiveStudent(null)}
      onEdit={student => { setActiveStudent(null); setFormStudent(student); }} />
    {formStudent !== undefined && <StudentForm student={formStudent || undefined} existingIds={new Set(students.map(student => student.MA))}
      onClose={() => setFormStudent(undefined)} onSave={saveStudent} />}
    {deleteTargets && <DeleteStudentDialog students={deleteTargets} onCancel={() => setDeleteTargets(null)} onConfirm={confirmDelete} />}
  </div>;
}
