import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import ImageUpload from '../components/ImageUpload';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const inputCls = "w-full px-4 py-3 rounded-xl border border-[#dcc1b5] bg-[#fff8f5] text-sm text-[#1e1b18] placeholder-[#a08070] focus:outline-none focus:border-[#99420d] transition-colors";
const labelCls = "text-sm font-medium text-[#1e1b18]";

export default function ClientSettings() {
  const { user, refreshUser } = useAuth();

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
        <h1 className="mb-8" style={{ fontFamily: "'Hanken Grotesk',sans-serif", fontSize: '32px', fontWeight: 600, letterSpacing: '-0.01em' }}>
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
                <button type="submit" disabled={profileForm.formState.isSubmitting} className="self-start px-6 py-3 bg-[#99420d] text-white text-sm font-semibold rounded-xl hover:bg-[#7a3409] transition-colors disabled:opacity-50">
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
                <button type="submit" disabled={passwordForm.formState.isSubmitting} className="self-start px-6 py-3 bg-[#99420d] text-white text-sm font-semibold rounded-xl hover:bg-[#7a3409] transition-colors disabled:opacity-50">
                  {passwordForm.formState.isSubmitting ? 'Updating...' : 'Update Password'}
                </button>
              </form>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}
