'use client'

import { NextStudio } from 'next-sanity/studio/client-component'
import config from '../../../../sanity.config'

const bridgeScript = 'https://core.sanity-cdn.com/bridge.js'

export default function StudioClient() {
  return (
    <>
      <script src={bridgeScript} async type="module" data-sanity-core />
      <NextStudio config={config} />
    </>
  )
}
