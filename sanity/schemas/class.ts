// Generate time slot options from 5:00 AM to 10:00 PM in 15-minute increments
// Stores 24-hour format values (e.g. "17:30") but displays 12-hour labels (e.g. "5:30 PM")
const timeSlots = (() => {
  const slots: { title: string; value: string }[] = []
  for (let hour = 5; hour <= 22; hour++) {
    for (let min = 0; min < 60; min += 15) {
      const h24 = `${hour}:${min.toString().padStart(2, '0')}`
      const period = hour >= 12 ? 'PM' : 'AM'
      const h12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
      const label = `${h12}:${min.toString().padStart(2, '0')} ${period}`
      slots.push({ title: label, value: h24 })
    }
  }
  return slots
})()

export default {
  name: 'class',
  title: 'Class',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Class Name',
      type: 'string',
      description: 'The name of the class as it will appear on the schedule (e.g. "Adults BJJ", "Kids BJJ")',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'dayOfWeek',
      title: 'Day of Week',
      type: 'string',
      description: 'Which day this class takes place',
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
      description: 'When the class begins — select from the dropdown',
      options: {
        list: timeSlots,
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'duration',
      title: 'Duration (minutes)',
      type: 'number',
      description: 'How long the class lasts in minutes (e.g. 60 for 1 hour, 90 for 1.5 hours)',
      validation: (Rule: any) => Rule.required().positive().integer(),
    },
    {
      name: 'type',
      title: 'Class Type',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Who this class is for — select one or more',
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
      description: 'What students should wear to this class',
    },
    {
      name: 'note',
      title: 'Note',
      type: 'string',
      description: 'Optional note shown on the schedule (e.g. "First Saturdays only", "Bring hand wraps")',
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
        subtitle: `${day} at ${time} — ${typeDisplay} ${uniformDisplay ? `(${uniformDisplay})` : ''}`,
      };
    },
  },
}