import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

function getInitials(name) {
  if (!name) return '??';
  const parts = name.trim().split(' ');
  return (parts[0][0] + (parts[1] ? parts[1][0] : '')).toUpperCase();
}

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return 'Just now';
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

function formatTime(iso) {
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

const statusColors = {
  pending: { bg: 'rgba(153,66,13,0.08)', color: '#99420d' },
  accepted: { bg: 'rgba(14,115,45,0.08)', color: '#0e7312' },
  rejected: { bg: 'rgba(186,26,26,0.08)', color: '#ba1a1a' },
};

export default function ProfessionalDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const firstName = user?.fullName?.split(' ')[0] || 'Professional';
  const initials = getInitials(user?.fullName || '');

  const [projects, setProjects] = useState([]);
  const [activeProjects, setActiveProjects] = useState([]);
  const [expressions, setExpressions] = useState([]);
  const [expressedIds, setExpressedIds] = useState(new Set());
  const [conversations, setConversations] = useState([]);
  const [certifications, setCertifications] = useState([]);

  const [loadingProjects, setLoadingProjects] = useState(true);
  const [loadingActive, setLoadingActive] = useState(true);
  const [loadingExpressions, setLoadingExpressions] = useState(true);
  const [loadingConvos, setLoadingConvos] = useState(true);
  const [loadingCerts, setLoadingCerts] = useState(true);

  const [messagingClients, setMessagingClients] = useState({});
  const [showCertModal, setShowCertModal] = useState(false);
  const certForm = useForm();

  const [interestModal, setInterestModal] = useState(null);
  const [modalMessage, setModalMessage] = useState('');
  const [submittingInterest, setSubmittingInterest] = useState(false);

  useEffect(() => {
    if (!user?.id) return;

    api.get('/api/projects')
      .then(res => setProjects(res.data))
      .catch(() => {})
      .finally(() => setLoadingProjects(false));

    api.get(`/api/projects/active/${user.id}`)
      .then(res => setActiveProjects(res.data))
      .catch(() => {})
      .finally(() => setLoadingActive(false));

    api.get('/api/expressions/professional')
      .then(res => {
        setExpressions(res.data);
        setExpressedIds(new Set(res.data.map(e => e.projectId?._id || e.projectId)));
      })
      .catch(() => {})
      .finally(() => setLoadingExpressions(false));

    api.get('/api/messages/conversations')
      .then(res => setConversations(res.data.slice(0, 3)))
      .catch(() => {})
      .finally(() => setLoadingConvos(false));

    api.get('/api/professionals/my-profile')
      .then(res => setCertifications(res.data.certifications || []))
      .catch(() => {})
      .finally(() => setLoadingCerts(false));
  }, [user?.id]);

  const handleMessageClient = async (proj) => {
    const clientId = proj.clientId?._id || proj.clientId;
    setMessagingClients(prev => ({ ...prev, [proj._id]: true }));
    try {
      const { data: convo } = await api.post('/api/messages/conversation', { receiverId: clientId });
      navigate('/messages', { state: { conversationId: convo._id } });
    } catch {
      toast.error('Could not open conversation');
      setMessagingClients(prev => ({ ...prev, [proj._id]: false }));
    }
  };

  const handleOpenModal = (proj) => {
    setInterestModal(proj);
    setModalMessage('');
  };

  const handleSubmitInterest = async () => {
    if (!interestModal) return;
    setSubmittingInterest(true);
    try {
      await api.post('/api/expressions', { projectId: interestModal._id, message: modalMessage });
      setExpressedIds(prev => new Set([...prev, interestModal._id]));
      const res = await api.get('/api/expressions/professional');
      setExpressions(res.data);
      toast.success('Interest expressed successfully');
      setInterestModal(null);
      setModalMessage('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to express interest');
    } finally {
      setSubmittingInterest(false);
    }
  };

  const handleWithdraw = async (exprId) => {
    if (!window.confirm('Withdraw your interest in this project?')) return;
    try {
      await api.delete(`/api/expressions/${exprId}`);
      const updated = expressions.filter(e => e._id !== exprId);
      setExpressions(updated);
      setExpressedIds(new Set(updated.map(e => e.projectId?._id || e.projectId)));
      toast.success('Interest withdrawn');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to withdraw');
    }
  };

  const handleAddCert = async (data) => {
    try {
      const res = await api.put('/api/professionals/certifications', data);
      setCertifications(res.data.certifications || []);
      toast.success('Certification added');
      setShowCertModal(false);
      certForm.reset();
    } catch {
      toast.error('Failed to add certification');
    }
  };

  const handleDeleteCert = async (certId) => {
    if (!window.confirm('Delete this certification?')) return;
    try {
      const res = await api.delete(`/api/professionals/certifications/${certId}`);
      setCertifications(res.data.certifications || []);
      toast.success('Certification removed');
    } catch {
      toast.error('Failed to delete certification');
    }
  };

  const getOtherParticipant = (convo) =>
    convo.participants?.find(p => p._id !== user?.id) || convo.participants?.[0];

  const inputCls = "w-full px-4 py-3 rounded-xl border border-[#dcc1b5] bg-[#fff8f5] text-sm text-[#1e1b18] placeholder-[#a08070] focus:outline-none focus:border-[#99420d] transition-colors";

  return (
    <div className="bg-[#fff8f5] text-[#1e1b18] flex min-h-screen">

      {/* Sidebar */}
      <nav className="pro-sidebar hidden md:flex">
        <div className="px-6 pb-7 border-b border-white/10 mb-2" style={{ paddingTop: 0 }}>
          <Link to="/" style={{ color: '#ffdbcc', fontFamily: "'Hanken Grotesk',sans-serif", fontSize: '24px', fontWeight: 700, textDecoration: 'none' }}>
            Ubwubatsi Hub
          </Link>
          <div className="flex items-center gap-3 mt-5">
            <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(153,66,13,0.25)', border: '2px solid rgba(153,66,13,0.4)' }}>
              {user?.profilePicture ? (
                <img src={user.profilePicture} alt={user.fullName} className="w-full h-full object-cover" />
              ) : (
                <span style={{ fontSize: '16px', fontWeight: 600, color: '#ffb693', letterSpacing: '0.05em' }}>{initials}</span>
              )}
            </div>
            <div>
              <p style={{ color: '#fff8f5', fontSize: '14px', fontWeight: 600, letterSpacing: '0.05em' }}>{user?.fullName || 'Professional'}</p>
              <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '14px' }}>Verified Professional</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col flex-grow py-2">
          <Link to="/professional-dashboard" className="sidebar-nav-item active">
            <span className="material-symbols-outlined fill" style={{ fontSize: '20px' }}>dashboard</span>
            Dashboard
          </Link>
          <Link to="/browse-professionals" className="sidebar-nav-item">
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>search</span>
            Browse Projects
          </Link>
          <Link to="/messages" className="sidebar-nav-item">
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>chat</span>
            Messages
          </Link>
        </div>

        <div className="px-0 mt-auto" style={{ paddingBottom: '8px' }}>
          <div className="flex flex-col gap-1 px-0">
            <Link to="/professional-settings" className="sidebar-nav-item" style={{ padding: '10px 8px', borderRadius: '8px' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>settings</span>
              Settings
            </Link>
            <button
              className="sidebar-nav-item text-left w-full"
              style={{ padding: '10px 8px', borderRadius: '8px', background: 'transparent', border: 'none', cursor: 'pointer' }}
              onClick={() => { logout(); }}
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
            <Link to="/" className="font-bold text-[#99420d]" style={{ fontFamily: "'Hanken Grotesk',sans-serif", fontSize: '24px' }}>
              Ubwubatsi Hub
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/messages" className="relative text-[#56433a] hover:text-[#99420d] transition-colors">
              <span className="material-symbols-outlined">chat</span>
            </Link>
            <div className="hidden md:flex items-center gap-2">
              <span className="text-sm font-semibold text-[#1e1b18]" style={{ letterSpacing: '0.05em' }}>{user?.fullName}</span>
              <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center" style={{ background: 'rgba(153,66,13,0.1)', border: '1px solid rgba(153,66,13,0.2)' }}>
                {user?.profilePicture ? (
                  <img src={user.profilePicture} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span style={{ fontSize: '11px', fontWeight: 600, color: '#99420d', letterSpacing: '0.05em' }}>{initials}</span>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 p-6 md:p-10 max-w-[1280px] w-full flex flex-col gap-14">

          {/* Welcome */}
          <section className="fade-up du-1">
            <h2 className="text-[#1e1b18] flex items-center gap-3" style={{ fontFamily: "'Hanken Grotesk',sans-serif", fontSize: '48px', letterSpacing: '-0.02em', lineHeight: '1.05', fontWeight: 700 }}>
              Welcome back, {firstName}
              <span className="material-symbols-outlined fill text-[#99420d]" style={{ fontSize: '28px' }} title="Verified">verified</span>
            </h2>
            <p className="text-lg text-[#56433a] mt-2">Here's what is happening with your projects today.</p>
          </section>

          {/* Available Projects */}
          <section className="fade-up du-2">
            <div className="flex justify-between items-end border-b border-[#dcc1b5] pb-3 mb-6">
              <h3 style={{ fontFamily: "'Hanken Grotesk',sans-serif", fontSize: '32px', fontWeight: 600 }}>Available Projects</h3>
            </div>

            {loadingProjects ? (
              <div className="flex justify-center py-10"><div className="w-7 h-7 border-2 border-[#dcc1b5] border-t-[#99420d] rounded-full animate-spin" /></div>
            ) : projects.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-12 text-center">
                <span className="material-symbols-outlined text-[#dcc1b5]" style={{ fontSize: '48px' }}>inbox</span>
                <p className="text-base text-[#56433a]">No projects available yet. Check back soon.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {projects.map((proj, i) => {
                  const alreadyExpressed = expressedIds.has(proj._id);
                  return (
                    <div key={proj._id} className="pro-card-shell fade-up" style={{ animationDelay: `${(i + 3) * 80}ms` }}>
                      <div className="pro-card-core">
                        <div className="flex justify-between items-start mb-4">
                          <span className="cat-chip">{proj.category}</span>
                          <span className="text-sm text-[#56433a]">{timeAgo(proj.createdAt)}</span>
                        </div>
                        <h4 className="text-[#1e1b18] mb-2" style={{ fontFamily: "'Hanken Grotesk',sans-serif", fontSize: '24px', fontWeight: 600 }}>{proj.title}</h4>
                        <p className="text-sm text-[#56433a] mb-5" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{proj.description}</p>
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
                        <button
                          className="interest-btn"
                          disabled={alreadyExpressed}
                          onClick={() => !alreadyExpressed && handleOpenModal(proj)}
                          style={alreadyExpressed ? { opacity: 0.5, cursor: 'not-allowed', background: '#c9a898', color: '#fff' } : {}}
                        >
                          {alreadyExpressed ? 'Interest Submitted' : 'Express Interest'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* Active Projects */}
          <section className="fade-up du-3">
            <div className="flex justify-between items-end border-b border-[#dcc1b5] pb-3 mb-6">
              <h3 style={{ fontFamily: "'Hanken Grotesk',sans-serif", fontSize: '32px', fontWeight: 600 }}>Active Projects</h3>
            </div>

            {loadingActive ? (
              <div className="flex justify-center py-10"><div className="w-7 h-7 border-2 border-[#dcc1b5] border-t-[#99420d] rounded-full animate-spin" /></div>
            ) : activeProjects.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-12 text-center">
                <span className="material-symbols-outlined text-[#dcc1b5]" style={{ fontSize: '48px' }}>construction</span>
                <p className="text-base text-[#56433a]">No active projects yet. Express interest in available projects to get started.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeProjects.map(proj => (
                  <div key={proj._id} className="pro-card-shell">
                    <div className="pro-card-core">
                      <div className="flex justify-between items-start mb-3">
                        <span className="cat-chip">{proj.category}</span>
                        <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{ background: 'rgba(14,115,45,0.08)', color: '#0e7312' }}>Active</span>
                      </div>
                      <h4 className="text-[#1e1b18] mb-1" style={{ fontFamily: "'Hanken Grotesk',sans-serif", fontSize: '20px', fontWeight: 600 }}>{proj.title}</h4>
                      <p className="text-sm text-[#56433a] mb-3">Client: {proj.clientId?.fullName || 'Unknown'}</p>
                      <div className="flex justify-between text-sm text-[#56433a] mb-4">
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>location_on</span>{proj.location}
                        </span>
                        <span>{proj.budget}</span>
                      </div>
                      <button
                        onClick={() => handleMessageClient(proj)}
                        disabled={messagingClients[proj._id]}
                        className="w-full py-2.5 rounded-xl border border-[#dcc1b5] text-sm font-semibold text-[#56433a] hover:border-[#99420d] hover:text-[#99420d] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>chat</span>
                        {messagingClients[proj._id] ? 'Opening…' : 'Message Client'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* My Expressions of Interest */}
          <section className="fade-up du-4">
            <div className="flex justify-between items-end border-b border-[#dcc1b5] pb-3 mb-6">
              <h3 style={{ fontFamily: "'Hanken Grotesk',sans-serif", fontSize: '32px', fontWeight: 600 }}>My Interest Applications</h3>
            </div>

            {loadingExpressions ? (
              <div className="flex justify-center py-10"><div className="w-7 h-7 border-2 border-[#dcc1b5] border-t-[#99420d] rounded-full animate-spin" /></div>
            ) : expressions.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-12 text-center">
                <span className="material-symbols-outlined text-[#dcc1b5]" style={{ fontSize: '48px' }}>article</span>
                <p className="text-base text-[#56433a]">You have not expressed interest in any projects yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {expressions.map(expr => {
                  const proj = expr.projectId;
                  const statusStyle = statusColors[expr.status] || statusColors.pending;
                  return (
                    <div key={expr._id} className="pro-card-shell">
                      <div className="pro-card-core">
                        <div className="flex justify-between items-start mb-3">
                          <span className="cat-chip">{proj?.category}</span>
                          <span className="text-xs font-semibold px-3 py-1 rounded-full capitalize" style={{ background: statusStyle.bg, color: statusStyle.color }}>
                            {expr.status}
                          </span>
                        </div>
                        <h4 className="text-[#1e1b18] mb-1" style={{ fontFamily: "'Hanken Grotesk',sans-serif", fontSize: '20px', fontWeight: 600 }}>{proj?.title || 'Project'}</h4>
                        <p className="text-sm text-[#56433a] mb-2">Client: {proj?.clientId?.fullName || 'Unknown'}</p>
                        <div className="flex justify-between text-sm text-[#56433a] mb-3">
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>location_on</span>{proj?.location}
                          </span>
                          <span>{proj?.budget}</span>
                        </div>
                        {expr.message && (
                          <p className="text-xs text-[#56433a] mb-3 px-3 py-2 rounded-xl" style={{ background: 'rgba(153,66,13,0.04)', borderLeft: '3px solid #dcc1b5' }}>
                            "{expr.message.length > 100 ? expr.message.slice(0, 100) + '…' : expr.message}"
                          </p>
                        )}
                        <div className="flex items-center justify-between pt-3 border-t border-[#dcc1b5]/50">
                          <span className="text-xs text-[#56433a]">
                            {new Date(expr.createdAt).toLocaleDateString('en-RW', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                          {expr.status === 'pending' && (
                            <button
                              onClick={() => handleWithdraw(expr._id)}
                              className="text-xs font-semibold text-[#ba1a1a] hover:underline"
                            >
                              Withdraw
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* Messages Preview */}
          <section className="fade-up du-5">
            <div className="flex justify-between items-end border-b border-[#dcc1b5] pb-3 mb-6">
              <h3 style={{ fontFamily: "'Hanken Grotesk',sans-serif", fontSize: '32px', fontWeight: 600 }}>Recent Messages</h3>
              <Link to="/messages" className="text-sm font-semibold text-[#99420d] hover:underline">View All</Link>
            </div>

            {loadingConvos ? (
              <div className="flex justify-center py-10"><div className="w-7 h-7 border-2 border-[#dcc1b5] border-t-[#99420d] rounded-full animate-spin" /></div>
            ) : conversations.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-12 text-center">
                <span className="material-symbols-outlined text-[#dcc1b5]" style={{ fontSize: '48px' }}>forum</span>
                <p className="text-base text-[#56433a]">No messages yet.</p>
              </div>
            ) : (
              <div className="flex flex-col divide-y divide-[#dcc1b5] border border-[#dcc1b5] rounded-2xl overflow-hidden">
                {conversations.map(convo => {
                  const other = getOtherParticipant(convo);
                  return (
                    <Link key={convo._id} to="/messages" state={{ conversationId: convo._id }} className="flex items-center gap-4 px-5 py-4 hover:bg-[#fdf5f2] transition-colors">
                      <div className="w-10 h-10 rounded-full bg-[#efe6e2] flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-semibold text-[#99420d]">{getInitials(other?.fullName)}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline">
                          <span className="text-sm font-semibold text-[#1e1b18] truncate">{other?.fullName || 'Client'}</span>
                          <span className="text-xs text-[#56433a] ml-2 flex-shrink-0">
                            {convo.lastMessageAt ? formatTime(convo.lastMessageAt) : ''}
                          </span>
                        </div>
                        <p className="text-xs text-[#56433a] truncate mt-0.5">{convo.lastMessage || 'Start a conversation'}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </section>

          {/* Certifications */}
          <section className="fade-up du-6 pb-12">
            <div className="flex justify-between items-end border-b border-[#dcc1b5] pb-3 mb-6">
              <h3 style={{ fontFamily: "'Hanken Grotesk',sans-serif", fontSize: '32px', fontWeight: 600 }}>Certifications</h3>
              <button
                onClick={() => setShowCertModal(true)}
                className="flex items-center gap-1.5 px-4 py-2 bg-[#99420d] text-white text-sm font-semibold rounded-xl hover:bg-[#7a3409] transition-colors"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>add</span>
                Add Certification
              </button>
            </div>

            {loadingCerts ? (
              <div className="flex justify-center py-10"><div className="w-7 h-7 border-2 border-[#dcc1b5] border-t-[#99420d] rounded-full animate-spin" /></div>
            ) : certifications.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-12 text-center">
                <span className="material-symbols-outlined text-[#dcc1b5]" style={{ fontSize: '48px' }}>workspace_premium</span>
                <p className="text-base text-[#56433a]">No certifications added yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {certifications.map(cert => (
                  <div key={cert._id} className="flex justify-between items-start px-5 py-4 border border-[#dcc1b5] rounded-2xl">
                    <div className="flex items-start gap-3">
                      <span className="material-symbols-outlined text-[#99420d] mt-0.5" style={{ fontSize: '20px' }}>workspace_premium</span>
                      <div>
                        <p className="text-sm font-semibold text-[#1e1b18]">{cert.name}</p>
                        {cert.issuingBody && <p className="text-xs text-[#56433a] mt-0.5">{cert.issuingBody}</p>}
                        {cert.year && <p className="text-xs text-[#56433a]">{cert.year}</p>}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteCert(cert._id)}
                      className="text-[#ba1a1a] hover:opacity-70 transition-opacity ml-4"
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>delete</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

        </div>
      </main>

      {/* Express Interest Modal */}
      {interestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(30,27,24,0.4)', backdropFilter: 'blur(4px)' }}>
          <div className="bg-[#fff8f5] rounded-2xl shadow-xl w-full max-w-md p-7">
            <div className="flex justify-between items-center mb-2">
              <h3 style={{ fontFamily: "'Hanken Grotesk',sans-serif", fontSize: '22px', fontWeight: 600, color: '#1e1b18' }}>Express Interest</h3>
              <button onClick={() => { setInterestModal(null); setModalMessage(''); }} className="text-[#56433a] hover:text-[#99420d]">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <p className="text-sm text-[#56433a] mb-5">{interestModal.title}</p>
            <div className="flex flex-col gap-1.5 mb-6">
              <label className="text-sm font-medium text-[#1e1b18]">Message (optional)</label>
              <textarea
                rows={4}
                value={modalMessage}
                onChange={e => setModalMessage(e.target.value)}
                placeholder="Introduce yourself to the client. Mention your experience with similar projects…"
                className="w-full px-4 py-3 rounded-xl border border-[#dcc1b5] bg-[#fff8f5] text-sm text-[#1e1b18] placeholder-[#a08070] focus:outline-none focus:border-[#99420d] transition-colors resize-none"
              />
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => { setInterestModal(null); setModalMessage(''); }}
                className="flex-1 py-3 border border-[#dcc1b5] rounded-xl text-sm font-semibold text-[#56433a] hover:border-[#99420d] transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={submittingInterest}
                onClick={handleSubmitInterest}
                className="flex-1 py-3 bg-[#99420d] text-white text-sm font-semibold rounded-xl hover:bg-[#7a3409] transition-colors disabled:opacity-50"
              >
                {submittingInterest ? 'Submitting…' : 'Submit Interest'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Certification Modal */}
      {showCertModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(30,27,24,0.4)', backdropFilter: 'blur(4px)' }}>
          <div className="bg-[#fff8f5] rounded-2xl shadow-xl w-full max-w-md p-7">
            <div className="flex justify-between items-center mb-6">
              <h3 style={{ fontFamily: "'Hanken Grotesk',sans-serif", fontSize: '22px', fontWeight: 600, color: '#1e1b18' }}>Add Certification</h3>
              <button onClick={() => { setShowCertModal(false); certForm.reset(); }} className="text-[#56433a] hover:text-[#99420d]">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={certForm.handleSubmit(handleAddCert)} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-[#1e1b18]">Certification Name *</label>
                <input {...certForm.register('name', { required: true })} type="text" placeholder="e.g. LEED Green Associate" className={inputCls} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-[#1e1b18]">Issuing Body</label>
                <input {...certForm.register('issuingBody')} type="text" placeholder="e.g. Rwanda Engineers' Council" className={inputCls} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-[#1e1b18]">Year</label>
                <input {...certForm.register('year')} type="text" placeholder="e.g. 2023" className={inputCls} />
              </div>
              <div className="flex gap-3 mt-2">
                <button type="button" onClick={() => { setShowCertModal(false); certForm.reset(); }} className="flex-1 py-3 border border-[#dcc1b5] rounded-xl text-sm font-semibold text-[#56433a] hover:border-[#99420d] transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={certForm.formState.isSubmitting} className="flex-1 py-3 bg-[#99420d] text-white text-sm font-semibold rounded-xl hover:bg-[#7a3409] transition-colors disabled:opacity-50">
                  {certForm.formState.isSubmitting ? 'Adding...' : 'Add Certification'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
