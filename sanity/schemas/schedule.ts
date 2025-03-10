              initialValue: 'Wear comfortable athletic clothing and bring a water bottle.'
            }
          ]
        },
        {
          name: '19:30',
          title: '7:30 PM - Adults BJJ (No Gi)',
          type: 'object',
          fields: [
            {
              name: 'name',
              title: 'Class Name',
              type: 'string',
              initialValue: 'Adults BJJ'
            },
            {
              name: 'startTime',
              title: 'Start Time',
              type: 'string',
              initialValue: '19:30'
            },
            {
              name: 'duration',
              title: 'Duration (minutes)',
              type: 'number',
              initialValue: 120
            },
            {
              name: 'type',
              title: 'Class Type',
              type: 'string',
              initialValue: 'adults'
            },
            {
              name: 'isNoGi',
              title: 'No Gi Class',
              type: 'boolean',
              initialValue: true
            },
            {
              name: 'note',
              title: 'Notes',
              type: 'text',
              initialValue: 'Wear comfortable athletic clothing and bring a water bottle.'
            }
          ]
        }
      ]
    },
    {
      name: 'Saturday',
      title: 'Saturday',
      type: 'object',
      fields: [
        {
          name: '08:30',
          title: '8:30 AM - Muay Thai',
          type: 'object',
          fields: [
            {
              name: 'name',
              title: 'Class Name',
              type: 'string',
              initialValue: 'Muay Thai'
            },
            {
              name: 'startTime',
              title: 'Start Time',
              type: 'string',
              initialValue: '08:30'
            },
            {
              name: 'duration',
              title: 'Duration (minutes)',
              type: 'number',
              initialValue: 60
            },
            {
              name: 'type',
              title: 'Class Type',
              type: 'string',
              initialValue: 'muay-thai'
            },
            {
              name: 'note',
              title: 'Notes',
              type: 'text',
              initialValue: 'Wear comfortable athletic clothing, hand wraps, and a mouthguard.'
            }
          ]
        },
        {
          name: '10:00',
          title: '10:00 AM - Adults BJJ',
          type: 'object',
          fields: [
            {
              name: 'name',
              title: 'Class Name',
              type: 'string',
              initialValue: 'Adults BJJ'
            },
            {
              name: 'startTime',
              title: 'Start Time',
              type: 'string',
              initialValue: '10:00'
            },
            {
              name: 'duration',
              title: 'Duration (minutes)',
              type: 'number',
              initialValue: 90
            },
            {
              name: 'type',
              title: 'Class Type',
              type: 'string',
              initialValue: 'adults'
            },
            {
              name: 'note',
              title: 'Notes',
              type: 'text',
              initialValue: 'Wear a gi and bring a water bottle.'
            }
          ]
        }
      ]
    },
    {
      name: 'Sunday',
      title: 'Sunday',
      type: 'object',
      fields: []
    }
  ],
  preview: {
    prepare() {
      return {
        title: 'Class Schedule'
      }
    }
  }
}
