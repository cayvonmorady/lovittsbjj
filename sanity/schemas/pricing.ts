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
          { title: 'Kids Programs', value: 'kids' },
          { title: 'Women\'s Self Defense', value: 'womens' },
          { title: 'Muay Thai', value: 'muaythai' },
          { title: 'Personal Training', value: 'personal' }
        ]
      },
      validation: (Rule: any) => Rule.required()
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
            type: 'string',
            validation: (Rule: any) => Rule.required()
          },
          {
            name: 'price',
            title: 'Price',
            type: 'string',
            validation: (Rule: any) => Rule.required()
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
            of: [{ type: 'string' }],
            validation: (Rule: any) => Rule.required().min(1)
          },
          {
            name: 'highlighted',
            title: 'Highlight this plan',
            type: 'boolean',
            initialValue: false
          }
        ]
      }],
      validation: (Rule: any) => Rule.required()
    }
  ]
}
