import React, { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight, MapPin, Search, Utensils } from 'lucide-react';
import {
  getCategories,
  getCollections,
  getDistinctCuisines,
  getFeaturedRestaurants,
  getLocations,
  getTrendingVenues,
  getVenueCountByLocation,
} from '../services/dataService';
import { VENUE_IMAGES } from '../data/images';
import { VenueCard } from '../components/common/VenueCard';
import { ImageWithFallback } from '../components/common/ImageWithFallback';

const POPULAR_SUGGESTIONS = [
  { label: 'Burj Khalifa Views', to: '/restaurants?area=downtown-dubai' },
  { label: 'Quiet Work Cafés', to: '/cafes?filter=work-friendly' },
  { label: 'DIFC Business Lunch', to: '/collections/best-business-lunches' },
  { label: 'Palm Beachfront', to: '/restaurants?area=palm-jumeirah' },
  { label: 'Al Seef Heritage', to: '/restaurants?area=al-seef' },
];

export function HomePage() {
  const navigate = useNavigate();
  const carouselRef = useRef<HTMLDivElement>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');

  const categories = getCategories();
  const featuredRestaurants = getFeaturedRestaurants();
  const trendingVenues = getTrendingVenues();
  const locations = getLocations();
  const collections = getCollections();
  const cuisines = getDistinctCuisines();

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set('q', searchQuery.trim());
    if (selectedLocation !== 'all') params.set('area', selectedLocation);

    if (selectedCategory === 'cafes-coffee') {
      navigate(`/cafes?${params.toString()}`);
      return;
    }

    if (selectedCategory !== 'all') {
      if (selectedCategory.startsWith('cuisine:')) {
        params.set('cuisine', selectedCategory.replace('cuisine:', ''));
      } else {
        params.set('category', selectedCategory);
      }
    }
    navigate(`/restaurants?${params.toString()}`);
  };

  const scrollTrending = (direction: 'left' | 'right') => {
    if (!carouselRef.current) return;
    const distance = direction === 'left' ? -380 : 380;
    carouselRef.current.scrollBy({ left: distance, behavior: 'smooth' });
  };

  return (
    <div className="bg-[#FAF8F5]">
      {/* Hero Section */}
      <section className="relative min-h-[580px] lg:min-h-[640px] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <ImageWithFallback
            src={VENUE_IMAGES.heroDubaiDining}
            alt="Evening terrace dining overlooking Downtown Dubai skyline"
            className="w-full h-full object-cover"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/50 to-black/30" />
        </div>

        <div className="relative z-10 w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="max-w-3xl space-y-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C5A46D]">
              Curated Culinary Guide · Dubai, UAE
            </p>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold text-white leading-[1.1] [text-wrap:balance]">
              Discover Dubai, One Bite at a Time.
            </h1>
            <p className="text-base sm:text-lg text-white/85 leading-relaxed max-w-2xl">
              Explore exceptional restaurants, hidden cafés, and unforgettable dining experiences across Dubai.
            </p>
          </div>

          {/* Search Bar */}
          <form
            onSubmit={handleHeroSearch}
            className="mt-8 bg-white rounded-2xl p-2.5 shadow-2xl border border-[#E8E2D9]/80 max-w-5xl"
          >
            <div className="grid grid-cols-1 md:grid-cols-12 gap-2 items-center">
              <div className="md:col-span-5 flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] md:bg-transparent">
                <Search className="w-4 h-4 text-[#146C5B] shrink-0" aria-hidden="true" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Restaurant, café, or signature dish..."
                  aria-label="Search restaurant or café name"
                  className="w-full bg-transparent text-sm text-[#222222] placeholder:text-[#222222]/50 focus:outline-none"
                />
              </div>

              <div className="hidden md:block w-px h-7 bg-[#E8E2D9] justify-self-center" />

              <div className="md:col-span-3 flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] md:bg-transparent">
                <Utensils className="w-4 h-4 text-[#222222]/55 shrink-0" aria-hidden="true" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  aria-label="Select cuisine or dining category"
                  className="w-full bg-transparent text-sm text-[#222222] focus:outline-none cursor-pointer"
                >
                  <option value="all">All Cuisines & Styles</option>
                  <optgroup label="Dining Categories">
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.slug}>
                        {cat.name}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Cuisines">
                    {cuisines.map((c) => (
                      <option key={c} value={`cuisine:${c}`}>
                        {c}
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>

              <div className="md:col-span-2 flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] md:bg-transparent">
                <MapPin className="w-4 h-4 text-[#222222]/55 shrink-0" aria-hidden="true" />
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  aria-label="Select Dubai neighborhood"
                  className="w-full bg-transparent text-sm text-[#222222] focus:outline-none cursor-pointer"
                >
                  <option value="all">All Dubai</option>
                  {locations.map((loc) => (
                    <option key={loc.id} value={loc.slug}>
                      {loc.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-1 flex justify-end">
                <button
                  type="submit"
                  className="w-full md:w-auto px-6 py-3 rounded-xl bg-[#146C5B] hover:bg-[#0F5548] text-white text-sm font-semibold transition-colors whitespace-nowrap cursor-pointer"
                >
                  Search
                </button>
              </div>
            </div>
          </form>

          {/* Popular Suggestions */}
          <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-white/85">
            <span className="font-medium text-[#C5A46D]">Popular searches:</span>
            {POPULAR_SUGGESTIONS.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className="underline decoration-white/30 underline-offset-4 hover:text-white hover:decoration-[#C5A46D] transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Browse Categories */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#146C5B]">
              By Dining Style
            </p>
            <h2 className="mt-2 font-serif text-3xl sm:text-4xl font-semibold text-[#222222]">
              Browse Categories
            </h2>
          </div>
          <Link
            to="/restaurants"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#146C5B] hover:text-[#0F5548] transition-colors"
          >
            <span>Explore full directory</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">
          {categories.map((category) => {
            const targetUrl =
              category.targetKind === 'cafe'
                ? `/cafes?category=${category.slug}`
                : `/restaurants?category=${category.slug}`;
            return (
              <Link
                key={category.id}
                to={targetUrl}
                className="group relative aspect-[4/3] rounded-2xl overflow-hidden bg-[#F3EFE8] shadow-[0_4px_16px_rgba(34,34,34,0.06)] hover:shadow-[0_12px_28px_rgba(34,34,34,0.12)] transition-all duration-200"
              >
                <ImageWithFallback
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <h3 className="font-serif text-lg font-semibold text-white leading-snug">
                    {category.name}
                  </h3>
                  <p className="mt-0.5 text-xs text-white/80 line-clamp-1">
                    {category.subtitle}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured Restaurants */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-16 border-t border-[#E8E2D9]">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#C5A46D]">
              Editors’ Selection
            </p>
            <h2 className="mt-2 font-serif text-3xl sm:text-4xl font-semibold text-[#222222]">
              Featured Restaurants
            </h2>
          </div>
          <Link
            to="/restaurants"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#146C5B] hover:text-[#0F5548] transition-colors"
          >
            <span>View all 20 restaurants</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {featuredRestaurants.map((venue) => (
            <VenueCard key={venue.id} venue={venue} />
          ))}
        </div>
      </section>

      {/* Trending in Dubai Carousel */}
      <section className="bg-white border-y border-[#E8E2D9] py-16 md:py-20">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-4 mb-10">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#146C5B]">
                In Demand This Season
              </p>
              <h2 className="mt-2 font-serif text-3xl sm:text-4xl font-semibold text-[#222222]">
                Trending in Dubai
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => scrollTrending('left')}
                aria-label="Scroll trending places left"
                className="w-10 h-10 rounded-xl border border-[#E8E2D9] bg-[#FAF8F5] hover:bg-[#F3EFE8] flex items-center justify-center text-[#222222] transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => scrollTrending('right')}
                aria-label="Scroll trending places right"
                className="w-10 h-10 rounded-xl border border-[#E8E2D9] bg-[#FAF8F5] hover:bg-[#F3EFE8] flex items-center justify-center text-[#222222] transition-colors cursor-pointer"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div
            ref={carouselRef}
            className="flex gap-6 overflow-x-auto no-scrollbar scroll-smooth pb-2 snap-x snap-mandatory"
          >
            {trendingVenues.map((venue) => (
              <div key={venue.id} className="w-[300px] sm:w-[340px] shrink-0 snap-start">
                <VenueCard venue={venue} showCafeMetrics={venue.venueKind === 'cafe'} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Explore by Location */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#146C5B]">
              Neighborhood Guides
            </p>
            <h2 className="mt-2 font-serif text-3xl sm:text-4xl font-semibold text-[#222222]">
              Explore by Location
            </h2>
          </div>
          <Link
            to="/map"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#146C5B] hover:text-[#0F5548] transition-colors"
          >
            <span>Open Dubai Map</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {locations.map((loc) => {
            const count = getVenueCountByLocation(loc.slug);
            return (
              <Link
                key={loc.id}
                to={`/restaurants?area=${loc.slug}`}
                className="group bg-white rounded-2xl border border-[#E8E2D9] p-4 hover:border-[#146C5B]/50 hover:shadow-[0_8px_24px_rgba(34,34,34,0.06)] transition-all flex items-center gap-3.5"
              >
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#F3EFE8] shrink-0">
                  <ImageWithFallback
                    src={loc.image}
                    alt={loc.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="min-w-0">
                  <h3 className="font-serif text-base font-semibold text-[#222222] group-hover:text-[#146C5B] transition-colors truncate">
                    {loc.name}
                  </h3>
                  <p className="text-xs text-[#222222]/60 mt-0.5 line-clamp-1">
                    {loc.tagline}
                  </p>
                  <p className="text-xs font-medium text-[#146C5B] mt-1 tabular-nums">
                    {count} curated {count === 1 ? 'place' : 'places'}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Curated Collections */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 border-t border-[#E8E2D9]">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#C5A46D]">
              Editorial Stories
            </p>
            <h2 className="mt-2 font-serif text-3xl sm:text-4xl font-semibold text-[#222222]">
              Curated Collections
            </h2>
          </div>
          <Link
            to="/collections"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#146C5B] hover:text-[#0F5548] transition-colors"
          >
            <span>All 7 collections</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.slice(0, 6).map((col) => (
            <Link
              key={col.id}
              to={`/collections/${col.slug}`}
              className="group relative aspect-[4/3] rounded-2xl overflow-hidden bg-[#F3EFE8] shadow-[0_4px_20px_rgba(34,34,34,0.06)] hover:shadow-[0_14px_34px_rgba(34,34,34,0.12)] transition-all"
            >
              <ImageWithFallback
                src={col.coverImage}
                alt={col.title}
                className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6">
                <p className="text-xs font-medium text-[#C5A46D] tabular-nums">
                  {col.venueIds.length} venues <span aria-hidden="true">·</span> By {col.curatorName}
                </p>
                <h3 className="mt-1.5 font-serif text-2xl font-semibold text-white leading-snug">
                  {col.title}
                </h3>
                <p className="mt-1.5 text-sm text-white/80 line-clamp-2">
                  {col.subtitle}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Highlight Banner for 7th Collection + Cafés */}
        <div className="mt-8 bg-white rounded-2xl border border-[#E8E2D9] p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#146C5B]">
              Dedicated Café Guide
            </p>
            <h3 className="font-serif text-2xl font-semibold text-[#222222]">
              Looking for quiet work cafés, ceremonial matcha, or single-origin roasters?
            </h3>
            <p className="text-sm text-[#222222]/70">
              Filter by Wi-Fi speed, power outlets, noise level, pet-friendly terraces, and specialty coffee price across 15 Dubai cafés.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              to="/collections/weekend-brunch-favorites"
              className="px-5 py-3 rounded-xl border border-[#E8E2D9] bg-[#FAF8F5] hover:bg-[#F3EFE8] text-sm font-semibold text-[#222222] transition-colors whitespace-nowrap"
            >
              Weekend Brunch Guide
            </Link>
            <Link
              to="/cafes"
              className="px-5 py-3 rounded-xl bg-[#146C5B] hover:bg-[#0F5548] text-white text-sm font-semibold transition-colors whitespace-nowrap"
            >
              Explore Cafés
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
