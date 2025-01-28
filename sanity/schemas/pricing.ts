export default {
  name: 'pricing',
  title: 'Pricing Plans',
  type: 'document',
  fields: [
    {
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Adult Programs', value: 'adult' },
          { title: 'Kids Programs', value: 'kids' }
        ]
      }
    },
    {
      name: 'plans',
      title: 'Plans',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          {
            name: 'name',
            title: 'Plan Name',
            type: 'string'
          },
          {
            name: 'price',
            title: 'Price',
            type: 'string'
          },
          {
            name: 'perMonth',
            title: 'Price is Per Month',
            type: 'boolean',
            initialValue: false
          },
          {
            name: 'features',
            title: 'Features',
            type: 'array',
            of: [{ type: 'string' }]
          },
          {
            name: 'highlighted',
            title: 'Highlight this plan',
            type: 'boolean',
            initialValue: false
          }
        ]
      }]
    }
  ]
}
