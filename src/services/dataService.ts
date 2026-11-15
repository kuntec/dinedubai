import { ALL_VENUES } from '../data/venues';
import { RESTAURANTS_DATA } from '../data/restaurants';
import { CAFES_DATA } from '../data/cafes';
import { DUBAI_LOCATIONS } from '../data/locations';
import { BROWSE_CATEGORIES } from '../data/categories';
import { CURATED_COLLECTIONS } from '../data/collections';
import {
  CafeFilterState,
  CategoryItem,
  Collection,
  LocationArea,
  RestaurantFilterState,
  SortOption,
  Venue,
} from '../types/dining';

export function getDubaiCurrentHour24(): number {
  try {
    const dubaiTimeStr = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Dubai',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(new Date());
    const [h, m] = dubaiTimeStr.split(':').map(Number);
    return h + m / 60;
  } catch {
    const now = new Date();
    return now.getHours() + now.getMinutes() / 60;
  }
}

export function isVenueOpenNow(venue: Venue): boolean {
  const currentHour = getDubaiCurrentHour24();
  // Adjust after-midnight hours (e.g. 01:00 = 25)
  const adjustedCurrent = currentHour < 4 ? currentHour + 24 : currentHour;
  return adjustedCurrent >= venue.openTime24 && adjustedCurrent <= venue.closeTime24;
}

export function getAllVenues(): Venue[] {
  return ALL_VENUES;
}

export function getAllRestaurants(): Venue[] {
  return RESTAURANTS_DATA;
}

export function getAllCafes(): Venue[] {
  return CAFES_DATA;
}

export function getFeaturedRestaurants(): Venue[] {
  return RESTAURANTS_DATA.filter((v) => v.featured).slice(0, 6);
}

export function getTrendingVenues(): Venue[] {
  return ALL_VENUES.filter((v) => v.trending);
}

export function getVenueBySlug(slug: string): Venue | undefined {
  return ALL_VENUES.find((v) => v.slug === slug);
}

export function getVenueById(id: string): Venue | undefined {
  return ALL_VENUES.find((v) => v.id === id);
}

export function getLocations(): LocationArea[] {
  return DUBAI_LOCATIONS;
}

export function getCategories(): CategoryItem[] {
  return BROWSE_CATEGORIES;
}

export function getCollections(): Collection[] {
  return CURATED_COLLECTIONS;
}

export function getCollectionBySlug(slug: string): Collection | undefined {
  return CURATED_COLLECTIONS.find((c) => c.slug === slug);
}

export function getVenuesForCollection(collection: Collection): Venue[] {
  return collection.venueIds
    .map((id) => ALL_VENUES.find((v) => v.id === id))
    .filter((v): v is Venue => Boolean(v));
}

export function getVenueCountByLocation(areaSlug: string): number {
  return ALL_VENUES.filter((v) => v.areaSlug === areaSlug).length;
}

export function getDistinctCuisines(kind?: 'restaurant' | 'cafe'): string[] {
  const source = kind === 'restaurant' ? RESTAURANTS_DATA : kind === 'cafe' ? CAFES_DATA : ALL_VENUES;
  return Array.from(new Set(source.map((v) => v.cuisine))).sort();
}

export function getDistinctRestaurantTypes(): string[] {
  return Array.from(new Set(RESTAURANTS_DATA.map((v) => v.restaurantType))).sort();
}

export function sortVenues(venues: Venue[], sortBy: SortOption): Venue[] {
  const copy = [...venues];
  switch (sortBy) {
    case 'highest-rated':
      return copy.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
    case 'price-low':
      return copy.sort((a, b) => a.averagePriceForTwoAed - b.averagePriceForTwoAed);
    case 'price-high':
      return copy.sort((a, b) => b.averagePriceForTwoAed - a.averagePriceForTwoAed);
    case 'alphabetical':
      return copy.sort((a, b) => a.name.localeCompare(b.name));
    case 'recommended':
    default:
      return copy.sort((a, b) => {
        const aScore = (a.featured ? 2 : 0) + (a.trending ? 1 : 0) + a.rating;
        const bScore = (b.featured ? 2 : 0) + (b.trending ? 1 : 0) + b.rating;
        return bScore - aScore;
      });
  }
}

