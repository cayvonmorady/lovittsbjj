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
          { title: 'Monday', value: 'Monday' },
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
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Tiny Kids', value: 'tiny-kids' },
          { title: 'Kids', value: 'kids' },
          { title: 'Adults', value: 'adults' },
          { title: "Women's", value: 'womens' },
          { title: 'Muay Thai', value: 'muay-thai' }, 
        ],
      },
      validation: (Rule: any) => Rule.required().min(1),
    },
    {
      name: 'uniform',
      title: 'Uniform Requirements',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Gi', value: 'Gi' },
          { title: 'No Gi', value: 'No Gi' },
          { title: 'No Uniform', value: 'No Uniform' },
        ],
      },
      validation: (Rule: any) => Rule.required().min(1),
      description: 'Select the uniform requirements for this class',
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
      uniform: 'uniform',
    },
    prepare(selection: any) {
      const { title, day, time, type, uniform } = selection;
      const typeDisplay = Array.isArray(type) ? type.join(', ') : type;
      const uniformDisplay = Array.isArray(uniform) ? uniform.join(', ') : uniform || '';
      return {
        title: title,
        subtitle: `${day} at ${time} - ${typeDisplay} ${uniformDisplay ? `(${uniformDisplay})` : ''}`,
      };
    },
  },
}
