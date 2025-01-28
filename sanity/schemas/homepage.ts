export default {
  name: 'homepage',
  title: 'Homepage',
  type: 'document',
  fields: [
    {
      name: 'hero',
      title: 'Hero Section',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Title',
          type: 'string'
        },
        {
          name: 'subtitle',
          title: 'Subtitle',
          type: 'text'
        },
        {
          name: 'image',
          title: 'Hero Image',
          type: 'image',
          options: {
            hotspot: true
          }
        }
      ]
    },
    {
      name: 'programs',
      title: 'Programs',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          {
            name: 'title',
            title: 'Program Title',
            type: 'string'
          },
          {
            name: 'description',
            title: 'Description',
            type: 'text'
          },
          {
            name: 'image',
            title: 'Program Image',
            type: 'image',
            options: {
              hotspot: true
            }
          }
        ]
      }]
    }
  ]
}
