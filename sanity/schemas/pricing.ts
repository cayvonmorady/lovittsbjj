export default {
  name: 'pricing',
  title: 'Pricing Plans',
  type: 'document',
  fields: [
    {
      name: 'category',
      title: 'Category',
      type: 'string',
      description: 'Which program this pricing applies to',
      options: {
        list: [
          { title: 'Adult Programs', value: 'adult' },
          { title: 'Kids Programs', value: 'kids' },
          { title: "Women's Self Defense", value: 'womens' },
          { title: 'Muay Thai', value: 'muaythai' },
          { title: 'Personal Training', value: 'personal' },
        ],
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'plans',
      title: 'Plans',
      type: 'array',
      description: 'Add one or more pricing plans for this category',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'name',
              title: 'Plan Name',
              type: 'string',
              description: 'Name of this plan (e.g. "Monthly Unlimited", "Drop-In")',
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: 'price',
              title: 'Price',
              type: 'string',
              description: 'The price to display (e.g. "$150", "$30", "Free Trial")',
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: 'perMonth',
              title: 'Price is Per Month',
              type: 'boolean',
              description: 'Turn on if the price shown is a monthly recurring charge',
              initialValue: false,
            },
            {
              name: 'features',
              title: 'Features',
              type: 'array',
              of: [{ type: 'string' }],
              description: 'List of what\'s included in this plan (one per line)',
              validation: (Rule: any) => Rule.required().min(1),
            },
            {
              name: 'highlighted',
              title: 'Highlight this plan',
              type: 'boolean',
              description: 'Turn on to visually emphasize this plan as the recommended option',
              initialValue: false,
            },
          ],
          preview: {
            select: {
              title: 'name',
              price: 'price',
              highlighted: 'highlighted',
            },
            prepare(selection: any) {
              const { title, price, highlighted } = selection
              return {
                title: `${title}${highlighted ? ' ⭐' : ''}`,
                subtitle: price,
              }
            },
          },
        },
      ],
      validation: (Rule: any) => Rule.required(),
    },
  ],
  preview: {
    select: {
      category: 'category',
      plans: 'plans',
    },
    prepare(selection: any) {
      const { category, plans } = selection
      const categoryLabels: Record<string, string> = {
        adult: 'Adult Programs',
        kids: 'Kids Programs',
        womens: "Women's Self Defense",
        muaythai: 'Muay Thai',
        personal: 'Personal Training',
      }
      const planCount = Array.isArray(plans) ? plans.length : 0
      return {
        title: categoryLabels[category] || category || 'Untitled',
        subtitle: `${planCount} plan${planCount !== 1 ? 's' : ''}`,
      }
    },
  },
}