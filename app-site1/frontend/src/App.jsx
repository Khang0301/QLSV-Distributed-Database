import React, { useState } from 'react';
import { BrowserRouter, Outlet, Route, Routes, useLocation, useNavigate, useOutletContext } from 'react-router-dom';
import { Toaster } from 'sonner';
import PageHeading from './components/PageHeading.jsx';
import Sidebar from './layouts/Sidebar.jsx';
import TopBar from './layouts/TopBar.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import PrototypePage from './pages/PrototypePage.jsx';
import StudentsPage from './pages/students/StudentsPage.jsx';
import { pageDescriptions } from './data/navigation.js';

const pageTitles = {
  '/': 'Dashboard', '/students': 'Quản lý sinh viên', '/predicates': 'Simple Predicates',
  '/com-min': 'COM_MIN', '/minterms': 'Minterms', '/fragments': 'Fragments',
  '/local-query': 'Local Query', '/distributed-query': 'Distributed Query',
  '/database-status': 'Trạng thái Database',
};
const routeIds = {
  '/': 'dashboard', '/students': 'students', '/predicates': 'predicates', '/com-min': 'com-min',
  '/minterms': 'minterms', '/fragments': 'fragments', '/local-query': 'local-query',
  '/distributed-query': 'distributed-query', '/database-status': 'database-status',
};
const routes = {
  dashboard: '/', students: '/students', predicates: '/predicates', 'com-min': '/com-min',
  minterms: '/minterms', fragments: '/fragments', 'local-query': '/local-query',
  'distributed-query': '/distributed-query', 'database-status': '/database-status',
};

function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [queryRan, setQueryRan] = useState(false);
  const pathname = location.pathname in pageTitles ? location.pathname : '/';
  const title = pageTitles[pathname];
  function onNavigate(id) {
    navigate(routes[id] || '/');
    setQueryRan(false);
  }
  return <div className="shell">
    <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />
    <main>
      <TopBar title={title} search={search} onSearch={setSearch} onOpenMenu={() => setMenuOpen(true)} />
      <div className="content">
        <PageHeading eyebrow={pathname === '/' ? 'HỌC VIỆN CÔNG NGHỆ BƯU CHÍNH VIỄN THÔNG' : 'QLSV / SITE 1'}
          title={pathname === '/' ? 'Tổng quan hệ thống' : title}
          description={pathname === '/' ? 'Theo dõi tình trạng cơ sở dữ liệu phân tán của bạn.' : pageDescriptions[routeIds[pathname]]}
          action={pathname === '/' ? <button className="light-button" onClick={() => onNavigate('database-status')}>Kiểm tra hệ thống</button> : null} />
        <Outlet context={{ search, setSearch, onNavigate, queryRan, setQueryRan, page: routeIds[pathname] }} />
      </div>
      <footer><span><i className="dot" /> SQL Server · Site 1</span><span>QLSV Distributed Database　·　v0.1.0</span></footer>
    </main>
    <Toaster position="top-right" richColors closeButton />
  </div>;
}

function DashboardHome() {
  const { onNavigate } = useOutletContext();
  return <DashboardPage onNavigate={onNavigate} />;
}

function PrototypeRoute() {
  const { page, queryRan, setQueryRan, onNavigate } = useOutletContext();
  return <PrototypePage page={page} ran={queryRan} onRun={() => setQueryRan(true)} onNavigate={onNavigate} />;
}

export default function App() {
  return <BrowserRouter><Routes>
    <Route element={<DashboardLayout />}>
      <Route index element={<DashboardHome />} />
      <Route path="students" element={<StudentsPage />} />
      <Route path="predicates" element={<PrototypeRoute />} />
      <Route path="com-min" element={<PrototypeRoute />} />
      <Route path="minterms" element={<PrototypeRoute />} />
      <Route path="fragments" element={<PrototypeRoute />} />
      <Route path="local-query" element={<PrototypeRoute />} />
      <Route path="distributed-query" element={<PrototypeRoute />} />
      <Route path="database-status" element={<PrototypeRoute />} />
      <Route path="*" element={<DashboardHome />} />
    </Route>
  </Routes></BrowserRouter>;
}
