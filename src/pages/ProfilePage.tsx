import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, Clock, Heart, LogOut, Star } from 'lucide-react';
import { useApp } from '../context/AppContext';
import {
  getCollections,
  getLocations,
  getVenueById,
} from '../services/dataService';
import { Venue } from '../types/dining';
import { VenueCard } from '../components/common/VenueCard';

const DIETARY_OPTIONS = [
  'Halal',
  'Vegetarian Options',
  'Vegan-Friendly',
  'Gluten-Free Options',
  'Specialty Coffee',
];

export function ProfilePage() {
  const {
    user,
    favorites,
    savedCollections,
    recentlyViewed,
    userReviews,
    openAuthModal,
    signOut,
    updatePreferences,
  } = useApp();

  const locations = getLocations();
  const collections = getCollections();

  const [selectedAreas, setSelectedAreas] = useState<string[]>(
    user?.preferredAreas ?? []
  );
  const [selectedDietary, setSelectedDietary] = useState<string[]>(
    user?.dietaryPreferences ?? []
  );

  if (!user) {
    return (
      <div className="bg-[#FAF8F5] min-h-[75vh] flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl border border-[#E8E2D9] p-10 text-center max-w-md space-y-4">
          <h1 className="font-serif text-3xl font-semibold text-[#222222]">
            Your DineDubai Profile
          </h1>
          <p className="text-sm text-[#222222]/70 leading-relaxed">
            Sign in to access your saved Dubai restaurants, bookmarked collections, dining preferences, and review history.
          </p>
          <button
            type="button"
            onClick={() => openAuthModal()}
            className="w-full py-3 px-5 rounded-xl bg-[#146C5B] hover:bg-[#0F5548] text-white text-sm font-semibold transition-colors cursor-pointer"
          >
            Sign In / Create Account
          </button>
        </div>
      </div>
    );
  }

  const favoriteVenues = favorites
    .map((id) => getVenueById(id))
    .filter((v): v is Venue => Boolean(v));

  const recentVenues = recentlyViewed
    .map((id) => getVenueById(id))
    .filter((v): v is Venue => Boolean(v));

  const bookmarkedCollections = collections.filter((c) =>
    savedCollections.includes(c.id)
  );

  const toggleArea = (areaName: string) => {
    setSelectedAreas((prev) =>
      prev.includes(areaName) ? prev.filter((a) => a !== areaName) : [...prev, areaName]
    );
  };

  const toggleDietary = (item: string) => {
    setSelectedDietary((prev) =>
      prev.includes(item) ? prev.filter((d) => d !== item) : [...prev, item]
    );
  };

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-10 md:py-14">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl border border-[#E8E2D9] p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#146C5B] text-white font-serif text-2xl font-semibold flex items-center justify-center shrink-0">
              {user.avatarInitials}
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[#C5A46D]">
                DineDubai Member · {user.authProvider === 'google' ? 'Google Demo' : 'Email'}
              </p>
              <h1 className="mt-1 font-serif text-2xl sm:text-3xl font-semibold text-[#222222]">
                {user.displayName}
              </h1>
              <p className="text-sm text-[#222222]/65">{user.email}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={signOut}
            className="px-4 py-2.5 rounded-xl border border-[#E8E2D9] bg-[#FAF8F5] hover:bg-[#F3EFE8] text-xs font-semibold text-[#222222] inline-flex items-center gap-2 self-start sm:self-auto cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Favorites */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#222222] inline-flex items-center gap-2.5">
              <Heart className="w-6 h-6 text-[#146C5B]" />
              <span>Saved Favorites ({favoriteVenues.length})</span>
            </h2>
            <Link
              to="/restaurants"
              className="text-sm font-semibold text-[#146C5B] hover:underline"
            >
              Discover more
            </Link>
          </div>

          {favoriteVenues.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[#E8E2D9] p-8 text-center">
              <p className="text-sm text-[#222222]/70">
                You haven’t saved any restaurants or cafés yet. Tap the heart icon on any venue to build your Dubai shortlist.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
              {favoriteVenues.map((v) => (
                <VenueCard key={v.id} venue={v} showCafeMetrics={v.venueKind === 'cafe'} />
              ))}
            </div>
          )}
        </section>

        {/* Saved Collections */}
        <section className="space-y-5">
          <h2 className="font-serif text-2xl font-semibold text-[#222222] inline-flex items-center gap-2.5">
            <Bookmark className="w-5 h-5 text-[#C5A46D]" />
            <span>Bookmarked Collections ({bookmarkedCollections.length})</span>
          </h2>
          {bookmarkedCollections.length === 0 ? (
            <p className="text-sm text-[#222222]/65">
              Bookmark any editorial collection to keep it handy here.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {bookmarkedCollections.map((col) => (
                <Link
                  key={col.id}
                  to={`/collections/${col.slug}`}
                  className="bg-white rounded-2xl border border-[#E8E2D9] p-5 hover:border-[#146C5B]/50 transition-colors"
                >
                  <p className="text-xs font-medium text-[#146C5B]">
                    {col.venueIds.length} venues
                  </p>
                  <h3 className="mt-1 font-serif text-xl font-semibold text-[#222222]">
                    {col.title}
                  </h3>
                  <p className="mt-1 text-xs text-[#222222]/65 line-clamp-2">
                    {col.subtitle}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Recently Viewed */}
        {recentVenues.length > 0 && (
          <section className="space-y-5">
            <h2 className="font-serif text-2xl font-semibold text-[#222222] inline-flex items-center gap-2.5">
              <Clock className="w-5 h-5 text-[#146C5B]" />
              <span>Recently Viewed</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {recentVenues.slice(0, 4).map((v) => (
                <VenueCard key={v.id} venue={v} />
              ))}
            </div>
          </section>
        )}

        {/* Dining Preferences & Review History */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <section className="bg-white rounded-2xl border border-[#E8E2D9] p-6 space-y-5">
            <h2 className="font-serif text-2xl font-semibold text-[#222222]">
              Dining Preferences
            </h2>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#222222]/55 mb-2.5">
                Preferred Neighborhoods
              </p>
              <div className="flex flex-wrap gap-2">
                {locations.map((loc) => {
                  const active = selectedAreas.includes(loc.name);
                  return (
                    <button
                      key={loc.id}
                      type="button"
                      onClick={() => toggleArea(loc.name)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors cursor-pointer ${
                        active
                          ? 'bg-[#146C5B] text-white border-[#146C5B]'
                          : 'bg-[#FAF8F5] text-[#222222]/80 border-[#E8E2D9]'
                      }`}
                    >
                      {loc.name}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#222222]/55 mb-2.5">
                Dietary & Style Preferences
              </p>
              <div className="flex flex-wrap gap-2">
                {DIETARY_OPTIONS.map((opt) => {
                  const active = selectedDietary.includes(opt);
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => toggleDietary(opt)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors cursor-pointer ${
                        active
                          ? 'bg-[#C5A46D] text-white border-[#C5A46D]'
                          : 'bg-[#FAF8F5] text-[#222222]/80 border-[#E8E2D9]'
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="button"
              onClick={() => updatePreferences(selectedAreas, selectedDietary)}
              className="px-5 py-2.5 rounded-xl bg-[#146C5B] hover:bg-[#0F5548] text-white text-xs font-semibold cursor-pointer"
            >
              Save Preferences
            </button>
          </section>

          <section className="bg-white rounded-2xl border border-[#E8E2D9] p-6 space-y-4">
            <h2 className="font-serif text-2xl font-semibold text-[#222222]">
              Your Review History ({userReviews.length})
            </h2>
            {userReviews.length === 0 ? (
              <p className="text-sm text-[#222222]/65">
                Reviews you publish on any restaurant or café profile will appear here.
              </p>
            ) : (
              <div className="space-y-3">
                {userReviews.map((rev) => {
                  const venue = getVenueById(rev.venueId);
                  return (
                    <div
                      key={rev.id}
                      className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E8E2D9] space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <Link
                          to={venue ? `/venue/${venue.slug}` : '/'}
                          className="font-semibold text-sm text-[#146C5B] hover:underline"
                        >
                          {venue?.name ?? 'Dubai Venue'}
                        </Link>
                        <span className="inline-flex items-center gap-1 text-xs font-semibold tabular-nums">
                          <Star className="w-3.5 h-3.5 fill-[#C5A46D] text-[#C5A46D]" />
                          {rev.rating.toFixed(1)}
                        </span>
                      </div>
                      <p className="text-xs text-[#222222]/80">{rev.comment}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
