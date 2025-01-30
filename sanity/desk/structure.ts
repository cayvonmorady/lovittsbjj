import { StructureBuilder } from 'sanity/desk'

export const structure = (S: StructureBuilder) =>
  S.list()
    .title('Content')
    .items([
      // Add a new "Unpublished Changes" list item
      S.listItem()
        .title('Unpublished Changes')
        .child(
          S.documentList()
            .title('Unpublished Changes')
            .filter('_type in ["pricing", "schedule", "instructor", "gallery", "homepage"] && (_id in path("drafts.**"))')
            .defaultOrdering([{ field: '_updatedAt', direction: 'desc' }])
        ),
      
      // Add the rest of your document types
      S.divider(),
      ...S.documentTypeListItems()
    ])
