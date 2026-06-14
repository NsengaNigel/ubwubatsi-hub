import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/LoadingSpinner';
import AdminSidebar from '../../components/AdminSidebar';

const STATUS_BADGES = {
  open: { background: 'rgba(225,239,216,0.9)', color: '#3b6623', label: 'Open' },
  'in-progress': { background: 'rgba(241,223,209,0.8)', color: '#783603', label: 'In Progress' },
  completed: { background: 'rgba(220,220,220,0.8)', color: '#56433a', label: 'Completed' },
};

const CATEGORY_FILTERS = ['All', 'Residential', 'Commercial', 'Renovation', 'Other'];

export default function AllProjects() {
  const { user } = useAuth();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    api.get('/api/admin/projects')
      .then(res => setProjects(res.data))
      .catch(() => toast.error('Failed to load projects'))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project? This cannot be undone.')) return;
    try {
      await api.delete(`/api/admin/projects/${id}`);
      setProjects(prev => prev.filter(p => p._id !== id));
      toast.success('Project deleted successfully.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete project.');
    }
  };

  const filtered = projects.filter(p => {
    const matchesSearch =
      p.title?.toLowerCase().includes(search.toLowerCase()) ||
      p.location?.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = activeFilter === 'All' || p.category === activeFilter;
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
              <h1 className="text-[#1e1b18]" style={{ fontFamily: "'Hanken Grotesk',sans-serif", fontSize: '32px', fontWeight: 700, letterSpacing: '-0.01em' }}>All Projects</h1>
              <p className="text-base text-[#56433a] mt-1">View and manage all projects posted on the platform.</p>
            </div>

            {/* Search + filters */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="relative flex-1">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#56433a]" style={{ fontSize: '18px' }}>search</span>
                <input
                  className="w-full bg-[#fff8f5] border border-[#dcc1b5] rounded-xl py-2.5 pl-10 pr-4 text-sm focus:border-[#99420d] outline-none transition-all"
                  placeholder="Search by title or location…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                {CATEGORY_FILTERS.map(f => (
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
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <LoadingSpinner fullPage={false} />
            ) : filtered.length === 0 ? (
              <div className="card-shell">
                <div className="card-core flex flex-col items-center gap-4 py-16">
                  <span className="material-symbols-outlined text-[#dcc1b5]" style={{ fontSize: '48px' }}>folder_open</span>
                  <p className="text-base text-[#56433a]">No projects found.</p>
                </div>
              </div>
            ) : (
              <div className="card-shell overflow-hidden">
                <div style={{ background: '#fff8f5', borderRadius: 'calc(1.25rem - 5px)', overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid #dcc1b5' }}>
                        {['Title', 'Category', 'Location', 'Budget', 'Status', 'Client', 'Date', 'Actions'].map(h => (
                          <th key={h} className="text-xs font-semibold text-[#56433a] text-left px-5 py-4" style={{ letterSpacing: '0.05em', textTransform: 'uppercase' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((proj, i) => {
                        const badge = STATUS_BADGES[proj.status] || STATUS_BADGES.open;
                        return (
                          <tr key={proj._id} style={{ borderBottom: i < filtered.length - 1 ? '1px solid rgba(220,193,181,0.5)' : 'none' }}>
                            <td className="px-5 py-4 text-sm font-semibold text-[#1e1b18]" style={{ maxWidth: '160px' }}>
                              <span style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{proj.title}</span>
                            </td>
                            <td className="px-5 py-4">
                              <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: 'rgba(153,66,13,0.08)', color: '#99420d', letterSpacing: '0.05em' }}>
                                {proj.category}
                              </span>
                            </td>
                            <td className="px-5 py-4 text-sm text-[#56433a]">{proj.location}</td>
                            <td className="px-5 py-4 text-sm text-[#56433a]" style={{ whiteSpace: 'nowrap' }}>{proj.budget}</td>
                            <td className="px-5 py-4">
                              <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: badge.background, color: badge.color, letterSpacing: '0.05em' }}>
                                {badge.label}
                              </span>
                            </td>
                            <td className="px-5 py-4 text-sm text-[#56433a]">
                              <div>{proj.clientId?.fullName || '—'}</div>
                              <div className="text-xs text-[#897268]">{proj.clientId?.email}</div>
                            </td>
                            <td className="px-5 py-4 text-sm text-[#56433a]" style={{ whiteSpace: 'nowrap' }}>
                              {proj.createdAt ? new Date(proj.createdAt).toLocaleDateString() : '—'}
                            </td>
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-2">
                                {proj.kubakaLink && (
                                  <a
                                    href={proj.kubakaLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs font-semibold text-[#99420d] hover:underline"
                                    style={{ letterSpacing: '0.04em' }}
                                  >
                                    KUBAKA
                                  </a>
                                )}
                                <button
                                  onClick={() => handleDelete(proj._id)}
                                  className="text-xs font-semibold text-[#ba1a1a] hover:text-white hover:bg-[#ba1a1a] transition-colors px-3 py-1.5 rounded-full border border-[#ba1a1a]"
                                  style={{ background: 'transparent', cursor: 'pointer', letterSpacing: '0.04em' }}
                                >
                                  Delete
                                </button>
                              </div>
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
