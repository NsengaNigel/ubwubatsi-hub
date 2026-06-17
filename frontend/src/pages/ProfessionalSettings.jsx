import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import ImageUpload from '../components/ImageUpload';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function ProfessionalSettings() {
  const { user, refreshUser } = useAuth();

  const basicForm = useForm();
  const proForm = useForm();

  const [portfolioImages, setPortfolioImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchAll = async () => {
      try {
        const [meRes, profileRes] = await Promise.all([
          api.get('/api/auth/me'),
          api.get('/api/professionals/my-profile'),
        ]);
        const me = meRes.data;
        const p = profileRes.data;

        basicForm.reset({
          fullName: me.fullName || '',
          phone: me.phone || '',
        });

        proForm.reset({
          specialty: p.specialty || '',
          bio: p.bio || '',
          location: p.location || '',
        });

        setPortfolioImages(p.portfolioImages || []);
      } catch {
        toast.error('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [user]);

  const onSaveBasic = async (data) => {
    try {
      await api.put('/api/users/settings', data);
      await refreshUser();
      toast.success('Basic info updated');
    } catch {
      toast.error('Failed to update info');
    }
  };

  const onSavePro = async (data) => {
    try {
      await api.put('/api/professionals/profile', data);
      toast.success('Professional details updated');
    } catch {
      toast.error('Failed to update professional details');
    }
  };

  const handleProfilePicUpload = async () => {
    await refreshUser();
    toast.success('Profile picture updated');
  };

  const handlePortfolioUpload = (data) => {
    setPortfolioImages(data.portfolioImages || []);
    toast.success('Portfolio images uploaded');
  };

  const handlePortfolioDelete = async (imageUrl) => {
    try {
      const { data } = await api.delete('/api/upload/portfolio', { data: { imageUrl } });
      setPortfolioImages(data.portfolioImages || []);
      toast.success('Image removed');
    } catch {
      toast.error('Failed to delete image');
    }
  };

  return (
    <div className="bg-[#fff8f5] text-[#1e1b18] min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 w-full max-w-[820px] mx-auto px-4 md:px-10 py-10">
        <h1 className="mb-8" style={{ fontFamily: "'Hanken Grotesk',sans-serif", fontSize: '32px', fontWeight: 600, letterSpacing: '-0.01em' }}>
          Profile Settings
        </h1>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-[#dcc1b5] border-t-[#99420d] rounded-full animate-spin" />
          </div>
        ) : (
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

            {/* Basic Info */}
            <section className="section-shell">
              <div className="section-core">
                <h2 className="mb-6" style={{ fontFamily: "'Hanken Grotesk',sans-serif", fontSize: '20px', fontWeight: 600 }}>
                  Basic Information
                </h2>
                <form onSubmit={basicForm.handleSubmit(onSaveBasic)} className="flex flex-col gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-[#1e1b18]">Full Name</label>
                    <input
                      {...basicForm.register('fullName', { required: true })}
                      type="text"
                      placeholder="Your full name"
                      className="w-full px-4 py-3 rounded-xl border border-[#dcc1b5] bg-[#fff8f5] text-sm text-[#1e1b18] placeholder-[#a08070] focus:outline-none focus:border-[#99420d] transition-colors"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-[#1e1b18]">Phone Number</label>
                    <input
                      {...basicForm.register('phone')}
                      type="tel"
                      placeholder="+250 7XX XXX XXX"
                      className="w-full px-4 py-3 rounded-xl border border-[#dcc1b5] bg-[#fff8f5] text-sm text-[#1e1b18] placeholder-[#a08070] focus:outline-none focus:border-[#99420d] transition-colors"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={basicForm.formState.isSubmitting}
                    className="self-start px-6 py-3 bg-[#99420d] text-white text-sm font-semibold rounded-xl hover:bg-[#7a3409] transition-colors disabled:opacity-50"
                  >
                    {basicForm.formState.isSubmitting ? 'Saving...' : 'Save Basic Info'}
                  </button>
                </form>
              </div>
            </section>

            {/* Professional Details */}
            <section className="section-shell">
              <div className="section-core">
                <h2 className="mb-6" style={{ fontFamily: "'Hanken Grotesk',sans-serif", fontSize: '20px', fontWeight: 600 }}>
                  Professional Details
                </h2>
                <form onSubmit={proForm.handleSubmit(onSavePro)} className="flex flex-col gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-[#1e1b18]">Specialty</label>
                    <select
                      {...proForm.register('specialty')}
                      className="w-full px-4 py-3 rounded-xl border border-[#dcc1b5] bg-[#fff8f5] text-sm text-[#1e1b18] focus:outline-none focus:border-[#99420d] transition-colors"
                    >
                      <option value="">Select specialty</option>
                      <option value="Architect">Architect</option>
                      <option value="Civil Engineer">Civil Engineer</option>
                      <option value="Both">Both</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-[#1e1b18]">Location</label>
                    <input
                      {...proForm.register('location')}
                      type="text"
                      placeholder="e.g. Kigali, Rwanda"
                      className="w-full px-4 py-3 rounded-xl border border-[#dcc1b5] bg-[#fff8f5] text-sm text-[#1e1b18] placeholder-[#a08070] focus:outline-none focus:border-[#99420d] transition-colors"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-[#1e1b18]">Bio</label>
                    <textarea
                      {...proForm.register('bio')}
                      rows={4}
                      placeholder="Tell clients about your experience and expertise..."
                      className="w-full px-4 py-3 rounded-xl border border-[#dcc1b5] bg-[#fff8f5] text-sm text-[#1e1b18] placeholder-[#a08070] focus:outline-none focus:border-[#99420d] transition-colors resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={proForm.formState.isSubmitting}
                    className="self-start px-6 py-3 bg-[#99420d] text-white text-sm font-semibold rounded-xl hover:bg-[#7a3409] transition-colors disabled:opacity-50"
                  >
                    {proForm.formState.isSubmitting ? 'Saving...' : 'Save Professional Details'}
                  </button>
                </form>
              </div>
            </section>

            {/* Portfolio */}
            <section className="section-shell">
              <div className="section-core">
                <div className="flex justify-between items-center mb-6">
                  <h2 style={{ fontFamily: "'Hanken Grotesk',sans-serif", fontSize: '20px', fontWeight: 600 }}>
                    Portfolio
                  </h2>
                  <span className="text-xs text-[#56433a]">{portfolioImages.length}/5 images</span>
                </div>
                <ImageUpload
                  multiple
                  maxFiles={5}
                  uploadUrl="/api/upload/portfolio"
                  fieldName="portfolioImages"
                  existingImages={portfolioImages}
                  onUpload={handlePortfolioUpload}
                  onDelete={handlePortfolioDelete}
                />
              </div>
            </section>

          </div>
        )}
      </main>
    </div>
  );
}
