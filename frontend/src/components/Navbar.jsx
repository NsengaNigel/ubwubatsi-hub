import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import api from '../api/axios';
import NotificationDropdown from './NotificationDropdown';

function getInitials(name) {
  if (!name) return '??';
  const parts = name.trim().split(' ');
  return (parts[0][0] + (parts[1] ? parts[1][0] : '')).toUpperCase();
}

export default function Navbar() {
  const { user, logout } = useAuth();
  const socket = useSocket();
  const { pathname } = useLocation();

  const [notifCount, setNotifCount] = useState(0);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const notifRef = useRef(null);
  const profileRef = useRef(null);

  // Poll notification unread count every 30s
  useEffect(() => {
    if (!user) return;
    const fetchCount = () =>
      api.get('/api/notifications/unread-count')
        .then(res => setNotifCount(res.data.count))
        .catch(() => {});
    fetchCount();
    const interval = setInterval(fetchCount, 30000);
    return () => clearInterval(interval);
  }, [user]);

  // Real-time count update via socket
  useEffect(() => {
    if (!socket) return;
    const handler = (data) => setNotifCount(data.count);
    socket.on('new_notification', handler);
    return () => socket.off('new_notification', handler);
  }, [socket]);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleOutside(e) {
      if (showNotifDropdown && notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifDropdown(false);
      }
      if (showProfileMenu && profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [showNotifDropdown, showProfileMenu]);

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

  const profileMenuItems =
    user?.role === 'client'
      ? [
          { label: 'My Profile', to: '/client-dashboard', icon: 'person' },
          { label: 'Settings', to: '/client-settings', icon: 'settings' },
          { label: 'Messages', to: '/messages', icon: 'chat' },
        ]
      : user?.role === 'professional'
      ? [
          { label: 'My Profile', to: '/professional-dashboard', icon: 'person' },
          { label: 'Settings', to: '/professional-settings', icon: 'settings' },
          { label: 'Messages', to: '/messages', icon: 'chat' },
        ]
      : [
          { label: 'Dashboard', to: '/admin', icon: 'dashboard' },
          { label: 'Settings', to: '/admin/settings', icon: 'settings' },
        ];

  return (
    <nav className="bg-[#fff8f5] w-full top-0 sticky border-b border-[#dcc1b5] z-50">
      <div className="flex justify-between items-center h-20 px-4 md:px-10 max-w-[1280px] mx-auto">

        {/* Logo + nav links */}
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

        {/* Right side */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              {/* Notification bell — all roles */}
              <div ref={notifRef} className="relative">
                <button
                  onClick={() => { setShowNotifDropdown(v => !v); setShowProfileMenu(false); }}
                  className="relative p-2 text-[#56433a] hover:text-[#99420d] transition-colors"
                  title="Notifications"
                >
                  <span className="material-symbols-outlined">notifications</span>
                  {notifCount > 0 && (
                    <span className="absolute top-1 right-1 bg-[#99420d] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none">
                      {notifCount > 9 ? '9+' : notifCount}
                    </span>
                  )}
                </button>
                {showNotifDropdown && (
                  <NotificationDropdown
                    onClose={() => setShowNotifDropdown(false)}
                    onCountReset={() => setNotifCount(0)}
                  />
                )}
              </div>

              {/* Messages */}
              <Link
                to="/messages"
                className="p-2 text-[#56433a] hover:text-[#99420d] transition-colors"
                title="Messages"
              >
                <span className="material-symbols-outlined">chat</span>
              </Link>

              {/* First name */}
              <span className="hidden md:block text-sm font-medium text-[#56433a]">
                {user.fullName?.split(' ')[0]}
              </span>

              {/* Avatar + profile dropdown */}
              <div ref={profileRef} className="relative">
                <button
                  className="nav-avatar overflow-hidden"
                  style={{ padding: 0 }}
                  onClick={() => { setShowProfileMenu(v => !v); setShowNotifDropdown(false); }}
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

                {showProfileMenu && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-lg border border-[#dcc1b5] z-50 overflow-hidden">
                    {/* User info */}
                    <div className="px-4 py-3 border-b border-[#dcc1b5]">
                      <p className="text-sm font-semibold text-[#1e1b18] truncate">{user.fullName}</p>
                      <p className="text-xs text-[#56433a] truncate mt-0.5">{user.email}</p>
                    </div>

                    {/* Links */}
                    <div className="py-1">
                      {profileMenuItems.map(item => (
                        <Link
                          key={item.to}
                          to={item.to}
                          onClick={() => setShowProfileMenu(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#1e1b18] hover:bg-[#fdf5f2] transition-colors"
                          style={{ textDecoration: 'none' }}
                        >
                          <span className="material-symbols-outlined text-[#56433a]" style={{ fontSize: '16px' }}>
                            {item.icon}
                          </span>
                          {item.label}
                        </Link>
                      ))}
                    </div>

                    {/* Logout */}
                    <div className="border-t border-[#dcc1b5] py-1">
                      <button
                        onClick={() => { setShowProfileMenu(false); logout(); }}
                        className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-[#ba1a1a] hover:bg-[rgba(186,26,26,0.04)] transition-colors"
                        style={{ background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' }}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>logout</span>
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
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
