import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  CalendarCheck,
  Check,
  Clock,
  Coffee,
  ExternalLink,
  Globe,
  Heart,
  MapPin,
  Navigation,
  Phone,
  PlugZap,
  Star,
  Utensils,
  Volume2,
  Wifi,
} from 'lucide-react';
import {
  getSimilarVenues,
  getVenueBySlug,
  isVenueOpenNow,
} from '../services/dataService';
import { useApp } from '../context/AppContext';
import { ImageWithFallback } from '../components/common/ImageWithFallback';
import { VenueCard } from '../components/common/VenueCard';
import { Modal } from '../components/common/Modal';

export function VenueDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const venue = slug ? getVenueBySlug(slug) : undefined;
  const {
    user,
    isFavorite,
    toggleFavorite,
    recordRecentlyViewed,
    userReviews,
    addReview,
    openAuthModal,
    showToast,
  } = useApp();

  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [reservationModalOpen, setReservationModalOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewVisitType, setReviewVisitType] = useState('Dinner');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewError, setReviewError] = useState('');

  useEffect(() => {
    setActiveImageIdx(0);
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    if (venue) {
      recordRecentlyViewed(venue.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const combinedReviews = useMemo(() => {
    if (!venue) return [];
    const custom = userReviews.filter((r) => r.venueId === venue.id);
    return [...custom, ...venue.reviews];
  }, [venue, userReviews]);

  if (!venue) {
    return (
      <div className="bg-[#FAF8F5] min-h-[70vh] flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl border border-[#E8E2D9] p-10 text-center max-w-md">
          <h1 className="font-serif text-3xl font-semibold text-[#222222]">
            Venue not found
          </h1>
          <p className="mt-2 text-sm text-[#222222]/70">
            The restaurant or café you requested is unavailable or has moved.
          </p>
          <Link
            to="/restaurants"
            className="mt-6 inline-block px-5 py-2.5 rounded-xl bg-[#146C5B] text-white text-sm font-semibold"
          >
            Browse Dubai Directory
          </Link>
        </div>
      </div>
    );
  }

  const openNow = isVenueOpenNow(venue);
  const favored = isFavorite(venue.id);
  const similarVenues = getSimilarVenues(venue, 3);
  const gallery = venue.galleryImages.length > 0 ? venue.galleryImages : [venue.heroImage];
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${venue.coordinates.lat},${venue.coordinates.lng}`;

  const facilityItems = [
    { label: 'Indoor Seating', enabled: venue.facilities.indoorSeating },
    { label: 'Outdoor Seating', enabled: venue.facilities.outdoorSeating },
    { label: 'Family-Friendly', enabled: venue.facilities.familyFriendly },
    { label: 'Vegetarian Options', enabled: venue.facilities.vegetarianOptions },
    { label: 'Halal Options', enabled: venue.facilities.halalOptions },
    { label: 'Parking Available', enabled: venue.facilities.parkingAvailable },
    { label: 'Valet Parking', enabled: Boolean(venue.facilities.valetParking) },
    { label: 'Private Dining', enabled: Boolean(venue.facilities.privateDining) },
    { label: 'Wheelchair Accessible', enabled: Boolean(venue.facilities.wheelchairAccessible) },
  ].filter((item) => item.enabled);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setReviewError('');
    if (!user) {
      openAuthModal('Sign in to publish your review on DineDubai.');
      return;
    }
    if (reviewComment.trim().length < 10) {
      setReviewError('Please share at least a short sentence (10+ characters) about your visit.');
      return;
    }
    addReview(venue.id, reviewRating, reviewComment, reviewVisitType);
    setReviewComment('');
    setReviewRating(5);
  };

  const handleCall = () => {
    showToast(`Demo venue telephone: ${venue.phone}`);
  };

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-8 md:py-12">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <Link
            to={venue.venueKind === 'cafe' ? '/cafes' : '/restaurants'}
            className="inline-flex items-center gap-2 text-sm font-medium text-[#222222]/75 hover:text-[#146C5B] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>
              Back to {venue.venueKind === 'cafe' ? 'Specialty Cafés' : 'Restaurants'}
            </span>
          </Link>

          <span className="text-xs text-[#222222]/55">
            Editorial Demonstration Listing
          </span>
        </div>

        {/* Gallery */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-9 aspect-[16/10] sm:aspect-[16/9] rounded-2xl overflow-hidden bg-[#F3EFE8] border border-[#E8E2D9]">
            <ImageWithFallback
              src={gallery[activeImageIdx]}
              alt={`${venue.name} interior and cuisine`}
              className="w-full h-full object-cover"
              loading="eager"
            />
          </div>

          <div className="lg:col-span-3 grid grid-cols-3 lg:grid-cols-1 gap-3">
            {gallery.slice(0, 3).map((img, idx) => (
              <button
                key={`${img}-${idx}`}
                type="button"
                onClick={() => setActiveImageIdx(idx)}
                className={`relative aspect-[4/3] lg:aspect-auto lg:h-full rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                  activeImageIdx === idx
                    ? 'border-[#146C5B] shadow-md'
                    : 'border-transparent opacity-80 hover:opacity-100'
                }`}
              >
                <ImageWithFallback
                  src={img}
                  alt={`${venue.name} photo ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Main Content + Sticky Right Action Column */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left 8 cols */}
          <div className="lg:col-span-8 space-y-10">
            {/* Title & Core Meta */}
            <div className="pb-8 border-b border-[#E8E2D9]">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#146C5B]">
                {venue.venueKind === 'cafe' ? 'Specialty Café' : venue.restaurantType} ·{' '}
                {venue.cuisine}
                {venue.secondaryCuisine ? ` / ${venue.secondaryCuisine}` : ''}
              </p>

              <div className="mt-2 flex flex-wrap items-baseline justify-between gap-4">
                <h1 className="font-serif text-3xl sm:text-5xl font-semibold text-[#222222] leading-tight">
                  {venue.name}
                </h1>
                <div className="flex items-center gap-2 text-base font-semibold text-[#222222] tabular-nums">
                  <Star className="w-5 h-5 fill-[#C5A46D] text-[#C5A46D]" aria-hidden="true" />
                  <span>{venue.rating.toFixed(1)}</span>
                  <span className="text-sm font-normal text-[#222222]/60">
                    ({combinedReviews.length + venue.reviewCount - venue.reviews.length} reviews)
                  </span>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-[#222222]/75">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#146C5B]" aria-hidden="true" />
                  {venue.address}
                </span>
                <span className="tabular-nums font-medium text-[#222222]">
                  {venue.priceTier} (Avg. AED {venue.averagePriceForTwoAed} for two)
                </span>
                <span className="inline-flex items-center gap-1.5 font-medium">
                  <Clock className="w-4 h-4 text-[#146C5B]" aria-hidden="true" />
                  {openNow ? 'Open now' : 'Closed now'} · {venue.openingHoursText}
                </span>
              </div>

              {/* Mobile Quick Actions (inline so mobile sticky cap isn't exceeded) */}
              <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-2.5 lg:hidden">
                <a
                  href="#menu"
                  className="py-2.5 px-3 rounded-xl border border-[#E8E2D9] bg-white text-xs font-semibold text-center text-[#222222]"
                >
                  View Menu
                </a>
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-3 rounded-xl border border-[#E8E2D9] bg-white text-xs font-semibold text-center text-[#222222]"
                >
                  Get Directions
                </a>
                <button
                  type="button"
                  onClick={() => setReservationModalOpen(true)}
                  className="py-2.5 px-3 rounded-xl bg-[#146C5B] text-white text-xs font-semibold text-center"
                >
                  {venue.facilities.reservationAvailable ? 'Book a Table' : 'Visit Info'}
                </button>
                <button
                  type="button"
                  onClick={() => toggleFavorite(venue.id, venue.name)}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-semibold text-center ${
                    favored
                      ? 'bg-[#146C5B]/10 border-[#146C5B] text-[#146C5B]'
                      : 'bg-white border-[#E8E2D9] text-[#222222]'
                  }`}
                >
                  {favored ? 'Saved' : 'Save'}
                </button>
              </div>
            </div>

            {/* Editorial Overview */}
            <section className="space-y-4">
              <h2 className="font-serif text-2xl font-semibold text-[#222222]">
                Editorial Overview
              </h2>
              <p className="text-base text-[#222222]/80 leading-relaxed max-w-prose">
                {venue.editorialDescription}
              </p>
              {venue.facilities.scenicView && (
                <p className="text-sm text-[#146C5B] font-medium">
                  Notable View: {venue.facilities.scenicView}
                </p>
              )}
            </section>

            {/* Café-Specific Workspace & Coffee Attributes */}
            {venue.cafeAttributes && (
              <section className="bg-white rounded-2xl border border-[#E8E2D9] p-6 space-y-5">
                <div className="flex items-center justify-between gap-4">
                  <h2 className="font-serif text-2xl font-semibold text-[#222222]">
                    Café & Workspace Profile
                  </h2>
                  <span className="text-xs font-semibold text-[#146C5B] tabular-nums">
                    Avg. Coffee AED {venue.cafeAttributes.averageCoffeePriceAed}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E8E2D9]/80">
                    <Wifi className="w-4 h-4 text-[#146C5B] mb-1.5" />
                    <p className="text-xs text-[#222222]/60">Wi-Fi</p>
                    <p className="text-sm font-semibold text-[#222222]">
                      {venue.cafeAttributes.wifiAvailable ? 'High-Speed Free' : 'Unplugged'}
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E8E2D9]/80">
                    <PlugZap className="w-4 h-4 text-[#146C5B] mb-1.5" />
                    <p className="text-xs text-[#222222]/60">Power Outlets</p>
                    <p className="text-sm font-semibold text-[#222222]">
                      {venue.cafeAttributes.powerOutlets ? 'At Most Tables' : 'Limited'}
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E8E2D9]/80">
                    <Volume2 className="w-4 h-4 text-[#C5A46D] mb-1.5" />
                    <p className="text-xs text-[#222222]/60">Noise Level</p>
                    <p className="text-sm font-semibold text-[#222222]">
                      {venue.cafeAttributes.noiseLevel}
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E8E2D9]/80">
                    <Coffee className="w-4 h-4 text-[#146C5B] mb-1.5" />
                    <p className="text-xs text-[#222222]/60">Seating Style</p>
                    <p className="text-sm font-semibold text-[#222222]">
                      {venue.cafeAttributes.seatingComfort}
                    </p>
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap gap-x-6 gap-y-2 text-xs text-[#222222]/75">
                  <span>
                    Laptop-friendly: <strong>{venue.cafeAttributes.laptopFriendly ? 'Yes' : 'Social/Counter'}</strong>
                  </span>
                  <span>
                    Study-friendly: <strong>{venue.cafeAttributes.studyFriendly ? 'Yes' : 'Casual'}</strong>
                  </span>
                  <span>
                    Pet-friendly outdoor: <strong>{venue.cafeAttributes.petFriendly ? 'Yes' : 'No'}</strong>
                  </span>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#222222]/55 mb-1.5">
                    Coffee Specialties
                  </p>
                  <p className="text-sm text-[#222222]/85">
                    {venue.cafeAttributes.coffeeSpecialties.join(' · ')}
                  </p>
                </div>
              </section>
            )}

            {/* Popular Dishes & Facilities */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl border border-[#E8E2D9] p-6">
                <h2 className="font-serif text-xl font-semibold text-[#222222] mb-4">
                  Popular Dishes & Pours
                </h2>
                <ul className="space-y-2.5 text-sm text-[#222222]/80">
                  {venue.popularDishes.map((dish) => (
                    <li key={dish} className="flex items-center gap-2.5">
                      <Utensils className="w-4 h-4 text-[#C5A46D] shrink-0" aria-hidden="true" />
                      <span>{dish}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white rounded-2xl border border-[#E8E2D9] p-6">
                <h2 className="font-serif text-xl font-semibold text-[#222222] mb-4">
                  Facilities & Amenities
                </h2>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-sm text-[#222222]/80">
                  {facilityItems.map((item) => (
                    <li key={item.label} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#146C5B] shrink-0" aria-hidden="true" />
                      <span>{item.label}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* Menu Section */}
            <section id="menu" className="scroll-mt-24 space-y-6">
              <div className="flex items-baseline justify-between border-b border-[#E8E2D9] pb-3">
                <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#222222]">
                  Curated Menu Highlights
                </h2>
                <span className="text-xs text-[#222222]/60">Prices in AED</span>
              </div>

              <div className="space-y-8">
                {venue.menuSections.map((section) => (
                  <div key={section.id} className="space-y-4">
                    <h3 className="text-sm font-semibold uppercase tracking-widest text-[#146C5B]">
                      {section.title}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {section.items.map((item) => (
                        <div
                          key={item.id}
                          className="bg-white rounded-2xl border border-[#E8E2D9] p-4 flex gap-4 items-start"
                        >
                          {item.image && (
                            <div className="w-20 h-20 rounded-xl overflow-hidden bg-[#F3EFE8] shrink-0">
                              <ImageWithFallback
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="font-semibold text-sm text-[#222222]">
                                {item.name}
                              </h4>
                              <span className="text-sm font-semibold text-[#146C5B] tabular-nums shrink-0">
                                AED {item.priceAed}
                              </span>
                            </div>
                            <p className="mt-1 text-xs text-[#222222]/70 leading-relaxed">
                              {item.description}
                            </p>
                            {item.dietary && item.dietary.length > 0 && (
                              <p className="mt-2 text-[11px] font-medium text-[#C5A46D]">
                                {item.dietary.join(' · ')}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Opening Hours & Location Map Card */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl border border-[#E8E2D9] p-6">
                <h2 className="font-serif text-xl font-semibold text-[#222222] mb-4">
                  Opening Hours
                </h2>
                <dl className="space-y-2 text-sm">
                  {venue.openingHours.map((row) => (
                    <div
                      key={row.day}
                      className="flex items-center justify-between py-1 border-b border-[#E8E2D9]/50 last:border-0"
                    >
                      <dt className="text-[#222222]/75">{row.day}</dt>
                      <dd className="font-medium text-[#222222] tabular-nums">{row.hours}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              <div className="bg-white rounded-2xl border border-[#E8E2D9] p-6 flex flex-col justify-between gap-4">
                <div>
                  <h2 className="font-serif text-xl font-semibold text-[#222222] mb-2">
                    Location & Directions
                  </h2>
                  <p className="text-sm text-[#222222]/75">{venue.address}</p>
                  <p className="mt-1 text-xs text-[#222222]/55 tabular-nums">
                    GPS: {venue.coordinates.lat.toFixed(4)}° N, {venue.coordinates.lng.toFixed(4)}° E
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E8E2D9] text-xs text-[#222222]/70 space-y-2">
                  <p className="font-semibold text-[#222222]">
                    Interactive Map Preview
                  </p>
                  <p>
                    Configure <code className="px-1 py-0.5 bg-white rounded border border-[#E8E2D9]">VITE_GOOGLE_MAPS_API_KEY</code> to embed live Google Maps tiles here, or launch turn-by-turn directions directly.
                  </p>
                </div>

                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 rounded-xl bg-[#222222] hover:bg-black text-white text-sm font-semibold inline-flex items-center justify-center gap-2 transition-colors"
                >
                  <Navigation className="w-4 h-4" />
                  <span>Open in Google Maps</span>
                </a>
              </div>
            </section>

            {/* Reviews Section */}
            <section className="space-y-6 pt-4 border-t border-[#E8E2D9]">
              <div className="flex items-baseline justify-between">
                <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#222222]">
                  Guest Reviews
                </h2>
                <span className="text-sm font-semibold text-[#222222] tabular-nums">
                  {venue.rating.toFixed(1)} / 5.0
                </span>
              </div>

              {/* Add Review Form */}
              <form
                onSubmit={handleReviewSubmit}
                className="bg-white rounded-2xl border border-[#E8E2D9] p-6 space-y-4"
                noValidate
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="font-semibold text-sm text-[#222222]">
                    Share your experience
                  </h3>
                  <div className="flex items-center gap-3">
                    <select
                      value={reviewRating}
                      onChange={(e) => setReviewRating(Number(e.target.value))}
                      aria-label="Select star rating"
                      className="px-3 py-1.5 rounded-lg border border-[#E8E2D9] bg-[#FAF8F5] text-xs font-medium"
                    >
                      <option value={5}>5 Stars — Exceptional</option>
                      <option value={4}>4 Stars — Very Good</option>
                      <option value={3}>3 Stars — Good</option>
                      <option value={2}>2 Stars — Fair</option>
                    </select>
                    <select
                      value={reviewVisitType}
                      onChange={(e) => setReviewVisitType(e.target.value)}
                      aria-label="Select visit occasion"
                      className="px-3 py-1.5 rounded-lg border border-[#E8E2D9] bg-[#FAF8F5] text-xs font-medium"
                    >
                      <option value="Dinner">Dinner</option>
                      <option value="Date Night">Date Night</option>
                      <option value="Business Lunch">Business Lunch</option>
                      <option value="Coffee & Work">Coffee & Work</option>
                      <option value="Family Brunch">Family Brunch</option>
                    </select>
                  </div>
                </div>

                <textarea
                  rows={3}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder={
                    user
                      ? `Write your dining notes on ${venue.name}...`
                      : `Sign in to share your dining notes on ${venue.name}...`
                  }
                  className="w-full p-3.5 rounded-xl border border-[#E8E2D9] bg-[#FAF8F5] text-sm text-[#222222] focus:outline-none focus:border-[#146C5B]"
                />

                {reviewError && (
                  <p className="text-xs font-medium text-red-700">{reviewError}</p>
                )}

                <div className="flex items-center justify-between gap-4">
                  <span className="text-xs text-[#222222]/55">
                    {user ? `Posting as ${user.displayName}` : 'Sign-in required to publish reviews.'}
                  </span>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-[#146C5B] hover:bg-[#0F5548] text-white text-xs font-semibold transition-colors cursor-pointer"
                  >
                    {user ? 'Publish Review' : 'Sign In to Review'}
                  </button>
                </div>
              </form>

              <div className="space-y-4">
                {combinedReviews.map((review) => (
                  <article
                    key={review.id}
                    className="bg-white rounded-2xl border border-[#E8E2D9] p-5 space-y-2"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <h4 className="font-semibold text-sm text-[#222222]">
                          {review.authorName}
                        </h4>
                        <p className="text-xs text-[#222222]/55">
                          {review.authorRole ?? 'Guest'} · {review.date}
                          {review.visitType ? ` · ${review.visitType}` : ''}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 text-sm font-semibold text-[#222222] tabular-nums">
                        <Star className="w-4 h-4 fill-[#C5A46D] text-[#C5A46D]" />
                        <span>{review.rating.toFixed(1)}</span>
                      </div>
                    </div>
                    <p className="text-sm text-[#222222]/80 leading-relaxed">
                      {review.comment}
                    </p>
                  </article>
                ))}
              </div>
            </section>
          </div>

          {/* Right 4 cols: Sticky Action Card */}
          <aside className="lg:col-span-4 lg:sticky lg:top-24 space-y-5">
            <div className="bg-white rounded-2xl border border-[#E8E2D9] p-6 shadow-[0_8px_30px_rgba(34,34,34,0.06)] space-y-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-[#146C5B]">
                  Plan Your Visit
                </p>
                <p className="mt-1 font-serif text-2xl font-semibold text-[#222222]">
                  {venue.name}
                </p>
                <p className="mt-1 text-xs text-[#222222]/65">
                  {venue.area} · {venue.priceTier}
                </p>
              </div>

              <div className="space-y-2.5">
                <button
                  type="button"
                  onClick={() => setReservationModalOpen(true)}
                  className="w-full py-3 px-4 rounded-xl bg-[#146C5B] hover:bg-[#0F5548] text-white text-sm font-semibold inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <CalendarCheck className="w-4 h-4" />
                  <span>
                    {venue.facilities.reservationAvailable
                      ? 'Book a Table'
                      : 'Walk-in & Seating Info'}
                  </span>
                </button>

                <a
                  href="#menu"
                  className="w-full py-3 px-4 rounded-xl border border-[#E8E2D9] bg-[#FAF8F5] hover:bg-[#F3EFE8] text-[#222222] text-sm font-semibold inline-flex items-center justify-center gap-2 transition-colors"
                >
                  <Utensils className="w-4 h-4 text-[#146C5B]" />
                  <span>View Menu</span>
                </a>

                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 rounded-xl border border-[#E8E2D9] bg-white hover:bg-[#FAF8F5] text-[#222222] text-sm font-semibold inline-flex items-center justify-center gap-2 transition-colors"
                >
                  <Navigation className="w-4 h-4 text-[#146C5B]" />
                  <span>Get Directions</span>
                </a>

                <button
                  type="button"
                  onClick={handleCall}
                  className="w-full py-3 px-4 rounded-xl border border-[#E8E2D9] bg-white hover:bg-[#FAF8F5] text-[#222222] text-sm font-semibold inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Phone className="w-4 h-4 text-[#146C5B]" />
                  <span>Call {venue.venueKind === 'cafe' ? 'Café' : 'Restaurant'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => toggleFavorite(venue.id, venue.name)}
                  className={`w-full py-3 px-4 rounded-xl border text-sm font-semibold inline-flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                    favored
                      ? 'border-[#146C5B] bg-[#146C5B]/10 text-[#146C5B]'
                      : 'border-[#E8E2D9] bg-white hover:bg-[#FAF8F5] text-[#222222]'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${favored ? 'fill-[#146C5B]' : ''}`} />
                  <span>{favored ? 'Saved to Favorites' : 'Save to Favorites'}</span>
                </button>
              </div>

              <div className="pt-4 border-t border-[#E8E2D9] space-y-2 text-xs text-[#222222]/70">
                <p className="flex items-center justify-between gap-2">
                  <span>Telephone (Demo)</span>
                  <span className="font-medium text-[#222222] tabular-nums">{venue.phone}</span>
                </p>
                <p className="flex items-center justify-between gap-2">
                  <span>Official Link</span>
                  <button
                    type="button"
                    onClick={() =>
                      showToast(`Demonstration website reference: ${venue.websiteUrl}`)
                    }
                    className="inline-flex items-center gap-1 font-medium text-[#146C5B] hover:underline cursor-pointer"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>Visit Website</span>
                  </button>
                </p>
              </div>
            </div>
          </aside>
        </div>

        {/* Similar Places */}
        {similarVenues.length > 0 && (
          <section className="mt-16 pt-12 border-t border-[#E8E2D9]">
            <h2 className="font-serif text-3xl font-semibold text-[#222222] mb-8">
              Similar Destinations in Dubai
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
              {similarVenues.map((sim) => (
                <VenueCard
                  key={sim.id}
                  venue={sim}
                  showCafeMetrics={sim.venueKind === 'cafe'}
                />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Reservation / Walk-In Info Modal (Never fabricates live slot availability) */}
      <Modal
        isOpen={reservationModalOpen}
        onClose={() => setReservationModalOpen(false)}
        title={
          venue.facilities.reservationAvailable
            ? `Reservations at ${venue.name}`
            : `Visiting ${venue.name}`
        }
        subtitle={venue.area}
      >
        <div className="space-y-4 text-sm text-[#222222]/80 leading-relaxed">
          <p>{venue.reservationNote}</p>
          {venue.facilities.reservationAvailable && venue.reservationUrl ? (
            <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E8E2D9] space-y-3">
              <p className="text-xs text-[#222222]/70">
                DineDubai connects you directly to verified booking partners rather than inventing live table inventory.
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setReservationModalOpen(false);
                    showToast(`Demo partner reservation link: ${venue.reservationUrl}`);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-[#146C5B] hover:bg-[#0F5548] text-white text-xs font-semibold inline-flex items-center gap-2 cursor-pointer"
                >
                  <span>Proceed to Booking Partner</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setReservationModalOpen(false);
                    handleCall();
                  }}
                  className="px-4 py-2.5 rounded-xl border border-[#E8E2D9] bg-white text-xs font-semibold text-[#222222] cursor-pointer"
                >
                  Call Desk ({venue.phone})
                </button>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E8E2D9] space-y-2">
              <p className="font-semibold text-[#222222]">
                Walk-in & Direct Inquiries
              </p>
              <p className="text-xs text-[#222222]/70">
                This venue welcomes walk-in guests during opening hours ({venue.openingHoursText}). For large groups, call {venue.phone}.
              </p>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
