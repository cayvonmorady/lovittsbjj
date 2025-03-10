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
      name: 'alert',
      title: 'Alert Banner',
      type: 'object',
      fields: [
        {
          name: 'isActive',
          title: 'Show Alert',
          type: 'boolean',
          initialValue: false
        },
        {
          name: 'message',
          title: 'Alert Message',
          type: 'text'
        },
        {
          name: 'type',
          title: 'Alert Type',
          type: 'string',
          options: {
            list: [
              { title: 'Info', value: 'info' },
              { title: 'Warning', value: 'warning' },
              { title: 'Success', value: 'success' }
            ]
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
    },
    {
      name: 'location',
      title: 'Location Information',
      type: 'object',
      fields: [
        {
          name: 'address',
          title: 'Street Address',
          type: 'string'
        },
        {
          name: 'city',
          title: 'City',
          type: 'string'
        },
        {
          name: 'state',
          title: 'State',
          type: 'string'
        },
        {
          name: 'zipCode',
          title: 'ZIP Code',
          type: 'string'
        },
        {
          name: 'phone',
          title: 'Phone Number',
          type: 'string'
        },
        {
          name: 'email',
          title: 'Email Address',
          type: 'string'
        },
        {
          name: 'googleMapsUrl',
          title: 'Google Maps Link',
          type: 'url'
        }
      ]
    }
  ],
  preview: {
    select: {
      title: 'hero.title'
    },
    prepare() {
      return {
        title: 'Homepage Content'
      }
    }
  }
}
