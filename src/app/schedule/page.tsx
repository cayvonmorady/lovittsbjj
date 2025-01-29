'use client';

import { useState, useEffect } from 'react';
import ScrollIndicator from "@/components/ScrollIndicator";
import { client } from '../../../sanity/lib/client';

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

export default function SchedulePage() {
  const [selectedTypes, setSelectedTypes] = useState<Set<string>>(new Set(['tiny-kids', 'kids', 'adults', 'womens']));
  const [showNoGi, setShowNoGi] = useState(true);
  const [showGi, setShowGi] = useState(true);
  const [schedule, setSchedule] = useState<ScheduleData>(devSchedule);

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
      const data = await client.fetch(query, {}, {
        next: { revalidate: 60 } // Revalidate every 60 seconds
      })
      
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

  useEffect(() => {
    async function fetchSchedule() {
      const scheduleData = await getScheduleData();
      setSchedule(scheduleData);
    }

    fetchSchedule();
  }, []);

  const filterSections = {
    age: [
      { id: 'tiny-kids', label: 'Tiny Kids', color: 'green' },
      { id: 'kids', label: 'Kids', color: 'green' },
      { id: 'adults', label: 'Adults', color: 'purple' },
      { id: 'womens', label: "Women's", color: 'red' },
    ],
    uniform: [
      { id: 'gi', label: 'Gi', color: 'cyan' },
      { id: 'nogi', label: 'No Gi', color: 'yellow' },
    ],
  };

  const timeSlots = [
    // Morning slots
    '09:00',
    '09:30',
    '10:00',
    '11:45',
    '12:00',
    '12:30',
    '13:00',
    '13:30',
    'gap',
    // Evening slots
    '17:30',
    '18:00',
    '18:30',
    '19:00',
    '19:30',
    '20:00',
    '20:30',
    '21:00',
  ];

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    return `${hour > 12 ? hour - 12 : hour}:${minutes} ${hour >= 12 ? 'PM' : 'AM'}`;
  };

  const formatDuration = (minutes: number) => {
    return `${minutes} min`;
  };

  const isNoGiDay = (day: string) => {
    return day === 'Wednesday' || day === 'Thursday';
  };

  const getClassColor = (type: string) => {
    // Women's classes get their own style regardless of gi/no-gi
    if (type === 'womens') {
      return 'border-red-500 bg-red-500/20';
    }

    // For other classes, use the existing logic
    switch (type) {
      case 'tiny-kids':
        return 'border-green-500 bg-green-500/20';
      case 'kids':
        return 'border-green-500 bg-green-500/20';
      case 'adults':
        return 'border-purple-500 bg-purple-500/20';
      default:
        return 'border-gray-800 bg-[#1c1c23]';
    }
  };

  const days = ['Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <main className="min-h-[calc(100vh-64px)] py-12 px-4 sm:px-6 lg:px-8">
      <ScrollIndicator />
      <div className="max-w-[1400px] mx-auto">
        <h1 className="text-4xl font-[--font-bebas-neue] text-white mb-8 tracking-wider">
          Class Schedule
        </h1>

        {/* Top Section - Filters and Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Filters */}
          <div className="mb-8 space-y-6">
            {/* Age Filters */}
            <div>
              <h3 className="text-white font-[--font-bebas-neue] text-xl mb-3">Age</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {filterSections.age.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setSelectedTypes(prev => {
                      const newSelected = new Set(prev);
                      if (prev.has(type.id)) {
                        newSelected.delete(type.id);
                      } else {
                        newSelected.add(type.id);
                      }
                      return newSelected;
                    })}
                    className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 text-center
                      ${selectedTypes.has(type.id)
                        ? `border-${type.color}-500 bg-${type.color}-500/20 text-white`
                        : 'border-gray-600 bg-gray-800/50 text-gray-400'
                      }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Uniform Filters */}
            <div>
              <h3 className="text-white font-[--font-bebas-neue] text-xl mb-3">Uniform</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  onClick={() => setShowGi(!showGi)}
                  className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 text-center
                    ${showGi
                      ? 'border-cyan-500 bg-cyan-500/20 text-white'
                      : 'border-gray-600 bg-gray-800/50 text-gray-400'
                    }`}
                >
                  Gi
                </button>
                <button
                  onClick={() => setShowNoGi(!showNoGi)}
                  className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 text-center
                    ${showNoGi
                      ? 'border-yellow-500 bg-yellow-500/20 text-white'
                      : 'border-gray-600 bg-gray-800/50 text-gray-400'
                    }`}
                >
                  No Gi
                </button>
              </div>
            </div>
          </div>

          {/* Class Info */}
          <div className="md:col-span-2 bg-[#111111] border border-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-[--font-bebas-neue] text-white mb-4 tracking-wider">
              Class Information
            </h2>
            <div className="space-y-4 text-gray-300">
              <p>• All BJJ classes encompass fundamentals and advanced techniques</p>
              <p>• For No Gi classes, wear rash guards and shorts or spats; For Gi classes, wear a BJJ Gi. </p>
              <p>• Please arrive 10-15 minutes before class starts</p>
              <p>• Women&apos;s self-defense classes are on the first Saturday of each month</p>
              <p>• Sunday Open Mat is available to anyone. NO DROP IN FEE.</p>
            </div>
          </div>
        </div>

        {/* Schedule Grid - Desktop */}
        <div className="hidden md:block bg-[#111111] border border-gray-800 rounded-lg overflow-hidden">
          {/* Days Header */}
          <div className="grid grid-cols-7 border-b border-gray-800 bg-[#0a0a0a]">
            <div className="p-4 font-[--font-bebas-neue] text-lg text-gray-400">
              Time
            </div>
            {days.map((day) => (
              <div 
                key={day} 
                className={`p-4 font-[--font-bebas-neue] text-lg ${
                  isNoGiDay(day) ? 'text-gray-400' : 'text-gray-400'
                }`}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Time Slots */}
          {timeSlots.map((timeSlot) => (
            <div key={timeSlot} className="grid grid-cols-7 border-b border-gray-800">
              <div className={`p-4 font-[--font-bebas-neue] text-lg ${timeSlot === 'gap' ? 'text-gray-600 italic' : 'text-gray-400'}`}>
                {timeSlot === 'gap' ? '...' : formatTime(timeSlot)}
              </div>
              {days.map((day) => (
                <div 
                  key={`${day}-${timeSlot}`} 
                  className={`p-2 relative min-h-[4rem] ${timeSlot === 'gap' ? 'bg-gray-900/30' : ''}`}
                >
                  {timeSlot !== 'gap' && Object.values(schedule[day] || {})
                    .filter(c => c.startTime === timeSlot)
                    .map((classInfo, index, array) => 
                    (selectedTypes.has(classInfo.type) && 
                      ((classInfo.type === 'womens') || 
                        (showGi && !classInfo.isNoGi) || 
                        (showNoGi && classInfo.isNoGi))) && (
                      <div 
                        key={`${day}-${timeSlot}-${classInfo.type}`}
                        className={`absolute rounded-lg border-2 ${getClassColor(classInfo.type)} p-2`}
                        style={{ 
                          left: array.length > 1 ? `${index * 50}%` : '0.5rem',
                          right: array.length > 1 ? 'auto' : '0.5rem',
                          width: array.length > 1 ? '50%' : 'auto',
                          top: '0.5rem',
                          height: `${(classInfo.duration / 30 * 4) - 1}rem`,
                          minHeight: '5.5rem',
                          zIndex: index + 1
                        }}
                      >
                        <div className="font-[--font-bebas-neue] tracking-wide text-lg">
                          {classInfo.name}
                          {classInfo.note && (
                            <div className="text-sm font-normal opacity-75">
                              {classInfo.note}
                            </div>
                          )}
                        </div>
                        <div className="text-sm opacity-90">
                          {formatTime(classInfo.startTime)} • {formatDuration(classInfo.duration)}
                          {classInfo.type !== 'womens' && ` • ${classInfo.isNoGi ? 'No Gi' : 'Gi'}`}
                        </div>
                      </div>
                    )
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Mobile Schedule View */}
        <div className="md:hidden space-y-6">
          {days.map((day) => {
            const dayClasses = Object.values(schedule[day] || {})
              .filter(classInfo => 
                selectedTypes.has(classInfo.type) && 
                ((classInfo.type === 'womens') || 
                  (showGi && !classInfo.isNoGi) || 
                  (showNoGi && classInfo.isNoGi)))
              .sort((a, b) => {
                // First sort by start time
                const timeCompare = a.startTime.localeCompare(b.startTime);
                if (timeCompare !== 0) return timeCompare;
                // If same start time, sort by type (tiny-kids, kids, adults)
                return a.type.localeCompare(b.type);
              });
            if (dayClasses.length === 0) return null;

            return (
              <div key={day} className="bg-[#111111] border border-gray-800 rounded-lg overflow-hidden">
                <div className="bg-gray-800 p-4">
                  <h3 className="font-[--font-bebas-neue] text-xl text-white tracking-wide">
                    {day}
                  </h3>
                </div>
                <div className="divide-y divide-gray-800">
                  {dayClasses.map((classInfo, index) => (
                    <div 
                      key={`${day}-${classInfo.startTime}-${index}`}
                      className={`p-3 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 border-2 rounded-lg ${getClassColor(classInfo.type)}`}
                    >
                      <div className="font-[--font-bebas-neue] tracking-wide text-lg">
                        {classInfo.name}
                        {classInfo.note && (
                          <div className="text-sm font-normal opacity-75">
                            {classInfo.note}
                          </div>
                        )}
                      </div>
                      <div className="text-sm opacity-90 sm:text-right">
                        {formatTime(classInfo.startTime)} • {formatDuration(classInfo.duration)}
                        {classInfo.type !== 'womens' && ` • ${classInfo.isNoGi ? 'No Gi' : 'Gi'}`}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        <p className="text-gray-300 text-center mb-8 mt-10">
          Can&apos;t make it to class? Contact us to schedule a private lesson.
        </p>
      </div>
    </main>
  );
}