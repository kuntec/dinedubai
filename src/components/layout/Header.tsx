import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Compass, Coffee, Heart, MapPin, Menu, UtensilsCrossed, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const NAV_ITEMS = [
  { label: 'Discover', to: '/' },
  { label: 'Restaurants', to: '/restaurants' },
  { label: 'Cafés', to: '/cafes' },
  { label: 'Collections', to: '/collections' },
  { label: 'Map', to: '/map' },
];

export function Header() {
  const { user, favorites, openAuthModal } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleProfileClick = () => {
    if (user) {
      navigate('/profile');
    } else {
      openAuthModal();
    }
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="md:sticky md:top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#E8E2D9]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 h-16 md:h-[72px] flex items-center justify-between gap-8">
          {/* Zone 1: Brand wordmark */}
          <Link
            to="/"
            className="font-serif text-2xl font-semibold tracking-tight text-[#222222] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-[#146C5B] rounded"
          >
            DineDubai
          </Link>

          {/* Zone 2: 5 concise single-line text links */}
          <nav className="hidden md:flex items-center gap-7" aria-label="Primary navigation">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `relative py-1 text-sm font-medium whitespace-nowrap shrink-0 transition-colors focus-visible:outline-2 focus-visible:outline-[#146C5B] rounded ${
                    isActive
                      ? 'text-[#146C5B] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#146C5B]'
                      : 'text-[#222222]/75 hover:text-[#222222]'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Zone 3: Primary action + mobile menu button */}
          <div className="flex items-center gap-3 shrink-0">
            {user ? (
              <Link
                to="/profile"
                className="hidden sm:inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-white border border-[#E8E2D9] hover:border-[#146C5B]/50 text-sm font-medium text-[#222222] transition-colors whitespace-nowrap shrink-0"
              >
                <span className="w-6 h-6 rounded-full bg-[#146C5B] text-white text-xs font-semibold flex items-center justify-center">
                  {user.avatarInitials}
                </span>
                <span>Profile</span>
                {favorites.length > 0 && (
                  <span className="text-xs text-[#222222]/60 tabular-nums">
                    ({favorites.length})
                  </span>
                )}
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => openAuthModal()}
                className="hidden sm:inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-[#146C5B] hover:bg-[#0F5548] text-white text-sm font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                Sign In
              </button>
            )}

            <button
              type="button"
              onClick={() => setMobileMenuOpen((v) => !v)}
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
              className="md:hidden p-2.5 rounded-xl border border-[#E8E2D9] bg-white text-[#222222] hover:bg-[#F3EFE8] transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-[#E8E2D9] px-4 py-4 space-y-2 shadow-lg">
            <nav className="flex flex-col space-y-1" aria-label="Mobile navigation">
              {NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-[#146C5B]/10 text-[#146C5B]'
                        : 'text-[#222222]/80 hover:bg-[#FAF8F5]'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
            <div className="pt-2 border-t border-[#E8E2D9]">
              <button
                type="button"
                onClick={handleProfileClick}
                className="w-full py-2.5 px-4 rounded-xl bg-[#146C5B] text-white text-sm font-semibold text-center"
              >
                {user ? `My Profile (${favorites.length} Saved)` : 'Sign In / Profile'}
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Compact mobile bottom bar */}
      <nav
        aria-label="Mobile quick navigation"
        className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E8E2D9] h-14 px-2 grid grid-cols-5 items-center"
      >
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `flex flex-col items-center justify-center gap-0.5 text-[11px] font-medium ${
              isActive ? 'text-[#146C5B]' : 'text-[#222222]/65'
            }`
          }
        >
          <Compass className="w-4 h-4" />
          <span>Discover</span>
        </NavLink>
        <NavLink
          to="/restaurants"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center gap-0.5 text-[11px] font-medium ${
              isActive ? 'text-[#146C5B]' : 'text-[#222222]/65'
            }`
          }
        >
          <UtensilsCrossed className="w-4 h-4" />
          <span>Dine</span>
        </NavLink>
        <NavLink
          to="/cafes"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center gap-0.5 text-[11px] font-medium ${
              isActive ? 'text-[#146C5B]' : 'text-[#222222]/65'
            }`
          }
        >
          <Coffee className="w-4 h-4" />
          <span>Cafés</span>
        </NavLink>
        <NavLink
          to="/map"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center gap-0.5 text-[11px] font-medium ${
              isActive ? 'text-[#146C5B]' : 'text-[#222222]/65'
            }`
          }
        >
          <MapPin className="w-4 h-4" />
          <span>Map</span>
        </NavLink>
        <button
          type="button"
          onClick={handleProfileClick}
          className="flex flex-col items-center justify-center gap-0.5 text-[11px] font-medium text-[#222222]/65"
        >
          <Heart className="w-4 h-4" />
          <span>{user ? 'Saved' : 'Sign In'}</span>
        </button>
      </nav>
    </>
  );
}
