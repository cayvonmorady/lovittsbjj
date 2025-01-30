import { defineConfig } from 'sanity'
import { deskTool } from 'sanity/desk'
import { schema } from './sanity/schema'
import { structure } from './sanity/desk/structure'
import { dashboardTool } from '@sanity/dashboard'
import { documentListWidget } from 'sanity-plugin-dashboard-widget-document-list'

export default defineConfig({
  name: 'default',
  title: 'Lovitts BJJ',
  projectId: 'xtgasnb2',
  dataset: 'production',
  plugins: [
    deskTool({
      structure
    }),
    dashboardTool({
      widgets: [
        documentListWidget({
          title: 'Last edited documents',
          order: '_updatedAt desc',
          limit: 10,
          types: ['pricing', 'schedule', 'instructor', 'gallery', 'homepage'],
          layout: { width: 'medium' }
        }),
        documentListWidget({
          title: 'Unpublished changes',
          query: '*[_id in path("drafts.**")]',
          limit: 10,
          layout: { width: 'medium' }
        })
      ]
    })
  ],
  schema: schema,
  basePath: '/studio',
})
