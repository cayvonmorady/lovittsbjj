import { PublishIcon } from '@sanity/icons'

export const structure = (S) =>
  S.list()
    .title('Content')
    .items([
      // Add a "Publish All" list item at the top
      S.listItem()
        .title('Publish All Drafts')
        .icon(PublishIcon)
        .child(
          S.component()
            .title('Publish All Drafts')
            .component(
              // This is a dynamic import to avoid SSR issues
              () => {
                const { default: PublishAllTool } = require('./components/PublishAllTool')
                return PublishAllTool()
              }
            )
        ),
      // Add a divider
      S.divider(),
      // Then the default items
      ...S.documentTypeListItems()
    ])
