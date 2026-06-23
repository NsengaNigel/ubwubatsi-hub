import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import ProjectCompletionPanel from '../components/ProjectCompletionPanel';
import RatingModal from '../components/RatingModal';

function getInitials(name) {
  if (!name) return '??';
  const parts = name.trim().split(' ');
  return (parts[0][0] + (parts[1] ? parts[1][0] : '')).toUpperCase();
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-RW', { day: 'numeric', month: 'short', year: 'numeric' });
}

function Footer() {
  return (
    <footer className="border-t border-[#dcc1b5] py-8 mt-auto">
      <div className="max-w-[1280px] mx-auto px-4 md:px-10 flex flex-col md:flex-row justify-between items-center gap-3">
        <span className="font-bold text-[#99420d]" style={{ fontFamily: "'Hanken Grotesk',sans-serif", fontSize: '24px' }}>Ubwubatsi Hub</span>
        <span className="text-sm text-[#56433a]">© 2024 Ubwubatsi Hub. Building Rwanda with Integrity.</span>
        <div className="flex gap-5">
          <a className="text-sm text-[#56433a] hover:text-[#99420d] transition-colors" href="#">Terms</a>
          <a className="text-sm text-[#56433a] hover:text-[#99420d] transition-colors" href="#">Privacy</a>
          <a className="text-sm text-[#56433a] hover:text-[#99420d] transition-colors" href="#">Contact</a>
        </div>
      </div>
    </footer>
  );
}

const STATUS_STYLES = {
  open: { background: 'rgba(227,242,253,0.9)', color: '#0d47a1', label: 'Open' },
  'in-progress': { background: 'rgba(241,223,209,0.8)', color: '#783603', label: 'In Progress' },
  completed: { background: 'rgba(225,239,216,0.9)', color: '#3b6623', label: 'Completed' },
};

const EXPR_STATUS_STYLES = {
  pending: { bg: 'rgba(153,66,13,0.08)', color: '#99420d' },
  accepted: { bg: 'rgba(14,115,45,0.08)', color: '#0e7312' },
  rejected: { bg: 'rgba(186,26,26,0.08)', color: '#ba1a1a' },
};

