'use client';

import React from 'react';
import Image from 'next/image';
import { client } from '../../../sanity/lib/client';
import { urlForImage } from '../../../sanity/lib/image';
import ScrollIndicator from '@/components/ScrollIndicator';

interface SanityImage {
  _type: 'image';
  asset: {
    _ref: string;
    _type: 'reference';
  };
}

interface GalleryImage {
  _id: string;
  image: SanityImage;
  alt?: string;
  order?: number;
}

export default function GalleryPage() {
  const [images, setImages] = React.useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchImages() {
      try {
        const data = await client.fetch<GalleryImage[]>(`
          *[_type == "galleryImage"] | order(order asc) {
            _id,
            image,
            alt,
            order
          }
        `);
        if (data && data.length > 0) {
          setImages(data);
        }
      } catch (error) {
        console.error('Error fetching gallery images:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchImages();
  }, []);

  if (isLoading) {
    return (
      <main className="min-h-[calc(100vh-64px)] py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <h1 className="text-4xl font-[--font-bebas-neue] text-white mb-8 tracking-wider">
            Gallery
          </h1>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, index) => (
              <div
                key={index}
                className="relative aspect-square overflow-hidden rounded-lg bg-[#111111] border border-gray-800 animate-pulse"
              />
            ))}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-64px)] py-12 px-4 sm:px-6 lg:px-8">
      <ScrollIndicator />
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <h1 className="text-4xl font-[--font-bebas-neue] text-white mb-8 tracking-wider">
          Gallery
        </h1>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image) => (
            <div
              key={image._id}
              className="relative aspect-square overflow-hidden rounded-lg bg-[#111111] border border-gray-800"
            >
              {image.image && image.image.asset && (
                <Image
                  src={urlForImage(image.image).url()}
                  alt={image.alt || 'Gallery image'}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  className="object-cover transition-all duration-300 hover:scale-110"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}