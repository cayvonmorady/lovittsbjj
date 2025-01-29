import { Metadata } from 'next';
import { client } from '../../../sanity/lib/client';
import ScheduleClient from '@/components/ScheduleClient';

interface ClassInfo {
  name: string;
  startTime: string;
  duration: number;
  type: string;
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

export const metadata: Metadata = {
  title: 'Class Schedule | Lovitt\'s BJJ',
  description: 'View our class schedule and find the perfect time to start your BJJ journey.',
};

export const revalidate = 60; // Revalidate this page every 60 seconds

async function getScheduleData(): Promise<ScheduleData> {
  try {
    const query = `*[_type == "schedule"][0] {
      Monday,
      Tuesday,
      Wednesday,
      Thursday,
      Friday,
      Saturday,
      Sunday
    }`
    const data = await client.fetch(query)
    
    if (!data) {
      console.log('No data from Sanity, using development data');
      return devSchedule;
    }

    return data;
  } catch (error) {
    console.error('Error fetching schedule:', error);
    return devSchedule;
  }
}

export default async function SchedulePage() {
  const scheduleData = await getScheduleData();

  return <ScheduleClient initialSchedule={scheduleData} />;
}