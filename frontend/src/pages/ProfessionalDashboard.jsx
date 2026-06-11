import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function getInitials(name) {
  if (!name) return '??';
  const parts = name.trim().split(' ');
  return (parts[0][0] + (parts[1] ? parts[1][0] : '')).toUpperCase();
}

const AVAILABLE_PROJECTS = [
  { id: 1, category: 'Commercial', time: '2h ago', title: 'Kigali Tech Park Office Build', desc: 'Looking for a lead architect to design a modern, eco-friendly 4-story office building in the new tech zone.', location: 'Kigali', budget: '150M – 200M RWF' },
  { id: 2, category: 'Residential', time: '5h ago', title: 'Luxury Villa Extension', desc: 'Seeking architectural plans and structural engineering for a major extension to an existing hillside property.', location: 'Rubavu', budget: '40M – 60M RWF' },
  { id: 3, category: 'Public Works', time: '1d ago', title: 'Community Health Clinic', desc: 'Design and structural planning for a new rural community health clinic. Focus on sustainable local materials.', location: 'Musanze', budget: 'Open to Bids' },
];

export default function ProfessionalDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const firstName = user?.fullName?.split(' ')[0] || 'Professional';
  const initials = getInitials(user?.fullName || '');

  return (
    <div className="bg-[#fff8f5] text-[#1e1b18] flex min-h-screen">

      {/* Sidebar */}
      <nav className="pro-sidebar hidden md:flex">
        <div className="px-6 pb-7 border-b border-white/10 mb-2" style={{ paddingTop: 0 }}>
          <Link to="/" style={{ color: '#ffdbcc', fontFamily: "'Hanken Grotesk',sans-serif", fontSize: '24px', fontWeight: 700, textDecoration: 'none' }}>Ubwubatsi Hub</Link>
          <div className="flex items-center gap-3 mt-5">
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(153,66,13,0.25)', border: '2px solid rgba(153,66,13,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: 600, color: '#ffb693', letterSpacing: '0.05em' }}>
              {initials}
            </div>
            <div>
              <p style={{ color: '#fff8f5', fontSize: '14px', fontWeight: 600, letterSpacing: '0.05em' }}>{user?.fullName || 'Professional'}</p>
              <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '14px' }}>Certified Architect</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col flex-grow py-2">
          <Link to="/professional-dashboard" className="sidebar-nav-item active">
            <span className="material-symbols-outlined fill" style={{ fontSize: '20px' }}>dashboard</span>
            Dashboard
          </Link>
          <a href="#" className="sidebar-nav-item">
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>architecture</span>
            Active Projects
          </a>
          <Link to="/professional/1" className="sidebar-nav-item">
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>import_contacts</span>
            My Portfolio
          </Link>
          <a href="#" className="sidebar-nav-item">
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>chat</span>
            Messages
          </a>
          <a href="#" className="sidebar-nav-item">
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>verified</span>
            Certifications
          </a>
        </div>

        <div className="px-0 mt-auto" style={{ paddingBottom: '8px' }}>
          <Link to="/post-project" className="sidebar-post-btn">Post a Project</Link>
          <div className="flex flex-col gap-1 mt-5 px-0">
            <a href="#" className="sidebar-nav-item" style={{ padding: '10px 8px', borderRadius: '8px' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>settings</span>
              Settings
            </a>
            <button
              className="sidebar-nav-item text-left w-full"
              style={{ padding: '10px 8px', borderRadius: '8px', background: 'transparent', border: 'none', cursor: 'pointer' }}
              onClick={() => { logout(); navigate('/'); }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>logout</span>
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main canvas */}
      <main className="flex-1 md:ml-64 flex flex-col min-h-screen">

        {/* Top bar */}
        <header className="h-20 flex justify-between items-center px-10 bg-[#fff8f5] border-b border-[#dcc1b5] sticky top-0 z-40">
          <div className="flex items-center gap-3">
            <button className="md:hidden text-[#56433a]">
              <span className="material-symbols-outlined">menu</span>
            </button>
            <Link to="/" className="font-bold text-[#99420d] hover:text-[#9c440f] transition-colors" style={{ fontFamily: "'Hanken Grotesk',sans-serif", fontSize: '24px' }}>
              Ubwubatsi Hub
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative text-[#56433a] hover:text-[#99420d] transition-colors">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-0 right-0 w-2 h-2 bg-[#ba1a1a] rounded-full" />
            </button>
            <div className="hidden md:flex items-center gap-2">
              <span className="text-sm font-semibold text-[#1e1b18]" style={{ letterSpacing: '0.05em' }}>{user?.fullName || 'Professional'}</span>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(153,66,13,0.1)', border: '1px solid rgba(153,66,13,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 600, color: '#99420d', letterSpacing: '0.05em' }}>
                {initials}
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 p-10 max-w-[1280px] w-full flex flex-col gap-14">

          {/* Welcome */}
          <section className="fade-up du-1">
            <h2
              className="text-[#1e1b18] flex items-center gap-3"
              style={{ fontFamily: "'Hanken Grotesk',sans-serif", fontSize: '48px', letterSpacing: '-0.02em', lineHeight: '1.05', fontWeight: 700 }}
            >
              Welcome back, {firstName}
              <span className="material-symbols-outlined fill text-[#99420d]" style={{ fontSize: '28px' }} title="Verified">verified</span>
            </h2>
            <p className="text-lg text-[#56433a] mt-2">Here's what is happening with your projects today.</p>
          </section>

          {/* Available Projects */}
          <section className="fade-up du-2">
            <div className="flex justify-between items-end border-b border-[#dcc1b5] pb-3 mb-6">
              <h3 className="text-[#1e1b18]" style={{ fontFamily: "'Hanken Grotesk',sans-serif", fontSize: '32px', fontWeight: 600 }}>Available Projects</h3>
              <Link to="/browse-professionals" className="text-sm font-semibold text-[#99420d] hover:underline" style={{ letterSpacing: '0.05em' }}>View all</Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {AVAILABLE_PROJECTS.map((proj, i) => (
                <div key={proj.id} className={`pro-card-shell fade-up`} style={{ animationDelay: `${(i + 3) * 80}ms` }}>
                  <div className="pro-card-core">
                    <div className="flex justify-between items-start mb-4">
                      <span className="cat-chip">{proj.category}</span>
                      <span className="text-sm text-[#56433a]">{proj.time}</span>
                    </div>
                    <h4 className="text-[#1e1b18] mb-2" style={{ fontFamily: "'Hanken Grotesk',sans-serif", fontSize: '24px', fontWeight: 600 }}>{proj.title}</h4>
                    <p className="text-sm text-[#56433a] mb-5" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{proj.desc}</p>
                    <div className="grid grid-cols-2 gap-3 mb-5 pt-4 border-t border-[#dcc1b5]/50">
                      <div>
                        <p className="text-xs font-medium text-[#56433a] mb-1" style={{ letterSpacing: '0.05em' }}>Location</p>
                        <p className="text-sm font-medium text-[#1e1b18] flex items-center gap-1">
                          <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>location_on</span>{proj.location}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-[#56433a] mb-1" style={{ letterSpacing: '0.05em' }}>Budget</p>
                        <p className="text-sm font-medium text-[#1e1b18]">{proj.budget}</p>
                      </div>
                    </div>
                    <button className="interest-btn">Express Interest</button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Active Projects */}
          <section className="fade-up du-6 pb-12">
            <div className="flex justify-between items-end border-b border-[#dcc1b5] pb-3 mb-6">
              <h3 className="text-[#1e1b18]" style={{ fontFamily: "'Hanken Grotesk',sans-serif", fontSize: '32px', fontWeight: 600 }}>My Active Projects</h3>
            </div>
            <div className="flex flex-col gap-3">

              <div className="active-project">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-semibold text-[#1e1b18]" style={{ letterSpacing: '0.05em' }}>Nyarutarama Residence</h4>
                    <span style={{ background: '#e1efd8', color: '#3b6623', borderRadius: '999px', padding: '2px 8px', fontSize: '11px', fontWeight: 600 }}>In Progress</span>
                  </div>
                  <p className="text-sm text-[#56433a]">Foundation Pouring · Client: M. Kamari</p>
                </div>
                <div className="w-full md:w-56 flex flex-col gap-1.5">
                  <div className="flex justify-between text-xs font-medium text-[#56433a]" style={{ letterSpacing: '0.05em' }}>
                    <span>Timeline</span><span>45%</span>
                  </div>
                  <div className="w-full bg-[#e9e1dc] h-1.5 rounded-full overflow-hidden">
                    <div className="bg-[#934b19] h-full rounded-full" style={{ width: '45%' }} />
                  </div>
                </div>
                <button className="flex-shrink-0 border border-[#dcc1b5] text-[#1e1b18] text-sm font-semibold px-4 py-2 hover:border-[#99420d] hover:text-[#99420d] transition-colors" style={{ borderRadius: '999px', letterSpacing: '0.05em' }}>Update</button>
              </div>

              <div className="active-project">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-semibold text-[#1e1b18]" style={{ letterSpacing: '0.05em' }}>Kiyovu Boutique Hotel</h4>
                    <span style={{ background: '#ffdbc9', color: '#753401', borderRadius: '999px', padding: '2px 8px', fontSize: '11px', fontWeight: 600 }}>Planning</span>
                  </div>
                  <p className="text-sm text-[#56433a]">Blueprint Finalization · Client: Heritage Group</p>
                </div>
                <div className="w-full md:w-56 flex flex-col gap-1.5">
                  <div className="flex justify-between text-xs font-medium text-[#56433a]" style={{ letterSpacing: '0.05em' }}>
                    <span>Timeline</span><span>15%</span>
                  </div>
                  <div className="w-full bg-[#e9e1dc] h-1.5 rounded-full overflow-hidden">
                    <div className="bg-[#934b19] h-full rounded-full" style={{ width: '15%' }} />
                  </div>
                </div>
                <button className="flex-shrink-0 border border-[#dcc1b5] text-[#1e1b18] text-sm font-semibold px-4 py-2 hover:border-[#99420d] hover:text-[#99420d] transition-colors" style={{ borderRadius: '999px', letterSpacing: '0.05em' }}>Update</button>
              </div>

            </div>
          </section>

        </div>
      </main>
    </div>
  );
}
