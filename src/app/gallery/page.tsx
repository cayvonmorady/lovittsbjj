'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { client } from '../../../sanity/lib/client';
import { urlForImage } from '../../../sanity/lib/image';

interface GalleryImage {
  _id: string;
  image: any;
  alt: string;
  order: number;
}

// Development fallback data
const devGalleryImages: GalleryImage[] = Array.from({ length: 8 }, (_, i) => ({
  _id: `dev-image-${i + 1}`,
  image: null, // We'll use a default image URL
  alt: `Gallery image ${i + 1}`,
  order: i + 1
}));

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loadingStates, setLoadingStates] = useState<{ [key: string]: boolean }>({});
  const [errorStates, setErrorStates] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    async function fetchImages() {
      try {
        const query = `*[_type == "galleryImage"] | order(order asc) {
          _id,
          image,
          alt,
          order
        }`;
        const fetchedImages = await client.fetch(query);
        
        // Use development images if in development mode or if no images found
        const finalImages = (process.env.NODE_ENV === 'development' || !fetchedImages || fetchedImages.length === 0) 
          ? devGalleryImages 
          : fetchedImages;
        
        setImages(finalImages);
        
        // Initialize loading states for new images
        const initialLoadingStates = finalImages.reduce((acc: any, img: GalleryImage) => ({
          ...acc,
          [img._id]: true
        }), {});
        setLoadingStates(initialLoadingStates);
        
        // Initialize error states for new images
        const initialErrorStates = finalImages.reduce((acc: any, img: GalleryImage) => ({
          ...acc,
          [img._id]: false
        }), {});
        setErrorStates(initialErrorStates);
      } catch (error) {
        console.error('Error fetching gallery images:', error);
        // Use development images on error
        setImages(devGalleryImages);
        
        const initialLoadingStates = devGalleryImages.reduce((acc: any, img: GalleryImage) => ({
          ...acc,
          [img._id]: true
        }), {});
        setLoadingStates(initialLoadingStates);
        
        const initialErrorStates = devGalleryImages.reduce((acc: any, img: GalleryImage) => ({
          ...acc,
          [img._id]: false
        }), {});
        setErrorStates(initialErrorStates);
      }
    }

    fetchImages();
  }, []);

  const handleImageLoad = (id: string) => {
    setLoadingStates(prev => ({ ...prev, [id]: false }));
  };

  const handleImageError = (id: string) => {
    setLoadingStates(prev => ({ ...prev, [id]: false }));
    setErrorStates(prev => ({ ...prev, [id]: true }));
  };

  const getImageUrl = (image: GalleryImage) => {
    if (image.image && urlForImage(image.image)) {
      return urlForImage(image.image).url();
    }
    // Fallback image URL - you can replace this with your own default image
    return '/assets/images/placeholder-image.jpg';
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
              key={image._id}
              className="relative aspect-square overflow-hidden rounded-lg group bg-gray-800"
            >
              {loadingStates[image._id] && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 border-4 border-gray-600 border-t-white rounded-full animate-spin" />
                </div>
              )}
              
              {errorStates[image._id] ? (
                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                  <span>Failed to load image</span>
                </div>
              ) : (
                <Image
                  src={getImageUrl(image)}
                  alt={image.alt}
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className={`object-cover transition-transform duration-300 group-hover:scale-110 ${
                    loadingStates[image._id] ? 'opacity-0' : 'opacity-100'
                  }`}
                  onLoadingComplete={() => handleImageLoad(image._id)}
                  onError={() => handleImageError(image._id)}
                  priority={image.order <= 4} // Prioritize loading first 4 images
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