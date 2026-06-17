import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function PendingVerification() {
  const { user } = useAuth();

  return (
    <div className="bg-[#fff8f5] min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md fade-up du-1">
        <div className="card-shell">
          <div className="card-core flex flex-col gap-6">

            <Link
              to="/"
              className="font-bold text-[#99420d]"
              style={{ fontFamily: "'Hanken Grotesk',sans-serif", fontSize: '24px' }}
            >
              Ubwubatsi Hub
            </Link>

            <div className="flex flex-col items-center gap-4 py-4 text-center">
              <div className="w-16 h-16 rounded-full bg-[#efe6e2] flex items-center justify-center">
                <span className="material-symbols-outlined text-[#99420d]" style={{ fontSize: '32px' }}>schedule</span>
              </div>

              <div>
                <h1
                  className="text-[#1e1b18] mb-2"
                  style={{ fontFamily: "'Hanken Grotesk',sans-serif", fontSize: '28px', fontWeight: 600, letterSpacing: '-0.01em' }}
                >
                  Verification Pending
                </h1>
                <p className="text-sm text-[#56433a] leading-relaxed">
                  Your account is pending verification. Our admin team is reviewing your registration number against the RIA and Engineers Rwanda directories. You will receive access to all features once verified.
                </p>
              </div>

              {user?.registrationNumber && (
                <div className="w-full px-4 py-3 bg-[#f3e8e4] rounded-xl flex justify-between items-center">
                  <span className="text-sm text-[#56433a]">Registration No.</span>
                  <span className="text-sm font-semibold text-[#1e1b18]" style={{ letterSpacing: '0.05em' }}>
                    {user.registrationNumber}
                  </span>
                </div>
              )}

              <div className="w-full pt-2 flex flex-col gap-3">
                <Link
                  to="/professional-settings"
                  className="btn-primary-sm w-full justify-center"
                >
                  View My Profile
                  <span className="btn-icon">
                    <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>arrow_forward</span>
                  </span>
                </Link>
                <Link
                  to="/"
                  className="text-sm text-center text-[#56433a] hover:text-[#99420d] transition-colors"
                >
                  Back to Home
                </Link>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
