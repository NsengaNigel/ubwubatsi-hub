import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NAV_ITEMS = [
  { to: '/admin', icon: 'dashboard', label: 'Dashboard', exact: true },
  { to: '/admin/users', icon: 'group', label: 'All Users' },
  { to: '/admin/projects', icon: 'folder_open', label: 'All Projects' },
  { to: '/admin/verifications', icon: 'verified_user', label: 'Verifications' },
  { to: '/admin/analytics', icon: 'analytics', label: 'Analytics' },
  { to: '/admin/settings', icon: 'settings', label: 'Settings' },
];

function SidebarContent({ pathname, onClose }) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  return (
    <>
      {NAV_ITEMS.map(item => {
        const isActive = item.exact ? pathname === item.to : pathname.startsWith(item.to);
        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={onClose}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors"
            style={{
              letterSpacing: '0.05em',
              background: isActive ? 'rgba(153,66,13,0.06)' : 'transparent',
              color: isActive ? '#99420d' : '#56433a',
            }}
          >
            <span className={`material-symbols-outlined${isActive ? ' fill' : ''}`} style={{ fontSize: '20px' }}>
              {item.icon}
            </span>
            {item.label}
          </Link>
        );
      })}

      <button
        onClick={() => { onClose?.(); logout(); navigate('/login'); }}
        className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-[#56433a] hover:bg-[rgba(153,66,13,0.04)] transition-colors mt-4"
        style={{ letterSpacing: '0.05em', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' }}
      >
        <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>logout</span>
        Logout
      </button>
    </>
  );
}

export default function AdminSidebar() {
  const { pathname } = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile hamburger — fixed bottom-right */}
      <button
        className="fixed bottom-5 right-5 md:hidden z-50 w-12 h-12 bg-[#99420d] text-white rounded-full flex items-center justify-center shadow-lg"
        onClick={() => setMobileOpen(true)}
        aria-label="Open navigation"
      >
        <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>menu</span>
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden" onClick={() => setMobileOpen(false)}>
          <div className="absolute inset-0 bg-black/40" />
          <aside
            className="absolute left-0 top-0 bottom-0 w-64 bg-[#fff8f5] flex flex-col border-r border-[#dcc1b5] pt-8 px-4 gap-1"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="font-bold text-[#99420d]" style={{ fontFamily: "'Hanken Grotesk',sans-serif", fontSize: '20px' }}>Admin</span>
              <button
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center w-8 h-8 text-[#56433a] hover:text-[#99420d]"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>close</span>
              </button>
            </div>
            <SidebarContent pathname={pathname} onClose={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-60 border-r border-[#dcc1b5] pt-8 px-4 gap-1">
        <SidebarContent pathname={pathname} onClose={() => {}} />
      </aside>
    </>
  );
}
