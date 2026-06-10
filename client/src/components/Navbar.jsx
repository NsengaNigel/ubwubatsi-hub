import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function getInitials(name) {
  if (!name) return '??';
  const parts = name.trim().split(' ');
  return (parts[0][0] + (parts[1] ? parts[1][0] : '')).toUpperCase();
}

export default function Navbar({ activeLink }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-[#fff8f5] w-full top-0 sticky border-b border-[#dcc1b5] z-50">
      <div className="flex justify-between items-center h-20 px-4 md:px-10 max-w-[1280px] mx-auto">
        <div className="flex items-center gap-8">
          <Link
            to="/"
            className="font-bold text-[#99420d]"
            style={{ fontFamily: "'Hanken Grotesk',sans-serif", fontSize: '24px', lineHeight: '32px' }}
          >
            Ubwubatsi Hub
          </Link>
          <div className="hidden md:flex gap-6">
            <Link
              to="/browse-professionals"
              className={`text-sm font-medium transition-colors ${activeLink === 'browse' ? 'text-[#99420d] border-b-2 border-[#99420d] pb-0.5' : 'text-[#56433a] hover:text-[#99420d]'}`}
            >
              Find Experts
            </Link>
            <Link
              to="/post-project"
              className={`text-sm font-medium transition-colors ${activeLink === 'projects' ? 'text-[#99420d] border-b-2 border-[#99420d] pb-0.5' : 'text-[#56433a] hover:text-[#99420d]'}`}
            >
              Projects
            </Link>
            <a
              href="/#how-it-works"
              className="text-sm font-medium text-[#56433a] hover:text-[#99420d] transition-colors"
            >
              How it Works
            </a>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <button className="p-2 text-[#56433a] hover:text-[#99420d] transition-colors">
                <span className="material-symbols-outlined">notifications</span>
              </button>
              <button className="nav-avatar" onClick={handleLogout} title="Logout">
                {getInitials(user.fullName)}
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="hidden md:block text-sm font-semibold text-[#56433a] hover:text-[#99420d] transition-colors"
                style={{ letterSpacing: '0.05em' }}
              >
                Login
              </Link>
              <Link to="/register" className="nav-register">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
