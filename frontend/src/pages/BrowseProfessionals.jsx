import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import StarRating from '../components/StarRating';

function getInitials(name) {
  if (!name) return '??';
  const parts = name.trim().split(' ');
  return (parts[0][0] + (parts[1] ? parts[1][0] : '')).toUpperCase();
}

const FILTERS = ['All', 'Architect', 'Civil Engineer'];

export default function BrowseProfessionals() {
  const { user } = useAuth();

  const [professionals, setProfessionals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    api.get('/api/professionals')
      .then(res => setProfessionals(res.data))
      .catch(() => setError('Could not load professionals.'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = professionals.filter(pro => {
    const name = pro.userId?.fullName?.toLowerCase() || '';
    const specialty = pro.specialty?.toLowerCase() || '';
    const matchesSearch = name.includes(search.toLowerCase()) || specialty.includes(search.toLowerCase());
    const matchesFilter = activeFilter === 'All' || pro.specialty === activeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="bg-[#fff8f5] text-[#1e1b18] min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow w-full max-w-[1280px] mx-auto px-4 md:px-10">

        {/* Page header */}
        <div className="pt-8 pb-6 md:pt-16 md:pb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="fade-up du-1">
            <span
              className="inline-flex items-center gap-1.5 mb-4"
              style={{ border: '1px solid rgba(153,66,13,0.25)', background: 'rgba(153,66,13,0.05)', color: '#99420d', borderRadius: '999px', padding: '4px 12px', fontSize: '11px', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase' }}
            >
              <span className="material-symbols-outlined fill" style={{ fontSize: '12px' }}>verified</span>
              Professionals
            </span>
            <h1
              className="text-[#1e1b18] text-3xl md:text-5xl"
              style={{ fontFamily: "'Hanken Grotesk',sans-serif", letterSpacing: '-0.02em', lineHeight: '1.05', fontWeight: 700 }}
            >
              Architects &amp; Engineers
            </h1>
            <p className="text-base text-[#56433a] mt-3" style={{ maxWidth: '40ch' }}>
              Rwanda's verified construction professionals — checked credentials, real projects.
            </p>
          </div>
          <div className="flex flex-col items-start md:items-end gap-3 fade-up du-2 w-full md:w-auto">
            {/* Search */}
            <div className="relative w-full md:w-72">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#56433a]" style={{ fontSize: '18px' }}>search</span>
              <input
                className="bg-[#fff8f5] border border-[#dcc1b5] rounded-full py-3 pl-10 pr-4 w-full focus:border-[#99420d] outline-none text-sm transition-all"
                placeholder="Search experts, skills..."
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            {!loading && !error && (
              <p className="text-sm text-[#56433a]">
                Showing <strong className="font-medium text-[#1e1b18]">{filtered.length}</strong> professionals
              </p>
            )}
          </div>
        </div>

        {/* Filter bar */}
        <div className="flex items-center gap-2 pb-6 md:pb-8 border-b border-[#dcc1b5] fade-up du-3 overflow-x-auto scrollbar-none" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {FILTERS.map(f => (
            <button
              key={f}
              className={`filter-chip${activeFilter === f ? ' active' : ''}`}
              onClick={() => setActiveFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>

        {/* States */}
        {loading && (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-[#dcc1b5] border-t-[#99420d] rounded-full animate-spin" />
          </div>
        )}

        {error && <p className="text-sm text-[#ba1a1a] py-10">{error}</p>}

        {!loading && !error && filtered.length === 0 && (
          <div className="flex flex-col items-center gap-4 py-20 text-center fade-up du-4">
            <span className="material-symbols-outlined text-[#dcc1b5]" style={{ fontSize: '56px' }}>group</span>
            <p className="text-base text-[#56433a]">No verified professionals yet. Check back soon.</p>
          </div>
        )}

        {!loading && !error && filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 py-6 md:py-8">
            {filtered.map((pro, i) => (
              <div key={pro._id} className="browse-card-shell fade-up" style={{ animationDelay: `${(i + 4) * 70}ms` }}>
                <div className="browse-card-core">
                  <div className="card-avatar-band" style={{ background: 'rgba(153,66,13,0.04)' }}>
                    {pro.userId?.profilePicture ? (
                      <img
                        src={pro.userId.profilePicture}
                        alt={pro.userId.fullName}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <span className="font-bold text-[#99420d]" style={{ fontFamily: "'Hanken Grotesk',sans-serif", fontSize: '22px' }}>
                        {getInitials(pro.userId?.fullName)}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 p-5">
                    <div className="flex justify-between items-start gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <h3 className="text-sm font-semibold text-[#1e1b18] truncate" style={{ letterSpacing: '0.05em' }}>
                            {pro.userId?.fullName}
                          </h3>
                          <span className="material-symbols-outlined fill text-[#99420d] flex-shrink-0" style={{ fontSize: '15px' }} title="Verified">verified</span>
                        </div>
                        <p className="text-sm text-[#56433a]">{pro.specialty || 'Construction Professional'}</p>
                        {pro.averageRating > 0 ? (
                          <div className="flex items-center gap-1.5 mt-1.5">
                            <StarRating value={Math.round(pro.averageRating)} readOnly size="sm" />
                            <span className="text-xs text-[#56433a]">
                              {pro.averageRating.toFixed(1)}
                              {pro.totalReviews > 0 && ` (${pro.totalReviews})`}
                            </span>
                          </div>
                        ) : (
                          <p className="text-xs text-[#897268] mt-1.5">No reviews yet</p>
                        )}
                      </div>
                      <Link to={`/professional/${pro._id}`} className="view-btn flex-shrink-0">
                        View
                        <span className="view-btn-icon">
                          <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>arrow_forward</span>
                        </span>
                      </Link>
                    </div>
                    {pro.bio && (
                      <p className="text-sm text-[#56433a] mt-2" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {pro.bio}
                      </p>
                    )}
                    {pro.location && (
                      <p className="flex items-center gap-1 mt-3 text-sm text-[#56433a]">
                        <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>location_on</span>{pro.location}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="bg-[#e9e1dc] w-full py-8 border-t border-[#dcc1b5]">
        <div className="flex flex-col md:flex-row justify-between items-center px-4 md:px-10 max-w-[1280px] mx-auto gap-4">
          <div className="font-bold text-[#99420d]" style={{ fontFamily: "'Hanken Grotesk',sans-serif", fontSize: '24px' }}>Ubwubatsi Hub</div>
          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            <a className="text-sm text-[#56433a] hover:text-[#934b19] transition-colors" href="#">Terms of Service</a>
            <a className="text-sm text-[#56433a] hover:text-[#934b19] transition-colors" href="#">Privacy Policy</a>
            <a className="text-sm text-[#56433a] hover:text-[#934b19] transition-colors" href="#">Contact Support</a>
            <a className="text-sm text-[#56433a] hover:text-[#934b19] transition-colors" href="#">Rwandan Institute of Architects</a>
          </nav>
          <div className="text-sm text-[#56433a]">© 2024 Ubwubatsi Hub. Building Rwanda with Integrity.</div>
        </div>
      </footer>
    </div>
  );
}
