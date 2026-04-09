'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

interface GalleryImage {
  _id: string;
  imageUrl: string;
  alt: string;
}

interface GalleryClientProps {
  images: GalleryImage[];
}

export default function GalleryClient({ images }: GalleryClientProps) {
  const [selected, setSelected] = useState<GalleryImage | null>(null);

  const close = useCallback(() => setSelected(null), []);

  useEffect(() => {
    if (!selected) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [selected, close]);

  if (images.length === 0) {
    return (
      <p className="text-muted text-center py-16">No images have been added to the gallery yet.</p>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {images.map((img) => (
          <button
            key={img._id}
            onClick={() => setSelected(img)}
            className="relative aspect-square overflow-hidden rounded-lg bg-surface2 border border-border group focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 focus:ring-offset-bg"
            aria-label={`View ${img.alt}`}
          >
            <Image
              src={img.imageUrl}
              alt={img.alt}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </button>
        ))}
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-label={selected.alt}
        >
          {/* Blurred backdrop */}
          <div className="absolute inset-0 bg-bg/80 backdrop-blur-md" />

          {/* Close button */}
          <button
            onClick={close}
            aria-label="Close image"
            className="absolute top-4 right-4 z-10 h-10 w-10 flex items-center justify-center rounded-full bg-surface/90 text-text hover:bg-surface2 transition-colors focus:outline-none focus:ring-2 focus:ring-brand"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Image container */}
          <div
            className="relative z-10 max-w-5xl w-full max-h-[90vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full" style={{ maxHeight: '90vh' }}>
              <Image
                src={selected.imageUrl}
                alt={selected.alt}
                width={1200}
                height={900}
                className="rounded-xl object-contain max-h-[90vh] w-auto mx-auto shadow-2xl"
                style={{ maxHeight: '90vh' }}
                priority
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
