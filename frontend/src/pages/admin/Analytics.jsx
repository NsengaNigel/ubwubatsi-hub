import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/LoadingSpinner';

const METRICS = [
  { key: 'totalUsers', label: 'Total Users', icon: 'group', color: '#99420d' },
  { key: 'totalProfessionals', label: 'Total Professionals', icon: 'engineering', color: '#934b19' },
  { key: 'totalClients', label: 'Total Clients', icon: 'person', color: '#665a4f' },
  { key: 'totalProjects', label: 'Total Projects', icon: 'folder_open', color: '#897268' },
  { key: 'verifiedProfessionals', label: 'Verified Professionals', icon: 'verified', color: '#3b6623' },
  { key: 'pendingVerifications', label: 'Pending Verifications', icon: 'pending', color: '#ba1a1a' },
];

export default function Analytics() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/admin/analytics')
      .then(r => setAnalytics(r.data))
      .catch(() => toast.error('Failed to load analytics'))
      .finally(() => setLoading(false));
  }, []);

  const chartData = analytics?.registrationsPerDay || [
    { day: 'Mon', count: 4 }, { day: 'Tue', count: 7 }, { day: 'Wed', count: 3 },
    { day: 'Thu', count: 9 }, { day: 'Fri', count: 6 }, { day: 'Sat', count: 2 }, { day: 'Sun', count: 5 },
  ];

  return (
    <div className="bg-[#fff8f5] min-h-screen flex flex-col">
      <header className="bg-[#fff8f5] sticky top-0 border-b border-[#dcc1b5] z-50">
        <div className="flex justify-between items-center h-20 px-4 md:px-10 max-w-[1280px] mx-auto">
          <Link to="/" className="font-bold text-[#99420d]" style={{ fontFamily: "'Hanken Grotesk',sans-serif", fontSize: '24px' }}>Ubwubatsi Hub</Link>
          <div className="flex items-center gap-4">
            <span className="text-sm font-semibold text-[#1e1b18]">{user?.fullName}</span>
            <span className="inline-block bg-[#99420d] text-white text-xs font-semibold px-3 py-1 rounded-full">Admin</span>
            <button onClick={() => { logout(); navigate('/'); }} className="text-sm font-semibold text-[#56433a] hover:text-[#99420d] transition-colors">Logout</button>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        <aside className="hidden md:flex flex-col w-60 border-r border-[#dcc1b5] pt-8 px-4 gap-1">
          <Link to="/admin" className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#56433a] hover:bg-[rgba(153,66,13,0.04)] text-sm font-semibold transition-colors" style={{ letterSpacing: '0.05em' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>dashboard</span>
            Dashboard
          </Link>
          <Link to="/admin/verifications" className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#56433a] hover:bg-[rgba(153,66,13,0.04)] text-sm font-semibold transition-colors" style={{ letterSpacing: '0.05em' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>verified_user</span>
            Verifications
          </Link>
          <Link to="/admin/analytics" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[rgba(153,66,13,0.06)] text-[#99420d] text-sm font-semibold" style={{ letterSpacing: '0.05em' }}>
            <span className="material-symbols-outlined fill" style={{ fontSize: '20px' }}>analytics</span>
            Analytics
          </Link>
        </aside>

        <main className="flex-1 p-8">
          <div className="max-w-5xl mx-auto">
            <div className="mb-8">
              <h1 className="text-[#1e1b18]" style={{ fontFamily: "'Hanken Grotesk',sans-serif", fontSize: '32px', fontWeight: 700, letterSpacing: '-0.01em' }}>Analytics</h1>
              <p className="text-base text-[#56433a] mt-1">Platform metrics and user registration trends.</p>
            </div>

            {loading ? (
              <LoadingSpinner fullPage={false} />
            ) : (
              <>
                {/* Metric cards */}
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
                  {METRICS.map(m => (
                    <div key={m.key} className="admin-metric-card">
                      <div className="admin-metric-core">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="material-symbols-outlined" style={{ fontSize: '22px', color: m.color }}>{m.icon}</span>
                          <p className="text-sm font-medium text-[#56433a]">{m.label}</p>
                        </div>
                        <p className="text-3xl font-bold text-[#1e1b18]" style={{ fontFamily: "'Hanken Grotesk',sans-serif", letterSpacing: '-0.02em' }}>
                          {analytics?.[m.key] ?? '—'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bar chart */}
                <div className="card-shell">
                  <div className="card-core" style={{ padding: '28px 32px' }}>
                    <h2 className="text-[#1e1b18] mb-6" style={{ fontFamily: "'Hanken Grotesk',sans-serif", fontSize: '24px', fontWeight: 600 }}>
                      User Registrations — Last 7 Days
                    </h2>
                    <ResponsiveContainer width="100%" height={280}>
                      <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#dcc1b5" vertical={false} />
                        <XAxis dataKey="day" tick={{ fill: '#56433a', fontSize: 13 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: '#56433a', fontSize: 13 }} axisLine={false} tickLine={false} />
                        <Tooltip
                          contentStyle={{ background: '#fff8f5', border: '1px solid #dcc1b5', borderRadius: '0.75rem', boxShadow: 'none' }}
                          labelStyle={{ color: '#1e1b18', fontWeight: 600 }}
                          itemStyle={{ color: '#99420d' }}
                          cursor={{ fill: 'rgba(153,66,13,0.04)' }}
                        />
                        <Bar dataKey="count" fill="#99420d" radius={[4, 4, 0, 0]} maxBarSize={48} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
