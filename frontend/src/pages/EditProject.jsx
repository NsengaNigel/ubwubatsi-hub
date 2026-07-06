import { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import api from '../api/axios';
import Footer from '../components/Footer';

export default function EditProject() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { register, handleSubmit, reset, formState: { isSubmitting, isLoading } } = useForm();

  useEffect(() => {
    api.get(`/api/projects/${id}`)
      .then(res => {
        const p = res.data;
        reset({
          title: p.title,
          category: p.category,
          location: p.location,
          budget: p.budget,
          description: p.description,
        });
      })
      .catch(() => {
        toast.error('Could not load project data.');
        navigate('/client-dashboard');
      });
  }, [id, reset, navigate]);

  const onSubmit = async (data) => {
    try {
      await api.put(`/api/projects/${id}`, data);
      toast.success('Project updated successfully!');
      navigate('/client-dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update project. Please try again.');
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
            <span className="eyebrow mb-4">Edit project</span>
            <h1
              className="text-[#1e1b18] mt-4"
              style={{ fontFamily: "'Hanken Grotesk',sans-serif", fontSize: '32px', letterSpacing: '-0.01em', fontWeight: 600 }}
            >
              Update Project
            </h1>
            <p className="text-base text-[#56433a] mt-2" style={{ maxWidth: '44ch' }}>
              Update your project details. Verified professionals will see the changes immediately.
            </p>
          </div>

          <div className="card-shell fade-up du-2">
            <div className="card-core">
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
                      <select className="post-select" id="category" {...register('category', { required: true })}>
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
                      <select className="post-select" id="location" {...register('location', { required: true })}>
                        <option value="Gasabo">Gasabo</option>
                        <option value="Kicukiro">Kicukiro</option>
                        <option value="Nyarugenge">Nyarugenge</option>
                      </select>
                      <span className="material-symbols-outlined absolute pointer-events-none text-[#56433a]" style={{ right: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '20px' }}>expand_more</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-[#1e1b18]" style={{ letterSpacing: '0.05em' }} htmlFor="budget">
                    Budget <span className="text-[#56433a] font-normal">(RWF)</span>
                  </label>
                  <input
                    className="input-field"
                    id="budget"
                    type="text"
                    placeholder="e.g., 5000000 - 10000000 RWF"
                    {...register('budget', { required: true })}
                  />
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

                <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-2 border-t border-[#dcc1b5]">
                  <Link to="/client-dashboard" className="text-sm font-semibold text-[#56433a] hover:text-[#99420d] transition-colors text-center py-3 sm:py-0 min-h-[44px] sm:min-h-0 flex items-center justify-center sm:justify-start">
                    Cancel
                  </Link>
                  <button className="btn-primary-sm w-full sm:w-auto justify-center" type="submit" disabled={isSubmitting} style={{ minHeight: '44px' }}>
                    {isSubmitting ? 'Saving…' : 'Save changes'}
                    {!isSubmitting && (
                      <span className="btn-icon">
                        <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>check</span>
                      </span>
                    )}
                  </button>
                </div>

              </form>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
