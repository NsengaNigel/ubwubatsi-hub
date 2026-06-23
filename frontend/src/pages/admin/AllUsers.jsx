import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/LoadingSpinner';
import AdminSidebar from '../../components/AdminSidebar';

const ROLE_BADGES = {
  admin: { background: 'rgba(186,26,26,0.1)', color: '#ba1a1a', label: 'Admin' },
  professional: { background: 'rgba(153,66,13,0.1)', color: '#99420d', label: 'Professional' },
  client: { background: 'rgba(13,71,161,0.1)', color: '#0d47a1', label: 'Client' },
};

const FILTERS = ['All', 'client', 'professional'];

export default function AllUsers() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    api.get('/api/admin/users')
      .then(res => setUsers(res.data))
      .catch(() => toast.error('Failed to load users'))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user? This cannot be undone.')) return;
    try {
      await api.delete(`/api/admin/users/${id}`);
      setUsers(prev => prev.filter(u => u._id !== id));
      toast.success('User deleted successfully.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete user.');
    }
  };

  const filtered = users.filter(u => {
    const matchesSearch =
      u.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = activeFilter === 'All' || u.role === activeFilter;
    return matchesSearch && matchesFilter;
  });

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
            <div className="mb-8">
              <h1 className="text-[#1e1b18]" style={{ fontFamily: "'Hanken Grotesk',sans-serif", fontSize: '32px', fontWeight: 700, letterSpacing: '-0.01em' }}>All Users</h1>
              <p className="text-base text-[#56433a] mt-1">Manage all registered users on the platform.</p>
            </div>

            {/* Search + filters */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="relative flex-1">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#56433a]" style={{ fontSize: '18px' }}>search</span>
                <input
                  className="w-full bg-[#fff8f5] border border-[#dcc1b5] rounded-xl py-2.5 pl-10 pr-4 text-sm focus:border-[#99420d] outline-none transition-all"
                  placeholder="Search by name or email…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                {FILTERS.map(f => (
                  <button
                    key={f}
                    onClick={() => setActiveFilter(f)}
                    className="text-xs font-semibold px-4 py-2 rounded-full border transition-colors"
                    style={{
                      letterSpacing: '0.05em',
                      background: activeFilter === f ? '#99420d' : 'transparent',
                      color: activeFilter === f ? '#fff' : '#56433a',
                      borderColor: activeFilter === f ? '#99420d' : '#dcc1b5',
                      cursor: 'pointer',
                    }}
                  >
                    {f === 'All' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1) + 's'}
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <LoadingSpinner fullPage={false} />
            ) : filtered.length === 0 ? (
              <div className="card-shell">
                <div className="card-core flex flex-col items-center gap-4 py-16">
                  <span className="material-symbols-outlined text-[#dcc1b5]" style={{ fontSize: '48px' }}>group</span>
                  <p className="text-base text-[#56433a]">No users found.</p>
                </div>
              </div>
            ) : (
              <div className="card-shell overflow-hidden">
                <div style={{ background: '#fff8f5', borderRadius: 'calc(1.25rem - 5px)', overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid #dcc1b5' }}>
                        {['Full Name', 'Email', 'Phone', 'Role', 'Verified', 'Registered', 'Action'].map(h => (
                          <th key={h} className="text-xs font-semibold text-[#56433a] text-left px-5 py-4" style={{ letterSpacing: '0.05em', textTransform: 'uppercase' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((u, i) => {
                        const badge = ROLE_BADGES[u.role] || ROLE_BADGES.client;
                        return (
                          <tr key={u._id} style={{ borderBottom: i < filtered.length - 1 ? '1px solid rgba(220,193,181,0.5)' : 'none' }}>
                            <td className="px-5 py-4 text-sm font-semibold text-[#1e1b18]">{u.fullName}</td>
                            <td className="px-5 py-4 text-sm text-[#56433a]">{u.email}</td>
                            <td className="px-5 py-4 text-sm text-[#56433a]">{u.phone || '—'}</td>
                            <td className="px-5 py-4">
                              <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: badge.background, color: badge.color, letterSpacing: '0.05em' }}>
                                {badge.label}
                              </span>
                            </td>
                            <td className="px-5 py-4">
                              {u.isVerified ? (
                                <span className="material-symbols-outlined fill text-[#3b6623]" style={{ fontSize: '20px' }} title="Verified">check_circle</span>
                              ) : (
                                <span className="material-symbols-outlined text-[#ba1a1a]" style={{ fontSize: '20px' }} title="Not verified">cancel</span>
                              )}
                            </td>
                            <td className="px-5 py-4 text-sm text-[#56433a]">
                              {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}
                            </td>
                            <td className="px-5 py-4">
                              {u.role !== 'admin' && (
                                <button
                                  onClick={() => handleDelete(u._id)}
                                  className="text-xs font-semibold text-[#ba1a1a] hover:text-white hover:bg-[#ba1a1a] transition-colors px-3 py-1.5 rounded-full border border-[#ba1a1a]"
                                  style={{ background: 'transparent', cursor: 'pointer', letterSpacing: '0.04em' }}
                                >
                                  Delete
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
