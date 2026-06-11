import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function getInitials(name) {
  if (!name) return '??';
  const parts = name.trim().split(' ');
  return (parts[0][0] + (parts[1] ? parts[1][0] : '')).toUpperCase();
}

export default function ProfessionalProfile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="bg-[#fff8f5] text-[#1e1b18] min-h-screen flex flex-col">
      {/* Nav */}
      <nav className="bg-[#fff8f5] w-full top-0 sticky border-b border-[#dcc1b5] z-50">
        <div className="flex justify-between items-center h-20 px-4 md:px-10 max-w-[1280px] mx-auto">
          <Link to="/" className="font-bold text-[#99420d]" style={{ fontFamily: "'Hanken Grotesk',sans-serif", fontSize: '24px' }}>Ubwubatsi Hub</Link>
          <div className="hidden md:flex items-center gap-6">
            <Link to="/browse-professionals" className="text-[#99420d] font-medium border-b-2 border-[#99420d] pb-0.5 text-base">Find Experts</Link>
            <Link to="/post-project" className="text-[#56433a] hover:text-[#99420d] transition-colors text-base">Projects</Link>
            <a href="/#how-it-works" className="text-[#56433a] hover:text-[#99420d] transition-colors text-base">How it Works</a>
          </div>
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
      </nav>

      {/* Main layout */}
      <main className="flex-1 w-full max-w-[1280px] mx-auto px-4 md:px-10 py-10 grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left column */}
        <div className="lg:col-span-8 flex flex-col gap-6">

          {/* Profile header */}
          <div className="profile-header fade-up du-1">
            <div className="h-36 md:h-48 bg-[#efe6e2]" />
            <div className="px-7 pb-7 -mt-12 flex flex-col sm:flex-row gap-5 items-start sm:items-end">
              <div className="profile-avatar">
                <span className="text-[#99420d]" style={{ fontFamily: "'Hanken Grotesk',sans-serif", fontSize: '28px', fontWeight: 600 }}>JB</span>
              </div>
              <div className="flex-1 pt-2 sm:pt-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <h1 className="text-[#1e1b18]" style={{ fontFamily: "'Hanken Grotesk',sans-serif", fontSize: '32px', letterSpacing: '-0.01em', fontWeight: 600 }}>Jean Bosco</h1>
                  <span className="material-symbols-outlined fill text-[#934b19]" style={{ fontSize: '20px' }} title="Verified">verified</span>
                </div>
                <p className="text-base text-[#b95925] mb-2">Principal Architect &amp; Structural Engineer</p>
                <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-[#56433a]">
                  <span className="flex items-center gap-1"><span className="material-symbols-outlined" style={{ fontSize: '16px' }}>location_on</span>Kigali, Rwanda</span>
                  <span className="flex items-center gap-1"><span className="material-symbols-outlined" style={{ fontSize: '16px' }}>work</span>12 Years Experience</span>
                  <span className="flex items-center gap-1"><span className="material-symbols-outlined fill" style={{ fontSize: '16px' }}>star</span>4.9 · 42 Reviews</span>
                </div>
              </div>
            </div>
          </div>

          {/* About */}
          <div className="section-shell fade-up du-2">
            <div className="section-core">
              <h2 className="text-[#1e1b18] mb-4" style={{ fontFamily: "'Hanken Grotesk',sans-serif", fontSize: '24px', fontWeight: 600 }}>About</h2>
              <div className="text-base text-[#56433a] flex flex-col gap-3">
                <p>Specializing in sustainable urban development and residential architecture, I blend traditional Rwandan design principles with modern engineering practices. My approach focuses on utilizing local materials — specifically laterite stone and sustainable timber — to create spaces that are both environmentally responsible and structurally enduring.</p>
                <p>Over the past decade, I have led projects ranging from boutique eco-lodges in Musanze to contemporary residential complexes in Kigali. I am deeply committed to structural integrity and collaborative client relationships.</p>
              </div>
              <div className="mt-6 pt-5 border-t border-[#dcc1b5]">
                <p className="text-xs font-medium text-[#56433a] uppercase tracking-widest mb-3">Expertise</p>
                <div className="flex flex-wrap gap-2">
                  {['Sustainable Design', 'Residential Architecture', 'Structural Engineering', 'Urban Planning', 'Local Materials Sourcing'].map(tag => (
                    <span key={tag} className="tag-pill">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Portfolio */}
          <div className="fade-up du-3">
            <div className="flex justify-between items-end mb-4">
              <h2 className="text-[#1e1b18]" style={{ fontFamily: "'Hanken Grotesk',sans-serif", fontSize: '24px', fontWeight: 600 }}>Selected Portfolio</h2>
              <a className="text-sm font-semibold text-[#99420d] hover:underline" style={{ letterSpacing: '0.05em' }} href="#">View all</a>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3" style={{ gridAutoRows: '160px' }}>
              <div className="portfolio-tile sm:col-span-2 lg:col-span-2" style={{ gridRow: 'span 2', background: 'rgba(245,236,231,0.6)' }}>
                <p className="text-xs font-medium text-[#56433a] uppercase tracking-wider mb-1">Residential · 2023</p>
                <h3 className="text-[#1e1b18]" style={{ fontFamily: "'Hanken Grotesk',sans-serif", fontSize: '24px', fontWeight: 600 }}>Kigali Heights Villas</h3>
              </div>
              <div className="portfolio-tile" style={{ background: 'rgba(239,230,226,0.5)' }}>
                <p className="text-xs text-[#56433a] mb-0.5">Eco-tourism · 2022</p>
                <h3 className="text-sm font-semibold text-[#1e1b18]" style={{ letterSpacing: '0.05em' }}>Musanze Eco-Lodge</h3>
              </div>
              <div className="portfolio-tile" style={{ background: 'rgba(245,236,231,0.6)' }}>
                <p className="text-xs text-[#56433a] mb-0.5">Commercial · 2021</p>
                <h3 className="text-sm font-semibold text-[#1e1b18]" style={{ letterSpacing: '0.05em' }}>Innovation Hub</h3>
              </div>
            </div>
          </div>

          {/* Reviews */}
          <div className="section-shell fade-up du-4">
            <div className="section-core">
              <div className="flex items-center gap-5 mb-6 pb-5 border-b border-[#dcc1b5]">
                <div className="text-center">
                  <p className="text-[#99420d] leading-none" style={{ fontFamily: "'Hanken Grotesk',sans-serif", fontSize: '44px', fontWeight: 700, letterSpacing: '-0.02em' }}>4.9</p>
                  <div className="flex items-center gap-0.5 my-1.5">
                    {[...Array(4)].map((_, i) => (
                      <span key={i} className="material-symbols-outlined fill text-[#934b19]" style={{ fontSize: '14px' }}>star</span>
                    ))}
                    <span className="material-symbols-outlined fill text-[#934b19]" style={{ fontSize: '14px' }}>star_half</span>
                  </div>
                  <p className="text-sm text-[#56433a]">42 reviews</p>
                </div>
                <div>
                  <h2 className="text-[#1e1b18]" style={{ fontFamily: "'Hanken Grotesk',sans-serif", fontSize: '24px', fontWeight: 600 }}>Client Feedback</h2>
                  <p className="text-sm text-[#56433a] mt-1">Based on verified project completions.</p>
                </div>
              </div>
              <div>
                <div className="review-item">
                  <div className="review-avatar" style={{ background: 'rgba(153,66,13,0.12)', color: '#99420d' }}>MK</div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="text-sm font-semibold text-[#1e1b18]" style={{ letterSpacing: '0.05em' }}>Marie Kamikazi</h4>
                      <span className="text-sm text-[#56433a]">2 months ago</span>
                    </div>
                    <div className="flex items-center gap-0.5 mb-2">
                      {[...Array(5)].map((_, i) => <span key={i} className="material-symbols-outlined fill text-[#934b19]" style={{ fontSize: '13px' }}>star</span>)}
                    </div>
                    <p className="text-base text-[#56433a]">Jean Bosco was exceptional to work with. He truly understood our vision for a sustainable home and delivered a design that was both beautiful and structurally sound. Highly recommend.</p>
                  </div>
                </div>
                <div className="review-item">
                  <div className="review-avatar" style={{ background: 'rgba(239,230,226,0.8)', color: '#56433a' }}>DN</div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="text-sm font-semibold text-[#1e1b18]" style={{ letterSpacing: '0.05em' }}>David N.</h4>
                      <span className="text-sm text-[#56433a]">5 months ago</span>
                    </div>
                    <div className="flex items-center gap-0.5 mb-2">
                      {[...Array(4)].map((_, i) => <span key={i} className="material-symbols-outlined fill text-[#934b19]" style={{ fontSize: '13px' }}>star</span>)}
                      <span className="material-symbols-outlined text-[#934b19]" style={{ fontSize: '13px' }}>star</span>
                    </div>
                    <p className="text-base text-[#56433a]">Great attention to detail and very knowledgeable about local materials. The project took slightly longer than expected, but the final architectural plans were flawless.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right sidebar */}
        <div className="lg:col-span-4 flex flex-col gap-5">

          <div className="sidebar-card sticky top-28 fade-up du-5">
            <div className="sidebar-card-core">
              <h3 className="text-[#1e1b18] mb-1" style={{ fontFamily: "'Hanken Grotesk',sans-serif", fontSize: '24px', fontWeight: 600 }}>Hire Jean Bosco</h3>
              <p className="text-sm text-[#56433a] mb-5">Typically responds within 24 hours.</p>
              <div className="flex flex-col gap-3">
                <button className="action-btn-primary">
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>send</span>
                  Send Message
                </button>
                <button className="action-btn-outline">
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>calendar_month</span>
                  Request Consultation
                </button>
              </div>
              <div className="mt-5 pt-5 border-t border-[#dcc1b5] flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#56433a]">Response Rate</span>
                  <span className="text-sm font-semibold text-[#1e1b18]" style={{ letterSpacing: '0.05em' }}>98%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#56433a]">Projects Completed</span>
                  <span className="text-sm font-semibold text-[#1e1b18]" style={{ letterSpacing: '0.05em' }}>34 on platform</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#56433a]">Availability</span>
                  <span className="text-sm font-semibold text-[#934b19] flex items-center gap-1.5" style={{ letterSpacing: '0.05em' }}>
                    <span className="avail-dot" />Accepting Projects
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="sidebar-card fade-up du-6">
            <div className="sidebar-card-core">
              <p className="text-xs font-medium text-[#56433a] uppercase tracking-widest mb-4">Credentials</p>
              <ul className="flex flex-col gap-4">
                {[
                  { icon: 'workspace_premium', title: 'Registered Architect', sub: 'Rwandan Institute of Architects (RIA)' },
                  { icon: 'school', title: 'MSc Structural Engineering', sub: 'University of Rwanda, 2012' },
                  { icon: 'eco', title: 'LEED Green Associate', sub: 'U.S. Green Building Council' },
                ].map(cred => (
                  <li key={cred.title} className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-[#56433a] mt-0.5" style={{ fontSize: '20px' }}>{cred.icon}</span>
                    <div>
                      <p className="text-sm font-semibold text-[#1e1b18]" style={{ letterSpacing: '0.05em' }}>{cred.title}</p>
                      <p className="text-sm text-[#56433a]">{cred.sub}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>
      </main>

      <footer className="border-t border-[#dcc1b5] py-10 mt-auto">
        <div className="flex flex-col md:flex-row justify-between items-center px-4 md:px-10 max-w-[1280px] mx-auto gap-4">
          <span className="font-bold text-[#99420d]" style={{ fontFamily: "'Hanken Grotesk',sans-serif", fontSize: '24px' }}>Ubwubatsi Hub</span>
          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            <a className="text-sm text-[#56433a] hover:text-[#99420d] transition-colors" href="#">Terms of Service</a>
            <a className="text-sm text-[#56433a] hover:text-[#99420d] transition-colors" href="#">Privacy Policy</a>
            <a className="text-sm text-[#56433a] hover:text-[#99420d] transition-colors" href="#">Contact Support</a>
            <a className="text-sm text-[#56433a] hover:text-[#99420d] transition-colors" href="#">Rwandan Institute of Architects</a>
          </nav>
          <span className="text-sm text-[#56433a]">© 2024 Ubwubatsi Hub. Building Rwanda with Integrity.</span>
        </div>
      </footer>
    </div>
  );
}
