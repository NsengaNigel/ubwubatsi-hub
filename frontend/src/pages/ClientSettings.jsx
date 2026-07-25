import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import ImageUpload from '../components/ImageUpload';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const inputCls = "w-full px-4 py-3 rounded-xl border border-[#dcc1b5] bg-[#fff8f5] text-sm text-[#1e1b18] placeholder-[#a08070] focus:outline-none focus:border-[#99420d] transition-colors";
const labelCls = "text-sm font-medium text-[#1e1b18]";

export default function ClientSettings() {
  const { user, refreshUser, logout } = useAuth();
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleting, setDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      await api.delete('/api/users/account', { data: { password: deletePassword } });
      toast.success('Account deleted');
      logout();
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete account');
    } finally {
      setDeleting(false);
    }
  };

  const profileForm = useForm();
  const passwordForm = useForm();

  useEffect(() => {
    if (!user) return;
    profileForm.reset({ fullName: user.fullName || '', phone: user.phone || '', location: user.location || '' });
  }, [user]);

  const onSaveProfile = async (data) => {
    try {
      await api.put('/api/users/settings', data);
      await refreshUser();
      toast.success('Profile updated successfully');
    } catch {
      toast.error('Failed to update profile');
    }
  };

  const onChangePassword = async (data) => {
    try {
      await api.put('/api/users/change-password', data);
      toast.success('Password updated successfully');
      passwordForm.reset();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update password');
    }
  };

  const handleProfilePicUpload = async () => {
    await refreshUser();
    toast.success('Profile picture updated');
  };

  const handleProfilePicDelete = async () => {
    if (!window.confirm('Remove your profile picture?')) return;
    try {
      await api.delete('/api/upload/profile-picture');
      await refreshUser();
      toast.success('Profile picture removed');
    } catch {
      toast.error('Failed to remove profile picture');
    }
  };

  return (
    <div className="bg-[#fff8f5] text-[#1e1b18] min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 w-full max-w-[820px] mx-auto px-4 md:px-10 py-10">
        <h1 className="mb-8 text-2xl md:text-[32px]" style={{ fontFamily: "'Hanken Grotesk',sans-serif", fontWeight: 600, letterSpacing: '-0.01em' }}>
          Account Settings
        </h1>

        <div className="flex flex-col gap-8">

          {/* Profile Picture */}
          <section className="section-shell">
            <div className="section-core">
              <h2 className="mb-6" style={{ fontFamily: "'Hanken Grotesk',sans-serif", fontSize: '20px', fontWeight: 600 }}>Profile Picture</h2>
              <ImageUpload
                uploadUrl="/api/upload/profile-picture"
                fieldName="profilePicture"
                existingImages={user?.profilePicture ? [user.profilePicture] : []}
                onUpload={handleProfilePicUpload}
                onDelete={handleProfilePicDelete}
              />
            </div>
          </section>

          {/* Profile Details */}
          <section className="section-shell">
            <div className="section-core">
              <h2 className="mb-6" style={{ fontFamily: "'Hanken Grotesk',sans-serif", fontSize: '20px', fontWeight: 600 }}>Profile Details</h2>
              <form onSubmit={profileForm.handleSubmit(onSaveProfile)} className="flex flex-col gap-5">
                <div className="flex flex-col gap-1.5">
                  <label className={labelCls}>Full Name</label>
                  <input {...profileForm.register('fullName', { required: true })} type="text" placeholder="Your full name" className={inputCls} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className={labelCls}>Phone Number</label>
                  <input {...profileForm.register('phone')} type="tel" placeholder="+250 7XX XXX XXX" className={inputCls} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className={labelCls}>Location in Kigali</label>
                  <input {...profileForm.register('location')} type="text" placeholder="e.g. Kicukiro, Kigali" className={inputCls} />
                </div>
                <button type="submit" disabled={profileForm.formState.isSubmitting} className="w-full sm:self-start sm:w-auto px-6 py-3 bg-[#99420d] text-white text-sm font-semibold rounded-xl hover:bg-[#7a3409] transition-colors disabled:opacity-50 min-h-[44px]">
                  {profileForm.formState.isSubmitting ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            </div>
          </section>

          {/* Change Password */}
          <section className="section-shell">
            <div className="section-core">
              <h2 className="mb-6" style={{ fontFamily: "'Hanken Grotesk',sans-serif", fontSize: '20px', fontWeight: 600 }}>Change Password</h2>
              <form onSubmit={passwordForm.handleSubmit(onChangePassword)} className="flex flex-col gap-5">
                <div className="flex flex-col gap-1.5">
                  <label className={labelCls}>Current Password</label>
                  <input {...passwordForm.register('currentPassword', { required: true })} type="password" placeholder="Enter current password" className={inputCls} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className={labelCls}>New Password</label>
                  <input {...passwordForm.register('newPassword', { required: true, minLength: 6 })} type="password" placeholder="At least 6 characters" className={inputCls} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className={labelCls}>Confirm New Password</label>
                  <input {...passwordForm.register('confirmPassword', { required: true })} type="password" placeholder="Repeat new password" className={inputCls} />
                </div>
                <button type="submit" disabled={passwordForm.formState.isSubmitting} className="w-full sm:self-start sm:w-auto px-6 py-3 bg-[#99420d] text-white text-sm font-semibold rounded-xl hover:bg-[#7a3409] transition-colors disabled:opacity-50 min-h-[44px]">
                  {passwordForm.formState.isSubmitting ? 'Updating...' : 'Update Password'}
                </button>
              </form>
            </div>
          </section>

          {/* Danger Zone */}
          <section style={{ border: '1px solid rgba(186,26,26,0.2)', borderRadius: '16px' }}>
            <div style={{ padding: '20px 24px' }}>
              <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined" style={{ fontSize: '20px', color: '#ba1a1a' }}>warning</span>
                <h2 style={{ fontFamily: "'Hanken Grotesk',sans-serif", fontSize: '20px', fontWeight: 600, color: '#ba1a1a' }}>Danger Zone</h2>
              </div>
              <p className="text-sm text-[#56433a] mb-5" style={{ maxWidth: '48ch', lineHeight: 1.6 }}>
                Deleting your account is permanent and cannot be undone. All your projects, messages, and profile data will be removed immediately.
              </p>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="px-5 py-2.5 text-white text-sm font-semibold rounded-xl transition-colors min-h-[44px]"
                style={{ background: '#ba1a1a' }}
                onMouseEnter={e => e.currentTarget.style.background = '#9b1616'}
                onMouseLeave={e => e.currentTarget.style.background = '#ba1a1a'}
              >
                Delete My Account
              </button>
            </div>
          </section>

        </div>
      </main>

      {/* Delete confirmation modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(30,27,24,0.6)' }}>
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-xl" style={{ border: '1px solid #dcc1b5' }}>
            <h3 style={{ fontFamily: "'Hanken Grotesk',sans-serif", fontSize: '20px', fontWeight: 700, color: '#1e1b18' }} className="mb-2">
              Delete Account
            </h3>
            <p className="text-sm text-[#56433a] mb-5" style={{ lineHeight: 1.6 }}>
              This cannot be undone. All your data will be permanently removed. Enter your password to confirm.
            </p>
            <div className="flex flex-col gap-1.5 mb-5">
              <label className={labelCls}>Enter your password to confirm</label>
              <input
                type="password"
                value={deletePassword}
                onChange={e => setDeletePassword(e.target.value)}
                placeholder="Your current password"
                className={inputCls}
                autoFocus
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleDeleteAccount}
                disabled={!deletePassword || deleting}
                className="flex-1 py-3 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-40 min-h-[44px]"
                style={{ background: '#ba1a1a' }}
              >
                {deleting ? 'Deleting...' : 'Yes, delete my account'}
              </button>
              <button
                onClick={() => { setShowDeleteModal(false); setDeletePassword(''); }}
                className="flex-1 py-3 text-sm font-semibold text-[#56433a] rounded-xl border border-[#dcc1b5] hover:bg-[#f5ede8] transition-colors min-h-[44px]"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
