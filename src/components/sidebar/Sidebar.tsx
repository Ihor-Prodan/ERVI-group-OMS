import React, { useEffect, useState } from 'react';
import {
  PackagePlus,
  PackageCheck,
  Package,
  PackageX,
  LayoutList,
  CreditCard,
  FileText,
  Users,
  Star,
  MoreHorizontal,
} from 'lucide-react';
import './Sidebar.css';
import useAuth from '../../hooks/useAuth';

interface SidebarProps {
  active: string;
  onChange: (val: string) => void;
  className?: string;
  orderCounts?: Record<string, number>;
}

const COMPACT_BREAKPOINT = 900;
const PRIMARY_COUNT = 4;

const Sidebar: React.FC<SidebarProps> = ({ active, onChange, className, orderCounts = {} }) => {
  const { user } = useAuth();

  const [isCompact, setIsCompact] = useState(window.innerWidth <= COMPACT_BREAKPOINT);
  const [moreOpen, setMoreOpen] = useState(false);

  useEffect(() => {
    const onResize = () => setIsCompact(window.innerWidth <= COMPACT_BREAKPOINT);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  type Role = 'admin' | 'accountant' | 'company';

  const allItems: { id: string; label: string; icon: React.ReactNode; visibleTo: Role[] }[] = [
    { id: 'new-order', label: 'Nová objednávka', icon: <PackagePlus size={18} />, visibleTo: ['company'] },
    { id: 'accepted', label: 'Nové', icon: <PackagePlus size={18} />, visibleTo: ['admin', 'company'] },
    { id: 'sent', label: 'Odoslané', icon: <PackageCheck size={18} />, visibleTo: ['admin', 'company'] },
    { id: 'delivered', label: 'Doručené', icon: <Package size={18} />, visibleTo: ['admin', 'company'] },
    { id: 'paid', label: 'Zaplatené', icon: <CreditCard size={18} />, visibleTo: ['admin', 'company'] },
    { id: 'cancelled', label: 'Zrušené', icon: <PackageX size={18} />, visibleTo: ['admin', 'company'] },
    { id: 'documents', label: 'Dokumenty', icon: <FileText size={18} />, visibleTo: ['admin', 'accountant'] },
    { id: 'home', label: 'Formulár', icon: <LayoutList size={18} />, visibleTo: ['admin'] },
    { id: 'users', label: 'Používatelia', icon: <Users size={18} />, visibleTo: ['admin'] },
    { id: 'reviews', label: 'Recenzie', icon: <Star size={18} />, visibleTo: ['admin'] },
  ];

  const role = user?.role;
  const items = allItems.filter(item => role && item.visibleTo.includes(role));
  const primaryItems = isCompact ? items.slice(0, PRIMARY_COUNT) : items;
  const overflowItems = isCompact ? items.slice(PRIMARY_COUNT) : [];

  return (
    <aside className={`sidebar ${className || ''}`}>
      <div className="sidebar-content">
        <nav className="sidebar-nav">
          {primaryItems.map((item) => {
            const count = orderCounts[item.id];
            const badge = count != null && count > 0 ? (
              <span className="sidebar-badge">{count}</span>
            ) : null;

            return (
              <button
                key={item.id}
                className={`sidebar-item ${active === item.id ? 'active' : ''}`}
                onClick={() => onChange(item.id)}
              >
                {isCompact ? (
                  <span className="sidebar-item-icon">
                    {item.icon}
                    {badge}
                  </span>
                ) : (
                  item.icon
                )}
                <span>{item.label}</span>
                {!isCompact && badge}
              </button>
            );
          })}

          {isCompact && overflowItems.length > 0 && (
            <button
              type="button"
              className={`sidebar-item sidebar-item--more ${moreOpen ? 'active' : ''}`}
              onClick={() => setMoreOpen((v) => !v)}
            >
              <MoreHorizontal size={18} />
              <span>Viac</span>
            </button>
          )}
        </nav>
      </div>

      {isCompact && moreOpen && overflowItems.length > 0 && (
        <>
          <div className="sidebar-more-backdrop" onClick={() => setMoreOpen(false)} />
          <div className="sidebar-more-sheet">
            {overflowItems.map((item) => {
              const count = orderCounts[item.id];
              return (
                <button
                  key={item.id}
                  className={`sidebar-more-item ${active === item.id ? 'active' : ''}`}
                  onClick={() => {
                    onChange(item.id);
                    setMoreOpen(false);
                  }}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {count != null && count > 0 && (
                    <span className="sidebar-badge">{count}</span>
                  )}
                </button>
              );
            })}
          </div>
        </>
      )}
    </aside>
  );
};

export default Sidebar;
