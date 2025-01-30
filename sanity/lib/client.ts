import { createClient } from 'next-sanity'

export const client = createClient({
  projectId: 'xtgasnb2',
  dataset: 'production',
  apiVersion: '2024-01-27',
  useCdn: false, // Disable CDN to always get fresh data
  perspective: 'published',
  stega: {
    enabled: false,
    studioUrl: '/studio',
  },
})
