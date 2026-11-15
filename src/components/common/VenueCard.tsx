import { Link } from 'react-router-dom';
import { ArrowRight, Heart, Star, Wifi, PlugZap, Volume2 } from 'lucide-react';
import { Venue } from '../../types/dining';
import { ImageWithFallback } from './ImageWithFallback';
import { useApp } from '../../context/AppContext';
import { isVenueOpenNow } from '../../services/dataService';

interface VenueCardProps {
  venue: Venue;
  variant?: 'grid' | 'list';
  showCafeMetrics?: boolean;
}

export function VenueCard({
  venue,
  variant = 'grid',
  showCafeMetrics = false,
}: VenueCardProps) {
  const { isFavorite, toggleFavorite } = useApp();
  const favored = isFavorite(venue.id);
  const openNow = isVenueOpenNow(venue);

  if (variant === 'list') {
    return (
      <article className="group bg-white rounded-2xl border border-[#E8E2D9]/80 shadow-[0_4px_20px_rgba(34,34,34,0.04)] hover:shadow-[0_10px_30px_rgba(34,34,34,0.08)] transition-all duration-200 overflow-hidden flex flex-col sm:flex-row">
        <Link
          to={`/venue/${venue.slug}`}
          className="sm:w-72 md:w-80 shrink-0 aspect-[4/3] sm:aspect-auto overflow-hidden bg-[#F3EFE8] block"
        >
          <ImageWithFallback
            src={venue.heroImage}
            alt={`${venue.name} in ${venue.area}`}
            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
          />
        </Link>

        <div className="flex-1 p-6 flex flex-col justify-between gap-4">
          <div>
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-xs font-medium text-[#222222]/60 truncate">
                  {venue.cuisine} <span aria-hidden="true">·</span> {venue.area}{' '}
                  <span aria-hidden="true">·</span>{' '}
                  <span className="tabular-nums">{venue.priceTier}</span>
                </p>
                <Link to={`/venue/${venue.slug}`} className="block mt-1">
                  <h3 className="font-serif text-xl font-semibold text-[#222222] group-hover:text-[#146C5B] transition-colors">
                    {venue.name}
                  </h3>
                </Link>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <div className="flex items-center gap-1 text-sm font-semibold text-[#222222] tabular-nums">
                  <Star className="w-4 h-4 fill-[#C5A46D] text-[#C5A46D]" aria-hidden="true" />
                  <span>{venue.rating.toFixed(1)}</span>
                </div>
                <button
                  type="button"
                  onClick={() => toggleFavorite(venue.id, venue.name)}
                  aria-label={favored ? `Remove ${venue.name} from favorites` : `Save ${venue.name} to favorites`}
                  className={`p-2 rounded-xl border transition-colors focus-visible:outline-2 focus-visible:outline-[#146C5B] ${
                    favored
                      ? 'border-[#146C5B]/30 bg-[#146C5B]/10 text-[#146C5B]'
                      : 'border-[#E8E2D9] text-[#222222]/60 hover:text-[#146C5B] hover:border-[#146C5B]/40'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${favored ? 'fill-[#146C5B]' : ''}`} />
                </button>
              </div>
            </div>

            <p className="mt-2.5 text-sm text-[#222222]/75 leading-relaxed line-clamp-2">
              {venue.shortDescription}
            </p>

            {showCafeMetrics && venue.cafeAttributes && (
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-[#222222]/70">
                <span className="inline-flex items-center gap-1.5">
                  <Wifi className="w-3.5 h-3.5 text-[#146C5B]" aria-hidden="true" />
                  {venue.cafeAttributes.wifiAvailable ? 'Fast Wi-Fi' : 'No Wi-Fi'}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <PlugZap className="w-3.5 h-3.5 text-[#146C5B]" aria-hidden="true" />
                  {venue.cafeAttributes.powerOutlets ? 'Power Outlets' : 'Limited Outlets'}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Volume2 className="w-3.5 h-3.5 text-[#C5A46D]" aria-hidden="true" />
                  {venue.cafeAttributes.noiseLevel}
                </span>
                <span className="tabular-nums font-medium text-[#222222]">
                  Avg. coffee AED {venue.cafeAttributes.averageCoffeePriceAed}
                </span>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-[#E8E2D9]/70 flex items-center justify-between gap-4">
            <span className="text-xs text-[#222222]/60 tabular-nums">
              {openNow ? 'Open now' : 'Closed now'} · {venue.openingHoursText}
            </span>
            <Link
              to={`/venue/${venue.slug}`}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#146C5B] hover:text-[#0F5548] transition-colors whitespace-nowrap shrink-0"
            >
              <span>View Details</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="group bg-white rounded-2xl border border-[#E8E2D9]/80 shadow-[0_4px_20px_rgba(34,34,34,0.04)] hover:shadow-[0_12px_32px_rgba(34,34,34,0.09)] hover:-translate-y-0.5 transition-all duration-200 overflow-hidden flex flex-col">
      <div className="relative aspect-[4/3] overflow-hidden bg-[#F3EFE8]">
        <Link to={`/venue/${venue.slug}`} className="block w-full h-full">
          <ImageWithFallback
            src={venue.heroImage}
            alt={`${venue.name} in ${venue.area}`}
            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
          />
        </Link>
        <button
          type="button"
          onClick={() => toggleFavorite(venue.id, venue.name)}
          aria-label={favored ? `Remove ${venue.name} from favorites` : `Save ${venue.name} to favorites`}
          className={`absolute top-3.5 right-3.5 w-10 h-10 rounded-xl flex items-center justify-center backdrop-blur-md transition-colors focus-visible:outline-2 focus-visible:outline-white ${
            favored
              ? 'bg-[#146C5B] text-white shadow-md'
              : 'bg-white/90 text-[#222222] hover:bg-white shadow-sm'
          }`}
        >
          <Heart className={`w-4 h-4 ${favored ? 'fill-white' : ''}`} />
        </button>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between gap-4">
        <div>
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-medium text-[#222222]/60 truncate">
              {venue.cuisine} <span aria-hidden="true">·</span> {venue.area}
            </p>
            <div className="flex items-center gap-1 text-sm font-semibold text-[#222222] tabular-nums shrink-0">
              <Star className="w-3.5 h-3.5 fill-[#C5A46D] text-[#C5A46D]" aria-hidden="true" />
              <span>{venue.rating.toFixed(1)}</span>
            </div>
          </div>

          <Link to={`/venue/${venue.slug}`} className="block mt-1.5">
            <h3 className="font-serif text-xl font-semibold text-[#222222] group-hover:text-[#146C5B] transition-colors line-clamp-1">
              {venue.name}
            </h3>
          </Link>

          <p className="mt-2 text-sm text-[#222222]/70 leading-relaxed line-clamp-2">
            {venue.shortDescription}
          </p>

          {showCafeMetrics && venue.cafeAttributes && (
            <div className="mt-3 pt-3 border-t border-[#E8E2D9]/60 grid grid-cols-2 gap-y-1.5 gap-x-2 text-xs text-[#222222]/75">
              <span className="truncate">
                {venue.cafeAttributes.wifiAvailable ? 'Wi-Fi available' : 'Unplugged'}
              </span>
              <span className="truncate text-right tabular-nums">
                Coffee AED {venue.cafeAttributes.averageCoffeePriceAed}
              </span>
              <span className="truncate">{venue.cafeAttributes.noiseLevel} vibe</span>
              <span className="truncate text-right">
                {venue.cafeAttributes.powerOutlets ? 'Power outlets' : 'Counter seating'}
              </span>
            </div>
          )}
        </div>

        <div className="pt-3.5 border-t border-[#E8E2D9]/70 flex items-center justify-between gap-2">
          <span className="text-xs font-medium text-[#222222]/70 tabular-nums">
            {venue.priceTier}
          </span>
          <Link
            to={`/venue/${venue.slug}`}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#146C5B] hover:text-[#0F5548] transition-colors whitespace-nowrap shrink-0"
          >
            <span>View Details</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}
