import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PROFESSIONALS = [
  { id: 1, initials: 'AU', name: 'Aline Uwase', title: 'Principal Architect', rating: '4.9', tags: ['Sustainable Design', 'Commercial'], location: 'Kigali', verified: true, bg: 'rgba(153,66,13,0.04)', color: '#99420d' },
  { id: 2, initials: 'JB', name: 'Jean Bosco', title: 'Senior Structural Engineer', rating: '4.8', tags: ['Concrete Structures', 'Bridge Design'], location: 'Musanze', verified: true, bg: 'rgba(245,236,231,0.7)', color: '#99420d' },
  { id: 3, initials: 'MC', name: 'Marie Claire', title: 'Interior Architect', rating: '5.0', tags: ['Residential', 'Custom Furniture'], location: 'Kigali', verified: true, bg: 'rgba(147,75,25,0.05)', color: '#934b19' },
  { id: 4, initials: 'EN', name: 'Eric Ndayisaba', title: 'Construction Manager', rating: '4.7', tags: ['Site Supervision', 'Cost Estimation'], location: 'Rubavu', verified: false, bg: 'rgba(153,66,13,0.04)', color: '#99420d' },
];

function getInitials(name) {
  if (!name) return '??';
  const parts = name.trim().split(' ');
  return (parts[0][0] + (parts[1] ? parts[1][0] : '')).toUpperCase();
}

export default function BrowseProfessionals() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [topRated, setTopRated] = useState(false);

  return (
    <div className="bg-[#fff8f5] text-[#1e1b18] min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-[#fff8f5] w-full top-0 sticky border-b border-[#dcc1b5] z-50">
        <div className="flex justify-between items-center h-20 px-4 md:px-10 max-w-[1280px] mx-auto">
          <div className="flex items-center gap-6">
            <Link to="/" className="font-bold text-[#99420d]" style={{ fontFamily: "'Hanken Grotesk',sans-serif", fontSize: '24px' }}>Ubwubatsi Hub</Link>
            <div className="hidden md:flex relative ml-8">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#56433a]">search</span>
              <input
                className="bg-[#fff8f5] border border-[#dcc1b5] rounded-full py-2 pl-10 pr-4 w-64 focus:border-[#99420d] outline-none text-sm transition-all"
                placeholder="Search experts, skills..."
                type="text"
              />
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/browse-professionals" className="text-[#99420d] font-bold border-b-2 border-[#99420d] pb-1 text-sm">Find Experts</Link>
            <Link to="/post-project" className="text-[#56433a] hover:text-[#99420d] transition-colors text-sm">Projects</Link>
            <a href="/#how-it-works" className="text-[#56433a] hover:text-[#99420d] transition-colors text-sm">How it Works</a>
          </nav>
          <div className="flex items-center gap-3">
            {user ? (
              <button className="nav-avatar" onClick={() => { logout(); navigate('/'); }}>{getInitials(user.fullName)}</button>
            ) : (
              <>
                <Link to="/login" className="hidden md:block text-sm font-semibold text-[#56433a] hover:text-[#99420d] transition-colors">Login</Link>
                <Link to="/register" className="nav-register">Register</Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-grow w-full max-w-[1280px] mx-auto px-4 md:px-10">

        {/* Page header */}
        <div className="pt-12 pb-8 md:pt-16 md:pb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="fade-up du-1">
            <span
              className="inline-flex items-center gap-1.5 mb-4"
              style={{ border: '1px solid rgba(153,66,13,0.25)', background: 'rgba(153,66,13,0.05)', color: '#99420d', borderRadius: '999px', padding: '4px 12px', fontSize: '11px', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase' }}
            >
              <span className="material-symbols-outlined fill" style={{ fontSize: '12px' }}>verified</span>
              Professionals
            </span>
            <h1
              className="text-[#1e1b18]"
              style={{ fontFamily: "'Hanken Grotesk',sans-serif", fontSize: '48px', letterSpacing: '-0.02em', lineHeight: '1.05', fontWeight: 700 }}
            >
              Architects &amp; Engineers
            </h1>
            <p className="text-base text-[#56433a] mt-3" style={{ maxWidth: '40ch' }}>
              Rwanda's verified construction professionals — checked credentials, real projects.
            </p>
          </div>
          <p className="text-sm text-[#56433a] shrink-0 fade-up du-2">
            Showing <strong className="font-medium text-[#1e1b18]">{PROFESSIONALS.length}</strong> professionals
          </p>
        </div>

        {/* Filter bar */}
        <div className="flex flex-wrap items-center gap-2 pb-8 border-b border-[#dcc1b5] fade-up du-3">
          <div className="relative">
            <select className="pill-select">
              <option>All Categories</option>
              <option>Architects</option>
              <option>Structural Engineers</option>
            </select>
            <span className="material-symbols-outlined absolute pointer-events-none text-[#56433a]" style={{ right: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '18px' }}>expand_more</span>
          </div>
          <div className="relative">
            <select className="pill-select">
              <option>All Locations</option>
              <option>Gasabo</option>
              <option>Nyarugenge</option>
              <option>Kicukiro</option>
            </select>
            <span className="material-symbols-outlined absolute pointer-events-none text-[#56433a]" style={{ right: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '18px' }}>location_on</span>
          </div>
          <button
            className={`filter-chip ${topRated ? 'active' : ''}`}
            onClick={() => setTopRated(v => !v)}
          >
            <span className="material-symbols-outlined fill text-[#99420d]" style={{ fontSize: '15px' }}>star</span>
            Top rated
          </button>
          <button className="filter-chip">
            <span className="material-symbols-outlined" style={{ fontSize: '17px' }}>tune</span>
            Filters
          </button>
        </div>

        {/* Professional grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 py-8">
          {PROFESSIONALS.map((pro, i) => (
            <div key={pro.id} className={`browse-card-shell fade-up`} style={{ animationDelay: `${(i + 4) * 70}ms` }}>
              <div className="browse-card-core">
                <div className="card-avatar-band" style={{ background: pro.bg }}>
                  <span className="font-bold" style={{ fontFamily: "'Hanken Grotesk',sans-serif", fontSize: '24px', color: pro.color }}>{pro.initials}</span>
                </div>
                <div className="flex-1 p-5">
                  <div className="flex justify-between items-start gap-3">
                    <div>
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <h3 className="text-sm font-semibold text-[#1e1b18]" style={{ letterSpacing: '0.05em' }}>{pro.name}</h3>
                        {pro.verified && (
                          <span className="material-symbols-outlined fill text-[#99420d]" style={{ fontSize: '15px' }} title="Verified">verified</span>
                        )}
                      </div>
                      <p className="text-sm text-[#56433a]">
                        {pro.title} &nbsp;·&nbsp; <span className="text-[#99420d] font-medium">{pro.rating}</span>
                      </p>
                    </div>
                    <Link to={`/professional/${pro.id}`} className="view-btn">
                      View
                      <span className="view-btn-icon">
                        <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>arrow_forward</span>
                      </span>
                    </Link>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {pro.tags.map(tag => (
                      <span key={tag} className="tag-pill" style={{ background: `rgba(${pro.color === '#934b19' ? '147,75,25' : '153,66,13'},0.07)`, color: pro.color }}>{tag}</span>
                    ))}
                  </div>
                  <p className="flex items-center gap-1 mt-3 text-sm text-[#56433a]">
                    <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>location_on</span>{pro.location}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center pb-16">
          <button className="load-more">
            Load more professionals
            <span style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(30,27,24,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>expand_more</span>
            </span>
          </button>
        </div>
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
