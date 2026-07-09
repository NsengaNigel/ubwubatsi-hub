import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import Footer from '../components/Footer';

export default function Register() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState('client');
  const [error, setError] = useState('');
  const { register, handleSubmit, formState: { isSubmitting, errors } } = useForm();

  const onSubmit = async ({ fullName, email, phone, password, registrationNumber }) => {
    setError('');
    try {
      const payload = { fullName, email, phone, password, role };
      if (role === 'professional') payload.registrationNumber = registrationNumber;
      const user = await registerUser(payload);
      toast.success('Account created successfully!');
      if (user.role === 'professional') navigate('/pending-verification');
      else if (user.role === 'admin') navigate('/admin');
      else navigate('/client-dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Please try again.';
      setError(msg);
      toast.error(msg);
    }
  };

  return (
    <div className="bg-[#fff8f5] min-h-screen flex flex-col">
      <div className="flex-1 flex items-center justify-center p-6 py-12">
        <div className="w-full max-w-sm fade-up du-1">
          <div className="card-shell">
            <div className="card-core">

              <Link
                to="/"
                className="font-bold text-[#99420d] block mb-6"
                style={{ fontFamily: "'Hanken Grotesk',sans-serif", fontSize: '24px' }}
              >
                Ubwubatsi Hub
              </Link>

              <div className="mb-7">
                <span className="eyebrow mb-3">
                  <span className="material-symbols-outlined fill" style={{ fontSize: '12px' }}>person_add</span>
                  Create account
                </span>
                <h1
                  className="text-[#1e1b18] mt-3"
                  style={{ fontFamily: "'Hanken Grotesk',sans-serif", fontSize: '32px', letterSpacing: '-0.02em', fontWeight: 600 }}
                >
                  Join the network
                </h1>
                <p className="text-sm text-[#56433a] mt-1.5">Rwanda's premier platform for construction professionals.</p>
              </div>

              {/* Role toggle */}
              <div className="role-toggle mb-6" style={{ position: 'relative' }}>
                <div
                  style={{
                    position: 'absolute', top: '4px', bottom: '4px', left: '4px',
                    width: 'calc(50% - 4px)', background: '#99420d', borderRadius: '999px',
                    transition: 'transform 0.35s cubic-bezier(0.32,0.72,0,1)',
                    transform: role === 'professional' ? 'translateX(100%)' : 'translateX(0)',
                  }}
                />
                <button type="button" className={`role-btn ${role === 'client' ? 'active' : ''}`} onClick={() => setRole('client')}>Client</button>
                <button type="button" className={`role-btn ${role === 'professional' ? 'active' : ''}`} onClick={() => setRole('professional')}>Professional</button>
              </div>

              <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-[#1e1b18]" style={{ letterSpacing: '0.05em' }} htmlFor="fullName">Full name</label>
                  <input className="input-field" id="fullName" type="text" placeholder="Your full name" {...register('fullName', { required: true })} />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-[#1e1b18]" style={{ letterSpacing: '0.05em' }} htmlFor="email">Email address</label>
                  <input
                    className="input-field"
                    id="email"
                    type="email"
                    placeholder="yourname@example.com"
                    {...register('email', {
                      required: 'Email is required',
                      minLength: { value: 6, message: 'Enter a valid email address' },
                      pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email address' },
                    })}
                  />
                  {errors.email && <p className="text-xs text-[#ba1a1a] mt-0.5">{errors.email.message}</p>}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-[#1e1b18]" style={{ letterSpacing: '0.05em' }} htmlFor="phone">Phone number</label>
                  <input
                    className="input-field"
                    id="phone"
                    type="tel"
                    placeholder="+250791540119 or 0791540119"
                    {...register('phone', {
                      required: 'Phone number is required',
                      pattern: { value: /^(\+250|0)7[2389]\d{7}$/, message: 'Enter a valid Rwandan phone number e.g. +250791540119 or 0791540119' },
                    })}
                  />
                  {errors.phone && <p className="text-xs text-[#ba1a1a] mt-0.5">{errors.phone.message}</p>}
                </div>

                {role === 'professional' && (
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-[#1e1b18]" style={{ letterSpacing: '0.05em' }} htmlFor="regNumber">
                      Registration number <span className="text-[#56433a] font-normal">(RIA / Engineers Rwanda)</span>
                    </label>
                    <input
                      className="input-field"
                      id="regNumber"
                      type="text"
                      placeholder="A2121/EC/IER/2024 or RIA-2024-001"
                      {...register('registrationNumber', {
                        required: 'Registration number is required',
                        pattern: {
                          value: /^([A-Z]\d+\/[A-Z]{2}\/[A-Z]{2,4}\/\d{4}|RIA-\d{4}-\d{3})$/,
                          message: 'Enter a valid registration number e.g. A2121/EC/IER/2024 for engineers or RIA-2024-001 for architects',
                        },
                      })}
                    />
                    {errors.registrationNumber && <p className="text-xs text-[#ba1a1a] mt-0.5">{errors.registrationNumber.message}</p>}
                    <p className="text-xs text-[#897268]">Engineers Rwanda: A2121/EC/IER/2024 · RIA architects: RIA-2024-001</p>
                  </div>
                )}

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-[#1e1b18]" style={{ letterSpacing: '0.05em' }} htmlFor="password">Password</label>
                  <input className="input-field" id="password" type="password" placeholder="Create a strong password" {...register('password', { required: true })} />
                </div>

                {error && <p className="text-sm text-[#ba1a1a]">{error}</p>}

                <button className="btn-primary-sm w-full justify-center mt-2" type="submit" disabled={isSubmitting} style={{ minHeight: '44px' }}>
                  {isSubmitting ? 'Creating account…' : 'Create account'}
                  {!isSubmitting && (
                    <span className="btn-icon">
                      <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>arrow_forward</span>
                    </span>
                  )}
                </button>
              </form>

              <p className="text-center text-sm text-[#56433a] mt-7 pt-5 border-t border-[#dcc1b5]">
                Already have an account?
                <Link className="text-[#99420d] font-medium hover:underline ml-1" to="/login">Log in</Link>
              </p>

            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
