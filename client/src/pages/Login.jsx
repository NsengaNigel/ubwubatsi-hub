import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, formState: { isSubmitting } } = useForm();

  const onSubmit = async ({ email, password }) => {
    setError('');
    try {
      const user = await login(email, password);
      toast.success('Welcome back!');
      if (user.role === 'admin') navigate('/admin');
      else if (user.role === 'professional') navigate('/professional-dashboard');
      else navigate('/client-dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please check your credentials.';
      setError(msg);
      toast.error(msg);
    }
  };

  return (
    <div className="bg-[#fff8f5] min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-sm fade-up du-1">
        <div className="card-shell">
          <div className="card-core">

            <Link
              to="/"
              className="font-bold text-[#99420d] block mb-8"
              style={{ fontFamily: "'Hanken Grotesk',sans-serif", fontSize: '24px' }}
            >
              Ubwubatsi Hub
            </Link>

            <div className="mb-8">
              <span className="eyebrow mb-4">
                <span className="material-symbols-outlined fill" style={{ fontSize: '12px' }}>lock</span>
                Sign in
              </span>
              <h1
                className="text-[#1e1b18] mt-3"
                style={{ fontFamily: "'Hanken Grotesk',sans-serif", fontSize: '32px', letterSpacing: '-0.02em', fontWeight: 600 }}
              >
                Welcome back
              </h1>
              <p className="text-base text-[#56433a] mt-2">Enter your details to continue building.</p>
            </div>

            <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-[#1e1b18]" style={{ letterSpacing: '0.05em' }} htmlFor="email">Email address</label>
                <input
                  className="input-field"
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  {...register('email', { required: true })}
                />
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-[#1e1b18]" style={{ letterSpacing: '0.05em' }} htmlFor="password">Password</label>
                  <a className="text-sm text-[#99420d] hover:text-[#9c440f] transition-colors" href="#">Forgot password?</a>
                </div>
                <div className="relative">
                  <input
                    className="input-field"
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    style={{ paddingRight: '48px' }}
                    {...register('password', { required: true })}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#897268] hover:text-[#99420d] transition-colors"
                    onClick={() => setShowPassword(v => !v)}
                    aria-label="Toggle visibility"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>

              {error && (
                <p className="text-sm text-[#ba1a1a]">{error}</p>
              )}

              <button
                className="btn-primary-sm w-full justify-center mt-1"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Logging in…' : 'Log in'}
                {!isSubmitting && (
                  <span className="btn-icon">
                    <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>arrow_forward</span>
                  </span>
                )}
              </button>
            </form>

            <p className="text-center text-sm text-[#56433a] mt-8 pt-6 border-t border-[#dcc1b5]">
              New to Ubwubatsi Hub?{' '}
              <Link className="text-[#99420d] font-medium hover:underline ml-1" to="/register">Create an account</Link>
            </p>

          </div>
        </div>
      </div>
    </div>
  );
}
