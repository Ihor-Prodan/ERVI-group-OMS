import React, { useEffect, useState } from 'react';
import './AdminPanel.css';
import Sidebar from '../sidebar/Sidebar';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

const AdminPanel: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 760);
  const [sidebarOpen, setSidebarOpen] = useState(false);


  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 760);
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const active = location.pathname.split('/').pop() || 'home';

  return (
    <div className="admin-panel">
      {isMobile && (
        <button className="mobile-sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
          ☰
        </button>
      )}

      <Sidebar
        active={active}
        onChange={(val) => {
          navigate(`/admin/${val}`);
          if (isMobile) setSidebarOpen(false);
        }}
        className={`${isMobile ? (sidebarOpen ? 'open' : 'closed') : ''}`}
      />

      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminPanel;
