import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/LoadingSpinner';
import AdminSidebar from '../../components/AdminSidebar';

const METRICS = [
  { key: 'totalUsers', label: 'Total Users', icon: 'group', color: '#99420d' },
  { key: 'totalProfessionals', label: 'Total Professionals', icon: 'engineering', color: '#934b19' },
  { key: 'totalClients', label: 'Total Clients', icon: 'person', color: '#665a4f' },
  { key: 'totalProjects', label: 'Total Projects', icon: 'folder_open', color: '#897268' },
  { key: 'verifiedProfessionals', label: 'Verified Professionals', icon: 'verified', color: '#3b6623' },
  { key: 'pendingVerifications', label: 'Pending Verifications', icon: 'pending', color: '#ba1a1a' },
];

const ROLE_COLORS = {
  admin: '#ba1a1a',
  professional: '#99420d',
  client: '#0d47a1',
};

export default function Analytics() {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentProjects, setRecentProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/api/admin/analytics'),
      api.get('/api/admin/users'),
      api.get('/api/admin/projects'),
    ])
      .then(([analyticsRes, usersRes, projectsRes]) => {
        setAnalytics(analyticsRes.data);
        setRecentUsers(usersRes.data.slice(0, 5));
        setRecentProjects(projectsRes.data.slice(0, 5));
      })
      .catch(() => toast.error('Failed to load analytics'))
      .finally(() => setLoading(false));
  }, []);

  const chartData = analytics?.registrationsPerDay || [];

  return (
    <div className="bg-[#fff8f5] min-h-screen flex flex-col">
      <header className="bg-[#fff8f5] sticky top-0 border-b border-[#dcc1b5] z-50">
        <div className="flex justify-between items-center h-20 px-4 md:px-10 max-w-[1280px] mx-auto">
          <Link to="/" className="font-bold text-[#99420d]" style={{ fontFamily: "'Hanken Grotesk',sans-serif", fontSize: '24px' }}>Ubwubatsi Hub</Link>
          <div className="flex items-center gap-4">
            <span className="text-sm font-semibold text-[#1e1b18]">{user?.fullName}</span>
            <span className="inline-block bg-[#99420d] text-white text-xs font-semibold px-3 py-1 rounded-full">Admin</span>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        <AdminSidebar />

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
                <div className="card-shell mb-8">
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

                {/* Recent users */}
                <div className="card-shell mb-8">
                  <div className="card-core" style={{ padding: '28px 32px' }}>
                    <div className="flex items-center justify-between mb-5">
                      <h2 className="text-[#1e1b18]" style={{ fontFamily: "'Hanken Grotesk',sans-serif", fontSize: '20px', fontWeight: 600 }}>Recent Users</h2>
                      <Link to="/admin/users" className="text-sm font-semibold text-[#99420d] hover:underline" style={{ letterSpacing: '0.05em' }}>View all</Link>
                    </div>
                    {recentUsers.length === 0 ? (
                      <p className="text-sm text-[#56433a]">No users registered yet.</p>
                    ) : (
                      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                          <tr style={{ borderBottom: '1px solid #dcc1b5' }}>
                            {['Name', 'Role', 'Registered'].map(h => (
                              <th key={h} className="text-xs font-semibold text-[#56433a] text-left pb-3" style={{ letterSpacing: '0.05em', textTransform: 'uppercase' }}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {recentUsers.map((u, i) => (
                            <tr key={u._id} style={{ borderBottom: i < recentUsers.length - 1 ? '1px solid rgba(220,193,181,0.4)' : 'none' }}>
                              <td className="py-3 text-sm font-semibold text-[#1e1b18]">{u.fullName}</td>
                              <td className="py-3">
                                <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: `${ROLE_COLORS[u.role]}15`, color: ROLE_COLORS[u.role] || '#56433a', letterSpacing: '0.05em' }}>
                                  {u.role}
                                </span>
                              </td>
                              <td className="py-3 text-sm text-[#56433a]">{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>

                {/* Recent projects */}
                <div className="card-shell">
                  <div className="card-core" style={{ padding: '28px 32px' }}>
                    <div className="flex items-center justify-between mb-5">
                      <h2 className="text-[#1e1b18]" style={{ fontFamily: "'Hanken Grotesk',sans-serif", fontSize: '20px', fontWeight: 600 }}>Recent Projects</h2>
                      <Link to="/admin/projects" className="text-sm font-semibold text-[#99420d] hover:underline" style={{ letterSpacing: '0.05em' }}>View all</Link>
                    </div>
                    {recentProjects.length === 0 ? (
                      <p className="text-sm text-[#56433a]">No projects posted yet.</p>
                    ) : (
                      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                          <tr style={{ borderBottom: '1px solid #dcc1b5' }}>
                            {['Title', 'Client', 'Date'].map(h => (
                              <th key={h} className="text-xs font-semibold text-[#56433a] text-left pb-3" style={{ letterSpacing: '0.05em', textTransform: 'uppercase' }}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {recentProjects.map((p, i) => (
                            <tr key={p._id} style={{ borderBottom: i < recentProjects.length - 1 ? '1px solid rgba(220,193,181,0.4)' : 'none' }}>
                              <td className="py-3 text-sm font-semibold text-[#1e1b18]">{p.title}</td>
                              <td className="py-3 text-sm text-[#56433a]">{p.clientId?.fullName || '—'}</td>
                              <td className="py-3 text-sm text-[#56433a]">{p.createdAt ? new Date(p.createdAt).toLocaleDateString() : '—'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
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
