import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

const sections = [
  {
    title: '1. Introduction',
    body: `Ubwubatsi Hub ("we", "our", or "us") operates a platform connecting homeowners and property developers with verified architects and civil engineers in Rwanda. This Privacy and Ethics Policy explains how we collect, use, and protect your personal information when you use our website and services. By creating an account, you accept the practices described here.`,
  },
  {
    title: '2. Information We Collect',
    subsections: [
      {
        heading: 'Account Information',
        text: 'When you register, we collect your full name, email address, phone number, password (stored as a one-way hash), and role (client or professional). Professionals additionally provide a registration number issued by Engineers Rwanda or the Rwanda Institute of Architects (RIA).',
      },
      {
        heading: 'Profile Information',
        text: 'Professionals may upload a profile picture, portfolio images, bio, specialty, and location in Kigali. Clients may add a profile picture and location. All images are stored on Cloudinary.',
      },
      {
        heading: 'Project Information',
        text: 'Clients who post projects provide a title, category, district, budget range, and project description. This information is visible to verified professionals on the platform.',
      },
      {
        heading: 'Messages',
        text: 'Conversations and messages exchanged between clients and professionals are stored in our database to enable real-time and persistent messaging.',
      },
    ],
  },
  {
    title: '3. How We Use Your Information',
    body: `We use your information solely to operate and improve the platform. Specifically: to create and authenticate your account; to connect clients with verified professionals; to enable project posting and expressions of interest; to send in-app notifications; to verify professional credentials against Rwanda Engineering and Architecture licensing bodies; and to generate anonymised platform statistics (total users, projects, and verifications). We do not use your data for advertising or sell it to third parties.`,
  },
  {
    title: '4. Information Sharing & Disclosure',
    body: `We do not share your personal data with external parties except in the following limited cases: (a) Service providers — Cloudinary processes and stores uploaded images under their own privacy policy. MongoDB Atlas hosts our database in a secure cloud environment. (b) Legal requirements — we may disclose data if required by Rwandan law or lawful court order. (c) Your voluntary sharing — your professional profile, portfolio, and specialisation are visible to all authenticated platform users when you are verified.`,
  },
  {
    title: '5. Professional Verification',
    body: `Professionals who register must provide a valid registration number from Engineers Rwanda (format: A####/##/###/####) or the Rwanda Institute of Architects (format: RIA-####-###). We display a pending-verification status until an administrator manually reviews and approves your profile. We reserve the right to reject or remove profiles where the registration number cannot be verified or where the profile is found to be fraudulent. Verification does not constitute an endorsement of the quality of any professional's work.`,
  },
  {
    title: '6. Account Security',
    body: `Passwords are hashed using bcrypt and are never stored or transmitted in plain text. Authentication tokens (JWT) are stored in your browser's localStorage and expire after 7 days. You are responsible for keeping your credentials confidential. If you believe your account has been compromised, contact us immediately at n.nigel@alustudent.com. We recommend using a strong, unique password and changing it periodically.`,
  },
  {
    title: '7. Media & Cloudinary Storage',
    body: `Profile pictures and portfolio images are uploaded to Cloudinary, a third-party cloud media service. By uploading images to Ubwubatsi Hub, you confirm that you have the right to use and share those images, and that they do not contain offensive, misleading, or copyrighted material. Images are deleted from Cloudinary when you remove them from your profile or when your account is deleted.`,
  },
  {
    title: '8. Your Rights & Account Deletion',
    subsections: [
      {
        heading: 'Access & Correction',
        text: 'You can view and update your profile information at any time through Account Settings.',
      },
      {
        heading: 'Account Deletion',
        text: 'You may permanently delete your account from the Danger Zone section of Account Settings. Deletion requires password confirmation and is irreversible. Upon deletion, we remove all your personal data, messages, projects, expressions of interest, ratings, notifications, and Cloudinary images. Admin accounts cannot be self-deleted.',
      },
      {
        heading: 'Data Portability',
        text: 'To request a copy of your data or raise a data concern, contact us at n.nigel@alustudent.com.',
      },
    ],
  },
  {
    title: '9. Cookies & Technical Tracking',
    body: `Ubwubatsi Hub does not use advertising cookies or third-party tracking scripts. Your browser may store the authentication token and user session data in localStorage, which is necessary for the platform to function. We do not use Google Analytics, Facebook Pixel, or any equivalent tracking technologies. Standard server access logs (IP address, timestamp, requested path) may be retained for up to 30 days for security and debugging purposes.`,
  },
  {
    title: '10. Policy Updates & Contact',
    body: `We may update this policy as the platform evolves. Significant changes will be communicated through in-app notifications. Continued use of the platform after an update constitutes acceptance of the revised policy. This policy was last updated in July 2026. For any questions, concerns, or data requests, contact us at:\n\nEmail: n.nigel@alustudent.com\nPhone: +250 791 530 119`,
  },
];