export function filterRestaurants(filters: RestaurantFilterState, includeCafes = false): Venue[] {
  const base = includeCafes ? ALL_VENUES : RESTAURANTS_DATA;
  const q = filters.query.trim().toLowerCase();

  const filtered = base.filter((v) => {
    if (q) {
      const hay = [
        v.name,
        v.cuisine,
        v.secondaryCuisine ?? '',
        v.area,
        v.restaurantType,
        v.shortDescription,
        ...v.popularDishes,
      ]
        .join(' ')
        .toLowerCase();
      if (!hay.includes(q)) return false;
    }

    if (filters.area !== 'all' && v.areaSlug !== filters.area) return false;
    if (filters.cuisine !== 'all' && v.cuisine !== filters.cuisine) return false;
    if (filters.restaurantType !== 'all' && v.restaurantType !== filters.restaurantType) return false;
    if (filters.category !== 'all' && !v.categorySlugs.includes(filters.category)) return false;
    if (filters.priceTier !== 'all' && v.priceTier !== filters.priceTier) return false;
    if (filters.minRating > 0 && v.rating < filters.minRating) return false;

    if (filters.seating === 'indoor' && !v.facilities.indoorSeating) return false;
    if (filters.seating === 'outdoor' && !v.facilities.outdoorSeating) return false;

    if (filters.familyFriendly && !v.facilities.familyFriendly) return false;
    if (filters.vegetarianOptions && !v.facilities.vegetarianOptions) return false;
    if (filters.halalOptions && !v.facilities.halalOptions) return false;
    if (filters.parkingAvailable && !v.facilities.parkingAvailable) return false;
    if (filters.reservationAvailable && !v.facilities.reservationAvailable) return false;
    if (filters.openNow && !isVenueOpenNow(v)) return false;

    return true;
  });

  return sortVenues(filtered, filters.sortBy);
}

export function filterCafes(filters: CafeFilterState): Venue[] {
  const q = filters.query.trim().toLowerCase();

  const filtered = CAFES_DATA.filter((v) => {
    const attrs = v.cafeAttributes;
    if (!attrs) return false;

    if (q) {
      const hay = [
        v.name,
        v.cuisine,
        v.area,
        v.shortDescription,
        ...attrs.coffeeSpecialties,
        ...v.popularDishes,
      ]
        .join(' ')
        .toLowerCase();
      if (!hay.includes(q)) return false;
    }

    if (filters.area !== 'all' && v.areaSlug !== filters.area) return false;
    if (filters.noiseLevel !== 'all' && attrs.noiseLevel !== filters.noiseLevel) return false;
    if (filters.maxCoffeePrice > 0 && attrs.averageCoffeePriceAed > filters.maxCoffeePrice) return false;

    switch (filters.quickFilter) {
      case 'specialty-coffee':
        if (!attrs.specialtyCoffee) return false;
        break;
      case 'work-friendly':
        if (!attrs.laptopFriendly || !attrs.wifiAvailable) return false;
        break;
      case 'quiet':
        if (attrs.noiseLevel !== 'Quiet') return false;
        break;
      case 'outdoor':
        if (!attrs.outdoorSeating) return false;
        break;
      case 'pet-friendly':
        if (!attrs.petFriendly) return false;
        break;
      case 'dessert':
        if (!attrs.dessertCafe) return false;
        break;
      case 'instagram-worthy':
        if (!attrs.instagramWorthy) return false;
        break;
      case 'wifi':
        if (!attrs.wifiAvailable) return false;
        break;
      case 'study-friendly':
        if (!attrs.studyFriendly) return false;
        break;
      case 'all':
      default:
        break;
    }

    return true;
  });

  return sortVenues(filtered, filters.sortBy);
}

export function getSimilarVenues(venue: Venue, limit = 3): Venue[] {
  return ALL_VENUES.filter((candidate) => candidate.id !== venue.id)
    .map((candidate) => {
      let score = 0;
      if (candidate.venueKind === venue.venueKind) score += 3;
      if (candidate.areaSlug === venue.areaSlug) score += 2;
      if (candidate.cuisine === venue.cuisine) score += 3;
      if (candidate.priceTier === venue.priceTier) score += 1;
      const sharedCategories = candidate.categorySlugs.filter((slug) =>
        venue.categorySlugs.includes(slug)
      ).length;
      score += sharedCategories;
      return { candidate, score };
    })
    .sort((a, b) => b.score - a.score || b.candidate.rating - a.candidate.rating)
    .slice(0, limit)
    .map((item) => item.candidate);
}
