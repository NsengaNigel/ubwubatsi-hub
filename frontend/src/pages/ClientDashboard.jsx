import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

function getInitials(name) {
  if (!name) return '??';
  const parts = name.trim().split(' ');
  return (parts[0][0] + (parts[1] ? parts[1][0] : '')).toUpperCase();
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-RW', { day: 'numeric', month: 'short', year: 'numeric' });
}

function Footer() {
  return (
    <footer className="border-t border-[#dcc1b5] py-8 mt-auto">
      <div className="max-w-[1280px] mx-auto px-10 flex flex-col md:flex-row justify-between items-center gap-3">
        <span className="font-bold text-[#99420d]" style={{ fontFamily: "'Hanken Grotesk',sans-serif", fontSize: '24px' }}>Ubwubatsi Hub</span>
        <span className="text-sm text-[#56433a]">© 2024 Ubwubatsi Hub. Building Rwanda with Integrity.</span>
        <div className="flex gap-5">
          <a className="text-sm text-[#56433a] hover:text-[#99420d] transition-colors" href="#">Terms</a>
          <a className="text-sm text-[#56433a] hover:text-[#99420d] transition-colors" href="#">Privacy</a>
          <a className="text-sm text-[#56433a] hover:text-[#99420d] transition-colors" href="#">Contact</a>
        </div>
      </div>
    </footer>
  );
}

const STATUS_STYLES = {
  open: { background: 'rgba(227,242,253,0.9)', color: '#0d47a1', label: 'Open' },
  'in-progress': { background: 'rgba(241,223,209,0.8)', color: '#783603', label: 'In Progress' },
  completed: { background: 'rgba(225,239,216,0.9)', color: '#3b6623', label: 'Completed' },
};

