'use client';

import React from 'react';
import Image from 'next/image';
import { client } from '../../../sanity/lib/client';
import { urlForImage } from '../../../sanity/lib/image';

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
  const [images, setImages] = React.useState<GalleryImage[]>([]);

  React.useEffect(() => {
    async function fetchImages() {
      try {
        const fetchedImages = await client.fetch<GalleryImage[]>(`*[_type == "galleryImage"] | order(order asc)`);
        setImages(fetchedImages);
      } catch (error) {
        console.error('Error fetching gallery images:', error);
        setImages(devGalleryImages);
      }
    }

    fetchImages();
  }, []);

  return (
    <main className="flex min-h-[calc(100vh-64px)] flex-col min-h-[calc(100vh-64px)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-[--font-bebas-neue] text-white mb-8 tracking-wider">
          Gallery
        </h1>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image) => (
            <div
              key={image._id}
              className="relative aspect-square overflow-hidden rounded-lg bg-gray-800"
            >
              <Image
                src={image.image && urlForImage(image.image) ? urlForImage(image.image).url() : '/assets/images/placeholder-image.jpg'}
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