export default function PrivacyPolicy() {
  return (
    <div className="bg-[#fff8f5] min-h-screen flex flex-col">

      {/* Simple header */}
      <header className="sticky top-0 z-50 border-b border-[#dcc1b5] bg-[#fff8f5]">
        <div className="flex items-center justify-between h-20 px-4 md:px-10 max-w-[1280px] mx-auto">
          <Link to="/" className="font-bold text-[#99420d]" style={{ fontFamily: "'Hanken Grotesk',sans-serif", fontSize: '24px' }}>
            Ubwubatsi Hub
          </Link>
          <Link to="/" className="flex items-center gap-1.5 text-sm font-medium text-[#56433a] hover:text-[#99420d] transition-colors">
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_back</span>
            Back to home
          </Link>
        </div>
      </header>

      <main className="flex-1 w-full max-w-[760px] mx-auto px-4 md:px-10 py-12 md:py-16">

        {/* Page header */}
        <div className="mb-10">
          <span className="eyebrow mb-4">
            <span className="material-symbols-outlined fill" style={{ fontSize: '12px' }}>policy</span>
            Legal
          </span>
          <h1
            className="text-[#1e1b18] mt-4"
            style={{ fontFamily: "'Hanken Grotesk',sans-serif", fontSize: '36px', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.15 }}
          >
            Privacy & Ethics Policy
          </h1>
          <p className="text-base text-[#56433a] mt-3" style={{ maxWidth: '52ch' }}>
            How Ubwubatsi Hub collects, uses, and protects your data — and our ethical commitments to users across Rwanda.
          </p>
          <p className="text-xs text-[#897268] mt-4">Last updated: July 2026</p>
        </div>

        {/* Sections */}
        <div className="flex flex-col gap-6">
          {sections.map((section) => (
            <div
              key={section.title}
              className="rounded-2xl p-6 md:p-8"
              style={{ background: '#FDF6F0', border: '1px solid #e8d5c8' }}
            >
              <h2
                className="mb-4"
                style={{ fontFamily: "'Hanken Grotesk',sans-serif", fontSize: '18px', fontWeight: 700, color: '#C4622D' }}
              >
                {section.title}
              </h2>

              {section.body && (
                <p className="text-sm text-[#3a2e28] leading-relaxed whitespace-pre-line">{section.body}</p>
              )}

              {section.subsections && (
                <div className="flex flex-col gap-4">
                  {section.subsections.map((sub) => (
                    <div key={sub.heading}>
                      <h3
                        className="mb-1.5 text-sm font-semibold"
                        style={{ color: '#8B4513' }}
                      >
                        {sub.heading}
                      </h3>
                      <p className="text-sm text-[#3a2e28] leading-relaxed">{sub.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom note */}
        <div className="mt-10 pt-8 border-t border-[#dcc1b5] text-center">
          <p className="text-sm text-[#56433a]">
            Questions about this policy?{' '}
            <a href="mailto:n.nigel@alustudent.com" className="text-[#99420d] font-medium hover:underline">
              Contact us
            </a>
          </p>
        </div>

      </main>

      <Footer />
    </div>
  );
}
