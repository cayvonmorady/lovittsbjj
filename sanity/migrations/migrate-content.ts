const { createClient } = require('@sanity/client');
require('dotenv').config();

interface ClassInfo {
  name: string;
  startTime: string;
  duration: number;
  type: string;
  isNoGi?: boolean;
  note?: string;
}

interface ScheduleData {
  [key: string]: {
    [key: string]: ClassInfo;
  };
}

// Initialize the Sanity client
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  token: process.env.SANITY_API_TOKEN, 
  apiVersion: '2024-01-27',
  useCdn: false,
});

// Development data from schedule page
const scheduleData: ScheduleData = {
  'Tuesday': {
    '09:00': { name: "Women's Fitness", startTime: '09:00', duration: 60, type: 'womens' },
    '12:00': { name: 'Adults BJJ', startTime: '12:00', duration: 60, type: 'adults' },
    '17:30': { name: 'Tiny Kids BJJ', startTime: '17:30', duration: 30, type: 'tiny-kids' },
    '18:30': { name: 'Kids BJJ', startTime: '18:30', duration: 60, type: 'kids' },
    '19:30': { name: 'Adults BJJ', startTime: '19:30', duration: 120, type: 'adults' },
  },
  'Wednesday': {
    '09:00': { name: "Women's Fitness", startTime: '09:00', duration: 60, type: 'womens' },
    '12:00': { name: 'Adults BJJ', startTime: '12:00', duration: 60, type: 'adults', isNoGi: true },
    '17:30': { name: 'Tiny Kids BJJ', startTime: '17:30', duration: 30, type: 'tiny-kids', isNoGi: true },
    '18:30': { name: 'Kids BJJ', startTime: '18:30', duration: 60, type: 'kids', isNoGi: true },
    '19:30': { name: 'Adults BJJ', startTime: '19:30', duration: 120, type: 'adults', isNoGi: true },
  },
  'Thursday': {
    '09:00': { name: "Women's Fitness", startTime: '09:00', duration: 60, type: 'womens' },
    '12:00': { name: 'Adults BJJ', startTime: '12:00', duration: 60, type: 'adults', isNoGi: true },
    '17:30': { name: 'Tiny Kids BJJ', startTime: '17:30', duration: 30, type: 'tiny-kids', isNoGi: true },
    '18:30': { name: 'Kids BJJ', startTime: '18:30', duration: 60, type: 'kids', isNoGi: true },
    '19:30': { name: 'Adults BJJ', startTime: '19:30', duration: 120, type: 'adults', isNoGi: true },
  },
  'Friday': {
    '09:00': { name: "Women's Fitness", startTime: '09:00', duration: 60, type: 'womens' },
    '12:00': { name: 'Adults BJJ', startTime: '12:00', duration: 60, type: 'adults' },
    '17:30': { name: 'Tiny Kids BJJ', startTime: '17:30', duration: 30, type: 'tiny-kids' },
    '18:30': { name: 'Kids BJJ', startTime: '18:30', duration: 60, type: 'kids' },
    '19:30': { name: 'Adults BJJ', startTime: '19:30', duration: 120, type: 'adults' },
  },
  'Saturday': {
    'kids': { name: 'Kids BJJ', startTime: '11:45', duration: 75, type: 'kids' },
    'tiny': { name: 'Tiny Kids BJJ', startTime: '11:45', duration: 75, type: 'tiny-kids' },
    'adults': { name: 'Adults BJJ', startTime: '13:00', duration: 60, type: 'adults' },
    'womens': { name: "Women's Self Defense", startTime: '17:30', duration: 60, type: 'womens', note: 'First Saturdays' },
  },
  'Sunday': {
    '12:00': { name: 'Open Mat', startTime: '12:00', duration: 120, type: 'adults' },
  },
};

async function migrateSchedule() {
  console.log('Starting schedule migration...');
  
  try {
    // First, delete all existing class documents
    await client.delete({ query: '*[_type == "class"]' });
    console.log('Deleted existing class documents');
    
    // Convert schedule data to array of class documents
    const classDocuments = [];
    
    for (const [day, classes] of Object.entries(scheduleData)) {
      for (const [time, classInfo] of Object.entries(classes)) {
        classDocuments.push({
          _type: 'class',
          name: classInfo.name,
          dayOfWeek: day,
          startTime: classInfo.startTime,
          duration: classInfo.duration,
          type: classInfo.type,
          isNoGi: classInfo.isNoGi || false,
          ...(classInfo.note ? { note: classInfo.note } : {}),
        });
      }
    }
    
    console.log(`Creating ${classDocuments.length} class documents...`);
    
    // Create all class documents one by one to avoid transaction size limits
    const results = [];
    
    for (const doc of classDocuments) {
      const result = await client.create(doc);
      results.push(result);
      console.log(`Created class: ${doc.name} on ${doc.dayOfWeek} at ${doc.startTime}`);
    }
    
    console.log(`Successfully migrated ${results.length} classes`);
    
  } catch (error) {
    console.error('Error migrating schedule:', error);
  }
}

// Function to migrate all content
async function migrateAllContent() {
  try {
    await migrateSchedule();
    console.log('All content migrated successfully!');
  } catch (error) {
    console.error('Error during migration:', error);
  }
}

// Run the migration
migrateAllContent();
