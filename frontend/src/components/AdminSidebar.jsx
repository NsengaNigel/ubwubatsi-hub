import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NAV_ITEMS = [
  { to: '/admin', icon: 'dashboard', label: 'Dashboard', exact: true },
  { to: '/admin/users', icon: 'group', label: 'All Users' },
  { to: '/admin/projects', icon: 'folder_open', label: 'All Projects' },
  { to: '/admin/verifications', icon: 'verified_user', label: 'Verifications' },
  { to: '/admin/analytics', icon: 'analytics', label: 'Analytics' },
];

export default function AdminSidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <aside className="hidden md:flex flex-col w-60 border-r border-[#dcc1b5] pt-8 px-4 gap-1">
      {NAV_ITEMS.map(item => {
        const isActive = item.exact ? pathname === item.to : pathname.startsWith(item.to);
        return (
          <Link
            key={item.to}
            to={item.to}
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
        onClick={() => { logout(); navigate('/login'); }}
        className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-[#56433a] hover:bg-[rgba(153,66,13,0.04)] transition-colors mt-4"
        style={{ letterSpacing: '0.05em', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' }}
      >
        <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>logout</span>
        Logout
      </button>
    </aside>
  );
}
