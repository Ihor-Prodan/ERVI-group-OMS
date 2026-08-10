import React, { useEffect, useState } from 'react';
import './AdminPanel.css';
import Sidebar from '../sidebar/Sidebar';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { getOrderCounts } from '../API/API';
import useAuth from '../../hooks/useAuth';

const AdminPanel: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 760);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [orderCounts, setOrderCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!isAdmin) return;
    getOrderCounts().then(setOrderCounts).catch(() => {});
  }, [isAdmin]);


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
        orderCounts={orderCounts}
      />

      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminPanel;
