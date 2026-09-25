import { useMemo, useState } from 'react';
import PageHeading from './components/PageHeading.jsx';
import Sidebar from './layouts/Sidebar.jsx';
import TopBar from './layouts/TopBar.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import PrototypePage from './pages/PrototypePage.jsx';
import StudentsPage from './pages/StudentsPage.jsx';
import { navigation, pageDescriptions } from './data/navigation.js';
import { students } from './data/students.js';

export default function App() {
  const [page, setPage] = useState('dashboard');
  const [search, setSearch] = useState('');
  const [ran, setRan] = useState(false);
  const pageTitle = navigation.flatMap(group => group[1]).find(item => item[0] === page)?.[1] || 'Dashboard';
  const filteredStudents = useMemo(
    () => students.filter(row => row.join(' ').toLowerCase().includes(search.toLowerCase())),
    [search],
  );
  const goToPage = nextPage => {
    setPage(nextPage);
    setRan(false);
  };

  return <div className="shell">
    <Sidebar page={page} onNavigate={goToPage} />
    <main>
      <TopBar title={pageTitle} />
      <div className="content">
        <PageHeading
          eyebrow={page === 'dashboard' ? 'THỨ SÁU, 25 THÁNG 9, 2026' : 'QLSV / SITE 1'}
          title={page === 'dashboard' ? 'Tổng quan hệ thống' : pageTitle}
          description={page === 'dashboard'
            ? 'Theo dõi tình trạng cơ sở dữ liệu phân tán của bạn.'
            : pageDescriptions[page]}
          action={page === 'dashboard'
            ? <button className="light-button" onClick={() => goToPage('database-status')}>◉　Kiểm tra hệ thống</button>
            : null}
        />
        {page === 'dashboard' && <DashboardPage onNavigate={goToPage} />}
        {page === 'students' && <StudentsPage rows={filteredStudents} search={search} onSearch={setSearch} />}
        {page !== 'dashboard' && page !== 'students' &&
          <PrototypePage page={page} ran={ran} onRun={() => setRan(true)} onNavigate={goToPage} />}
      </div>
      <footer><span><i className="dot" /> System operational</span><span>QLSV Distributed Database　·　v0.1.0</span></footer>
    </main>
  </div>;
}
