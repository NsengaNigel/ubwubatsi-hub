import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import LoadingSpinner from '../../components/LoadingSpinner';

function MetricCard({ icon, label, value, color }) {
  return (
    <div className="admin-metric-card">
      <div className="admin-metric-core">
        <div className="flex items-center justify-between mb-3">
          <span className="material-symbols-outlined" style={{ fontSize: '24px', color }}>{icon}</span>
        </div>
        <p className="text-3xl font-bold text-[#1e1b18]" style={{ fontFamily: "'Hanken Grotesk',sans-serif", letterSpacing: '-0.02em' }}>
          {value ?? '—'}
        </p>
        <p className="text-sm text-[#56433a] mt-1">{label}</p>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/admin/analytics')
      .then(r => setAnalytics(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="bg-[#fff8f5] min-h-screen flex flex-col">
      {/* Top nav */}
      <header className="bg-[#fff8f5] sticky top-0 border-b border-[#dcc1b5] z-50">
        <div className="flex justify-between items-center h-20 px-4 md:px-10 max-w-[1280px] mx-auto">
          <Link to="/" className="font-bold text-[#99420d]" style={{ fontFamily: "'Hanken Grotesk',sans-serif", fontSize: '24px' }}>Ubwubatsi Hub</Link>
          <div className="flex items-center gap-4">
            <span className="text-sm font-semibold text-[#1e1b18]" style={{ letterSpacing: '0.05em' }}>{user?.fullName}</span>
            <span className="inline-block bg-[#99420d] text-white text-xs font-semibold px-3 py-1 rounded-full" style={{ letterSpacing: '0.05em' }}>Admin</span>
            <button
              onClick={() => { logout(); navigate('/'); }}
              className="text-sm font-semibold text-[#56433a] hover:text-[#99420d] transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="hidden md:flex flex-col w-60 border-r border-[#dcc1b5] pt-8 px-4 gap-1">
          <Link to="/admin" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[rgba(153,66,13,0.06)] text-[#99420d] text-sm font-semibold" style={{ letterSpacing: '0.05em' }}>
            <span className="material-symbols-outlined fill" style={{ fontSize: '20px' }}>dashboard</span>
            Dashboard
          </Link>
          <Link to="/admin/verifications" className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#56433a] hover:bg-[rgba(153,66,13,0.04)] text-sm font-semibold transition-colors" style={{ letterSpacing: '0.05em' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>verified_user</span>
            Verifications
          </Link>
          <Link to="/admin/analytics" className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#56433a] hover:bg-[rgba(153,66,13,0.04)] text-sm font-semibold transition-colors" style={{ letterSpacing: '0.05em' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>analytics</span>
            Analytics
          </Link>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-8">
          <div className="max-w-5xl mx-auto">

            <div className="mb-10 fade-up du-1">
              <h1
                className="text-[#1e1b18]"
                style={{ fontFamily: "'Hanken Grotesk',sans-serif", fontSize: '40px', letterSpacing: '-0.02em', lineHeight: '1.05', fontWeight: 700 }}
              >
                Welcome, {user?.fullName?.split(' ')[0]}
              </h1>
              <p className="text-lg text-[#56433a] mt-2">Here's an overview of the Ubwubatsi Hub platform.</p>
            </div>

            {/* Metric cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10 fade-up du-2">
              <MetricCard icon="group" label="Total Users" value={analytics?.totalUsers} color="#99420d" />
              <MetricCard icon="engineering" label="Total Professionals" value={analytics?.totalProfessionals} color="#934b19" />
              <MetricCard icon="pending" label="Pending Verifications" value={analytics?.pendingVerifications} color="#ba1a1a" />
              <MetricCard icon="folder_open" label="Total Projects" value={analytics?.totalProjects} color="#665a4f" />
            </div>

            {/* Quick actions */}
            <div className="fade-up du-3">
              <h2 className="text-[#1e1b18] mb-4" style={{ fontFamily: "'Hanken Grotesk',sans-serif", fontSize: '24px', fontWeight: 600 }}>Quick Actions</h2>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/admin/verifications"
                  className="flex items-center gap-3 card-shell p-4 hover:border-[#99420d] transition-colors"
                  style={{ flex: 1, textDecoration: 'none' }}
                >
                  <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(186,26,26,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span className="material-symbols-outlined text-[#ba1a1a]" style={{ fontSize: '22px' }}>verified_user</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#1e1b18]" style={{ letterSpacing: '0.05em' }}>Review Verifications</p>
                    <p className="text-sm text-[#56433a]">{analytics?.pendingVerifications ?? 0} pending</p>
                  </div>
                </Link>
                <Link
                  to="/admin/analytics"
                  className="flex items-center gap-3 card-shell p-4 hover:border-[#99420d] transition-colors"
                  style={{ flex: 1, textDecoration: 'none' }}
                >
                  <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(153,66,13,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span className="material-symbols-outlined text-[#99420d]" style={{ fontSize: '22px' }}>analytics</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#1e1b18]" style={{ letterSpacing: '0.05em' }}>View Analytics</p>
                    <p className="text-sm text-[#56433a]">Platform metrics</p>
                  </div>
                </Link>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
