import { defineConfig } from 'sanity'
import { deskTool } from 'sanity/desk'
import { schema } from './sanity/schema'
import StudioNavbar from './sanity/components/StudioNavbar'

export default defineConfig({
  name: 'default',
  title: 'Lovitts BJJ',
  projectId: 'xtgasnb2',
  dataset: 'production',
  plugins: [deskTool()],
  schema: schema,
  basePath: '/studio',
  studio: {
    components: {
      navbar: StudioNavbar
    }
  }
})
