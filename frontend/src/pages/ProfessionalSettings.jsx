import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

function getInitials(name) {
  if (!name) return '??';
  const parts = name.trim().split(' ');
  return (parts[0][0] + (parts[1] ? parts[1][0] : '')).toUpperCase();
}

export default function ProfessionalSettings() {
  const { user } = useAuth();
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();

  const [profilePic, setProfilePic] = useState(null);
  const [portfolioImages, setPortfolioImages] = useState([]);
  const [uploadingPic, setUploadingPic] = useState(false);
  const [uploadingPortfolio, setUploadingPortfolio] = useState(false);
  const [loading, setLoading] = useState(true);

  const picInputRef = useRef(null);
  const portfolioInputRef = useRef(null);

  // Load existing profile
  useEffect(() => {
    if (!user) return;
    api.get(`/api/professionals/${user.id}`)
      .then(res => {
        const p = res.data;
        reset({
          specialty: p.specialty || '',
          bio: p.bio || '',
          location: p.location || '',
        });
        if (p.profilePicture) setProfilePic(p.profilePicture);
        if (p.portfolioImages) setPortfolioImages(p.portfolioImages);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user, reset]);

  const onSaveProfile = async (data) => {
    try {
      await api.put('/api/professionals/profile', data);
      toast.success('Profile updated successfully');
    } catch {
      toast.error('Failed to update profile');
    }
  };

  const handleProfilePicUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingPic(true);
    const form = new FormData();
    form.append('image', file);
    try {
      const { data } = await api.post('/api/upload/profile-picture', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setProfilePic(data.url);
      toast.success('Profile picture updated');
    } catch {
      toast.error('Failed to upload picture');
    } finally {
      setUploadingPic(false);
    }
  };

  const handlePortfolioUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    if (portfolioImages.length + files.length > 5) {
      toast.error('Maximum 5 portfolio images allowed');
      return;
    }
    setUploadingPortfolio(true);
    const form = new FormData();
    files.forEach(f => form.append('images', f));
    try {
      const { data } = await api.post('/api/upload/portfolio', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setPortfolioImages(prev => [...prev, ...data.urls]);
      toast.success(`${data.urls.length} image${data.urls.length > 1 ? 's' : ''} uploaded`);
    } catch {
      toast.error('Failed to upload portfolio images');
    } finally {
      setUploadingPortfolio(false);
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
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 rounded-full overflow-hidden bg-[#efe6e2] flex items-center justify-center flex-shrink-0">
                    {profilePic ? (
                      <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-2xl font-semibold text-[#99420d]" style={{ fontFamily: "'Hanken Grotesk',sans-serif" }}>
                        {getInitials(user?.fullName)}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => picInputRef.current?.click()}
                      disabled={uploadingPic}
                      className="px-4 py-2 border border-[#dcc1b5] rounded-xl text-sm font-medium text-[#1e1b18] hover:border-[#99420d] hover:text-[#99420d] transition-colors disabled:opacity-50"
                    >
                      {uploadingPic ? 'Uploading...' : 'Change Photo'}
                    </button>
                    <p className="text-xs text-[#56433a]">JPG or PNG, max 5MB</p>
                  </div>
                  <input
                    ref={picInputRef}
                    type="file"
                    accept="image/jpeg,image/png"
                    className="hidden"
                    onChange={handleProfilePicUpload}
                  />
                </div>
              </div>
            </section>

            {/* Bio & Details */}
            <section className="section-shell">
              <div className="section-core">
                <h2 className="mb-6" style={{ fontFamily: "'Hanken Grotesk',sans-serif", fontSize: '20px', fontWeight: 600 }}>
                  Professional Details
                </h2>
                <form onSubmit={handleSubmit(onSaveProfile)} className="flex flex-col gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-[#1e1b18]">Specialty</label>
                    <select
                      {...register('specialty')}
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
                      {...register('location')}
                      type="text"
                      placeholder="e.g. Kigali, Rwanda"
                      className="w-full px-4 py-3 rounded-xl border border-[#dcc1b5] bg-[#fff8f5] text-sm text-[#1e1b18] placeholder-[#a08070] focus:outline-none focus:border-[#99420d] transition-colors"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-[#1e1b18]">Bio</label>
                    <textarea
                      {...register('bio')}
                      rows={4}
                      placeholder="Tell clients about your experience, approach, and expertise..."
                      className="w-full px-4 py-3 rounded-xl border border-[#dcc1b5] bg-[#fff8f5] text-sm text-[#1e1b18] placeholder-[#a08070] focus:outline-none focus:border-[#99420d] transition-colors resize-none"
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

            {/* Portfolio */}
            <section className="section-shell">
              <div className="section-core">
                <div className="flex justify-between items-center mb-6">
                  <h2 style={{ fontFamily: "'Hanken Grotesk',sans-serif", fontSize: '20px', fontWeight: 600 }}>
                    Portfolio
                  </h2>
                  <span className="text-xs text-[#56433a]">{portfolioImages.length}/5 images</span>
                </div>

                {portfolioImages.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">
                    {portfolioImages.map((src, i) => (
                      <img
                        key={i}
                        src={src}
                        alt={`Portfolio ${i + 1}`}
                        className="w-full h-36 object-cover rounded-xl"
                      />
                    ))}
                  </div>
                )}

                {portfolioImages.length < 5 && (
                  <>
                    <button
                      type="button"
                      onClick={() => portfolioInputRef.current?.click()}
                      disabled={uploadingPortfolio}
                      className="w-full py-8 border-2 border-dashed border-[#dcc1b5] rounded-xl flex flex-col items-center gap-2 hover:border-[#99420d] hover:text-[#99420d] transition-colors disabled:opacity-50 text-[#56433a]"
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '32px' }}>add_photo_alternate</span>
                      <span className="text-sm font-medium">
                        {uploadingPortfolio ? 'Uploading...' : `Add Photos (${5 - portfolioImages.length} remaining)`}
                      </span>
                    </button>
                    <input
                      ref={portfolioInputRef}
                      type="file"
                      accept="image/jpeg,image/png"
                      multiple
                      className="hidden"
                      onChange={handlePortfolioUpload}
                    />
                  </>
                )}
              </div>
            </section>

          </div>
        )}
      </main>
    </div>
  );
}
