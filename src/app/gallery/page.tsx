import { Metadata } from 'next';
import { client } from '../../../sanity/lib/client';
import { urlForImage } from '../../../sanity/lib/image';
import GalleryClient from '@/components/GalleryClient';
import { endTimer, startTimer, timeAsync, timeSync } from '@/lib/serverTiming';

export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Gallery | Lovitts BJJ',
  description: 'Photos from Lovitts BJJ — classes, competitions, and community moments.',
};

interface SanityGalleryImage {
  _id: string;
  image: {
    _type: 'image';
    asset: { _ref: string; _type: 'reference' };
  };
  alt: string;
  order: number;
}

async function getGalleryImages() {
  try {
    return await timeAsync(
      'GET /gallery Sanity query',
      () =>
        client.fetch<SanityGalleryImage[]>(`
          *[_type == "galleryImage"] | order(order asc) {
            _id,
            image,
            alt,
            order
          }
        `)
    );
  } catch {
    return [];
  }
}

export default async function GalleryPage() {
  const totalLabel = startTimer('GET /gallery total');

  try {
    const raw = await getGalleryImages();

    const images = timeSync('GET /gallery transform-images', () =>
      raw
        .filter((img) => img.image?.asset)
        .map((img) => ({
          _id: img._id,
          imageUrl: urlForImage(img.image).width(1200).url(),
          alt: img.alt,
        }))
    );

    return (
    <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1
          className="text-5xl uppercase tracking-widest text-text mb-2"
          style={{ fontFamily: 'var(--font-bebas-neue)' }}
        >
          Gallery
        </h1>
        <p className="text-muted mb-8">Photos from the gym — classes, competitions, and community.</p>
        <GalleryClient images={images} />
      </div>
    </main>
    );
  } finally {
    endTimer(totalLabel);
  }
}
