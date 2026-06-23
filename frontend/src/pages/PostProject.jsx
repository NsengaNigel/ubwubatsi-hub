import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import api from '../api/axios';

export default function PostProject() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const preferredProfessionalId = state?.preferredProfessionalId || null;
  const preferredProfessionalName = state?.preferredProfessionalName || null;

  const { register, handleSubmit, formState: { isSubmitting } } = useForm();
  const [kubakaLink, setKubakaLink] = useState(null);

  const onSubmit = async (data) => {
    try {
      const budget = `${data.budgetMin || '0'} - ${data.budgetMax || '0'} RWF`;
      const body = {
        title: data.title,
        category: data.category,
        location: data.location,
        budget,
        description: data.description,
      };
      if (preferredProfessionalId) body.preferredProfessionalId = preferredProfessionalId;
      const res = await api.post('/api/projects', body);
      toast.success('Project posted successfully!');
      setKubakaLink(res.data.kubakaLink);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to post project. Please try again.');
    }
  };

  return (
    <div className="bg-[#fff8f5] min-h-screen flex flex-col">
      {/* Nav */}
      <header className="bg-[#fff8f5] w-full top-0 sticky z-50 border-b border-[#dcc1b5]">
        <div className="flex justify-between items-center h-20 px-4 md:px-10 max-w-[1280px] mx-auto">
          <Link to="/" className="font-bold text-[#99420d]" style={{ fontFamily: "'Hanken Grotesk',sans-serif", fontSize: '24px' }}>Ubwubatsi Hub</Link>
          <Link to="/client-dashboard" className="text-base text-[#56433a] hover:text-[#99420d] transition-colors">Cancel</Link>
        </div>
      </header>

      <main className="flex-grow flex items-start justify-center py-12 md:py-20 px-4 md:px-10">
        <div className="w-full max-w-2xl">

          <div className="mb-10 fade-up du-1">
            <span className="eyebrow mb-4">New project</span>
            <h1
              className="text-[#1e1b18] mt-4"
              style={{ fontFamily: "'Hanken Grotesk',sans-serif", fontSize: '32px', letterSpacing: '-0.01em', fontWeight: 600 }}
            >
              Post a Project
            </h1>
            <p className="text-base text-[#56433a] mt-2" style={{ maxWidth: '44ch' }}>
              Provide details about your construction or renovation project to connect with certified professionals.
            </p>
          </div>

          {kubakaLink ? (
            <div className="card-shell fade-up du-2">
              <div className="card-core">
                <div className="flex flex-col items-center gap-5 text-center py-4">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: 'rgba(153,66,13,0.1)' }}>
                    <span className="material-symbols-outlined text-[#99420d]" style={{ fontSize: '28px' }}>check_circle</span>
                  </div>
                  <div>
                    <h2 className="text-[#1e1b18]" style={{ fontFamily: "'Hanken Grotesk',sans-serif", fontSize: '24px', fontWeight: 600 }}>Project Posted!</h2>
                    <p className="text-base text-[#56433a] mt-2">Your project is now live and visible to verified professionals.</p>
                  </div>
                  <div className="w-full border border-[#dcc1b5] rounded-xl p-4 text-left">
                    <p className="text-xs font-semibold text-[#56433a] mb-2" style={{ letterSpacing: '0.05em' }}>KUBAKA ZONING LINK</p>
                    <a
                      href={kubakaLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-sm text-[#99420d] hover:underline break-all"
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>policy</span>
                      {kubakaLink}
                      <span className="material-symbols-outlined flex-shrink-0" style={{ fontSize: '14px' }}>open_in_new</span>
                    </a>
                  </div>
                  <button className="btn-primary-sm" onClick={() => navigate('/client-dashboard')}>
                    Go to Dashboard
                    <span className="btn-icon">
                      <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>arrow_forward</span>
                    </span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="card-shell fade-up du-2">
              <div className="card-core">
                {preferredProfessionalName && (
                  <div className="flex items-center gap-3 mb-6 px-4 py-3 rounded-xl" style={{ background: 'rgba(153,66,13,0.06)', border: '1px solid rgba(153,66,13,0.15)' }}>
                    <span className="material-symbols-outlined text-[#99420d]" style={{ fontSize: '18px' }}>person_check</span>
                    <p className="text-sm text-[#56433a]">
                      Preferred professional: <span className="font-semibold text-[#1e1b18]">{preferredProfessionalName}</span>
                    </p>
                  </div>
                )}
                <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>

                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-[#1e1b18]" style={{ letterSpacing: '0.05em' }} htmlFor="title">Project title</label>
                    <input
                      className="input-field"
                      id="title"
                      type="text"
                      placeholder="e.g., Modern Duplex in Gasabo"
                      {...register('title', { required: true })}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-semibold text-[#1e1b18]" style={{ letterSpacing: '0.05em' }} htmlFor="category">Category</label>
                      <div className="relative">
                        <select className="post-select" id="category" defaultValue="" {...register('category', { required: true })}>
                          <option value="" disabled>Select category</option>
                          <option value="Residential">Residential</option>
                          <option value="Commercial">Commercial</option>
                          <option value="Renovation">Renovation</option>
                          <option value="Other">Other</option>
                        </select>
                        <span className="material-symbols-outlined absolute pointer-events-none text-[#56433a]" style={{ right: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '20px' }}>expand_more</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-semibold text-[#1e1b18]" style={{ letterSpacing: '0.05em' }} htmlFor="location">District</label>
                      <div className="relative">
                        <select className="post-select" id="location" defaultValue="" {...register('location', { required: true })}>
                          <option value="" disabled>Select district</option>
                          <option value="Gasabo">Gasabo</option>
                          <option value="Kicukiro">Kicukiro</option>
                          <option value="Nyarugenge">Nyarugenge</option>
                        </select>
                        <span className="material-symbols-outlined absolute pointer-events-none text-[#56433a]" style={{ right: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '20px' }}>expand_more</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-[#1e1b18]" style={{ letterSpacing: '0.05em' }}>
                      Budget range <span className="text-[#56433a] font-normal">(RWF)</span>
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <input className="input-field" type="number" placeholder="Minimum" {...register('budgetMin')} />
                      <input className="input-field" type="number" placeholder="Maximum" {...register('budgetMax')} />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-[#1e1b18]" style={{ letterSpacing: '0.05em' }} htmlFor="description">Project description</label>
                    <textarea
                      className="input-field"
                      id="description"
                      rows={5}
                      placeholder="Describe your vision, requirements, and expected timeline…"
                      {...register('description', { required: true })}
                    />
                  </div>

                  <div className="flex flex-col gap-3 pt-2 border-t border-[#dcc1b5]">
                    <a
                      className="flex items-center gap-1.5 text-sm text-[#56433a] hover:text-[#99420d] transition-colors"
                      href="https://kubaka.gov.rw"
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>policy</span>
                      View zoning regulations on KUBAKA
                      <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>open_in_new</span>
                    </a>
                    <button className="btn-primary-sm w-full justify-center md:w-auto md:self-end" type="submit" disabled={isSubmitting} style={{ minHeight: '44px' }}>
                      {isSubmitting ? 'Submitting…' : 'Submit project'}
                      {!isSubmitting && (
                        <span className="btn-icon">
                          <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>arrow_forward</span>
                        </span>
                      )}
                    </button>
                  </div>

                </form>
              </div>
            </div>
          )}

        </div>
      </main>

      <footer className="border-t border-[#dcc1b5] py-8 mt-auto">
        <div className="max-w-[1280px] mx-auto px-4 md:px-10 flex flex-col md:flex-row justify-between items-center gap-3">
          <span className="text-sm text-[#56433a]">© 2024 Ubwubatsi Hub. Building Rwanda with Integrity.</span>
          <div className="flex gap-5">
            <a className="text-sm text-[#56433a] hover:text-[#99420d] transition-colors" href="#">Terms of Service</a>
            <a className="text-sm text-[#56433a] hover:text-[#99420d] transition-colors" href="#">Privacy Policy</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
