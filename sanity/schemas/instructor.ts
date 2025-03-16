export default {
  name: 'instructor',
  title: 'Instructor',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Full Name',
      type: 'string'
    },
    {
      name: 'title',
      title: 'Title/Position',
      type: 'string'
    },
    {
      name: 'secondaryTitle',
      title: 'Secondary Title',
      type: 'string',
      description: 'Additional title or qualification to display below the main title'
    },
    {
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Controls the order in which instructors are displayed (lower numbers appear first)',
      validation: (Rule: any) => Rule.integer().positive()
    },
    {
      name: 'image',
      title: 'Profile Image',
      type: 'image',
      options: {
        hotspot: true
      }
    },
    {
      name: 'bio',
      title: 'Biography',
      type: 'array',
      of: [{ type: 'block' }]
    },
    {
      name: 'achievements',
      title: 'Achievements',
      type: 'array',
      of: [{ type: 'string' }]
    },
    {
      name: 'certifications',
      title: 'Certifications',
      type: 'array',
      of: [{ type: 'string' }]
    },
    {
      name: 'socialMedia',
      title: 'Social Media',
      type: 'object',
      fields: [
        {
          name: 'instagram',
          title: 'Instagram URL',
          type: 'url'
        },
        {
          name: 'facebook',
          title: 'Facebook URL',
          type: 'url'
        },
        {
          name: 'youtube',
          title: 'YouTube URL',
          type: 'url'
        }
      ]
    }
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'title',
      media: 'image'
    }
  }
}
