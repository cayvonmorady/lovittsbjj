import { Metadata } from 'next';
import { client } from '../../../sanity/lib/client';
import ScheduleClient from '@/components/ScheduleClient';

interface ClassInfo {
  name: string;
  startTime: string;
  duration: number;
  types: string[] | string; 
  isNoGi?: boolean;
  note?: string;
}

interface DaySchedule {
  [key: string]: ClassInfo;
}

interface ScheduleData {
  [key: string]: DaySchedule;
}

// Development fallback data
const devSchedule: ScheduleData = {
  'Monday': {
    '19:30': { name: 'Muay Thai', startTime: '19:30', duration: 60, types: ['muay-thai'], note: 'Wear comfortable athletic clothing, hand wraps, and a mouthguard.' },
  },
  'Tuesday': {
    '09:00': { name: "Women's Fitness", startTime: '09:00', duration: 60, types: ['womens'] },
    '12:00': { name: 'Adults BJJ', startTime: '12:00', duration: 60, types: ['adults'] },
    '17:30': { name: 'Tiny Kids BJJ', startTime: '17:30', duration: 30, types: ['tiny-kids'] },
    '18:30': { name: 'Kids BJJ', startTime: '18:30', duration: 60, types: ['kids'] },
    '19:30': { name: 'Adults BJJ', startTime: '19:30', duration: 120, types: ['adults'] },
  },
  'Wednesday': {
    '09:00': { name: "Women's Fitness", startTime: '09:00', duration: 60, types: ['womens'] },
    '12:00': { name: 'Adults BJJ', startTime: '12:00', duration: 60, types: ['adults'], isNoGi: true },
    '17:30': { name: 'Tiny Kids BJJ', startTime: '17:30', duration: 30, types: ['tiny-kids'], isNoGi: true },
    '18:30': { name: 'Kids BJJ', startTime: '18:30', duration: 60, types: ['kids'], isNoGi: true },
    '19:30': { name: 'Adults BJJ', startTime: '19:30', duration: 120, types: ['adults'], isNoGi: true },
  },
  'Thursday': {
    '09:00': { name: "Women's Fitness", startTime: '09:00', duration: 60, types: ['womens'] },
    '12:00': { name: 'Adults BJJ', startTime: '12:00', duration: 60, types: ['adults'] },
    '17:30': { name: 'Tiny Kids BJJ', startTime: '17:30', duration: 30, types: ['tiny-kids'] },
    '18:30': { name: 'Kids BJJ', startTime: '18:30', duration: 60, types: ['kids'] },
    '19:30': { name: 'Adults BJJ', startTime: '19:30', duration: 120, types: ['adults'] },
  },
  'Friday': {
    '09:00': { name: "Women's Fitness", startTime: '09:00', duration: 60, types: ['womens'] },
    '12:00': { name: 'Adults BJJ', startTime: '12:00', duration: 60, types: ['adults'], isNoGi: true },
    '17:30': { name: 'Tiny Kids BJJ', startTime: '17:30', duration: 30, types: ['tiny-kids'], isNoGi: true },
    '18:30': { name: 'Kids BJJ', startTime: '18:30', duration: 60, types: ['kids'], isNoGi: true },
    '19:30': { name: 'Adults BJJ', startTime: '19:30', duration: 120, types: ['adults'], isNoGi: true },
  },
  'Saturday': {
    '08:30': { name: 'Muay Thai', startTime: '08:30', duration: 60, types: ['muay-thai'], note: 'Wear comfortable athletic clothing, hand wraps, and a mouthguard.' },
    '10:00': { name: 'Adults BJJ', startTime: '10:00', duration: 90, types: ['adults'] },
  },
  'Sunday': {
    '12:00': { name: 'Open Mat', startTime: '12:00', duration: 120, types: ['adults'] },
  },
};

export const metadata: Metadata = {
  title: 'Class Schedule | Lovitt\'s BJJ',
  description: 'View our class schedule and find the perfect time to start your BJJ journey.',
};

export const revalidate = 0; 

// Define an interface for the class item from Sanity
interface SanityClassItem {
  name: string;
  dayOfWeek: string;
  startTime: string;
  duration: number;
  type: string[] | string; 
  isNoGi?: boolean;
  note?: string;
}

// Helper function to normalize types to array
const normalizeTypes = (types: string[] | string | undefined): string[] => {
  if (Array.isArray(types)) {
    return types;
  }
  return types ? [types] : [];
};

async function getScheduleData(): Promise<ScheduleData> {
  try {
    // Fetch all classes from Sanity
    const query = `*[_type == "class"] {
      name,
      dayOfWeek,
      startTime,
      duration,
      type,
      isNoGi,
      note
    }`
    
    const classes = await client.fetch(query);
    
    if (!classes || classes.length === 0) {
      console.log('No classes found in Sanity, using development data');
      return devSchedule;
    }

    // Organize classes by day and time
    const schedule: ScheduleData = {
      'Monday': {},
      'Tuesday': {},
      'Wednesday': {},
      'Thursday': {},
      'Friday': {},
      'Saturday': {},
      'Sunday': {},
    };

    // Add each class to the appropriate day and time slot
    classes.forEach((classItem: SanityClassItem) => {
      if (!schedule[classItem.dayOfWeek]) {
        schedule[classItem.dayOfWeek] = {};
      }
      
      schedule[classItem.dayOfWeek][classItem.startTime] = {
        name: classItem.name,
        startTime: classItem.startTime,
        duration: classItem.duration,
        types: normalizeTypes(classItem.type),
        isNoGi: classItem.isNoGi || false,
        note: classItem.note || '',
      };
    });

    return schedule;
  } catch (error) {
    console.error('Error fetching classes:', error);
    return devSchedule;
  }
}

export default async function SchedulePage() {
  const scheduleData = await getScheduleData();

  return <ScheduleClient initialSchedule={scheduleData} />;
}