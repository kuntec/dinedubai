import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Bookmark } from 'lucide-react';
import {
  getCollectionBySlug,
  getCollections,
  getVenuesForCollection,
} from '../services/dataService';
import { ImageWithFallback } from '../components/common/ImageWithFallback';
import { VenueCard } from '../components/common/VenueCard';
import { useApp } from '../context/AppContext';

export function CollectionsPage() {
  const { slug } = useParams<{ slug?: string }>();
  const { isCollectionSaved, toggleSavedCollection } = useApp();

  if (slug) {
    const collection = getCollectionBySlug(slug);
    if (!collection) {
      return (
        <div className="bg-[#FAF8F5] min-h-[70vh] flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl border border-[#E8E2D9] p-10 text-center max-w-md">
            <h1 className="font-serif text-3xl font-semibold text-[#222222]">
              Collection not found
            </h1>
            <Link
              to="/collections"
              className="mt-6 inline-block px-5 py-2.5 rounded-xl bg-[#146C5B] text-white text-sm font-semibold"
            >
              View All Collections
            </Link>
          </div>
        </div>
      );
    }

    const venues = getVenuesForCollection(collection);
    const saved = isCollectionSaved(collection.id);

    return (
      <div className="bg-[#FAF8F5] min-h-screen py-10 md:py-14">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/collections"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#222222]/75 hover:text-[#146C5B] mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>All Curated Collections</span>
          </Link>

          <div className="bg-white rounded-2xl border border-[#E8E2D9] overflow-hidden grid grid-cols-1 lg:grid-cols-12">
            <div className="lg:col-span-5 aspect-[4/3] lg:aspect-auto bg-[#F3EFE8]">
              <ImageWithFallback
                src={collection.coverImage}
                alt={collection.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="lg:col-span-7 p-8 sm:p-10 flex flex-col justify-between gap-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#C5A46D]">
                  Curated by {collection.curatorName} · {venues.length} Places
                </p>
                <h1 className="mt-2 font-serif text-3xl sm:text-4xl font-semibold text-[#222222]">
                  {collection.title}
                </h1>
                <p className="mt-4 text-base text-[#222222]/75 leading-relaxed max-w-prose">
                  {collection.editorialIntro}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => toggleSavedCollection(collection.id, collection.title)}
                  className={`px-5 py-2.5 rounded-xl border text-sm font-semibold inline-flex items-center gap-2 transition-colors cursor-pointer ${
                    saved
                      ? 'bg-[#146C5B] text-white border-[#146C5B]'
                      : 'bg-[#FAF8F5] text-[#222222] border-[#E8E2D9] hover:border-[#146C5B]/50'
                  }`}
                >
                  <Bookmark className={`w-4 h-4 ${saved ? 'fill-white' : ''}`} />
                  <span>{saved ? 'Collection Saved' : 'Save Collection'}</span>
                </button>
              </div>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {venues.map((venue) => (
              <VenueCard
                key={venue.id}
                venue={venue}
                showCafeMetrics={venue.venueKind === 'cafe'}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const collections = getCollections();

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-10 md:py-14">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="pb-8 border-b border-[#E8E2D9]">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#C5A46D]">
            DineDubai Editorial Guides
          </p>
          <h1 className="mt-2 font-serif text-3xl sm:text-4xl font-semibold text-[#222222]">
            Curated Collections
          </h1>
          <p className="mt-2 text-sm sm:text-base text-[#222222]/70 max-w-2xl">
            Hand-edited lists organized around Dubai occasions—from sunset waterfront tables and DIFC business lunches to quiet specialty coffee studios.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-7">
          {collections.map((col) => {
            const saved = isCollectionSaved(col.id);
            return (
              <div
                key={col.id}
                className="group bg-white rounded-2xl border border-[#E8E2D9] overflow-hidden shadow-[0_4px_20px_rgba(34,34,34,0.04)] hover:shadow-[0_12px_32px_rgba(34,34,34,0.09)] transition-all flex flex-col"
              >
                <Link
                  to={`/collections/${col.slug}`}
                  className="aspect-[16/9] overflow-hidden bg-[#F3EFE8] block"
                >
                  <ImageWithFallback
                    src={col.coverImage}
                    alt={col.title}
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                  />
                </Link>
                <div className="p-6 flex-1 flex flex-col justify-between gap-4">
                  <div>
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-xs font-medium text-[#146C5B] tabular-nums">
                        {col.venueIds.length} curated places · By {col.curatorName}
                      </p>
                      <button
                        type="button"
                        onClick={() => toggleSavedCollection(col.id, col.title)}
                        aria-label={saved ? 'Remove collection bookmark' : 'Bookmark collection'}
                        className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                          saved
                            ? 'border-[#146C5B]/30 bg-[#146C5B]/10 text-[#146C5B]'
                            : 'border-[#E8E2D9] text-[#222222]/60 hover:text-[#146C5B]'
                        }`}
                      >
                        <Bookmark className={`w-4 h-4 ${saved ? 'fill-[#146C5B]' : ''}`} />
                      </button>
                    </div>
                    <Link to={`/collections/${col.slug}`} className="block mt-2">
                      <h2 className="font-serif text-2xl font-semibold text-[#222222] group-hover:text-[#146C5B] transition-colors">
                        {col.title}
                      </h2>
                    </Link>
                    <p className="mt-2 text-sm text-[#222222]/70 leading-relaxed">
                      {col.editorialIntro}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#E8E2D9]/70">
                    <Link
                      to={`/collections/${col.slug}`}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#146C5B] hover:text-[#0F5548]"
                    >
                      <span>Explore collection</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
