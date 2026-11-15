import { Collection } from '../types/dining';
import { VENUE_IMAGES } from './images';

export const CURATED_COLLECTIONS: Collection[] = [
  {
    id: 'col-date-night',
    slug: 'best-date-night-restaurants',
    title: 'Best Date Night Restaurants',
    subtitle: 'Candlelit rooms, skyline terraces, and unhurried tasting courses.',
    editorialIntro:
      'From intimate Downtown terraces framed by shimmering pools to softly lit Japanese counters in DIFC, these dining rooms set an unforgettable evening pace.',
    curatorName: 'Layla Al Hashimi',
    coverImage: VENUE_IMAGES.heroDubaiDining,
    venueIds: ['rest-1', 'rest-3', 'rest-5', 'rest-8', 'rest-14'],
  },
  {
    id: 'col-instagram-cafes',
    slug: 'instagram-worthy-cafes',
    title: 'Instagram-Worthy Cafés',
    subtitle: 'Travertine espresso bars, sunlit villas, and sculptural pastries.',
    editorialIntro:
      'Architecture meets craft roasting across Jumeirah and Alserkal-inspired spaces where natural daylight and ceramic tableware elevate your morning ritual.',
    curatorName: 'Nadia Mansour',
    coverImage: VENUE_IMAGES.specialtyCafe,
    venueIds: ['cafe-1', 'cafe-3', 'cafe-6', 'cafe-9', 'cafe-12'],
  },
  {
    id: 'col-business-lunch',
    slug: 'best-business-lunches',
    title: 'Best Business Lunches',
    subtitle: 'Crisp service and polished three-course menus in DIFC & Downtown.',
    editorialIntro:
      'Designed for ninety-minute meetings that require acoustic calm, thoughtful pacing, and seasonal menus that impress without slowing down the afternoon.',
    curatorName: 'Tariq Al Mazrouei',
    coverImage: VENUE_IMAGES.fineDining,
    venueIds: ['rest-2', 'rest-4', 'rest-7', 'rest-11'],
  },
  {
    id: 'col-hidden-gems',
    slug: 'hidden-gems-in-dubai',
    title: 'Hidden Gems in Dubai',
    subtitle: 'Courtyard kitchens, creekside bakeries, and quiet neighborhood treasures.',
    editorialIntro:
      'Step off the main boulevards into sandstone courtyards in Al Seef, spice-scented kitchens in Deira, and tucked-away roasteries known mostly to regulars.',
    curatorName: 'Saeed Al Qasimi',
    coverImage: VENUE_IMAGES.levantineHeritage,
    venueIds: ['rest-9', 'rest-13', 'rest-17', 'rest-19', 'cafe-4', 'cafe-11'],
  },
  {
    id: 'col-sunset-dining',
    slug: 'best-sunset-dining-spots',
    title: 'Best Sunset Dining Spots',
    subtitle: 'West-facing beachfront decks and golden-hour rooftop tables.',
    editorialIntro:
      'Watch the Arabian Gulf turn amber over grilled sea bass on Palm Jumeirah or settle into olive-lined DIFC terraces as the city lights awaken.',
    curatorName: 'Maya Haddad',
    coverImage: VENUE_IMAGES.beachfrontDining,
    venueIds: ['rest-6', 'rest-10', 'rest-12', 'rest-16', 'cafe-8'],
  },
  {
    id: 'col-specialty-coffee',
    slug: 'best-specialty-coffee',
    title: 'Best Specialty Coffee',
    subtitle: 'Small-batch micro-lots, V60 pour-overs, and precise espresso extraction.',
    editorialIntro:
      'For purists who care about roast profile, water chemistry, and origin transparency—Dubai’s independent roasters pour with remarkable discipline.',
    curatorName: 'Omar Al Farsi',
    coverImage: VENUE_IMAGES.quietWorkCafe,
    venueIds: ['cafe-2', 'cafe-5', 'cafe-7', 'cafe-10', 'cafe-14'],
  },
  {
    id: 'col-weekend-brunch',
    slug: 'weekend-brunch-favorites',
    title: 'Weekend Brunch Favorites',
    subtitle: 'Unrushed coastal spreads, sourdough tartines, and garden courtyards.',
    editorialIntro:
      'Skip the noise for sunlit tables laden with shakshuka, freshly laminated viennoiserie, seasonal fruit, and endless specialty pours.',
    curatorName: 'Claire Beaumont',
    coverImage: VENUE_IMAGES.brunchBreakfast,
    venueIds: ['rest-15', 'rest-18', 'rest-20', 'cafe-1', 'cafe-13', 'cafe-15'],
  },
];
