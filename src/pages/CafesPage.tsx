import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Coffee, LayoutGrid, List, RotateCcw, Search } from 'lucide-react';
import { filterCafes, getLocations } from '../services/dataService';
import { CafeFilterState, CafeQuickFilter, SortOption } from '../types/dining';
import { VenueCard } from '../components/common/VenueCard';

const CAFE_TABS: { id: CafeQuickFilter; label: string }[] = [
  { id: 'all', label: 'All Cafés' },
  { id: 'specialty-coffee', label: 'Specialty Coffee' },
  { id: 'work-friendly', label: 'Work-Friendly' },
  { id: 'quiet', label: 'Quiet Cafés' },
  { id: 'outdoor', label: 'Outdoor Cafés' },
  { id: 'pet-friendly', label: 'Pet-Friendly' },
  { id: 'dessert', label: 'Dessert Cafés' },
  { id: 'instagram-worthy', label: 'Instagram-Worthy' },
  { id: 'wifi', label: 'With Wi-Fi' },
  { id: 'study-friendly', label: 'Study-Friendly' },
];

const DEFAULT_CAFE_FILTERS: CafeFilterState = {
  query: '',
  area: 'all',
  quickFilter: 'all',
  noiseLevel: 'all',
  maxCoffeePrice: 0,
  sortBy: 'recommended',
};