export default function ClientDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const firstName = user?.fullName?.split(' ')[0] || 'Client';

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [canRateMap, setCanRateMap] = useState({});

  const [expressionsModal, setExpressionsModal] = useState(null);
  const [projectExpressions, setProjectExpressions] = useState([]);
  const [expressionsLoading, setExpressionsLoading] = useState(false);
  const [messagingPros, setMessagingPros] = useState({});

  const [ratingModal, setRatingModal] = useState(null);

  useEffect(() => {
    api.get('/api/projects/my-projects')
      .then(res => {
        setProjects(res.data);
        // Fetch can-rate for all completed projects
        const completed = res.data.filter(p => p.status === 'completed');
        if (completed.length > 0) {
          Promise.all(
            completed.map(p =>
              api.get(`/api/ratings/can-rate/${p._id}`)
                .then(r => [p._id, r.data])
                .catch(() => [p._id, { canRate: false }])
            )
          ).then(results => {
            const map = {};
            results.forEach(([id, data]) => { map[id] = data; });
            setCanRateMap(map);
          });
        }
      })
      .catch(() => setError('Could not load your projects.'))
      .finally(() => setLoading(false));
  }, []);

  const handleComplete = (projectId) => {
    setProjects(prev => prev.map(p => p._id === projectId ? { ...p, status: 'completed' } : p));
    api.get(`/api/ratings/can-rate/${projectId}`)
      .then(res => setCanRateMap(prev => ({ ...prev, [projectId]: res.data })))
      .catch(() => {});
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project? This cannot be undone.')) return;
    try {
      await api.delete(`/api/projects/${id}`);
      setProjects(prev => prev.filter(p => p._id !== id));
      toast.success('Project deleted.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete project.');
    }
  };

  const handleMessageProfessional = async (professionalId) => {
    setMessagingPros(prev => ({ ...prev, [professionalId]: true }));
    try {
      const { data: convo } = await api.post('/api/messages/conversation', { receiverId: professionalId });
      navigate('/messages', { state: { conversationId: convo._id } });
    } catch {
      toast.error('Could not open conversation');
      setMessagingPros(prev => ({ ...prev, [professionalId]: false }));
    }
  };

  const handleOpenExpressions = async (proj) => {
    setExpressionsModal(proj);
    setExpressionsLoading(true);
    try {
      const res = await api.get(`/api/expressions/project/${proj._id}`);
      setProjectExpressions(res.data);
    } catch {
      toast.error('Failed to load expressions');
    } finally {
      setExpressionsLoading(false);
    }
  };

  const handleAccept = async (exprId) => {
    try {
      await api.put(`/api/expressions/${exprId}/accept`);
      const res = await api.get(`/api/expressions/project/${expressionsModal._id}`);
      setProjectExpressions(res.data);
      // Re-fetch this project to get acceptedProfessional
      const projRes = await api.get('/api/projects/my-projects');
      setProjects(projRes.data);
      toast.success('Professional accepted! Project is now in progress.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to accept');
    }
  };

  const handleReject = async (exprId) => {
    try {
      await api.put(`/api/expressions/${exprId}/reject`);
      const res = await api.get(`/api/expressions/project/${expressionsModal._id}`);
      setProjectExpressions(res.data);
      toast.success('Expression rejected.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reject');
    }
  };

  return (
    <div className="bg-[#fff8f5] text-[#1e1b18] min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow px-4 md:px-10 max-w-[1280px] mx-auto w-full py-12">

        {/* Welcome */}
        <div className="mb-12 fade-up du-1">
          <span className="text-sm text-[#56433a]">Good day</span>
          <h1
            className="text-[#1e1b18] mt-1 text-3xl md:text-[40px]"
            style={{ fontFamily: "'Hanken Grotesk',sans-serif", letterSpacing: '-0.02em', lineHeight: '1.05', fontWeight: 700 }}
          >
            Welcome back, {firstName}
          </h1>
          <p className="text-base md:text-lg text-[#56433a] mt-2">Manage your construction projects and find the right professionals.</p>
        </div>

        {/* Action cards */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-12 fade-up du-2">
          <Link to="/post-project" className="action-shell block">
            <div className="action-core">
              <div>
                <div className="action-icon" style={{ background: 'rgba(153,66,13,0.1)' }}>
                  <span className="material-symbols-outlined text-[#99420d]" style={{ fontSize: '24px' }}>add_circle</span>
                </div>
                <h2 className="text-[#1e1b18] mb-2" style={{ fontFamily: "'Hanken Grotesk',sans-serif", fontSize: '24px', fontWeight: 600 }}>Post a New Project</h2>
                <p className="text-base text-[#56433a]">Describe your vision, set your budget, and start receiving proposals from top-rated professionals.</p>
              </div>
              <div className="mt-8 cta-link text-[#99420d]">
                Get started
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_forward</span>
              </div>
            </div>
          </Link>

          <Link to="/browse-professionals" className="action-shell block">
            <div className="action-core">
              <div>
                <div className="action-icon" style={{ background: 'rgba(147,75,25,0.1)' }}>
                  <span className="material-symbols-outlined text-[#934b19]" style={{ fontSize: '24px' }}>search</span>
                </div>
                <h2 className="text-[#1e1b18] mb-2" style={{ fontFamily: "'Hanken Grotesk',sans-serif", fontSize: '24px', fontWeight: 600 }}>Browse Professionals</h2>
                <p className="text-base text-[#56433a]">Explore portfolios, read reviews, and connect directly with certified architects and engineers.</p>
              </div>
              <div className="mt-8 cta-link text-[#934b19]">
                Explore directory
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_forward</span>
              </div>
            </div>
          </Link>
        </section>

        {/* Posted projects */}
        <section className="fade-up du-3">
          <div className="flex items-center justify-between mb-5 pb-4 border-b border-[#dcc1b5]">
            <h3 className="text-[#1e1b18]" style={{ fontFamily: "'Hanken Grotesk',sans-serif", fontSize: '24px', fontWeight: 600 }}>My Posted Projects</h3>
          </div>

          {loading && <p className="text-sm text-[#56433a]">Loading your projects…</p>}
          {error && <p className="text-sm text-[#ba1a1a]">{error}</p>}

          {!loading && !error && projects.length === 0 && (
            <div className="flex flex-col items-center gap-3 py-12 text-center">
              <span className="material-symbols-outlined text-[#dcc1b5]" style={{ fontSize: '48px' }}>folder_open</span>
              <p className="text-base text-[#56433a]">You have not posted any projects yet. Post your first project to get started.</p>
              <Link to="/post-project" className="btn-primary-sm mt-2">
                Post a Project
                <span className="btn-icon">
                  <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>arrow_forward</span>
                </span>
              </Link>
            </div>
          )}

          {!loading && !error && projects.length > 0 && (
            <div className="flex flex-col gap-4">
              {projects.map((proj) => {
                const badge = STATUS_STYLES[proj.status] || STATUS_STYLES.open;
                const exprCount = proj.expressionCount || 0;
                const hasPanel = (proj.status === 'in-progress' || proj.status === 'completed') && proj.acceptedProfessional;
                const canRate = canRateMap[proj._id]?.canRate || false;
                const alreadyRated = canRateMap[proj._id]?.alreadyRated || false;

                return (
                  <div key={proj._id} className="flex flex-col gap-2 fade-up du-4">
                    {/* Project row */}
                    <div className="project-item flex-col md:flex-row items-start md:items-center">
                      <div className="flex items-start gap-4 flex-1 min-w-0 w-full">
                        <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(153,66,13,0.08)' }}>
                          <span className="material-symbols-outlined text-[#99420d]" style={{ fontSize: '20px' }}>architecture</span>
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-base font-semibold text-[#1e1b18]">{proj.title}</h4>
                          <div className="flex flex-wrap items-center gap-2 md:gap-3 mt-0.5 text-sm text-[#56433a]">
                            <span className="flex items-center gap-1">
                              <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>calendar_today</span>
                              {formatDate(proj.createdAt)}
                            </span>
                            <span>{proj.location}, Rwanda</span>
                            <span>{proj.category}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap justify-start md:justify-end w-full md:w-auto mt-3 md:mt-0 flex-shrink-0">
                        <span className="status-badge" style={{ background: badge.background, color: badge.color }}>{badge.label}</span>
                        <span className="text-sm font-medium text-[#56433a]">{proj.budget}</span>
                        <button
                          onClick={() => handleOpenExpressions(proj)}
                          className="relative flex items-center gap-1.5 text-xs font-semibold text-[#56433a] hover:text-[#99420d] transition-colors px-3 py-2 rounded-full border border-[#dcc1b5] hover:border-[#99420d] min-h-[36px]"
                          style={{ letterSpacing: '0.04em' }}
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>people</span>
                          Interested
                          {exprCount > 0 && (
                            <span className="ml-1 bg-[#99420d] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none">
                              {exprCount > 9 ? '9+' : exprCount}
                            </span>
                          )}
                        </button>
                        {proj.status !== 'completed' && (
                          <Link
                            to={`/edit-project/${proj._id}`}
                            className="flex items-center gap-1 text-xs font-semibold text-[#56433a] hover:text-[#99420d] transition-colors px-3 py-2 rounded-full border border-[#dcc1b5] hover:border-[#99420d] min-h-[36px]"
                            style={{ letterSpacing: '0.04em', textDecoration: 'none' }}
                          >
                            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>edit</span>
                            Edit
                          </Link>
                        )}
                        <button
                          onClick={() => handleDelete(proj._id)}
                          className="flex items-center gap-1 text-xs font-semibold text-[#ba1a1a] hover:text-white hover:bg-[#ba1a1a] transition-colors px-3 py-2 rounded-full border border-[#ba1a1a] min-h-[36px]"
                          style={{ letterSpacing: '0.04em', background: 'transparent', cursor: 'pointer' }}
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>delete</span>
                          Delete
                        </button>
                      </div>
                    </div>

                    {/* Completion panel */}
                    {hasPanel && (
                      <ProjectCompletionPanel
                        project={proj}
                        canRate={canRate}
                        alreadyRated={alreadyRated}
                        onComplete={handleComplete}
                        onRateClick={() => setRatingModal({
                          project: proj,
                          professionalName: proj.acceptedProfessional?.fullName,
                        })}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>

      </main>

      <Footer />

      {/* Interested Professionals Modal */}
      {expressionsModal && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center md:p-4" style={{ background: 'rgba(30,27,24,0.4)', backdropFilter: 'blur(4px)' }}>
          <div className="bg-[#fff8f5] w-full md:max-w-lg rounded-t-2xl md:rounded-2xl shadow-xl flex flex-col" style={{ maxHeight: '90vh' }}>

            <div className="flex justify-between items-start p-6 pb-4 border-b border-[#dcc1b5]">
              <div>
                <h3 style={{ fontFamily: "'Hanken Grotesk',sans-serif", fontSize: '20px', fontWeight: 600, color: '#1e1b18' }}>
                  Interested Professionals
                </h3>
                <p className="text-sm text-[#56433a] mt-0.5">{expressionsModal.title}</p>
              </div>
              <button onClick={() => setExpressionsModal(null)} className="text-[#56433a] hover:text-[#99420d] ml-4">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="overflow-y-auto flex-1 p-6">
              {expressionsLoading ? (
                <div className="flex justify-center py-10">
                  <div className="w-7 h-7 border-2 border-[#dcc1b5] border-t-[#99420d] rounded-full animate-spin" />
                </div>
              ) : projectExpressions.length === 0 ? (
                <div className="flex flex-col items-center gap-3 py-10 text-center">
                  <span className="material-symbols-outlined text-[#dcc1b5]" style={{ fontSize: '40px' }}>person_search</span>
                  <p className="text-sm text-[#56433a]">No professionals have expressed interest in this project yet.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {projectExpressions.map((expr) => {
                    const pro = expr.professionalId || {};
                    const profile = expr.professionalProfile || {};
                    const statusStyle = EXPR_STATUS_STYLES[expr.status] || EXPR_STATUS_STYLES.pending;
                    return (
                      <div key={expr._id} className="border border-[#dcc1b5] rounded-2xl p-4">
                        <div className="flex items-start gap-3 mb-3">
                          <div className="w-11 h-11 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(153,66,13,0.08)' }}>
                            {pro.profilePicture ? (
                              <img src={pro.profilePicture} alt={pro.fullName} className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-sm font-semibold text-[#99420d]">{getInitials(pro.fullName)}</span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-sm font-semibold text-[#1e1b18]">{pro.fullName || 'Professional'}</span>
                              {pro.isVerified && (
                                <span className="material-symbols-outlined fill text-[#99420d]" style={{ fontSize: '14px' }} title="Verified">verified</span>
                              )}
                              <span className="text-xs font-semibold px-2 py-0.5 rounded-full capitalize ml-auto" style={{ background: statusStyle.bg, color: statusStyle.color }}>
                                {expr.status}
                              </span>
                            </div>
                            {profile.specialty && <p className="text-xs text-[#56433a] mt-0.5">{profile.specialty}</p>}
                            {profile.averageRating > 0 && (
                              <div className="flex items-center gap-0.5 mt-0.5">
                                <span className="material-symbols-outlined fill text-[#99420d]" style={{ fontSize: '12px' }}>star</span>
                                <span className="text-xs text-[#56433a]">{profile.averageRating.toFixed(1)}</span>
                                {profile.totalReviews > 0 && (
                                  <span className="text-xs text-[#56433a]">({profile.totalReviews})</span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>

                        {expr.message && (
                          <p className="text-xs text-[#56433a] mb-3 px-3 py-2 rounded-xl" style={{ background: 'rgba(153,66,13,0.04)', borderLeft: '3px solid #dcc1b5' }}>
                            "{expr.message}"
                          </p>
                        )}

                        <div className="flex items-center justify-between">
                          <span className="text-xs text-[#56433a]">{formatDate(expr.createdAt)}</span>
                          {expr.status === 'pending' && (
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleReject(expr._id)}
                                className="text-xs font-semibold px-3 py-1.5 rounded-full border border-[#ba1a1a] text-[#ba1a1a] hover:bg-[#ba1a1a] hover:text-white transition-colors"
                              >
                                Reject
                              </button>
                              <button
                                onClick={() => handleAccept(expr._id)}
                                className="text-xs font-semibold px-3 py-1.5 rounded-full bg-[#99420d] text-white hover:bg-[#7a3409] transition-colors"
                              >
                                Accept
                              </button>
                            </div>
                          )}
                          {expr.status === 'accepted' && (
                            <button
                              onClick={() => handleMessageProfessional(pro._id || pro)}
                              disabled={messagingPros[pro._id || pro]}
                              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-[#99420d] text-white hover:bg-[#7a3409] transition-colors disabled:opacity-50"
                            >
                              <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>chat</span>
                              {messagingPros[pro._id || pro] ? 'Opening…' : 'Message Professional'}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Rating Modal */}
      {ratingModal && (
        <RatingModal
          project={ratingModal.project}
          professionalName={ratingModal.professionalName}
          onClose={() => setRatingModal(null)}
          onSuccess={() => {
            setCanRateMap(prev => ({
              ...prev,
              [ratingModal.project._id]: { canRate: false, alreadyRated: true },
            }));
          }}
        />
      )}
    </div>
  );
}
