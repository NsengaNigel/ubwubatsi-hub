import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

function getInitials(name) {
  if (!name) return '??';
  const parts = name.trim().split(' ');
  return (parts[0][0] + (parts[1] ? parts[1][0] : '')).toUpperCase();
}

export default function Navbar() {
  const { user, logout } = useAuth();
  const { pathname } = useLocation();
  const [unread, setUnread] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [acceptedCount, setAcceptedCount] = useState(0);

  useEffect(() => {
    if (!user) return;

    const fetchUnread = () =>
      api.get('/api/messages/unread-count')
        .then(res => setUnread(res.data.count))
        .catch(() => {});
    fetchUnread();
    const msgInterval = setInterval(fetchUnread, 30000);

    let exprInterval;
    if (user.role === 'client') {
      const fetchPending = () =>
        api.get('/api/expressions/client')
          .then(res => setPendingCount(res.data.filter(e => e.status === 'pending').length))
          .catch(() => {});
      fetchPending();
      exprInterval = setInterval(fetchPending, 60000);
    } else if (user.role === 'professional') {
      const fetchAccepted = () =>
        api.get('/api/expressions/professional')
          .then(res => setAcceptedCount(res.data.filter(e => e.status === 'accepted').length))
          .catch(() => {});
      fetchAccepted();
      exprInterval = setInterval(fetchAccepted, 60000);
    }

    return () => {
      clearInterval(msgInterval);
      if (exprInterval) clearInterval(exprInterval);
    };
  }, [user]);

  const navLink = (to, label) => (
    <Link
      to={to}
      className={`text-sm font-medium transition-colors ${
        pathname === to ? 'text-[#99420d] border-b-2 border-[#99420d] pb-0.5' : 'text-[#56433a] hover:text-[#99420d]'
      }`}
    >
      {label}
    </Link>
  );

  const settingsPath = user?.role === 'client'
    ? '/client-settings'
    : user?.role === 'professional'
      ? '/professional-settings'
      : '/admin/settings';

  return (
    <nav className="bg-[#fff8f5] w-full top-0 sticky border-b border-[#dcc1b5] z-50">
      <div className="flex justify-between items-center h-20 px-4 md:px-10 max-w-[1280px] mx-auto">

        <div className="flex items-center gap-8">
          <Link
            to="/"
            className="font-bold text-[#99420d]"
            style={{ fontFamily: "'Hanken Grotesk',sans-serif", fontSize: '24px' }}
          >
            Ubwubatsi Hub
          </Link>

          <div className="hidden md:flex gap-6">
            {!user && (
              <>
                {navLink('/browse-professionals', 'Find Experts')}
                <a href="/#how-it-works" className="text-sm font-medium text-[#56433a] hover:text-[#99420d] transition-colors">
                  How it Works
                </a>
              </>
            )}

            {user?.role === 'client' && (
              <>
                {navLink('/browse-professionals', 'Find Experts')}
                {navLink('/post-project', 'Post a Project')}
                {navLink('/client-dashboard', 'My Projects')}
                {navLink('/client-settings', 'Settings')}
              </>
            )}

            {user?.role === 'professional' && (
              <>
                {navLink('/professional-dashboard', 'Browse Projects')}
                {navLink('/professional-settings', 'My Profile')}
              </>
            )}

            {user?.role === 'admin' && (
              <>
                {navLink('/admin', 'Dashboard')}
                {navLink('/admin/users', 'Users')}
                {navLink('/admin/projects', 'Projects')}
                {navLink('/admin/settings', 'Settings')}
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              {/* Client: notification bell for pending expressions */}
              {user.role === 'client' && (
                <Link
                  to="/client-dashboard"
                  className="relative p-2 text-[#56433a] hover:text-[#99420d] transition-colors"
                  title="Interested Professionals"
                >
                  <span className="material-symbols-outlined">notifications</span>
                  {pendingCount > 0 && (
                    <span className="absolute top-1 right-1 bg-[#99420d] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none">
                      {pendingCount > 9 ? '9+' : pendingCount}
                    </span>
                  )}
                </Link>
              )}

              {/* Professional: badge for accepted expressions */}
              {user.role === 'professional' && (
                <Link
                  to="/professional-dashboard"
                  className="relative p-2 text-[#56433a] hover:text-[#99420d] transition-colors"
                  title="Active Projects"
                >
                  <span className="material-symbols-outlined">work</span>
                  {acceptedCount > 0 && (
                    <span className="absolute top-1 right-1 bg-[#0e7312] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none">
                      {acceptedCount > 9 ? '9+' : acceptedCount}
                    </span>
                  )}
                </Link>
              )}

              <Link
                to="/messages"
                className="relative p-2 text-[#56433a] hover:text-[#99420d] transition-colors"
                title="Messages"
              >
                <span className="material-symbols-outlined">chat</span>
                {unread > 0 && (
                  <span className="absolute top-1 right-1 bg-[#99420d] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none">
                    {unread > 9 ? '9+' : unread}
                  </span>
                )}
              </Link>

              <span className="hidden md:block text-sm font-medium text-[#56433a]">
                {user.fullName?.split(' ')[0]}
              </span>

              <Link to={settingsPath} title="Settings">
                <button
                  className="nav-avatar overflow-hidden"
                  style={{ padding: 0 }}
                  onClick={e => e.stopPropagation()}
                >
                  {user.profilePicture ? (
                    <img
                      src={user.profilePicture}
                      alt={user.fullName}
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    getInitials(user.fullName)
                  )}
                </button>
              </Link>

              <button
                onClick={logout}
                className="hidden md:flex items-center gap-1 text-xs text-[#56433a] hover:text-[#99420d] transition-colors"
                title="Logout"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>logout</span>
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="hidden md:block text-sm font-semibold text-[#56433a] hover:text-[#99420d] transition-colors"
                style={{ letterSpacing: '0.05em' }}
              >
                Login
              </Link>
              <Link to="/register" className="nav-register">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