export function CafesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const [filters, setFilters] = useState<CafeFilterState>(() => ({
    ...DEFAULT_CAFE_FILTERS,
    query: searchParams.get('q') ?? '',
    area: searchParams.get('area') ?? 'all',
    quickFilter: (searchParams.get('filter') as CafeQuickFilter) || 'all',
  }));

  useEffect(() => {
    const q = searchParams.get('q') ?? '';
    const area = searchParams.get('area') ?? 'all';
    const quick = (searchParams.get('filter') as CafeQuickFilter) || 'all';
    setFilters((prev) => ({
      ...prev,
      query: q,
      area,
      quickFilter: quick,
    }));
  }, [searchParams]);

  const locations = getLocations();
  const results = useMemo(() => filterCafes(filters), [filters]);

  const resetFilters = () => {
    setFilters(DEFAULT_CAFE_FILTERS);
    setSearchParams({});
  };

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-10 md:py-14">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-8 border-b border-[#E8E2D9]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#146C5B]">
              Roasteries, Bakeries & Study Studios
            </p>
            <h1 className="mt-2 font-serif text-3xl sm:text-4xl font-semibold text-[#222222]">
              Dubai Specialty Cafés
            </h1>
            <p className="mt-2 text-sm sm:text-base text-[#222222]/70 max-w-2xl">
              Discover quiet remote-work sanctuaries, third-wave pour-over counters, ceremonial matcha bars, and sunlit villa cafés with verified Wi-Fi and outlet specs.
            </p>
          </div>

          <div className="flex items-center p-1 bg-white border border-[#E8E2D9] rounded-xl self-start md:self-auto">
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

        {/* Dedicated Café Discovery Quick Tabs */}
        <div className="mt-6 flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
          {CAFE_TABS.map((tab) => {
            const active = filters.quickFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilters({ ...filters, quickFilter: tab.id })}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 border transition-colors cursor-pointer ${
                  active
                    ? 'bg-[#146C5B] text-white border-[#146C5B]'
                    : 'bg-white text-[#222222]/80 border-[#E8E2D9] hover:border-[#146C5B]/50'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Detailed Café Attribute Filters */}
        <div className="mt-4 bg-white rounded-2xl border border-[#E8E2D9] p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-[#222222]/45 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={filters.query}
              onChange={(e) => setFilters({ ...filters, query: e.target.value })}
              placeholder="Coffee, matcha, pastry, name..."
              aria-label="Search cafés"
              className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#E8E2D9] bg-[#FAF8F5] text-sm text-[#222222] focus:outline-none focus:border-[#146C5B]"
            />
          </div>

          <select
            value={filters.area}
            onChange={(e) => setFilters({ ...filters, area: e.target.value })}
            aria-label="Filter café by area"
            className="px-3.5 py-2.5 rounded-xl border border-[#E8E2D9] bg-[#FAF8F5] text-sm text-[#222222] cursor-pointer"
          >
            <option value="all">All Dubai Locations</option>
            {locations.map((loc) => (
              <option key={loc.id} value={loc.slug}>
                {loc.name}
              </option>
            ))}
          </select>

          <select
            value={filters.noiseLevel}
            onChange={(e) => setFilters({ ...filters, noiseLevel: e.target.value })}
            aria-label="Filter by noise level"
            className="px-3.5 py-2.5 rounded-xl border border-[#E8E2D9] bg-[#FAF8F5] text-sm text-[#222222] cursor-pointer"
          >
            <option value="all">Any Noise Level</option>
            <option value="Quiet">Quiet (Focus & Reading)</option>
            <option value="Moderate">Moderate Ambient Buzz</option>
            <option value="Lively">Lively & Social</option>
          </select>

          <select
            value={filters.maxCoffeePrice}
            onChange={(e) => setFilters({ ...filters, maxCoffeePrice: Number(e.target.value) })}
            aria-label="Maximum coffee price"
            className="px-3.5 py-2.5 rounded-xl border border-[#E8E2D9] bg-[#FAF8F5] text-sm text-[#222222] cursor-pointer"
          >
            <option value={0}>Any Coffee Price</option>
            <option value={25}>Coffee up to AED 25</option>
            <option value={30}>Coffee up to AED 30</option>
            <option value={35}>Coffee up to AED 35</option>
          </select>

          <select
            value={filters.sortBy}
            onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as SortOption })}
            aria-label="Sort cafés"
            className="px-3.5 py-2.5 rounded-xl border border-[#E8E2D9] bg-[#FAF8F5] text-sm font-medium text-[#222222] cursor-pointer"
          >
            <option value="recommended">Sort: Recommended</option>
            <option value="highest-rated">Sort: Highest Rated</option>
            <option value="price-low">Sort: Price Low to High</option>
            <option value="alphabetical">Sort: Alphabetical</option>
          </select>
        </div>

        {/* Count & Reset */}
        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-[#222222]/70 tabular-nums">
            Showing <strong className="text-[#222222]">{results.length}</strong> specialty{' '}
            {results.length === 1 ? 'café' : 'cafés'}
          </p>

          {(filters.quickFilter !== 'all' ||
            filters.area !== 'all' ||
            filters.noiseLevel !== 'all' ||
            filters.maxCoffeePrice > 0 ||
            filters.query) && (
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#146C5B] hover:text-[#0F5548] cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset café filters</span>
            </button>
          )}
        </div>

        {/* Results */}
        {results.length === 0 ? (
          <div className="mt-8 bg-white rounded-2xl border border-[#E8E2D9] p-12 text-center max-w-xl mx-auto">
            <Coffee className="w-8 h-8 text-[#146C5B] mx-auto mb-3" />
            <h2 className="font-serif text-2xl font-semibold text-[#222222]">
              No cafés match these criteria
            </h2>
            <p className="mt-2 text-sm text-[#222222]/70">
              Try switching neighborhoods or broadening your noise or price filter to explore more Dubai coffee studios.
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="mt-6 px-5 py-2.5 rounded-xl bg-[#146C5B] hover:bg-[#0F5548] text-white text-sm font-semibold cursor-pointer"
            >
              Show All 15 Cafés
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {results.map((cafe) => (
              <VenueCard key={cafe.id} venue={cafe} variant="grid" showCafeMetrics />
            ))}
          </div>
        ) : (
          <div className="mt-6 space-y-5">
            {results.map((cafe) => (
              <VenueCard key={cafe.id} venue={cafe} variant="list" showCafeMetrics />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
