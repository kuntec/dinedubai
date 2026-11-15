import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Info, MapPin, Navigation, Star } from 'lucide-react';
import { getAllVenues, getDistinctCuisines, getLocations } from '../services/dataService';
import { Venue } from '../types/dining';
import { ImageWithFallback } from '../components/common/ImageWithFallback';

export function MapPage() {
  const allVenues = getAllVenues();
  const locations = getLocations();
  const cuisines = getDistinctCuisines();

  const [kindFilter, setKindFilter] = useState<'all' | 'restaurant' | 'cafe'>('all');
  const [areaFilter, setAreaFilter] = useState('all');
  const [cuisineFilter, setCuisineFilter] = useState('all');
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(allVenues[0] ?? null);

  const filteredVenues = useMemo(() => {
    return allVenues.filter((v) => {
      if (kindFilter !== 'all' && v.venueKind !== kindFilter) return false;
      if (areaFilter !== 'all' && v.areaSlug !== areaFilter) return false;
      if (cuisineFilter !== 'all' && v.cuisine !== cuisineFilter) return false;
      return true;
    });
  }, [allVenues, kindFilter, areaFilter, cuisineFilter]);

  const getPinCoordinates = (venue: Venue, index: number) => {
    const loc = locations.find((l) => l.slug === venue.areaSlug);
    const base = loc?.mapPosition ?? { x: 50, y: 50 };
    const ringAngle = (index * 137.5 * Math.PI) / 180;
    const radius = ((index % 4) + 1) * 1.4;
    return {
      x: Math.min(91, Math.max(9, base.x + Math.cos(ringAngle) * radius)),
      y: Math.min(89, Math.max(11, base.y + Math.sin(ringAngle) * radius)),
    };
  };

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-10 md:py-14">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#E8E2D9]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#146C5B]">
              Interactive Neighborhood Explorer
            </p>
            <h1 className="mt-2 font-serif text-3xl sm:text-4xl font-semibold text-[#222222]">
              Dubai Dining Map
            </h1>
            <p className="mt-2 text-sm text-[#222222]/70 max-w-2xl">
              Explore restaurants and specialty cafés across Dubai’s coastline, financial district, and creekside heritage neighborhoods.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center p-1 bg-white border border-[#E8E2D9] rounded-xl">
              {(
                [
                  ['all', 'All Places'],
                  ['restaurant', 'Restaurants'],
                  ['cafe', 'Cafés'],
                ] as const
              ).map(([val, label]) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setKindFilter(val)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    kindFilter === val
                      ? 'bg-[#146C5B] text-white'
                      : 'text-[#222222]/70 hover:text-[#222222]'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <select
              value={areaFilter}
              onChange={(e) => setAreaFilter(e.target.value)}
              aria-label="Filter map by area"
              className="px-3.5 py-2 rounded-xl border border-[#E8E2D9] bg-white text-xs font-medium text-[#222222]"
            >
              <option value="all">All Dubai Areas</option>
              {locations.map((loc) => (
                <option key={loc.id} value={loc.slug}>
                  {loc.name}
                </option>
              ))}
            </select>

            <select
              value={cuisineFilter}
              onChange={(e) => setCuisineFilter(e.target.value)}
              aria-label="Filter map by cuisine"
              className="px-3.5 py-2 rounded-xl border border-[#E8E2D9] bg-white text-xs font-medium text-[#222222]"
            >
              <option value="all">All Cuisines</option>
              {cuisines.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Google Maps Credentials Setup Placeholder Notice */}
        <div className="bg-white rounded-2xl border border-[#E8E2D9] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#222222]/75">
          <div className="flex items-start sm:items-center gap-2.5">
            <Info className="w-4 h-4 text-[#146C5B] shrink-0 mt-0.5 sm:mt-0" />
            <span>
              <strong>Interactive Coastal Preview Active:</strong> Live Google Maps JavaScript tiles load automatically once <code className="px-1.5 py-0.5 rounded bg-[#FAF8F5] border border-[#E8E2D9]">VITE_GOOGLE_MAPS_API_KEY</code> is configured in your environment. Every pin still links directly to turn-by-turn Google Maps directions.
            </span>
          </div>
          <span className="font-semibold text-[#146C5B] tabular-nums shrink-0">
            {filteredVenues.length} markers shown
          </span>
        </div>

        {/* Map Canvas + Preview Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          <div className="lg:col-span-8 relative min-h-[460px] sm:min-h-[560px] rounded-2xl overflow-hidden bg-gradient-to-br from-[#EDE9DF] via-[#F6F3EC] to-[#E2ECE8] border border-[#E8E2D9] shadow-sm">
            {/* Stylized Dubai Coastline & Landmarks */}
            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className="absolute inset-0 w-full h-full"
              aria-hidden="true"
            >
              {/* Arabian Gulf Water */}
              <path
                d="M0,100 L0,0 L76,0 C60,18 42,35 28,55 C16,72 8,85 0,100 Z"
                fill="#D4E5E2"
              />
              {/* Palm Jumeirah silhouette */}
              <circle cx="25" cy="64" r="6.5" fill="#F3EFE8" stroke="#C5A46D" strokeWidth="0.35" />
              {/* Dubai Creek */}
              <path
                d="M74,20 Q78,28 84,34 T96,42"
                stroke="#BBD6D2"
                strokeWidth="2.5"
                fill="none"
              />
              {/* Sheikh Zayed Road corridor */}
              <path
                d="M12,92 L88,16"
                stroke="#C5A46D"
                strokeWidth="0.45"
                strokeDasharray="1.8 1.5"
                fill="none"
              />
            </svg>

            {/* Neighborhood labels */}
            {locations.map((loc) => (
              <button
                key={loc.id}
                type="button"
                onClick={() => setAreaFilter(areaFilter === loc.slug ? 'all' : loc.slug)}
                style={{ left: `${loc.mapPosition.x}%`, top: `${loc.mapPosition.y}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 text-[10px] font-semibold uppercase tracking-widest text-[#222222]/45 hover:text-[#146C5B] pointer-events-auto cursor-pointer"
              >
                {loc.name}
              </button>
            ))}

            {/* Venue Markers */}
            {filteredVenues.map((venue, idx) => {
              const pos = getPinCoordinates(venue, idx);
              const isSelected = selectedVenue?.id === venue.id;
              return (
                <button
                  key={venue.id}
                  type="button"
                  onClick={() => setSelectedVenue(venue)}
                  style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                  aria-label={`Select ${venue.name} in ${venue.area}`}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 transition-all cursor-pointer flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold shadow-md whitespace-nowrap ${
                    isSelected
                      ? 'bg-[#222222] text-white scale-110 z-30 ring-2 ring-[#C5A46D]'
                      : venue.venueKind === 'cafe'
                      ? 'bg-white text-[#C5A46D] border border-[#C5A46D]/60 hover:scale-105 z-10'
                      : 'bg-[#146C5B] text-white hover:scale-105 z-20'
                  }`}
                >
                  <MapPin className="w-3 h-3 shrink-0" />
                  <span className="max-w-[110px] truncate">{venue.name}</span>
                </button>
              );
            })}

            {/* Legend */}
            <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-xl border border-[#E8E2D9] px-3.5 py-2 flex items-center gap-4 text-[11px] font-medium text-[#222222]">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#146C5B]" />
                Restaurants
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#C5A46D]" />
                Cafés
              </span>
            </div>
          </div>

          {/* Right Preview + Scrollable List */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            {selectedVenue && (
              <div className="bg-white rounded-2xl border border-[#E8E2D9] p-5 shadow-sm space-y-4">
                <div className="aspect-[16/10] rounded-xl overflow-hidden bg-[#F3EFE8]">
                  <ImageWithFallback
                    src={selectedVenue.heroImage}
                    alt={selectedVenue.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-medium text-[#222222]/60">
                      {selectedVenue.cuisine} · {selectedVenue.area}
                    </p>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#222222] tabular-nums">
                      <Star className="w-3.5 h-3.5 fill-[#C5A46D] text-[#C5A46D]" />
                      {selectedVenue.rating.toFixed(1)}
                    </span>
                  </div>
                  <h2 className="mt-1 font-serif text-2xl font-semibold text-[#222222]">
                    {selectedVenue.name}
                  </h2>
                  <p className="mt-1.5 text-xs text-[#222222]/70 leading-relaxed">
                    {selectedVenue.shortDescription}
                  </p>
                  <p className="mt-2 text-xs font-medium text-[#222222]/80 tabular-nums">
                    {selectedVenue.priceTier} · {selectedVenue.openingHoursText}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2.5 pt-2">
                  <Link
                    to={`/venue/${selectedVenue.slug}`}
                    className="py-2.5 px-3 rounded-xl bg-[#146C5B] hover:bg-[#0F5548] text-white text-xs font-semibold text-center transition-colors"
                  >
                    View Details
                  </Link>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${selectedVenue.coordinates.lat},${selectedVenue.coordinates.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 px-3 rounded-xl border border-[#E8E2D9] bg-[#FAF8F5] hover:bg-[#F3EFE8] text-[#222222] text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Directions</span>
                  </a>
                </div>
              </div>
            )}

            <div className="bg-white rounded-2xl border border-[#E8E2D9] p-4 flex-1 max-h-[260px] overflow-y-auto space-y-2">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-[#222222]/55 px-1">
                Matching Venues ({filteredVenues.length})
              </h3>
              {filteredVenues.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setSelectedVenue(v)}
                  className={`w-full text-left p-2.5 rounded-xl transition-colors flex items-center justify-between gap-3 cursor-pointer ${
                    selectedVenue?.id === v.id
                      ? 'bg-[#146C5B]/10 text-[#146C5B]'
                      : 'hover:bg-[#FAF8F5] text-[#222222]'
                  }`}
                >
                  <div className="min-w-0">
                    <p className="text-sm font-semibold truncate">{v.name}</p>
                    <p className="text-xs opacity-70 truncate">
                      {v.area} · {v.cuisine}
                    </p>
                  </div>
                  <span className="text-xs font-semibold tabular-nums shrink-0">
                    {v.rating.toFixed(1)}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
