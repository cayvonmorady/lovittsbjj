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
  image: SanityImage | null;
  alt: string;
  order: number;
}

// Development fallback data
const devGalleryImages: GalleryImage[] = Array.from({ length: 8 }, (_, i) => ({
  _id: `dev-image-${i + 1}`,
  image: null,
  alt: `Gallery image ${i + 1}`,
  order: i + 1
}));

export default function GalleryPage() {
  const [images, setImages] = React.useState<GalleryImage[]>(devGalleryImages);

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
      }
    }

    fetchImages();
  }, []);

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
              <Image
                src={image.image && urlForImage(image.image) ? urlForImage(image.image).url() : `/assets/images/gallery/gallery-${image.order}.jpg`}
                alt={image.alt}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                className="object-cover transition-all duration-300 hover:scale-110"
              />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}