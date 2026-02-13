export default {
  name: 'instructor',
  title: 'Instructor',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Full Name',
      type: 'string',
      description: 'Instructor\'s full name as it will appear on the website',
    },
    {
      name: 'title',
      title: 'Title / Position',
      type: 'string',
      description: 'Primary role (e.g. "Head Instructor", "Kids Coach")',
    },
    {
      name: 'secondaryTitle',
      title: 'Secondary Title',
      type: 'string',
      description: 'Additional title or belt rank shown below the main title (e.g. "Black Belt 2nd Degree")',
    },
    {
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Controls the order on the Instructors page — lower numbers appear first (e.g. 1 = top of the list)',
      validation: (Rule: any) => Rule.integer().positive(),
    },
    {
      name: 'image',
      title: 'Profile Photo',
      type: 'image',
      description: 'A professional headshot or training photo of the instructor',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'bio',
      title: 'Biography',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'Write a short bio about the instructor — you can use bold, italic, and links',
    },
    {
      name: 'achievements',
      title: 'Achievements',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Competition wins, titles, or notable accomplishments (one per line)',
    },
    {
      name: 'certifications',
      title: 'Certifications',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Training certifications or qualifications (one per line)',
    },
    {
      name: 'socialMedia',
      title: 'Social Media',
      type: 'object',
      description: 'Optional social media links — leave blank if not applicable',
      fields: [
        {
          name: 'instagram',
          title: 'Instagram URL',
          type: 'url',
          description: 'Full Instagram profile link (e.g. https://instagram.com/username)',
        },
        {
          name: 'facebook',
          title: 'Facebook URL',
          type: 'url',
          description: 'Full Facebook profile or page link',
        },
        {
          name: 'youtube',
          title: 'YouTube URL',
          type: 'url',
          description: 'Full YouTube channel link',
        },
      ],
    },
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'title',
      media: 'image',
    },
  },
}