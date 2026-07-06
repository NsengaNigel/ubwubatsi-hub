import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={{ background: '#8B4513' }}>
      <div className="max-w-[1280px] mx-auto px-4 md:px-10 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">

        {/* Column 1 — Brand */}
        <div className="flex flex-col gap-3">
          <span
            style={{ fontFamily: "'Hanken Grotesk',sans-serif", fontSize: '22px', fontWeight: 700, color: '#C4622D' }}
          >
            Ubwubatsi Hub
          </span>
          <p style={{ color: 'rgba(255,255,255,0.72)', fontSize: '14px', lineHeight: '1.65' }}>
            Connecting homeowners with verified architects and civil engineers in Rwanda.
          </p>
        </div>

        {/* Column 2 — Quick Links */}
        <div className="flex flex-col gap-3">
          <h3 style={{ color: 'rgba(255,255,255,0.45)', fontSize: '11px', fontWeight: 600, letterSpacing: '0.09em', textTransform: 'uppercase' }}>
            Quick Links
          </h3>
          <nav className="flex flex-col gap-2">
            <Link to="/browse-professionals" style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', textDecoration: 'none', transition: 'color 0.15s' }}
              onMouseEnter={e => e.target.style.color = '#fff'}
              onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.8)'}
            >Browse Professionals</Link>
            <Link to="/post-project" style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', textDecoration: 'none', transition: 'color 0.15s' }}
              onMouseEnter={e => e.target.style.color = '#fff'}
              onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.8)'}
            >Post a Project</Link>
            <Link to="/login" style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', textDecoration: 'none', transition: 'color 0.15s' }}
              onMouseEnter={e => e.target.style.color = '#fff'}
              onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.8)'}
            >Login</Link>
            <Link to="/register" style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', textDecoration: 'none', transition: 'color 0.15s' }}
              onMouseEnter={e => e.target.style.color = '#fff'}
              onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.8)'}
            >Register</Link>
          </nav>
        </div>

        {/* Column 3 — Contact */}
        <div className="flex flex-col gap-3">
          <h3 style={{ color: 'rgba(255,255,255,0.45)', fontSize: '11px', fontWeight: 600, letterSpacing: '0.09em', textTransform: 'uppercase' }}>
            Contact
          </h3>
          <div className="flex flex-col gap-2">
            <a
              href="tel:+250791530119"
              style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', textDecoration: 'none', transition: 'color 0.15s' }}
              onMouseEnter={e => e.target.style.color = '#fff'}
              onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.8)'}
            >
              +250 791 530 119
            </a>
            <a
              href="mailto:n.nigel@alustudent.com"
              style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', textDecoration: 'none', transition: 'color 0.15s' }}
              onMouseEnter={e => e.target.style.color = '#fff'}
              onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.8)'}
            >
              n.nigel@alustudent.com
            </a>
          </div>
        </div>

      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.12)' }}>
        <div className="max-w-[1280px] mx-auto px-4 md:px-10 py-4 flex justify-center">
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px' }}>
            © 2026 Ubwubatsi Hub. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
