import { useState } from 'react';
import { Utensils } from 'lucide-react';

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  className?: string;
  aspectClass?: string;
  loading?: 'lazy' | 'eager';
}

export function ImageWithFallback({
  src,
  alt,
  className = 'w-full h-full object-cover',
  aspectClass = '',
  loading = 'lazy',
}: ImageWithFallbackProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#F3EFE8] to-[#E6DFD3] text-[#146C5B]/70 p-4 text-center ${aspectClass} ${className}`}
        role="img"
        aria-label={alt}
      >
        <Utensils className="w-6 h-6 mb-2 opacity-60" aria-hidden="true" />
        <span className="text-xs font-medium text-[#222222]/70 line-clamp-2 max-w-[180px]">
          {alt}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={loading}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
    />
  );
}
