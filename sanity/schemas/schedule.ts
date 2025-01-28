export default {
  name: 'schedule',
  title: 'Class Schedule',
  type: 'document',
  fields: [
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
          { title: 'Sunday', value: 'Sunday' }
        ]
      }
    },
    {
      name: 'classes',
      title: 'Classes',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          {
            name: 'name',
            title: 'Class Name',
            type: 'string'
          },
          {
            name: 'startTime',
            title: 'Start Time',
            type: 'string'
          },
          {
            name: 'duration',
            title: 'Duration (minutes)',
            type: 'number'
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
                { title: "Women's", value: 'womens' }
              ]
            }
          },
          {
            name: 'isNoGi',
            title: 'No Gi Class',
            type: 'boolean',
            initialValue: false
          },
          {
            name: 'note',
            title: 'Special Note',
            type: 'string'
          }
        ]
      }]
    }
  ]
}
