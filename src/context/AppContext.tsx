import React, { createContext, useContext, useEffect, useState } from 'react';
import { Review, UserProfile } from '../types/dining';

interface AppContextValue {
  user: UserProfile | null;
  favorites: string[];
  savedCollections: string[];
  recentlyViewed: string[];
  userReviews: Review[];
  isAuthModalOpen: boolean;
  authPromptReason: string | null;
  toastMessage: string | null;
  openAuthModal: (reason?: string, pendingFavoriteVenueId?: string) => void;
  closeAuthModal: () => void;
  signInDemoGoogle: () => void;
  signInWithEmail: (name: string, email: string) => void;
  signOut: () => void;
  toggleFavorite: (venueId: string, venueName?: string) => void;
  isFavorite: (venueId: string) => boolean;
  toggleSavedCollection: (collectionId: string, collectionTitle?: string) => void;
  isCollectionSaved: (collectionId: string) => boolean;
  recordRecentlyViewed: (venueId: string) => void;
  addReview: (venueId: string, rating: number, comment: string, visitType: string) => void;
  updatePreferences: (areas: string[], dietary: string[]) => void;
  showToast: (message: string) => void;
}

const STORAGE_KEYS = {
  USER: 'dinedubai_user_v1',
  FAVORITES: 'dinedubai_favorites_v1',
  COLLECTIONS: 'dinedubai_collections_v1',
  RECENT: 'dinedubai_recent_v1',
  REVIEWS: 'dinedubai_reviews_v1',
};

