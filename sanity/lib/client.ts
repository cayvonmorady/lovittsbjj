import { createClient } from 'next-sanity'

export const client = createClient({
  projectId: 'xtgasnb2',
  dataset: 'production',
  apiVersion: '2024-01-27',
  useCdn: true, // Enable CDN for better performance
  perspective: 'published', // Only show published content
  stega: {
    enabled: true, // Enable live preview
    studioUrl: '/studio', // Path to your Sanity Studio
  },
})
