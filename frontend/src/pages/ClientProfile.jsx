import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function getInitials(name) {
  if (!name) return '??';
  const parts = name.trim().split(' ');
  return (parts[0][0] + (parts[1] ? parts[1][0] : '')).toUpperCase();
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-RW', { month: 'long', year: 'numeric' });
}

const STATUS_STYLES = {
  open: { background: 'rgba(227,242,253,0.9)', color: '#0d47a1', label: 'Open' },
  'in-progress': { background: 'rgba(241,223,209,0.8)', color: '#783603', label: 'In Progress' },
  completed: { background: 'rgba(225,239,216,0.9)', color: '#3b6623', label: 'Completed' },
};

export default function ClientProfile() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);

  useEffect(() => {
    api.get('/api/projects/my-projects')
      .then(res => setProjects(res.data))
      .catch(() => {})
      .finally(() => setLoadingProjects(false));
  }, []);

  const initials = getInitials(user?.fullName);

  return (
    <div className="bg-[#fff8f5] text-[#1e1b18] min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 w-full max-w-[1280px] mx-auto px-4 md:px-10 py-10 grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left column */}
        <div className="lg:col-span-8 flex flex-col gap-6">

          {/* Profile header */}
          <div className="profile-header fade-up du-1">
            <div className="h-36 md:h-48 rounded-t-2xl" style={{ background: 'linear-gradient(135deg, #efe6e2 0%, #dcc1b5 100%)' }} />
            <div className="px-7 pb-7 -mt-12 flex flex-col sm:flex-row gap-5 items-start sm:items-end">
              <div className="profile-avatar overflow-hidden">
                {user?.profilePicture ? (
                  <img src={user.profilePicture} alt={user.fullName} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-[#99420d]" style={{ fontFamily: "'Hanken Grotesk',sans-serif", fontSize: '28px', fontWeight: 600 }}>
                    {initials}
                  </span>
                )}
              </div>
              <div className="flex-1 pt-2 sm:pt-0">
                <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                  <h1 className="text-2xl md:text-[32px] text-[#1e1b18]" style={{ fontFamily: "'Hanken Grotesk',sans-serif", letterSpacing: '-0.01em', fontWeight: 600 }}>
                    {user?.fullName || 'Client'}
                  </h1>
                </div>
                <p className="text-base text-[#b95925] mb-2">Client</p>
                <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-[#56433a]">
                  {user?.location && (
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>location_on</span>
                      {user.location}
                    </span>
                  )}
                  {user?.createdAt && (
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>calendar_month</span>
                      Member since {formatDate(user.createdAt)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Account Info */}
          <div className="section-shell fade-up du-2">
            <div className="section-core">
              <h2 className="text-[#1e1b18] mb-5" style={{ fontFamily: "'Hanken Grotesk',sans-serif", fontSize: '24px', fontWeight: 600 }}>
                Account Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-semibold text-[#56433a]" style={{ letterSpacing: '0.06em' }}>FULL NAME</span>
                  <span className="text-sm font-medium text-[#1e1b18]">{user?.fullName || '—'}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-semibold text-[#56433a]" style={{ letterSpacing: '0.06em' }}>EMAIL</span>
                  <span className="text-sm font-medium text-[#1e1b18]">{user?.email || '—'}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-semibold text-[#56433a]" style={{ letterSpacing: '0.06em' }}>PHONE</span>
                  <span className="text-sm font-medium text-[#1e1b18]">{user?.phone || '—'}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-semibold text-[#56433a]" style={{ letterSpacing: '0.06em' }}>LOCATION</span>
                  <span className="text-sm font-medium text-[#1e1b18]">{user?.location || '—'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Posted Projects */}
          <div className="section-shell fade-up du-3">
            <div className="section-core">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-[#1e1b18]" style={{ fontFamily: "'Hanken Grotesk',sans-serif", fontSize: '24px', fontWeight: 600 }}>
                  Posted Projects
                </h2>
                <span className="text-sm text-[#56433a]">{projects.length} project{projects.length !== 1 ? 's' : ''}</span>
              </div>

              {loadingProjects ? (
                <div className="flex justify-center py-8">
                  <div className="w-6 h-6 border-2 border-[#dcc1b5] border-t-[#99420d] rounded-full animate-spin" />
                </div>
              ) : projects.length === 0 ? (
                <div className="flex flex-col items-center gap-3 py-10 text-center">
                  <span className="material-symbols-outlined text-[#dcc1b5]" style={{ fontSize: '40px' }}>folder_open</span>
                  <p className="text-sm text-[#56433a]">No projects posted yet.</p>
                  <Link to="/post-project" className="btn-primary-sm mt-1">
                    Post a Project
                    <span className="btn-icon">
                      <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>arrow_forward</span>
                    </span>
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {projects.map(proj => {
                    const badge = STATUS_STYLES[proj.status] || STATUS_STYLES.open;
                    return (
                      <div key={proj._id} className="flex items-start gap-3 p-4 border border-[#dcc1b5] rounded-2xl">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(153,66,13,0.08)' }}>
                          <span className="material-symbols-outlined text-[#99420d]" style={{ fontSize: '18px' }}>architecture</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-3 flex-wrap">
                            <div>
                              <p className="text-sm font-semibold text-[#1e1b18]">{proj.title}</p>
                              <p className="text-xs text-[#56433a] mt-0.5">{proj.category} · {proj.location}</p>
                            </div>
                            <span className="text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0" style={{ background: badge.background, color: badge.color }}>
                              {badge.label}
                            </span>
                          </div>
                          <p className="text-xs text-[#56433a] mt-1.5" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                            {proj.description}
                          </p>
                          <div className="flex items-center gap-3 mt-2 text-xs text-[#56433a]">
                            <span>{proj.budget}</span>
                            <span>·</span>
                            <span>{new Date(proj.createdAt).toLocaleDateString('en-RW', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Right sidebar */}
        <div className="lg:col-span-4 flex flex-col gap-5">

          <div className="sidebar-card lg:sticky top-28 fade-up du-4">
            <div className="sidebar-card-core">
              <h3 className="text-[#1e1b18] mb-1" style={{ fontFamily: "'Hanken Grotesk',sans-serif", fontSize: '22px', fontWeight: 600 }}>
                My Account
              </h3>
              <p className="text-sm text-[#56433a] mb-5">Manage your profile and projects.</p>
              <div className="flex flex-col gap-3">
                <Link
                  to="/client-settings"
                  className="action-btn-primary"
                  style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>settings</span>
                  Edit Profile
                </Link>
                <Link
                  to="/client-dashboard"
                  className="action-btn-outline"
                  style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>dashboard</span>
                  My Dashboard
                </Link>
                <Link
                  to="/post-project"
                  className="action-btn-outline"
                  style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add_circle</span>
                  Post a Project
                </Link>
              </div>

              <div className="mt-5 pt-5 border-t border-[#dcc1b5] flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#56433a]" style={{ fontSize: '16px' }}>folder_open</span>
                  <span className="text-sm text-[#56433a]">{projects.length} Project{projects.length !== 1 ? 's' : ''} Posted</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#56433a]" style={{ fontSize: '16px' }}>location_on</span>
                  <span className="text-sm text-[#56433a]">{user?.location || 'Location not set'}</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
