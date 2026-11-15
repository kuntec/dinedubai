export type VenueKind = 'restaurant' | 'cafe';

export type PriceTier = 'AED 50–120' | 'AED 120–250' | 'AED 250–450' | 'AED 450+';

export type NoiseLevel = 'Quiet' | 'Moderate' | 'Lively';

export type SeatingComfort = 'Ergonomic Desk Seating' | 'Plush Lounge' | 'Bistro & Terrace' | 'Minimalist Counter';

export interface OpeningHour {
  day: string;
  hours: string;
  isOpen24?: boolean;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  priceAed: number;
  image?: string;
  dietary?: ('Vegetarian' | 'Vegan' | 'Gluten-Free' | 'Halal' | 'Signature')[];
}

export interface MenuSection {
  id: string;
  title: string;
  items: MenuItem[];
}

export interface Review {
  id: string;
  venueId: string;
  authorName: string;
  authorRole?: string;
  rating: number;
  date: string;
  comment: string;
  visitType?: string;
}

export interface VenueFacilities {
  indoorSeating: boolean;
  outdoorSeating: boolean;
  familyFriendly: boolean;
  vegetarianOptions: boolean;
  halalOptions: boolean;
  parkingAvailable: boolean;
  reservationAvailable: boolean;
  valetParking?: boolean;
  privateDining?: boolean;
  wheelchairAccessible?: boolean;
  scenicView?: string;
}

export interface CafeAttributes {
  wifiAvailable: boolean;
  powerOutlets: boolean;
  seatingComfort: SeatingComfort;
  noiseLevel: NoiseLevel;
  averageCoffeePriceAed: number;
  laptopFriendly: boolean;
  outdoorSeating: boolean;
  petFriendly: boolean;
  studyFriendly: boolean;
  instagramWorthy: boolean;
  specialtyCoffee: boolean;
  dessertCafe: boolean;
  coffeeSpecialties: string[];
}

export interface Venue {
  id: string;
  slug: string;
  name: string;
  venueKind: VenueKind;
  cuisine: string;
  secondaryCuisine?: string;
  categorySlugs: string[];
  restaurantType: string;
  area: string;
  areaSlug: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  priceTier: PriceTier;
  averagePriceForTwoAed: number;
  rating: number;
  reviewCount: number;
  shortDescription: string;
  editorialDescription: string;
  heroImage: string;
  galleryImages: string[];
  featured: boolean;
  trending: boolean;
  isDemoListing: boolean;
  openTime24: number; // e.g., 8 for 08:00
  closeTime24: number; // e.g., 24 for 00:00, 26 for 02:00 next day
  openingHoursText: string;
  openingHours: OpeningHour[];
  facilities: VenueFacilities;
  cafeAttributes?: CafeAttributes;
  popularDishes: string[];
  menuSections: MenuSection[];
  reviews: Review[];
  phone: string;
  websiteUrl: string;
  reservationUrl?: string;
  reservationNote: string;
  collectionSlugs: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CategoryItem {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  image: string;
  targetKind: 'all' | 'restaurant' | 'cafe';
}

export interface LocationArea {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  image: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  mapPosition: {
    x: number; // percentage 0-100 on Dubai map canvas
    y: number; // percentage 0-100 on Dubai map canvas
  };
}

export interface Collection {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  editorialIntro: string;
  curatorName: string;
  coverImage: string;
  venueIds: string[];
}

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  avatarInitials: string;
  preferredAreas: string[];
  dietaryPreferences: string[];
  authProvider: 'google' | 'email';
}

export type SortOption =
  | 'recommended'
  | 'highest-rated'
  | 'price-low'
  | 'price-high'
  | 'alphabetical';

export interface RestaurantFilterState {
  query: string;
  area: string;
  cuisine: string;
  restaurantType: string;
  category: string;
  priceTier: string;
  minRating: number;
  seating: 'all' | 'indoor' | 'outdoor';
  familyFriendly: boolean;
  vegetarianOptions: boolean;
  halalOptions: boolean;
  parkingAvailable: boolean;
  openNow: boolean;
  reservationAvailable: boolean;
  sortBy: SortOption;
}

export type CafeQuickFilter =
  | 'all'
  | 'specialty-coffee'
  | 'work-friendly'
  | 'quiet'
  | 'outdoor'
  | 'pet-friendly'
  | 'dessert'
  | 'instagram-worthy'
  | 'wifi'
  | 'study-friendly';

export interface CafeFilterState {
  query: string;
  area: string;
  quickFilter: CafeQuickFilter;
  noiseLevel: string;
  maxCoffeePrice: number;
  sortBy: SortOption;
}
