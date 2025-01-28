'use client';

import React, { useState } from 'react';
import Image from 'next/image';

export default function GalleryPage() {
  // Array of image paths from the gallery folder
  const images = Array.from({ length: 16 }, (_, i) => ({
    id: i + 1,
    src: `/assets/images/gallery/image${i + 1}.jpg`, // You'll need to add images with these names
    alt: `Gallery image ${i + 1}`
  }));

  // Track loading and error states for each image
  const [loadingStates, setLoadingStates] = useState<{ [key: number]: boolean }>(
    images.reduce((acc, img) => ({ ...acc, [img.id]: true }), {})
  );
  const [errorStates, setErrorStates] = useState<{ [key: number]: boolean }>(
    images.reduce((acc, img) => ({ ...acc, [img.id]: false }), {})
  );

  const handleImageLoad = (id: number) => {
    setLoadingStates(prev => ({ ...prev, [id]: false }));
  };

  const handleImageError = (id: number) => {
    setLoadingStates(prev => ({ ...prev, [id]: false }));
    setErrorStates(prev => ({ ...prev, [id]: true }));
  };

  return (
    <main className="flex min-h-[calc(100vh-64px)] flex-col bg-[#141419]">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-[--font-bebas-neue] text-white mb-8 tracking-wider">
          Gallery
        </h1>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image) => (
            <div 
              key={image.id}
              className="relative aspect-square overflow-hidden rounded-lg group bg-gray-800"
            >
              {loadingStates[image.id] && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 border-4 border-gray-600 border-t-white rounded-full animate-spin" />
                </div>
              )}
              
              {errorStates[image.id] ? (
                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                  <span>Failed to load image</span>
                </div>
              ) : (
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className={`object-cover transition-transform duration-300 group-hover:scale-110 ${
                    loadingStates[image.id] ? 'opacity-0' : 'opacity-100'
                  }`}
                  onLoadingComplete={() => handleImageLoad(image.id)}
                  onError={() => handleImageError(image.id)}
                  priority={image.id <= 4} // Prioritize loading first 4 images
                />
              )}
              
              <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
