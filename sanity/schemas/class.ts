export default {
  name: 'class',
  title: 'Class',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Class Name',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'dayOfWeek',
      title: 'Day of Week',
      type: 'string',
      options: {
        list: [
          { title: 'Tuesday', value: 'Tuesday' },
          { title: 'Wednesday', value: 'Wednesday' },
          { title: 'Thursday', value: 'Thursday' },
          { title: 'Friday', value: 'Friday' },
          { title: 'Saturday', value: 'Saturday' },
          { title: 'Sunday', value: 'Sunday' },
        ],
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'startTime',
      title: 'Start Time',
      type: 'string',
      validation: (Rule: any) => Rule.required().regex(/^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/, {
        name: 'time format',
        invert: false,
      }).warning('Start time should be in 24-hour format (HH:MM)'),
    },
    {
      name: 'duration',
      title: 'Duration (minutes)',
      type: 'number',
      validation: (Rule: any) => Rule.required().positive().integer(),
    },
    {
      name: 'type',
      title: 'Class Type',
      type: 'string',
      options: {
        list: [
          { title: 'Tiny Kids', value: 'tiny-kids' },
          { title: 'Kids', value: 'kids' },
          { title: 'Adults', value: 'adults' },
          { title: "Women's", value: 'womens' },
        ],
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'isNoGi',
      title: 'No Gi Class',
      type: 'boolean',
      initialValue: false,
    },
    {
      name: 'note',
      title: 'Note',
      type: 'string',
      description: 'Optional note about the class (e.g., "First Saturdays only")',
    },
  ],
  preview: {
    select: {
      title: 'name',
      day: 'dayOfWeek',
      time: 'startTime',
      type: 'type',
    },
    prepare(selection: any) {
      const { title, day, time, type } = selection;
      return {
        title: title,
        subtitle: `${day} at ${time} - ${type}`,
      };
    },
  },
}
