import { useState, useEffect, useRef } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import StarRating from './StarRating';

const SCORE_LABELS = { 1: 'Poor', 2: 'Fair', 3: 'Good', 4: 'Very Good', 5: 'Excellent' };
const MAX_CHARS = 500;

export default function RatingModal({ project, professionalName, onClose, onSuccess }) {
  const [score, setScore] = useState(0);
  const [review, setReview] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const overlayRef = useRef(null);

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const handleSubmit = async () => {
    if (score === 0) { toast.error('Please select a rating before submitting'); return; }
    setSubmitting(true);
    try {
      const { data } = await api.post('/api/ratings', { projectId: project._id, score, review });
      toast.success('Review submitted — thank you!');
      onSuccess?.(data);
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(30,27,24,0.5)', backdropFilter: 'blur(6px)' }}
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      <div
        className="bg-[#fff8f5] rounded-2xl w-full max-w-md overflow-hidden fade-up du-1"
        style={{ boxShadow: '0 24px 48px -12px rgba(30,27,24,0.25)' }}
      >
        {/* Header */}
        <div className="px-7 pt-7 pb-5 border-b border-[#dcc1b5]">
          <div className="flex justify-between items-start">
            <div>
              <h3
                style={{ fontFamily: "'Hanken Grotesk',sans-serif", fontSize: '22px', fontWeight: 600, color: '#1e1b18' }}
              >
                Leave a Review
              </h3>
              <p className="text-sm text-[#56433a] mt-0.5 truncate" style={{ maxWidth: '280px' }}>
                {project.title}
                {professionalName ? ` · ${professionalName}` : ''}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-[#56433a] hover:text-[#99420d] transition-colors ml-4 mt-0.5"
              aria-label="Close"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        </div>

        <div className="px-7 py-6 flex flex-col gap-6">
          {/* Star picker */}
          <div className="flex flex-col items-center gap-3">
            <StarRating value={score} onChange={setScore} size="lg" />
            <span
              className="text-sm font-semibold"
              style={{
                color: score > 0 ? '#99420d' : '#a08070',
                minHeight: '20px',
                transition: 'color 0.2s ease',
              }}
            >
              {score > 0 ? SCORE_LABELS[score] : 'Tap a star to rate'}
            </span>
          </div>

          {/* Review textarea */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[#1e1b18]">
              Your Review{' '}
              <span className="text-[#897268] font-normal">(optional)</span>
            </label>
            <textarea
              rows={4}
              value={review}
              onChange={e => setReview(e.target.value.slice(0, MAX_CHARS))}
              placeholder="Describe your experience working with this professional…"
              className="w-full px-4 py-3 rounded-xl border border-[#dcc1b5] bg-[#fff8f5] text-sm text-[#1e1b18] placeholder-[#a08070] focus:outline-none focus:border-[#99420d] transition-colors resize-none"
            />
            <span className="text-xs text-[#897268] text-right">{review.length}/{MAX_CHARS}</span>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 border border-[#dcc1b5] rounded-xl text-sm font-semibold text-[#56433a] hover:border-[#99420d] transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting || score === 0}
              className="flex-1 py-3 bg-[#99420d] text-white text-sm font-semibold rounded-xl hover:bg-[#7a3409] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Submitting…' : 'Submit Review'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
