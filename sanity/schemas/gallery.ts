export default {
  name: 'gallery',
  title: 'Gallery',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Gallery Title',
      type: 'string'
    },
    {
      name: 'description',
      title: 'Gallery Description',
      type: 'text'
    },
    {
      name: 'images',
      title: 'Gallery Images',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'image',
              title: 'Image',
              type: 'image',
              options: {
                hotspot: true
              }
            },
            {
              name: 'caption',
              title: 'Caption',
              type: 'string'
            },
            {
              name: 'category',
              title: 'Category',
              type: 'string',
              options: {
                list: [
                  { title: 'Competition', value: 'competition' },
                  { title: 'Training', value: 'training' },
                  { title: 'Events', value: 'events' },
                  { title: 'Facility', value: 'facility' }
                ]
              }
            }
          ]
        }
      ]
    }
  ]
}
