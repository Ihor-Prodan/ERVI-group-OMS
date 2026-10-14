import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown, Package } from 'lucide-react';
import logo from '../../assets/LOGO-white.png';
import useAuth from '../../hooks/useAuth';
import UserMenu from './UserMenu';
import './LandingHeader.css';

interface LandingHeaderProps {
  onLoginClick: () => void;
}

type NavLink = { id: string; label: string };
type NavEntry = NavLink | { label: string; children: NavLink[] };

const serviceLinks: NavLink[] = [
  { id: 'sluzby', label: 'Prepravné služby' },
  { id: 'paletova-preprava', label: 'Paletová preprava' },
  { id: 'home-delivery', label: 'Home delivery' },
];

const navEntries: NavEntry[] = [
  { id: 'o-nas', label: 'O nás' },
  { label: 'Služby', children: serviceLinks },
  { id: 'proces', label: 'Proces' },
  { id: 'vyhody', label: 'Výhody' },
  { id: 'recenzie', label: 'Recenzie' },
  { id: 'kontakt', label: 'Kontakt' },
];

const allSectionIds = navEntries.flatMap((entry) =>
  'children' in entry ? entry.children.map((c) => c.id) : [entry.id]
);

const LandingHeader: React.FC<LandingHeaderProps> = ({ onLoginClick }) => {
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, isCompany } = useAuth();
  const ctaLabel = isAdmin
    ? 'Prejsť do administrácie'
    : isCompany
    ? 'Prejsť do môjho účtu'
    : 'Prejsť do aplikácie';
  const [activeId, setActiveId] = useState(allSectionIds[0]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);

  useEffect(() => {
    const sections = allSectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    setMenuOpen(false);
    setServicesOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const actionButtons = isAuthenticated ? (
    <UserMenu
      goToApp={{
        label: ctaLabel,
        onClick: () => {
          setMenuOpen(false);
          navigate('/');
        },
      }}
    />
  ) : (
    <button
      className="landing-header__login"
      onClick={() => {
        setMenuOpen(false);
        onLoginClick();
      }}
    >
      Prihlásiť sa
    </button>
  );

  return (
    <header className="landing-header">
      <div className="landing-header__logo" onClick={() => navigate('/ervi-group')}>
        <img src={logo} alt="ERVI Group" />
      </div>

      <nav className={`landing-header__nav${menuOpen ? ' landing-header__nav--open' : ''}`}>
        {navEntries.map((entry) => {
          if ('children' in entry) {
            const isChildActive = entry.children.some((c) => c.id === activeId);

            return (
              <div
                key={entry.label}
                className={`landing-header__dropdown${servicesOpen ? ' is-open' : ''}`}
                onMouseEnter={() => setServicesOpen(true)}
                onMouseLeave={() => setServicesOpen(false)}
              >
                <button
                  type="button"
                  className={`landing-header__dropdown-trigger${isChildActive ? ' is-active' : ''}`}
                  onClick={() => setServicesOpen((prev) => !prev)}
                  aria-expanded={servicesOpen}
                >
                  {entry.label}
                  <ChevronDown size={14} />
                </button>
                <div className="landing-header__dropdown-menu">
                  {entry.children.map((child) => (
                    <a
                      key={child.id}
                      href={`#${child.id}`}
                      className={child.id === activeId ? 'is-active' : undefined}
                      onClick={(e) => {
                        e.preventDefault();
                        scrollToSection(child.id);
                      }}
                    >
                      {child.label}
                    </a>
                  ))}
                </div>
              </div>
            );
          }

          return (
            <a
              key={entry.id}
              href={`#${entry.id}`}
              className={entry.id === activeId ? 'is-active' : undefined}
              onClick={(e) => {
                e.preventDefault();
                scrollToSection(entry.id);
              }}
            >
              {entry.label}
            </a>
          );
        })}

        <a
          href="/#/tracking"
          className="landing-header__track"
          onClick={(e) => {
            e.preventDefault();
            setMenuOpen(false);
            navigate('/tracking');
          }}
        >
          <Package size={14} />
          Sledovať zásielku
        </a>

        <div className="landing-header__actions landing-header__actions--mobile">{actionButtons}</div>
      </nav>

      <div className="landing-header__actions landing-header__actions--desktop">{actionButtons}</div>

      <button
        type="button"
        className="landing-header__menu-toggle"
        onClick={() => setMenuOpen((prev) => !prev)}
        aria-label={menuOpen ? 'Zavrieť menu' : 'Otvoriť menu'}
        aria-expanded={menuOpen}
      >
        {menuOpen ? <X size={22} /> : <Menu size={22} />}
      </button>
    </header>
  );
};

export default LandingHeader;
