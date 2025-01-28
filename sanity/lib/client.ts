import { createClient } from 'next-sanity'

export const client = createClient({
  projectId: 'xtgasnb2',
  dataset: 'production',
  apiVersion: '2024-01-27',
  useCdn: false, // Set to true for production
})
