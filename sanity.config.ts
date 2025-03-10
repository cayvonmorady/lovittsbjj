import { defineConfig } from 'sanity'
import { deskTool } from 'sanity/desk'
import { schema } from './sanity/schema'
import publishAllTool from './sanity/desk/publishAllTool'

export default defineConfig({
  name: 'default',
  title: 'Lovitts BJJ',
  projectId: 'xtgasnb2',
  dataset: 'production',
  plugins: [deskTool(), publishAllTool],
  schema: schema,
  basePath: '/studio',
})
