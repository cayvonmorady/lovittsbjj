export default {
  name: 'homepage',
  title: 'Homepage',
  type: 'document',
  groups: [
    { name: 'hero', title: 'Hero Banner', default: true },
    { name: 'alert', title: 'Alert Banner' },
    { name: 'programs', title: 'Programs' },
    { name: 'location', title: 'Location & Contact' },
  ],
  fields: [
    // ── Hero Section ──
    {
      name: 'hero',
      title: 'Hero Section',
      type: 'object',
      group: 'hero',
      description: 'The large banner area at the top of the homepage',
      fields: [
        {
          name: 'title',
          title: 'Title',
          type: 'string',
          description: 'Main headline displayed in the hero banner',
        },
        {
          name: 'subtitle',
          title: 'Subtitle',
          type: 'text',
          description: 'Supporting text shown below the headline',
        },
        {
          name: 'image',
          title: 'Hero Image',
          type: 'image',
          description: 'Background image for the hero banner — use a high-resolution photo',
          options: {
            hotspot: true,
          },
        },
      ],
    },

    // ── Alert Banner ──
    {
      name: 'alert',
      title: 'Alert Banner',
      type: 'object',
      group: 'alert',
      description: 'An optional banner shown at the top of the page for announcements or closures',
      fields: [
        {
          name: 'isActive',
          title: 'Show Alert',
          type: 'boolean',
          description: 'Turn this on to display the alert banner on the website',
          initialValue: false,
        },
        {
          name: 'message',
          title: 'Alert Message',
          type: 'text',
          description: 'The message visitors will see (e.g. "Gym closed Dec 24–26 for the holidays")',
        },
        {
          name: 'type',
          title: 'Alert Type',
          type: 'string',
          description: 'Controls the color of the alert banner',
          options: {
            list: [
              { title: 'Info (blue)', value: 'info' },
              { title: 'Warning (yellow)', value: 'warning' },
              { title: 'Success (green)', value: 'success' },
            ],
          },
        },
      ],
    },

    // ── Programs ──
    {
      name: 'programs',
      title: 'Programs',
      type: 'array',
      group: 'programs',
      description: 'The program cards shown on the homepage — each one links to more info',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'title',
              title: 'Program Title',
              type: 'string',
              description: 'Name of the program (e.g. "Adults BJJ", "Kids Program")',
            },
            {
              name: 'description',
              title: 'Description',
              type: 'text',
              description: 'A short summary of what this program offers',
            },
            {
              name: 'image',
              title: 'Program Image',
              type: 'image',
              description: 'Photo representing this program',
              options: {
                hotspot: true,
              },
            },
          ],
          preview: {
            select: {
              title: 'title',
              media: 'image',
            },
          },
        },
      ],
    },

    // ── Location & Contact ──
    {
      name: 'location',
      title: 'Location & Contact Info',
      type: 'object',
      group: 'location',
      description: 'Gym address and contact details shown on the website',
      fields: [
        {
          name: 'address',
          title: 'Street Address',
          type: 'string',
          description: 'Street address of the gym',
        },
        {
          name: 'city',
          title: 'City',
          type: 'string',
        },
        {
          name: 'state',
          title: 'State',
          type: 'string',
        },
        {
          name: 'zipCode',
          title: 'ZIP Code',
          type: 'string',
        },
        {
          name: 'phone',
          title: 'Phone Number',
          type: 'string',
          description: 'Contact phone number displayed on the site',
        },
        {
          name: 'email',
          title: 'Email Address',
          type: 'string',
          description: 'Contact email displayed on the site',
        },
        {
          name: 'googleMapsUrl',
          title: 'Google Maps Link',
          type: 'url',
          description: 'Paste the Google Maps link so visitors can get directions',
        },
      ],
    },
  ],
  preview: {
    select: {
      title: 'hero.title',
    },
    prepare() {
      return {
        title: 'Homepage Content',
      }
    },
  },
}