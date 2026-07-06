import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Landing() {
  return (
    <div className="bg-[#fff8f5] text-[#1e1b18] min-h-screen flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="max-w-[1280px] mx-auto px-4 md:px-10 pt-20 pb-24 md:pt-28 md:pb-32">
        <div className="flex flex-col gap-6 max-w-2xl">
          <div className="flex flex-col gap-6">
            <span className="eyebrow fade-up du-1">
              <span className="material-symbols-outlined fill" style={{ fontSize: '12px' }}>verified</span>
              Verified professionals only
            </span>
            <h1
              className="fade-up du-2 text-[#1e1b18] text-3xl md:text-5xl lg:text-[56px]"
              style={{ fontFamily: "'Hanken Grotesk',sans-serif", lineHeight: '1.05', letterSpacing: '-0.02em', fontWeight: 700 }}
            >
              Find Verified<br />
              <span className="text-[#99420d]">Architects &amp; Engineers</span><br />
              in Rwanda
            </h1>
            <p className="text-lg text-[#56433a] fade-up du-3" style={{ maxWidth: '44ch', lineHeight: '28px' }}>
              Connecting homeowners with Rwanda's top construction professionals. Build with trusted experts, transparent pricing, and guaranteed quality.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 fade-up du-4">
              <Link to="/register" className="btn-primary w-full sm:w-auto justify-center">
                Post a Project
                <span className="btn-icon">
                  <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>arrow_forward</span>
                </span>
              </Link>
              <Link to="/browse-professionals" className="btn-outline w-full sm:w-auto justify-center">Find Professionals</Link>
            </div>
          </div>

        </div>
      </section>

      {/* How it Works */}
      <section className="bg-[#fbf2ed] py-24 px-4 md:px-10" id="how-it-works">
        <div className="max-w-[1280px] mx-auto">
          <div className="mb-14">
            <span className="eyebrow mb-4">Process</span>
            <h2
              className="text-[#1e1b18] mt-4"
              style={{ fontFamily: "'Hanken Grotesk',sans-serif", fontSize: '36px', lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: 700 }}
            >
              How Ubwubatsi Hub works
            </h2>
            <p className="text-lg text-[#56433a] mt-3" style={{ maxWidth: '44ch' }}>
              Transparency and professional rigor at every step of your construction journey.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            <div className="step-card">
              <span className="step-num">01</span>
              <h3 className="text-[#1e1b18] mt-5 mb-3" style={{ fontFamily: "'Hanken Grotesk',sans-serif", fontSize: '24px', fontWeight: 600 }}>Post your project</h3>
              <p className="text-base text-[#56433a]">Describe your vision, budget, and timeline. Our structured forms help define your requirements clearly for the best matches.</p>
            </div>
            <div className="step-card">
              <span className="step-num">02</span>
              <h3 className="text-[#1e1b18] mt-5 mb-3" style={{ fontFamily: "'Hanken Grotesk',sans-serif", fontSize: '24px', fontWeight: 600 }}>Get matched</h3>
              <p className="text-base text-[#56433a]">Receive expressions of interest from verified architects and engineers. Compare portfolios, read reviews, and select the right expert.</p>
            </div>
            <div className="step-card">
              <span className="step-num">03</span>
              <h3 className="text-[#1e1b18] mt-5 mb-3" style={{ fontFamily: "'Hanken Grotesk',sans-serif", fontSize: '24px', fontWeight: 600 }}>Build with confidence</h3>
              <p className="text-base text-[#56433a]">Communicate directly with your chosen professional, track progress, and leave a review when the project is complete.</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
