import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const TYPE_ICONS = {
  expression_of_interest: 'person',
  expression_accepted: 'check_circle',
  expression_rejected: 'cancel',
  new_message: 'chat',
  profile_verified: 'verified_user',
  project_in_progress: 'work',
  new_review: 'star',
};

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default function NotificationDropdown({ onClose, onCountReset }) {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/notifications')
      .then(res => setNotifications(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleClick = async (notif) => {
    if (!notif.read) {
      await api.put(`/api/notifications/${notif._id}/read`).catch(() => {});
      setNotifications(prev => prev.map(n => n._id === notif._id ? { ...n, read: true } : n));
    }
    onClose();
    if (notif.link) navigate(notif.link);
  };

  const handleMarkAllRead = async () => {
    await api.put('/api/notifications/read-all').catch(() => {});
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    onCountReset?.();
  };

  const handleDelete = async (e, notifId) => {
    e.stopPropagation();
    await api.delete(`/api/notifications/${notifId}`).catch(() => {});
    setNotifications(prev => prev.filter(n => n._id !== notifId));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div
      className="fixed md:absolute inset-x-3 md:inset-x-auto top-[72px] md:top-full md:right-0 md:mt-2 md:w-[400px] bg-white rounded-2xl shadow-lg border border-[#dcc1b5] z-50 overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#dcc1b5]">
        <h3 style={{ fontFamily: "'Hanken Grotesk',sans-serif", fontSize: '15px', fontWeight: 600, color: '#1e1b18' }}>
          Notifications
        </h3>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="text-xs font-semibold text-[#99420d] hover:underline"
          >
            Mark all as read
          </button>
        )}
      </div>

      {/* List */}
      <div className="overflow-y-auto max-h-[70vh] md:max-h-[500px]">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="w-5 h-5 border-2 border-[#dcc1b5] border-t-[#99420d] rounded-full animate-spin" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-10 text-center px-4">
            <span className="material-symbols-outlined text-[#dcc1b5]" style={{ fontSize: '36px' }}>notifications</span>
            <p className="text-sm text-[#56433a]">No notifications yet</p>
          </div>
        ) : (
          notifications.map(notif => (
            <div
              key={notif._id}
              onClick={() => handleClick(notif)}
              className="flex items-start gap-3 px-4 py-3 border-b border-[#f3e8e4] cursor-pointer hover:bg-[#fdf5f2] transition-colors"
              style={{ background: notif.read ? 'white' : 'rgba(153,66,13,0.04)' }}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ background: 'rgba(153,66,13,0.08)' }}
              >
                <span className="material-symbols-outlined text-[#99420d]" style={{ fontSize: '15px' }}>
                  {TYPE_ICONS[notif.type] || 'notifications'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-[#1e1b18]">{notif.title}</p>
                <p className="text-xs text-[#56433a] mt-0.5 leading-relaxed">{notif.message}</p>
                <p className="text-[10px] text-[#a08070] mt-1">{timeAgo(notif.createdAt)}</p>
              </div>
              <button
                onClick={e => handleDelete(e, notif._id)}
                className="flex-shrink-0 text-[#c9a898] hover:text-[#ba1a1a] transition-colors mt-0.5 ml-1"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>close</span>
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
