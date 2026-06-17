import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';

function getInitials(name) {
  if (!name) return '??';
  const parts = name.trim().split(' ');
  return (parts[0][0] + (parts[1] ? parts[1][0] : '')).toUpperCase();
}

export default function ProfessionalProfile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [messaging, setMessaging] = useState(false);

  useEffect(() => {
    api.get(`/api/professionals/${id}`)
      .then(res => setProfile(res.data))
      .catch(() => setError('Could not load this profile.'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSendMessage = async () => {
    if (!user) { navigate('/login'); return; }
    setMessaging(true);
    try {
      const { data: convo } = await api.post('/api/messages/conversation', { receiverId: id });
      navigate('/messages', { state: { conversationId: convo._id } });
    } catch {
      toast.error('Could not start conversation');
    } finally {
      setMessaging(false);
    }
  };

  const pro = profile?.userId || {};
  const initials = getInitials(pro.fullName);

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

      {loading && (
        <div className="flex-1 flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-[#dcc1b5] border-t-[#99420d] rounded-full animate-spin" />
        </div>
      )}

      {error && (
        <div className="flex-1 flex flex-col items-center justify-center gap-4 py-20">
          <p className="text-base text-[#ba1a1a]">{error}</p>
          <Link to="/browse-professionals" className="btn-primary-sm">Back to Professionals</Link>
        </div>
      )}

      {!loading && !error && profile && (
        <main className="flex-1 w-full max-w-[1280px] mx-auto px-4 md:px-10 py-10 grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Left column */}
          <div className="lg:col-span-8 flex flex-col gap-6">

            {/* Profile header */}
            <div className="profile-header fade-up du-1">
              <div className="h-36 md:h-48 bg-[#efe6e2]" />
              <div className="px-7 pb-7 -mt-12 flex flex-col sm:flex-row gap-5 items-start sm:items-end">
                <div className="profile-avatar overflow-hidden">
                  {pro.profilePicture ? (
                    <img src={pro.profilePicture} alt={pro.fullName} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-[#99420d]" style={{ fontFamily: "'Hanken Grotesk',sans-serif", fontSize: '28px', fontWeight: 600 }}>{initials}</span>
                  )}
                </div>
                <div className="flex-1 pt-2 sm:pt-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h1 className="text-[#1e1b18]" style={{ fontFamily: "'Hanken Grotesk',sans-serif", fontSize: '32px', letterSpacing: '-0.01em', fontWeight: 600 }}>
                      {pro.fullName || 'Professional'}
                    </h1>
                    {pro.isVerified && (
                      <span className="material-symbols-outlined fill text-[#934b19]" style={{ fontSize: '20px' }} title="Verified">verified</span>
                    )}
                  </div>
                  <p className="text-base text-[#b95925] mb-2">{profile.specialty || 'Verified Professional'}</p>
                  <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-[#56433a]">
                    {profile.location && (
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>location_on</span>{profile.location}
                      </span>
                    )}
                    {profile.averageRating > 0 && (
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined fill" style={{ fontSize: '16px' }}>star</span>
                        {profile.averageRating.toFixed(1)} · {profile.totalReviews} Reviews
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* About */}
            <div className="section-shell fade-up du-2">
              <div className="section-core">
                <h2 className="text-[#1e1b18] mb-4" style={{ fontFamily: "'Hanken Grotesk',sans-serif", fontSize: '24px', fontWeight: 600 }}>About</h2>
                {profile.bio ? (
                  <p className="text-base text-[#56433a]">{profile.bio}</p>
                ) : (
                  <p className="text-base text-[#56433a]">No bio available.</p>
                )}
              </div>
            </div>

            {/* Portfolio */}
            <div className="fade-up du-3">
              <h2 className="text-[#1e1b18] mb-4" style={{ fontFamily: "'Hanken Grotesk',sans-serif", fontSize: '24px', fontWeight: 600 }}>Selected Portfolio</h2>
              {profile.portfolioImages && profile.portfolioImages.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {profile.portfolioImages.map((src, i) => (
                    <a key={i} href={src} target="_blank" rel="noopener noreferrer" className="block group">
                      <img src={src} alt={`Portfolio item ${i + 1}`} className="w-full h-40 object-cover rounded-2xl group-hover:opacity-90 transition-opacity" />
                    </a>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3 py-12 text-center border border-dashed border-[#dcc1b5] rounded-2xl">
                  <span className="material-symbols-outlined text-[#dcc1b5]" style={{ fontSize: '48px' }}>photo_library</span>
                  <p className="text-base text-[#56433a]">No portfolio items yet.</p>
                </div>
              )}
            </div>

            {/* Reviews */}
            <div className="section-shell fade-up du-4">
              <div className="section-core">
                <h2 className="text-[#1e1b18] mb-4" style={{ fontFamily: "'Hanken Grotesk',sans-serif", fontSize: '24px', fontWeight: 600 }}>Client Feedback</h2>
                <p className="text-sm text-[#56433a] mb-5">Based on verified project completions.</p>
                <div className="flex flex-col items-center gap-3 py-8 text-center">
                  <span className="material-symbols-outlined text-[#dcc1b5]" style={{ fontSize: '48px' }}>rate_review</span>
                  <p className="text-base text-[#56433a]">No reviews yet.</p>
                </div>
              </div>
            </div>

          </div>

          {/* Right sidebar */}
          <div className="lg:col-span-4 flex flex-col gap-5">

            <div className="sidebar-card sticky top-28 fade-up du-5">
              <div className="sidebar-card-core">
                <h3 className="text-[#1e1b18] mb-1" style={{ fontFamily: "'Hanken Grotesk',sans-serif", fontSize: '24px', fontWeight: 600 }}>
                  Hire {pro.fullName?.split(' ')[0] || 'this Professional'}
                </h3>
                <p className="text-sm text-[#56433a] mb-5">Typically responds within 24 hours.</p>
                <div className="flex flex-col gap-3">
                  <button className="action-btn-primary" onClick={handleSendMessage} disabled={messaging}>
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>send</span>
                    {messaging ? 'Opening...' : 'Send Message'}
                  </button>
                  <button className="action-btn-outline">
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>calendar_month</span>
                    Request Consultation
                  </button>
                </div>
                {pro.registrationNumber && (
                  <div className="mt-5 pt-5 border-t border-[#dcc1b5]">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-[#56433a]">Registration No.</span>
                      <span className="text-sm font-semibold text-[#1e1b18]" style={{ letterSpacing: '0.05em' }}>{pro.registrationNumber}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>
        </main>
      )}

      <footer className="border-t border-[#dcc1b5] py-10 mt-auto">
        <div className="flex flex-col md:flex-row justify-between items-center px-4 md:px-10 max-w-[1280px] mx-auto gap-4">
          <span className="font-bold text-[#99420d]" style={{ fontFamily: "'Hanken Grotesk',sans-serif", fontSize: '24px' }}>Ubwubatsi Hub</span>
          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            <a className="text-sm text-[#56433a] hover:text-[#99420d] transition-colors" href="#">Terms of Service</a>
            <a className="text-sm text-[#56433a] hover:text-[#99420d] transition-colors" href="#">Privacy Policy</a>
            <a className="text-sm text-[#56433a] hover:text-[#99420d] transition-colors" href="#">Contact Support</a>
          </nav>
          <span className="text-sm text-[#56433a]">© 2024 Ubwubatsi Hub. Building Rwanda with Integrity.</span>
        </div>
      </footer>
    </div>
  );
}
