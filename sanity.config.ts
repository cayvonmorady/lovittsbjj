import { defineConfig } from 'sanity'
import { deskTool } from 'sanity/desk'
import { schema } from './sanity/schema'
import { structure } from './sanity/deskStructure'

export default defineConfig({
  name: 'default',
  title: 'Lovitts BJJ',
  projectId: 'xtgasnb2',
  dataset: 'production',
  plugins: [
    deskTool({
      structure,
    }),
  ],
  schema: schema,
  basePath: '/studio',
})