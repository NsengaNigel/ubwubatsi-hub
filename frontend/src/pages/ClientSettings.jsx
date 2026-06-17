import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import ImageUpload from '../components/ImageUpload';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function ClientSettings() {
  const { user, refreshUser } = useAuth();
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();

  useEffect(() => {
    if (!user) return;
    reset({
      fullName: user.fullName || '',
      phone: user.phone || '',
      location: user.location || '',
    });
  }, [user, reset]);

  const onSave = async (data) => {
    try {
      await api.put('/api/users/settings', data);
      await refreshUser();
      toast.success('Profile updated successfully');
    } catch {
      toast.error('Failed to update profile');
    }
  };

  const handleProfilePicUpload = async (data) => {
    await refreshUser();
    toast.success('Profile picture updated');
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
              <h2 className="mb-6" style={{ fontFamily: "'Hanken Grotesk',sans-serif", fontSize: '20px', fontWeight: 600 }}>
                Profile Picture
              </h2>
              <ImageUpload
                uploadUrl="/api/upload/profile-picture"
                fieldName="profilePicture"
                existingImages={user?.profilePicture ? [user.profilePicture] : []}
                onUpload={handleProfilePicUpload}
                onDelete={() => {}}
              />
            </div>
          </section>

          {/* Profile Info */}
          <section className="section-shell">
            <div className="section-core">
              <h2 className="mb-6" style={{ fontFamily: "'Hanken Grotesk',sans-serif", fontSize: '20px', fontWeight: 600 }}>
                Personal Details
              </h2>
              <form onSubmit={handleSubmit(onSave)} className="flex flex-col gap-5">

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-[#1e1b18]">Full Name</label>
                  <input
                    {...register('fullName', { required: true })}
                    type="text"
                    placeholder="Your full name"
                    className="w-full px-4 py-3 rounded-xl border border-[#dcc1b5] bg-[#fff8f5] text-sm text-[#1e1b18] placeholder-[#a08070] focus:outline-none focus:border-[#99420d] transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-[#1e1b18]">Phone Number</label>
                  <input
                    {...register('phone')}
                    type="tel"
                    placeholder="+250 7XX XXX XXX"
                    className="w-full px-4 py-3 rounded-xl border border-[#dcc1b5] bg-[#fff8f5] text-sm text-[#1e1b18] placeholder-[#a08070] focus:outline-none focus:border-[#99420d] transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-[#1e1b18]">Location in Kigali</label>
                  <input
                    {...register('location')}
                    type="text"
                    placeholder="e.g. Kicukiro, Kigali"
                    className="w-full px-4 py-3 rounded-xl border border-[#dcc1b5] bg-[#fff8f5] text-sm text-[#1e1b18] placeholder-[#a08070] focus:outline-none focus:border-[#99420d] transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="self-start px-6 py-3 bg-[#99420d] text-white text-sm font-semibold rounded-xl hover:bg-[#7a3409] transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}
