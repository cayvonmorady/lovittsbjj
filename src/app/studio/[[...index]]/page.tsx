import { metadata, viewport } from 'next-sanity/studio'
import StudioClient from './StudioClient'

export const dynamic = 'force-static'
export { metadata, viewport }

export default function StudioPage() {
  return <StudioClient />
}
