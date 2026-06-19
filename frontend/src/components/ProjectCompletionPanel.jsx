import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';
import StarRating from './StarRating';

function getInitials(name) {
  if (!name) return '??';
  const p = name.trim().split(' ');
  return (p[0][0] + (p[1] ? p[1][0] : '')).toUpperCase();
}

export default function ProjectCompletionPanel({ project, canRate, alreadyRated, onComplete, onRateClick }) {
  const navigate = useNavigate();
  const [messaging, setMessaging] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [completing, setCompleting] = useState(false);

  const pro = project.acceptedProfessional;
  if (!pro) return null;

  const isInProgress = project.status === 'in-progress';
  const isCompleted = project.status === 'completed';

  const handleMessage = async () => {
    setMessaging(true);
    try {
      const { data: convo } = await api.post('/api/messages/conversation', { receiverId: pro.userId });
      navigate('/messages', { state: { conversationId: convo._id } });
    } catch {
      toast.error('Could not open conversation');
      setMessaging(false);
    }
  };

  const handleMarkComplete = async () => {
    setCompleting(true);
    try {
      await api.put(`/api/projects/${project._id}/complete`);
      toast.success('Project marked as complete!');
      onComplete?.(project._id);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update project');
      setCompleting(false);
    }
  };

  return (
    <div
      className="border border-[#dcc1b5] rounded-2xl overflow-hidden"
      style={{
        borderLeftColor: isInProgress ? '#99420d' : '#3b6623',
        borderLeftWidth: '4px',
      }}
    >
      <div className="p-5">

        {/* Professional mini-card */}
        <div
          className="flex items-center gap-3 p-3 rounded-xl mb-4"
          style={{ background: 'rgba(153,66,13,0.04)', border: '1px solid rgba(220,193,181,0.5)' }}
        >
          <div
            className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(153,66,13,0.1)' }}
          >
            {pro.profilePicture ? (
              <img src={pro.profilePicture} alt={pro.fullName} className="w-full h-full object-cover" />
            ) : (
              <span className="text-xs font-bold text-[#99420d]">{getInitials(pro.fullName)}</span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-semibold text-[#1e1b18] truncate">{pro.fullName}</span>
              {pro.isVerified && (
                <span className="material-symbols-outlined fill text-[#99420d] flex-shrink-0" style={{ fontSize: '13px' }}>verified</span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
              {pro.specialty && <span className="text-xs text-[#56433a]">{pro.specialty}</span>}
              {pro.averageRating > 0 && (
                <>
                  <span className="text-[#dcc1b5] text-xs">·</span>
                  <div className="flex items-center gap-1">
                    <StarRating value={Math.round(pro.averageRating)} readOnly size="sm" />
                    <span className="text-xs text-[#56433a]">{pro.averageRating.toFixed(1)}</span>
                  </div>
                </>
              )}
            </div>
          </div>
          <span className="text-xs text-[#897268] flex-shrink-0 whitespace-nowrap">
            {isInProgress ? 'Working with you' : 'Worked with you'}
          </span>
        </div>

        {/* Action row */}
        <div className="flex flex-wrap gap-2 items-center">
          <button
            onClick={handleMessage}
            disabled={messaging}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-full border border-[#dcc1b5] text-[#56433a] hover:border-[#99420d] hover:text-[#99420d] transition-colors disabled:opacity-50"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>chat</span>
            {messaging ? 'Opening…' : 'Message'}
          </button>

          <Link
            to={`/professional/${pro.userId}`}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-full border border-[#dcc1b5] text-[#56433a] hover:border-[#99420d] hover:text-[#99420d] transition-colors"
            style={{ textDecoration: 'none' }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>person</span>
            View Profile
          </Link>

          {isInProgress && !confirming && (
            <button
              onClick={() => setConfirming(true)}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-full bg-[#3b6623] text-white hover:bg-[#2d4f1a] transition-colors"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>check_circle</span>
              Mark Complete
            </button>
          )}

          {isInProgress && confirming && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-[#56433a] font-medium">Confirm completion?</span>
              <button
                onClick={() => setConfirming(false)}
                className="text-xs font-semibold px-3 py-1.5 rounded-full border border-[#dcc1b5] text-[#56433a] hover:border-[#99420d] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleMarkComplete}
                disabled={completing}
                className="text-xs font-semibold px-3 py-1.5 rounded-full bg-[#3b6623] text-white hover:bg-[#2d4f1a] transition-colors disabled:opacity-50"
              >
                {completing ? 'Completing…' : 'Yes, complete'}
              </button>
            </div>
          )}

          {isCompleted && canRate && (
            <button
              onClick={onRateClick}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-full bg-[#99420d] text-white hover:bg-[#7a3409] transition-colors"
            >
              <span className="material-symbols-outlined fill" style={{ fontSize: '13px' }}>star</span>
              Leave a Review
            </button>
          )}

          {isCompleted && alreadyRated && (
            <span className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-full" style={{ background: 'rgba(14,115,45,0.08)', color: '#0e7312' }}>
              <span className="material-symbols-outlined fill" style={{ fontSize: '13px' }}>verified</span>
              Reviewed
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
