import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import LoadingSpinner from '../../components/LoadingSpinner';
import AdminSidebar from '../../components/AdminSidebar';

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
  const { user } = useAuth();
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
      <header className="bg-[#fff8f5] sticky top-0 border-b border-[#dcc1b5] z-50">
        <div className="flex justify-between items-center h-20 px-4 md:px-10 max-w-[1280px] mx-auto">
          <Link to="/" className="font-bold text-[#99420d]" style={{ fontFamily: "'Hanken Grotesk',sans-serif", fontSize: '24px' }}>Ubwubatsi Hub</Link>
          <div className="flex items-center gap-4">
            <span className="text-sm font-semibold text-[#1e1b18]" style={{ letterSpacing: '0.05em' }}>{user?.fullName}</span>
            <span className="inline-block bg-[#99420d] text-white text-xs font-semibold px-3 py-1 rounded-full" style={{ letterSpacing: '0.05em' }}>Admin</span>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        <AdminSidebar />

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
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-10 fade-up du-2">
              <MetricCard icon="group" label="Total Users" value={analytics?.totalUsers} color="#99420d" />
              <MetricCard icon="engineering" label="Total Professionals" value={analytics?.totalProfessionals} color="#934b19" />
              <MetricCard icon="person" label="Total Clients" value={analytics?.totalClients} color="#665a4f" />
              <MetricCard icon="pending" label="Pending Verifications" value={analytics?.pendingVerifications} color="#ba1a1a" />
              <MetricCard icon="folder_open" label="Total Projects" value={analytics?.totalProjects} color="#897268" />
              <MetricCard icon="verified" label="Verified Professionals" value={analytics?.verifiedProfessionals} color="#3b6623" />
            </div>

            {/* Quick actions */}
            <div className="fade-up du-3">
              <h2 className="text-[#1e1b18] mb-4" style={{ fontFamily: "'Hanken Grotesk',sans-serif", fontSize: '24px', fontWeight: 600 }}>Quick Actions</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <Link to="/admin/verifications" className="flex items-center gap-3 card-shell p-4 hover:border-[#99420d] transition-colors" style={{ textDecoration: 'none' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(186,26,26,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span className="material-symbols-outlined text-[#ba1a1a]" style={{ fontSize: '22px' }}>verified_user</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#1e1b18]" style={{ letterSpacing: '0.05em' }}>Review Verifications</p>
                    <p className="text-sm text-[#56433a]">{analytics?.pendingVerifications ?? 0} pending</p>
                  </div>
                </Link>

                <Link to="/admin/analytics" className="flex items-center gap-3 card-shell p-4 hover:border-[#99420d] transition-colors" style={{ textDecoration: 'none' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(153,66,13,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span className="material-symbols-outlined text-[#99420d]" style={{ fontSize: '22px' }}>analytics</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#1e1b18]" style={{ letterSpacing: '0.05em' }}>View Analytics</p>
                    <p className="text-sm text-[#56433a]">Platform metrics</p>
                  </div>
                </Link>

                <Link to="/admin/users" className="flex items-center gap-3 card-shell p-4 hover:border-[#99420d] transition-colors" style={{ textDecoration: 'none' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(13,71,161,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span className="material-symbols-outlined text-[#0d47a1]" style={{ fontSize: '22px' }}>group</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#1e1b18]" style={{ letterSpacing: '0.05em' }}>View All Users</p>
                    <p className="text-sm text-[#56433a]">{analytics?.totalUsers ?? 0} registered</p>
                  </div>
                </Link>

                <Link to="/admin/projects" className="flex items-center gap-3 card-shell p-4 hover:border-[#99420d] transition-colors" style={{ textDecoration: 'none' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(102,90,79,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span className="material-symbols-outlined text-[#665a4f]" style={{ fontSize: '22px' }}>folder_open</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#1e1b18]" style={{ letterSpacing: '0.05em' }}>View All Projects</p>
                    <p className="text-sm text-[#56433a]">{analytics?.totalProjects ?? 0} posted</p>
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
