import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function PendingVerifications() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [professionals, setProfessionals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [verifiedIds, setVerifiedIds] = useState(new Set());

  useEffect(() => {
    api.get('/api/admin/pending')
      .then(r => setProfessionals(r.data))
      .catch(() => toast.error('Failed to load pending verifications'))
      .finally(() => setLoading(false));
  }, []);

  const handleApprove = async (id) => {
    try {
      await api.put(`/api/admin/verify/${id}`);
      setVerifiedIds(prev => new Set([...prev, id]));
      toast.success('Professional verified successfully!');
    } catch {
      toast.error('Failed to approve verification');
    }
  };

  const handleReject = async (id) => {
    try {
      await api.delete(`/api/admin/reject/${id}`);
      setProfessionals(prev => prev.filter(p => p._id !== id));
      toast.success('Professional rejected');
    } catch {
      toast.error('Failed to reject');
    }
  };

  return (
    <div className="bg-[#fff8f5] min-h-screen flex flex-col">
      <header className="bg-[#fff8f5] sticky top-0 border-b border-[#dcc1b5] z-50">
        <div className="flex justify-between items-center h-20 px-4 md:px-10 max-w-[1280px] mx-auto">
          <Link to="/" className="font-bold text-[#99420d]" style={{ fontFamily: "'Hanken Grotesk',sans-serif", fontSize: '24px' }}>Ubwubatsi Hub</Link>
          <div className="flex items-center gap-4">
            <span className="text-sm font-semibold text-[#1e1b18]">{user?.fullName}</span>
            <span className="inline-block bg-[#99420d] text-white text-xs font-semibold px-3 py-1 rounded-full">Admin</span>
            <button onClick={() => { logout(); navigate('/'); }} className="text-sm font-semibold text-[#56433a] hover:text-[#99420d] transition-colors">Logout</button>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        <aside className="hidden md:flex flex-col w-60 border-r border-[#dcc1b5] pt-8 px-4 gap-1">
          <Link to="/admin" className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#56433a] hover:bg-[rgba(153,66,13,0.04)] text-sm font-semibold transition-colors" style={{ letterSpacing: '0.05em' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>dashboard</span>
            Dashboard
          </Link>
          <Link to="/admin/verifications" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[rgba(153,66,13,0.06)] text-[#99420d] text-sm font-semibold" style={{ letterSpacing: '0.05em' }}>
            <span className="material-symbols-outlined fill" style={{ fontSize: '20px' }}>verified_user</span>
            Verifications
          </Link>
          <Link to="/admin/analytics" className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#56433a] hover:bg-[rgba(153,66,13,0.04)] text-sm font-semibold transition-colors" style={{ letterSpacing: '0.05em' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>analytics</span>
            Analytics
          </Link>
        </aside>

        <main className="flex-1 p-8">
          <div className="max-w-5xl mx-auto">
            <div className="mb-8">
              <h1 className="text-[#1e1b18]" style={{ fontFamily: "'Hanken Grotesk',sans-serif", fontSize: '32px', fontWeight: 700, letterSpacing: '-0.01em' }}>
                Pending Verifications
              </h1>
              <p className="text-base text-[#56433a] mt-1">Review and approve or reject professional registration requests.</p>
            </div>

            {loading ? (
              <LoadingSpinner fullPage={false} />
            ) : professionals.length === 0 ? (
              <div className="card-shell">
                <div className="card-core flex flex-col items-center gap-4 py-16">
                  <span className="material-symbols-outlined text-[#56433a]" style={{ fontSize: '48px' }}>check_circle</span>
                  <h3 className="text-[#1e1b18]" style={{ fontFamily: "'Hanken Grotesk',sans-serif", fontSize: '24px', fontWeight: 600 }}>All clear!</h3>
                  <p className="text-base text-[#56433a]">No pending verifications at this time.</p>
                </div>
              </div>
            ) : (
              <div className="card-shell overflow-hidden">
                <div style={{ background: '#fff8f5', borderRadius: 'calc(1.25rem - 5px)', overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid #dcc1b5' }}>
                        {['Full Name', 'Email', 'Phone', 'Reg. Number', 'Date', 'Actions'].map(h => (
                          <th key={h} className="text-xs font-semibold text-[#56433a] text-left px-5 py-4" style={{ letterSpacing: '0.05em', textTransform: 'uppercase' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {professionals.map((pro, i) => {
                        const isVerified = verifiedIds.has(pro._id);
                        return (
                          <tr key={pro._id} style={{ borderBottom: i < professionals.length - 1 ? '1px solid rgba(220,193,181,0.5)' : 'none' }}>
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold text-[#1e1b18]">{pro.fullName}</span>
                                {isVerified && (
                                  <span className="material-symbols-outlined fill text-[#99420d]" style={{ fontSize: '16px' }}>verified</span>
                                )}
                              </div>
                            </td>
                            <td className="px-5 py-4 text-sm text-[#56433a]">{pro.email}</td>
                            <td className="px-5 py-4 text-sm text-[#56433a]">{pro.phone}</td>
                            <td className="px-5 py-4 text-sm text-[#56433a]">{pro.registrationNumber || '—'}</td>
                            <td className="px-5 py-4 text-sm text-[#56433a]">
                              {pro.createdAt ? new Date(pro.createdAt).toLocaleDateString() : '—'}
                            </td>
                            <td className="px-5 py-4">
                              {isVerified ? (
                                <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#3b6623]" style={{ background: '#e1efd8', borderRadius: '999px', padding: '3px 10px' }}>
                                  <span className="material-symbols-outlined fill" style={{ fontSize: '13px' }}>verified</span>
                                  Verified
                                </span>
                              ) : (
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => handleApprove(pro._id)}
                                    className="text-xs font-semibold text-white px-3 py-1.5 rounded-full transition-colors"
                                    style={{ background: '#99420d', letterSpacing: '0.04em', border: 'none', cursor: 'pointer' }}
                                    onMouseOver={e => e.target.style.background = '#7a3000'}
                                    onMouseOut={e => e.target.style.background = '#99420d'}
                                  >
                                    Approve
                                  </button>
                                  <button
                                    onClick={() => handleReject(pro._id)}
                                    className="text-xs font-semibold text-[#56433a] px-3 py-1.5 rounded-full transition-colors"
                                    style={{ border: '1px solid #dcc1b5', background: 'transparent', letterSpacing: '0.04em', cursor: 'pointer' }}
                                  >
                                    Reject
                                  </button>
                                </div>
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