export default function ClientDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const firstName = user?.fullName?.split(' ')[0] || 'Client';
  const initials = getInitials(user?.fullName || '');

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get('/api/projects/my-projects')
      .then(res => setProjects(res.data))
      .catch(() => setError('Could not load your projects.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-[#fff8f5] text-[#1e1b18] min-h-screen flex flex-col">
      {/* Nav */}
      <nav className="bg-[#fff8f5] w-full top-0 sticky border-b border-[#dcc1b5] z-50">
        <div className="flex justify-between items-center h-20 px-10 max-w-[1280px] mx-auto">
          <div className="flex items-center gap-8">
            <Link to="/" className="font-bold text-[#99420d]" style={{ fontFamily: "'Hanken Grotesk',sans-serif", fontSize: '24px' }}>Ubwubatsi Hub</Link>
            <div className="hidden md:flex gap-6">
              <Link to="/browse-professionals" className="text-base text-[#56433a] hover:text-[#99420d] transition-colors">Find Experts</Link>
              <Link to="/post-project" className="text-base text-[#99420d] font-medium border-b-2 border-[#99420d] pb-0.5">Projects</Link>
              <a href="/#how-it-works" className="text-base text-[#56433a] hover:text-[#99420d] transition-colors">How it Works</a>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 text-[#56433a] hover:text-[#99420d] transition-colors">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <button className="nav-avatar" onClick={() => { logout(); navigate('/'); }}>{initials}</button>
          </div>
        </div>
      </nav>

      <main className="flex-grow px-4 md:px-10 max-w-[1280px] mx-auto w-full py-12">

        {/* Welcome */}
        <div className="mb-12 fade-up du-1">
          <span className="text-sm text-[#56433a]">Good day</span>
          <h1
            className="text-[#1e1b18] mt-1"
            style={{ fontFamily: "'Hanken Grotesk',sans-serif", fontSize: '40px', letterSpacing: '-0.02em', lineHeight: '1.05', fontWeight: 700 }}
          >
            Welcome back, {firstName}
          </h1>
          <p className="text-lg text-[#56433a] mt-2">Manage your construction projects and find the right professionals.</p>
        </div>

        {/* Action cards */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-12 fade-up du-2">
          <Link to="/post-project" className="action-shell block">
            <div className="action-core">
              <div>
                <div className="action-icon" style={{ background: 'rgba(153,66,13,0.1)' }}>
                  <span className="material-symbols-outlined text-[#99420d]" style={{ fontSize: '24px' }}>add_circle</span>
                </div>
                <h2 className="text-[#1e1b18] mb-2" style={{ fontFamily: "'Hanken Grotesk',sans-serif", fontSize: '24px', fontWeight: 600 }}>Post a New Project</h2>
                <p className="text-base text-[#56433a]">Describe your vision, set your budget, and start receiving proposals from top-rated professionals.</p>
              </div>
              <div className="mt-8 cta-link text-[#99420d]">
                Get started
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_forward</span>
              </div>
            </div>
          </Link>

          <Link to="/browse-professionals" className="action-shell block">
            <div className="action-core">
              <div>
                <div className="action-icon" style={{ background: 'rgba(147,75,25,0.1)' }}>
                  <span className="material-symbols-outlined text-[#934b19]" style={{ fontSize: '24px' }}>search</span>
                </div>
                <h2 className="text-[#1e1b18] mb-2" style={{ fontFamily: "'Hanken Grotesk',sans-serif", fontSize: '24px', fontWeight: 600 }}>Browse Professionals</h2>
                <p className="text-base text-[#56433a]">Explore portfolios, read reviews, and connect directly with certified architects and engineers.</p>
              </div>
              <div className="mt-8 cta-link text-[#934b19]">
                Explore directory
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_forward</span>
              </div>
            </div>
          </Link>
        </section>

        {/* Posted projects */}
        <section className="fade-up du-3">
          <div className="flex items-center justify-between mb-5 pb-4 border-b border-[#dcc1b5]">
            <h3 className="text-[#1e1b18]" style={{ fontFamily: "'Hanken Grotesk',sans-serif", fontSize: '24px', fontWeight: 600 }}>My Posted Projects</h3>
          </div>

          {loading && (
            <p className="text-sm text-[#56433a]">Loading your projects…</p>
          )}

          {error && (
            <p className="text-sm text-[#ba1a1a]">{error}</p>
          )}

          {!loading && !error && projects.length === 0 && (
            <div className="flex flex-col items-center gap-3 py-12 text-center">
              <span className="material-symbols-outlined text-[#dcc1b5]" style={{ fontSize: '48px' }}>folder_open</span>
              <p className="text-base text-[#56433a]">You have not posted any projects yet. Post your first project to get started.</p>
              <Link to="/post-project" className="btn-primary-sm mt-2">
                Post a Project
                <span className="btn-icon">
                  <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>arrow_forward</span>
                </span>
              </Link>
            </div>
          )}

          {!loading && !error && projects.length > 0 && (
            <div className="flex flex-col gap-3">
              {projects.map((proj) => {
                const badge = STATUS_STYLES[proj.status] || STATUS_STYLES.open;
                return (
                  <div key={proj._id} className="project-item fade-up du-4">
                    <div className="flex items-start gap-4">
                      <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(153,66,13,0.08)' }}>
                        <span className="material-symbols-outlined text-[#99420d]" style={{ fontSize: '20px' }}>architecture</span>
                      </div>
                      <div>
                        <h4 className="text-base font-semibold text-[#1e1b18]">{proj.title}</h4>
                        <div className="flex items-center gap-3 mt-0.5 text-sm text-[#56433a]">
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>calendar_today</span>
                            {formatDate(proj.createdAt)}
                          </span>
                          <span>{proj.location}, Rwanda</span>
                          <span>{proj.category}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="status-badge" style={{ background: badge.background, color: badge.color }}>{badge.label}</span>
                      <span className="text-sm font-medium text-[#56433a]">{proj.budget}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

      </main>

      <Footer />
    </div>
  );
}
