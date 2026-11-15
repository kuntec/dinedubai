import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Instagram, Globe, Mail } from 'lucide-react';
import { Modal } from '../common/Modal';

type InfoModalTopic = 'about' | 'contact' | 'privacy' | 'terms' | null;

export function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [infoTopic, setInfoTopic] = useState<InfoModalTopic>(null);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError('');
    if (!email.trim() || !email.includes('@')) {
      setEmailError('Please enter a valid email address.');
      return;
    }
    setSubscribed(true);
    setEmail('');
  };

  const renderModalContent = () => {
    switch (infoTopic) {
      case 'about':
        return (
          <div className="space-y-4 text-sm text-[#222222]/80 leading-relaxed">
            <p>
              <strong>DineDubai</strong> is a curated culinary discovery guide dedicated to showcasing Dubai’s finest dining rooms, specialty coffee roasters, waterfront terraces, and neighborhood culinary heritage.
            </p>
            <p>
              Our editorial directory currently runs on curated demonstration data across 20 restaurants, 15 specialty cafés, and 10 iconic Dubai neighborhoods—architected cleanly for live Cloud Firestore and Google Maps Platform integration.
            </p>
          </div>
        );
      case 'contact':
        return (
          <div className="space-y-4 text-sm text-[#222222]/80 leading-relaxed">
            <p>
              For editorial inquiries, partnership submissions, or listing corrections in Dubai, reach our curation desk:
            </p>
            <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E8E2D9] space-y-2">
              <p><strong>Editorial Desk:</strong> editorial@dinedubai.example</p>
              <p><strong>Location:</strong> DIFC Gate Village, Dubai, UAE</p>
              <p><strong>Hours:</strong> Sun – Thu, 09:00 – 18:00 GST</p>
            </div>
          </div>
        );
      case 'privacy':
        return (
          <div className="space-y-3 text-sm text-[#222222]/80 leading-relaxed">
            <p>
              DineDubai respects member privacy. During local demonstration mode, your saved favorites, recently viewed places, and dining preferences are stored exclusively in your browser’s local storage.
            </p>
            <p>
              No personal information is transmitted to external third parties without explicit sign-in consent.
            </p>
          </div>
        );
      case 'terms':
        return (
          <div className="space-y-3 text-sm text-[#222222]/80 leading-relaxed">
            <p>
              Venue profiles, menus, pricing estimates in AED, opening hours, and ratings presented in this preview constitute curated demonstration data and do not represent live booking availability or verified real-world business telemetry.
            </p>
            <p>
              External reservation links are provided solely as partner placeholders until live venue verification is enabled.
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  const modalTitleMap: Record<Exclude<InfoModalTopic, null>, string> = {
    about: 'About DineDubai',
    contact: 'Contact Our Curation Desk',
    privacy: 'Privacy Policy',
    terms: 'Terms of Use & Demo Notice',
  };

  return (
    <footer className="bg-[#1A1A1A] text-[#FAF8F5] pt-16 pb-24 md:pb-12 border-t border-white/10">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          {/* Brand column */}
          <div className="md:col-span-4 space-y-4">
            <Link to="/" className="font-serif text-2xl font-semibold tracking-tight text-white">
              DineDubai
            </Link>
            <p className="text-sm text-[#FAF8F5]/70 leading-relaxed max-w-sm">
              An editorial guide to Dubai’s finest restaurants, third-wave coffee bars, waterfront kitchens, and neighborhood dining gems.
            </p>
            <div className="flex items-center gap-3 pt-1">
              <button
                type="button"
                onClick={() => setInfoTopic('about')}
                aria-label="DineDubai Instagram & Editorial"
                className="w-9 h-9 rounded-lg border border-white/15 flex items-center justify-center text-[#FAF8F5]/75 hover:text-white hover:border-[#C5A46D] transition-colors cursor-pointer"
              >
                <Instagram className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setInfoTopic('contact')}
                aria-label="Email DineDubai"
                className="w-9 h-9 rounded-lg border border-white/15 flex items-center justify-center text-[#FAF8F5]/75 hover:text-white hover:border-[#C5A46D] transition-colors cursor-pointer"
              >
                <Mail className="w-4 h-4" />
              </button>
              <Link
                to="/map"
                aria-label="Explore Dubai Map"
                className="w-9 h-9 rounded-lg border border-white/15 flex items-center justify-center text-[#FAF8F5]/75 hover:text-white hover:border-[#C5A46D] transition-colors"
              >
                <Globe className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Navigation links */}
          <div className="md:col-span-2 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-[#C5A46D]">
              Explore
            </h3>
            <ul className="space-y-2.5 text-sm text-[#FAF8F5]/75">
              <li>
                <Link to="/restaurants" className="hover:text-white transition-colors">
                  Restaurants
                </Link>
              </li>
              <li>
                <Link to="/cafes" className="hover:text-white transition-colors">
                  Specialty Cafés
                </Link>
              </li>
              <li>
                <Link to="/collections" className="hover:text-white transition-colors">
                  Curated Collections
                </Link>
              </li>
              <li>
                <Link to="/map" className="hover:text-white transition-colors">
                  Dubai Map
                </Link>
              </li>
            </ul>
          </div>

          {/* Company & Legal */}
          <div className="md:col-span-2 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-[#C5A46D]">
              Editorial
            </h3>
            <ul className="space-y-2.5 text-sm text-[#FAF8F5]/75">
              <li>
                <button
                  type="button"
                  onClick={() => setInfoTopic('about')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  About
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setInfoTopic('contact')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Contact
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setInfoTopic('privacy')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setInfoTopic('terms')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Terms
                </button>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="md:col-span-4 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-[#C5A46D]">
              The Weekly Table
            </h3>
            <p className="text-sm text-[#FAF8F5]/70 leading-relaxed">
              New Dubai openings, seasonal tasting menus, and quiet roasteries delivered every Thursday.
            </p>
            {subscribed ? (
              <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-[#146C5B]/25 border border-[#146C5B]/50 text-sm text-white">
                <CheckCircle2 className="w-4 h-4 text-[#C5A46D] shrink-0" />
                <span>You are subscribed to The Weekly Table.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2" noValidate>
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    aria-label="Newsletter email address"
                    className="flex-1 min-w-0 px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/15 text-sm text-white placeholder:text-white/45 focus:outline-none focus:border-[#C5A46D]"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-xl bg-[#146C5B] hover:bg-[#0F5548] text-white text-sm font-semibold inline-flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <span>Subscribe</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                {emailError && (
                  <p className="text-xs text-amber-300">{emailError}</p>
                )}
              </form>
            )}
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[#FAF8F5]/55">
          <p>© {new Date().getFullYear()} DineDubai. Editorial demonstration showcase for Dubai dining discovery.</p>
          <p>Listings, pricing in AED, and hours are sample demonstration entries.</p>
        </div>
      </div>

      <Modal
        isOpen={infoTopic !== null}
        onClose={() => setInfoTopic(null)}
        title={infoTopic ? modalTitleMap[infoTopic] : ''}
      >
        {renderModalContent()}
      </Modal>
    </footer>
  );
}