const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER);
      return saved ? (JSON.parse(saved) as UserProfile) : null;
    } catch {
      return null;
    }
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.FAVORITES);
      return saved ? (JSON.parse(saved) as string[]) : [];
    } catch {
      return [];
    }
  });

  const [savedCollections, setSavedCollections] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.COLLECTIONS);
      return saved ? (JSON.parse(saved) as string[]) : [];
    } catch {
      return [];
    }
  });

  const [recentlyViewed, setRecentlyViewed] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.RECENT);
      return saved ? (JSON.parse(saved) as string[]) : [];
    } catch {
      return [];
    }
  });

  const [userReviews, setUserReviews] = useState<Review[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.REVIEWS);
      return saved ? (JSON.parse(saved) as Review[]) : [];
    } catch {
      return [];
    }
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authPromptReason, setAuthPromptReason] = useState<string | null>(null);
  const [pendingFavoriteId, setPendingFavoriteId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      if (user) localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      else localStorage.removeItem(STORAGE_KEYS.USER);
    } catch {
      // ignore storage quota
    }
  }, [user]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
    } catch {
      // ignore
    }
  }, [favorites]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.COLLECTIONS, JSON.stringify(savedCollections));
    } catch {
      // ignore
    }
  }, [savedCollections]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.RECENT, JSON.stringify(recentlyViewed));
    } catch {
      // ignore
    }
  }, [recentlyViewed]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(userReviews));
    } catch {
      // ignore
    }
  }, [userReviews]);

  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => setToastMessage(null), 3200);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  const showToast = (message: string) => {
    setToastMessage(message);
  };

  const openAuthModal = (reason?: string, pendingVenueId?: string) => {
    setAuthPromptReason(reason ?? null);
    setPendingFavoriteId(pendingVenueId ?? null);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    setAuthPromptReason(null);
    setPendingFavoriteId(null);
  };

  const applyPendingAction = () => {
    if (pendingFavoriteId) {
      setFavorites((prev) =>
        prev.includes(pendingFavoriteId) ? prev : [pendingFavoriteId, ...prev]
      );
      showToast('Signed in and added to your saved shortlist.');
      setPendingFavoriteId(null);
    }
  };

  const signInDemoGoogle = () => {
    const profile: UserProfile = {
      uid: 'demo-google-user',
      displayName: 'Layla Al Hashimi',
      email: 'layla.dubai@example.com',
      avatarInitials: 'LH',
      preferredAreas: ['Downtown Dubai', 'DIFC', 'Jumeirah'],
      dietaryPreferences: ['Halal', 'Vegetarian Options'],
      authProvider: 'google',
    };
    setUser(profile);
    setIsAuthModalOpen(false);
    setAuthPromptReason(null);
    if (pendingFavoriteId) {
      applyPendingAction();
    } else {
      showToast('Welcome back, Layla.');
    }
  };

  const signInWithEmail = (name: string, email: string) => {
    const cleanName = name.trim() || email.split('@')[0];
    const parts = cleanName.split(/\s+/);
    const initials = parts
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase() ?? '')
      .join('');

    const profile: UserProfile = {
      uid: `email-${Date.now()}`,
      displayName: cleanName,
      email: email.trim(),
      avatarInitials: initials || 'DD',
      preferredAreas: ['Downtown Dubai', 'Dubai Marina'],
      dietaryPreferences: ['Halal'],
      authProvider: 'email',
    };
    setUser(profile);
    setIsAuthModalOpen(false);
    setAuthPromptReason(null);
    if (pendingFavoriteId) {
      applyPendingAction();
    } else {
      showToast(`Signed in as ${cleanName}.`);
    }
  };

  const signOut = () => {
    setUser(null);
    showToast('You have signed out.');
  };

  const toggleFavorite = (venueId: string, venueName?: string) => {
    if (!user) {
      openAuthModal('Sign in to save restaurants and cafés to your personal Dubai shortlist.', venueId);
      return;
    }
    setFavorites((prev) => {
      const exists = prev.includes(venueId);
      const next = exists ? prev.filter((id) => id !== venueId) : [venueId, ...prev];
      showToast(
        exists
          ? `Removed ${venueName ?? 'place'} from saved favorites.`
          : `Saved ${venueName ?? 'place'} to your favorites.`
      );
      return next;
    });
  };

  const isFavorite = (venueId: string) => favorites.includes(venueId);

  const toggleSavedCollection = (collectionId: string, collectionTitle?: string) => {
    if (!user) {
      openAuthModal('Sign in to bookmark curated Dubai collections.');
      return;
    }
    setSavedCollections((prev) => {
      const exists = prev.includes(collectionId);
      const next = exists ? prev.filter((id) => id !== collectionId) : [collectionId, ...prev];
      showToast(
        exists
          ? `Removed "${collectionTitle ?? 'Collection'}" from saved.`
          : `Bookmarked "${collectionTitle ?? 'Collection'}".`
      );
      return next;
    });
  };

  const isCollectionSaved = (collectionId: string) => savedCollections.includes(collectionId);

  const recordRecentlyViewed = (venueId: string) => {
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((id) => id !== venueId);
      return [venueId, ...filtered].slice(0, 8);
    });
  };

  const addReview = (venueId: string, rating: number, comment: string, visitType: string) => {
    if (!user) {
      openAuthModal('Sign in to publish your dining review.');
      return;
    }
    const newReview: Review = {
      id: `user-rev-${Date.now()}`,
      venueId,
      authorName: user.displayName,
      authorRole: 'DineDubai Member',
      rating,
      date: 'November 2026',
      comment: comment.trim(),
      visitType,
    };
    setUserReviews((prev) => [newReview, ...prev]);
    showToast('Your review has been published.');
  };

  const updatePreferences = (areas: string[], dietary: string[]) => {
    if (!user) return;
    setUser({
      ...user,
      preferredAreas: areas,
      dietaryPreferences: dietary,
    });
    showToast('Dining preferences updated.');
  };

  return (
    <AppContext.Provider
      value={{
        user,
        favorites,
        savedCollections,
        recentlyViewed,
        userReviews,
        isAuthModalOpen,
        authPromptReason,
        toastMessage,
        openAuthModal,
        closeAuthModal,
        signInDemoGoogle,
        signInWithEmail,
        signOut,
        toggleFavorite,
        isFavorite,
        toggleSavedCollection,
        isCollectionSaved,
        recordRecentlyViewed,
        addReview,
        updatePreferences,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
