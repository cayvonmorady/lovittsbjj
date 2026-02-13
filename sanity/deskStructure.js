import {
  HomeIcon,
  CalendarIcon,
  CreditCardIcon,
  UsersIcon,
  ImagesIcon,
  PublishIcon,
} from '@sanity/icons'
import PublishAllTool from './components/PublishAllTool'

// Define the singleton document ID for homepage
const HOMEPAGE_ID = 'homepage'

export const structure = (S) =>
  S.list()
    .title('Content')
    .items([
      // Homepage — singleton, opens directly to editor
      S.listItem()
        .title('Homepage')
        .icon(HomeIcon)
        .child(
          S.document()
            .schemaType('homepage')
            .documentId(HOMEPAGE_ID)
            .title('Homepage')
        ),

      S.divider(),

      // Schedule — broken out by program type
      S.listItem()
        .title('Schedule')
        .icon(CalendarIcon)
        .child(
          S.list()
            .title('Schedule by Program')
            .items([
              S.listItem()
                .title('All Classes')
                .icon(CalendarIcon)
                .child(
                  S.documentTypeList('class')
                    .title('All Classes')
                ),
              S.divider(),
              S.listItem()
                .title('Adults BJJ')
                .child(
                  S.documentList()
                    .title('Adults BJJ')
                    .filter('_type == "class" && "adults" in type && !("muay-thai" in type) && name != "Open Mat"')
                ),
              S.listItem()
                .title('Kids BJJ')
                .child(
                  S.documentList()
                    .title('Kids BJJ')
                    .filter('_type == "class" && "kids" in type')
                ),
              S.listItem()
                .title('Tiny Kids BJJ')
                .child(
                  S.documentList()
                    .title('Tiny Kids BJJ')
                    .filter('_type == "class" && "tiny-kids" in type')
                ),
              S.listItem()
                .title("Women's")
                .child(
                  S.documentList()
                    .title("Women's Classes")
                    .filter('_type == "class" && "womens" in type')
                ),
              S.listItem()
                .title('Muay Thai')
                .child(
                  S.documentList()
                    .title('Muay Thai Classes')
                    .filter('_type == "class" && "muay-thai" in type')
                ),
              S.listItem()
                .title('Open Mat')
                .child(
                  S.documentList()
                    .title('Open Mat')
                    .filter('_type == "class" && name == "Open Mat"')
                ),
            ])
        ),

      // Pricing Plans
      S.listItem()
        .title('Pricing')
        .icon(CreditCardIcon)
        .child(
          S.documentTypeList('pricing')
            .title('Pricing Plans')
        ),

      // Instructors
      S.listItem()
        .title('Instructors')
        .icon(UsersIcon)
        .child(
          S.documentTypeList('instructor')
            .title('Instructors')
        ),

      // Gallery
      S.listItem()
        .title('Gallery')
        .icon(ImagesIcon)
        .child(
          S.documentTypeList('galleryImage')
            .title('Gallery Images')
        ),

      S.divider(),

      // Publish All Drafts utility
      S.listItem()
        .title('Publish All Drafts')
        .icon(PublishIcon)
        .child(
          S.component()
            .title('Publish All Drafts')
            .component(PublishAllTool)
        ),
    ])