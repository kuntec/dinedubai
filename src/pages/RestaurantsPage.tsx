import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  LayoutGrid,
  List,
  Map as MapIcon,
  RotateCcw,
  Search,
  SlidersHorizontal,
} from 'lucide-react';
import {
  filterRestaurants,
  getCategories,
  getDistinctCuisines,
  getDistinctRestaurantTypes,
  getLocations,
} from '../services/dataService';
import { PriceTier, RestaurantFilterState, SortOption, Venue } from '../types/dining';
import { VenueCard } from '../components/common/VenueCard';
import { ImageWithFallback } from '../components/common/ImageWithFallback';

const PRICE_TIERS: PriceTier[] = ['AED 50–120', 'AED 120–250', 'AED 250–450', 'AED 450+'];

const DEFAULT_FILTERS: RestaurantFilterState = {
  query: '',
  area: 'all',
  cuisine: 'all',
  restaurantType: 'all',
  category: 'all',
  priceTier: 'all',
  minRating: 0,
  seating: 'all',
  familyFriendly: false,
  vegetarianOptions: false,
  halalOptions: false,
  parkingAvailable: false,
  openNow: false,
  reservationAvailable: false,
  sortBy: 'recommended',
};

export function RestaurantsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showMapSplit, setShowMapSplit] = useState(false);
  const [selectedMapVenue, setSelectedMapVenue] = useState<Venue | null>(null);
  const [showMoreFilters, setShowMoreFilters] = useState(false);

  const [filters, setFilters] = useState<RestaurantFilterState>(() => ({
    ...DEFAULT_FILTERS,
    query: searchParams.get('q') ?? '',
    area: searchParams.get('area') ?? 'all',
    cuisine: searchParams.get('cuisine') ?? 'all',
    category: searchParams.get('category') ?? 'all',
  }));

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      query: searchParams.get('q') ?? '',
      area: searchParams.get('area') ?? 'all',
      cuisine: searchParams.get('cuisine') ?? 'all',
      category: searchParams.get('category') ?? 'all',
    }));
  }, [searchParams]);

  const locations = getLocations();
  const cuisines = getDistinctCuisines('restaurant');
  const restaurantTypes = getDistinctRestaurantTypes();
  const categories = getCategories();

  // Include cafes if category is breakfast-brunch, desserts-bakeries, or healthy-food
  const includeCafes =
    filters.category === 'breakfast-brunch' ||
    filters.category === 'desserts-bakeries' ||
    filters.category === 'healthy-food' ||
    filters.query.trim().length > 0;

  const results = useMemo(
    () => filterRestaurants(filters, includeCafes),
    [filters, includeCafes]
  );

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.area !== 'all') count++;
    if (filters.cuisine !== 'all') count++;
    if (filters.restaurantType !== 'all') count++;
    if (filters.category !== 'all') count++;
    if (filters.priceTier !== 'all') count++;
    if (filters.minRating > 0) count++;
    if (filters.seating !== 'all') count++;
    if (filters.familyFriendly) count++;
    if (filters.vegetarianOptions) count++;
    if (filters.halalOptions) count++;
    if (filters.parkingAvailable) count++;
    if (filters.openNow) count++;
    if (filters.reservationAvailable) count++;
    return count;
  }, [filters]);

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setSearchParams({});
  };

  const toggleBoolFilter = (key: keyof RestaurantFilterState) => {
    setFilters((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const getMapCoords = (areaSlug: string) => {
    const loc = locations.find((l) => l.slug === areaSlug);
    return loc?.mapPosition ?? { x: 50, y: 50 };
  };

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-10 md:py-14">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-8 border-b border-[#E8E2D9]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#146C5B]">
              Dubai Dining Directory
            </p>
            <h1 className="mt-2 font-serif text-3xl sm:text-4xl font-semibold text-[#222222]">
              Discover Restaurants
            </h1>
            <p className="mt-2 text-sm sm:text-base text-[#222222]/70 max-w-2xl">
              From candlelit DIFC tasting rooms to waterfront family tables across Dubai’s ten culinary neighborhoods.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setShowMapSplit((v) => !v)}
              className={`px-3.5 py-2 rounded-xl border text-xs font-semibold inline-flex items-center gap-2 transition-colors cursor-pointer ${
                showMapSplit
                  ? 'bg-[#146C5B] text-white border-[#146C5B]'
                  : 'bg-white text-[#222222] border-[#E8E2D9] hover:border-[#146C5B]/50'
              }`}
            >
              <MapIcon className="w-4 h-4" />
              <span>{showMapSplit ? 'Hide Map' : 'Map View'}</span>
            </button>

            <div className="flex items-center p-1 bg-white border border-[#E8E2D9] rounded-xl">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                aria-label="Grid view"
                className={`p-2 rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-[#146C5B] text-white'
                    : 'text-[#222222]/65 hover:text-[#222222]'
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                aria-label="List view"
                className={`p-2 rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'list'
                    ? 'bg-[#146C5B] text-white'
                    : 'text-[#222222]/65 hover:text-[#222222]'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="mt-6 bg-white rounded-2xl border border-[#E8E2D9] p-4 sm:p-5 shadow-[0_4px_20px_rgba(34,34,34,0.03)] space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
            {/* Search Input */}
            <div className="lg:col-span-2 relative">
              <Search className="w-4 h-4 text-[#222222]/45 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={filters.query}
                onChange={(e) => setFilters({ ...filters, query: e.target.value })}
                placeholder="Search name, dish, cuisine..."
                aria-label="Filter restaurants by keyword"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#E8E2D9] bg-[#FAF8F5] text-sm text-[#222222] focus:outline-none focus:border-[#146C5B]"
              />
            </div>

            {/* Area */}
            <select
              value={filters.area}
              onChange={(e) => setFilters({ ...filters, area: e.target.value })}
              aria-label="Filter by location"
              className="px-3.5 py-2.5 rounded-xl border border-[#E8E2D9] bg-[#FAF8F5] text-sm text-[#222222] focus:outline-none focus:border-[#146C5B] cursor-pointer"
            >
              <option value="all">All Locations</option>
              {locations.map((loc) => (
                <option key={loc.id} value={loc.slug}>
                  {loc.name}
                </option>
              ))}
            </select>

            {/* Cuisine */}
            <select
              value={filters.cuisine}
              onChange={(e) => setFilters({ ...filters, cuisine: e.target.value })}
              aria-label="Filter by cuisine"
              className="px-3.5 py-2.5 rounded-xl border border-[#E8E2D9] bg-[#FAF8F5] text-sm text-[#222222] focus:outline-none focus:border-[#146C5B] cursor-pointer"
            >
              <option value="all">All Cuisines</option>
              {cuisines.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            {/* Price Tier */}
            <select
              value={filters.priceTier}
              onChange={(e) => setFilters({ ...filters, priceTier: e.target.value })}
              aria-label="Filter by price range"
              className="px-3.5 py-2.5 rounded-xl border border-[#E8E2D9] bg-[#FAF8F5] text-sm text-[#222222] focus:outline-none focus:border-[#146C5B] cursor-pointer"
            >
              <option value="all">All Price Tiers</option>
              {PRICE_TIERS.map((tier) => (
                <option key={tier} value={tier}>
                  {tier}
                </option>
              ))}
            </select>

            {/* Sort By */}
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as SortOption })}
              aria-label="Sort restaurants"
              className="px-3.5 py-2.5 rounded-xl border border-[#E8E2D9] bg-[#FAF8F5] text-sm font-medium text-[#222222] focus:outline-none focus:border-[#146C5B] cursor-pointer"
            >
              <option value="recommended">Sort: Recommended</option>
              <option value="highest-rated">Sort: Highest Rated</option>
              <option value="price-low">Sort: Price Low to High</option>
              <option value="price-high">Sort: Price High to Low</option>
              <option value="alphabetical">Sort: Alphabetical</option>
            </select>
          </div>

          {/* Expandable Advanced Filters */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#E8E2D9]/70">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setShowMoreFilters((v) => !v)}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-[#E8E2D9] bg-[#FAF8F5] hover:bg-[#F3EFE8] text-xs font-semibold text-[#222222] transition-colors cursor-pointer"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#146C5B]" />
                <span>More Filters</span>
                {activeFilterCount > 0 && (
                  <span className="tabular-nums text-[#146C5B]">({activeFilterCount})</span>
                )}
              </button>

              {(
                [
                  ['openNow', 'Open Now'],
                  ['reservationAvailable', 'Reservations'],
                  ['familyFriendly', 'Family-Friendly'],
                  ['vegetarianOptions', 'Vegetarian Options'],
                  ['halalOptions', 'Halal Options'],
                  ['parkingAvailable', 'Parking'],
                ] as const
              ).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => toggleBoolFilter(key)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-medium border transition-colors cursor-pointer ${
                    filters[key]
                      ? 'bg-[#146C5B] text-white border-[#146C5B]'
                      : 'bg-white text-[#222222]/80 border-[#E8E2D9] hover:border-[#146C5B]/40'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {activeFilterCount > 0 || filters.query ? (
              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#146C5B] hover:text-[#0F5548] cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset all</span>
              </button>
            ) : null}
          </div>

          {showMoreFilters && (
            <div className="pt-4 border-t border-[#E8E2D9] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#222222]/70 mb-1.5">
                  Category
                </label>
                <select
                  value={filters.category}
                  onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E2D9] bg-[#FAF8F5] text-sm"
                >
                  <option value="all">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.slug}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#222222]/70 mb-1.5">
                  Restaurant Type
                </label>
                <select
                  value={filters.restaurantType}
                  onChange={(e) => setFilters({ ...filters, restaurantType: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E2D9] bg-[#FAF8F5] text-sm"
                >
                  <option value="all">All Types</option>
                  {restaurantTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#222222]/70 mb-1.5">
                  Minimum Rating
                </label>
                <select
                  value={filters.minRating}
                  onChange={(e) =>
                    setFilters({ ...filters, minRating: Number(e.target.value) })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E2D9] bg-[#FAF8F5] text-sm"
                >
                  <option value={0}>Any Rating</option>
                  <option value={4.5}>4.5+ Stars</option>
                  <option value={4.7}>4.7+ Stars</option>
                  <option value={4.8}>4.8+ Stars</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#222222]/70 mb-1.5">
                  Seating Preference
                </label>
                <select
                  value={filters.seating}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      seating: e.target.value as RestaurantFilterState['seating'],
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E2D9] bg-[#FAF8F5] text-sm"
                >
                  <option value="all">Indoor & Outdoor</option>
                  <option value="indoor">Indoor Seating</option>
                  <option value="outdoor">Outdoor Terrace / Beach</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-[#222222]/70 tabular-nums">
            Showing <strong className="text-[#222222]">{results.length}</strong>{' '}
            {results.length === 1 ? 'destination' : 'destinations'} in Dubai
          </p>
        </div>

        {/* Optional Split Map Panel */}
        {showMapSplit && (
          <div className="mt-5 bg-white rounded-2xl border border-[#E8E2D9] p-4 sm:p-5 grid grid-cols-1 lg:grid-cols-12 gap-5">
            <div className="lg:col-span-8 relative h-[340px] rounded-xl overflow-hidden bg-gradient-to-br from-[#EFECE4] via-[#F7F4EE] to-[#E6EFEA] border border-[#E8E2D9]">
              <svg
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                className="absolute inset-0 w-full h-full opacity-55"
                aria-hidden="true"
              >
                <path
                  d="M0,78 Q22,60 40,42 T78,20 L100,10 L100,0 L0,0 Z"
                  fill="#D6E6E2"
                />
                <path
                  d="M8,88 L88,18"
                  stroke="#C5A46D"
                  strokeWidth="0.4"
                  strokeDasharray="1.5 1.5"
                  fill="none"
                />
              </svg>

              {results.map((venue, index) => {
                const base = getMapCoords(venue.areaSlug);
                const offsetX = ((index % 3) - 1) * 2.2;
                const offsetY = (Math.floor(index / 3) % 3 - 1) * 2.2;
                const active = selectedMapVenue?.id === venue.id;
                return (
                  <button
                    key={venue.id}
                    type="button"
                    onClick={() => setSelectedMapVenue(venue)}
                    style={{
                      left: `${Math.min(92, Math.max(8, base.x + offsetX))}%`,
                      top: `${Math.min(88, Math.max(12, base.y + offsetY))}%`,
                    }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 px-2.5 py-1 rounded-lg text-[11px] font-semibold shadow-md transition-transform cursor-pointer whitespace-nowrap ${
                      active
                        ? 'bg-[#222222] text-white scale-110 z-20'
                        : 'bg-white text-[#146C5B] border border-[#146C5B]/30 hover:scale-105 z-10'
                    }`}
                  >
                    {venue.name}
                  </button>
                );
              })}

              <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-[#E8E2D9] text-xs text-[#222222]/75">
                Interactive Dubai Neighborhood Preview ·{' '}
                <Link to="/map" className="font-semibold text-[#146C5B] underline">
                  Open full map view
                </Link>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col justify-between bg-[#FAF8F5] rounded-xl p-4 border border-[#E8E2D9]">
              {selectedMapVenue ? (
                <div className="space-y-3">
                  <div className="aspect-[4/3] rounded-xl overflow-hidden bg-[#F3EFE8]">
                    <ImageWithFallback
                      src={selectedMapVenue.heroImage}
                      alt={selectedMapVenue.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-xs text-[#222222]/60">
                      {selectedMapVenue.cuisine} · {selectedMapVenue.area}
                    </p>
                    <h3 className="font-serif text-xl font-semibold text-[#222222] mt-0.5">
                      {selectedMapVenue.name}
                    </h3>
                    <p className="text-xs text-[#222222]/70 mt-1 line-clamp-2">
                      {selectedMapVenue.shortDescription}
                    </p>
                  </div>
                  <Link
                    to={`/venue/${selectedMapVenue.slug}`}
                    className="block w-full py-2.5 rounded-xl bg-[#146C5B] hover:bg-[#0F5548] text-white text-xs font-semibold text-center transition-colors"
                  >
                    Open Restaurant Profile
                  </Link>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-4 text-sm text-[#222222]/65">
                  <MapIcon className="w-6 h-6 text-[#146C5B] mb-2" />
                  <p>Select any pin on the map to preview venue highlights and jump to its profile.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Results Grid / List or Empty State */}
        {results.length === 0 ? (
          <div className="mt-8 bg-white rounded-2xl border border-[#E8E2D9] p-12 text-center max-w-xl mx-auto">
            <h2 className="font-serif text-2xl font-semibold text-[#222222]">
              No matching restaurants found
            </h2>
            <p className="mt-2 text-sm text-[#222222]/70">
              Try loosening one or two filters—such as price range or neighborhood—to explore more culinary destinations in Dubai.
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="mt-6 px-5 py-2.5 rounded-xl bg-[#146C5B] hover:bg-[#0F5548] text-white text-sm font-semibold transition-colors cursor-pointer"
            >
              Clear All Filters
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {results.map((venue) => (
              <VenueCard key={venue.id} venue={venue} variant="grid" />
            ))}
          </div>
        ) : (
          <div className="mt-6 space-y-5">
            {results.map((venue) => (
              <VenueCard key={venue.id} venue={venue} variant="list" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
