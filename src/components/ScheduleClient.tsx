'use client';

import { useState } from 'react';

interface ClassInfo {
  name: string;
  startTime: string;
  duration: number;
  types: string[] | string;
  uniform: string[];
  note?: string;
}

interface DaySchedule {
  [key: string]: ClassInfo;
}

interface ScheduleData {
  [key: string]: DaySchedule;
}

interface ScheduleClientProps {
  initialSchedule: ScheduleData;
}

// Explicit color class maps — safe for Tailwind purging
const typeActiveClasses: Record<string, string> = {
  'tiny-kids': 'border-blue-500 bg-blue-500/20 text-white',
  'kids': 'border-green-500 bg-green-500/20 text-white',
  'adults': 'border-purple-500 bg-purple-500/20 text-white',
  'womens': 'border-red-500 bg-red-500/20 text-white',
  'muay-thai': 'border-orange-500 bg-orange-500/20 text-white',
};

const uniformActiveClasses: Record<string, string> = {
  'Gi': 'border-cyan-500 bg-cyan-500/20 text-white',
  'No Gi': 'border-yellow-500 bg-yellow-500/20 text-white',
  'No Uniform': 'border-gray-400 bg-gray-400/20 text-white',
};

const inactiveClass = 'border-gray-600 bg-gray-800/50 text-gray-400';

export default function ScheduleClient({ initialSchedule }: ScheduleClientProps) {
  const [selectedTypes, setSelectedTypes] = useState<Set<string>>(new Set(['tiny-kids', 'kids', 'adults', 'womens', 'muay-thai']));
  const [selectedUniforms, setSelectedUniforms] = useState<Set<string>>(new Set(['Gi', 'No Gi', 'No Uniform']));

  const filterSections = {
    age: [
      { id: 'tiny-kids', label: 'Tiny Kids' },
      { id: 'kids', label: 'Kids' },
      { id: 'adults', label: 'Adults' },
      { id: 'womens', label: "Women's" },
      { id: 'muay-thai', label: 'Muay Thai' },
    ],
    uniform: [
      { id: 'Gi', label: 'Gi' },
      { id: 'No Gi', label: 'No Gi' },
      { id: 'No Uniform', label: 'No Uniform' },
    ],
  };

  // Visual time slots (what's displayed in the UI)
  const timeSlots = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
    'gap',
    '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00',
  ];

  const findNearestDisplayTimeSlot = (time: string): string => {
    const [hours, minutes] = time.split(':').map(Number);
    const timeInMinutes = hours * 60 + minutes;
    const displaySlots = timeSlots.filter(slot => slot !== 'gap');
    let nearestSlot = displaySlots[0];
    let minDifference = Infinity;
    for (const slot of displaySlots) {
      const [slotHours, slotMinutes] = slot.split(':').map(Number);
      const slotInMinutes = slotHours * 60 + slotMinutes;
      const difference = Math.abs(timeInMinutes - slotInMinutes);
      if (difference < minDifference || (difference === minDifference && slotInMinutes < timeInMinutes)) {
        minDifference = difference;
        nearestSlot = slot;
      }
    }
    return nearestSlot;
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    return `${hour > 12 ? hour - 12 : hour}:${minutes} ${hour >= 12 ? 'PM' : 'AM'}`;
  };

  const formatDuration = (minutes: number) => `${minutes} min`;

  const normalizeTypes = (types: string[] | string): string[] => {
    if (Array.isArray(types)) return types;
    return types ? [types] : [];
  };

  const normalizeUniforms = (uniforms: string[]): string[] => {
    if (Array.isArray(uniforms) && uniforms.length > 0) return uniforms;
    return ['Gi'];
  };

  const getClassColor = (types: string[] | string) => {
    const typeArray = normalizeTypes(types);
    if (typeArray.includes('womens')) return 'border-red-500 bg-red-500/20';
    if (typeArray.includes('muay-thai')) return 'border-orange-500 bg-orange-500/20';
    if (typeArray.includes('tiny-kids')) return 'border-blue-500 bg-blue-500/20';
    if (typeArray.includes('kids')) return 'border-green-500 bg-green-500/20';
    if (typeArray.includes('adults')) return 'border-purple-500 bg-purple-500/20';
    return 'border-gray-800 bg-[#1c1c23]';
  };

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const shouldDisplayClass = (classInfo: ClassInfo) => {
    const typeArray = normalizeTypes(classInfo.types);
    const uniformArray = normalizeUniforms(classInfo.uniform);
    return typeArray.some(t => selectedTypes.has(t)) && uniformArray.some(u => selectedUniforms.has(u));
  };

  const getFontSize = (types: string[] | string) => {
    const typeArray = normalizeTypes(types);
    return typeArray.includes('tiny-kids') || typeArray.includes('kids') ? 'text-sm' : 'text-lg';
  };

  const getVisualDuration = (actualDuration: number): number => {
    if (actualDuration % 30 === 15) return actualDuration - 15;
    return actualDuration;
  };

  const getVisualStartTime = (startTime: string, actualDuration: number): string => {
    if (actualDuration >= 75 && actualDuration % 30 === 15) {
      const [hours, minutes] = startTime.split(':').map(Number);
      const startInMinutes = hours * 60 + minutes;
      const visualStartInMinutes = Math.max(0, startInMinutes - 15);
      const visualHours = Math.floor(visualStartInMinutes / 60);
      const visualMinutes = visualStartInMinutes % 60;
      return `${visualHours.toString().padStart(2, '0')}:${visualMinutes.toString().padStart(2, '0')}`;
    }
    return startTime;
  };

  const getClassKey = (day: string, timeSlot: string, classInfo: ClassInfo) => {
    const typeArray = normalizeTypes(classInfo.types);
    const uniformArray = normalizeUniforms(classInfo.uniform);
    return `${day}-${timeSlot}-${typeArray.join('-')}-${uniformArray.join('-')}`;
  };

  return (
    <main className="min-h-[calc(100vh-64px)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1400px] mx-auto">
        <h1 className="text-4xl font-[--font-bebas-neue] text-white mb-8 tracking-wider text-center">
          Class Schedule
        </h1>

        {/* Filters + Info Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Filters */}
          <div className="space-y-6">
            <div>
              <h3 className="text-white font-[--font-bebas-neue] text-xl mb-3">Age Group</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {filterSections.age.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setSelectedTypes(prev => {
                      const next = new Set(prev);
                      next.has(type.id) ? next.delete(type.id) : next.add(type.id);
                      return next;
                    })}
                    className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 text-center font-medium text-sm ${
                      selectedTypes.has(type.id) ? typeActiveClasses[type.id] : inactiveClass
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-white font-[--font-bebas-neue] text-xl mb-3">Uniform</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {filterSections.uniform.map((uniform) => (
                  <button
                    key={uniform.id}
                    onClick={() => setSelectedUniforms(prev => {
                      const next = new Set(prev);
                      next.has(uniform.id) ? next.delete(uniform.id) : next.add(uniform.id);
                      return next;
                    })}
                    className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 text-center font-medium text-sm ${
                      selectedUniforms.has(uniform.id) ? uniformActiveClasses[uniform.id] : inactiveClass
                    }`}
                  >
                    {uniform.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Class Info */}
          <div className="md:col-span-2 bg-[#111111] border border-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-[--font-bebas-neue] text-white mb-4 tracking-wider">
              Class Information
            </h2>
            <div className="space-y-3 text-gray-300 text-sm leading-relaxed">
              <p>• All BJJ classes encompass fundamentals and advanced techniques</p>
              <p>• For No Gi classes, wear rash guards and shorts or spats; For Gi classes, wear a BJJ Gi</p>
              <p>• For Muay Thai classes, wear comfortable athletic clothing, hand wraps, and a mouthguard</p>
              <p>• Please arrive 10–15 minutes before class starts</p>
              <p>• Women&apos;s self-defense classes are on the first Saturday of each month</p>
              <p>• Sunday Open Mat is available to anyone — <strong className="text-white">NO DROP IN FEE</strong></p>
            </div>
          </div>
        </div>

        {/* Desktop Grid Schedule */}
        <div className="hidden md:block bg-[#111111] border border-gray-800 rounded-lg overflow-hidden">
          <div className="grid grid-cols-8 border-b border-gray-800 bg-[#0a0a0a]">
            <div className="p-4 font-[--font-bebas-neue] text-lg text-gray-400">Time</div>
            {days.map((day) => (
              <div key={day} className="p-4 font-[--font-bebas-neue] text-lg text-gray-400">{day}</div>
            ))}
          </div>

          {timeSlots.map((timeSlot) => (
            <div key={timeSlot} className="grid grid-cols-8 border-b border-gray-800">
              <div className={`p-4 font-[--font-bebas-neue] text-lg ${timeSlot === 'gap' ? 'text-gray-600 italic' : 'text-gray-400'}`}>
                {timeSlot === 'gap' ? '...' : formatTime(timeSlot)}
              </div>
              {days.map((day) => (
                <div
                  key={`${day}-${timeSlot}`}
                  className={`p-2 relative min-h-[4rem] ${timeSlot === 'gap' ? 'bg-gray-900/30' : ''}`}
                >
                  {timeSlot !== 'gap' && Object.values(initialSchedule[day] || {})
                    .filter(c => {
                      const visualStartTime = getVisualStartTime(c.startTime, c.duration);
                      return findNearestDisplayTimeSlot(visualStartTime) === timeSlot && shouldDisplayClass(c);
                    })
                    .map((classInfo, index, array) => {
                      const visualDuration = getVisualDuration(classInfo.duration);
                      return (
                        <div
                          key={getClassKey(day, timeSlot, classInfo)}
                          className={`absolute rounded-lg border-2 ${getClassColor(classInfo.types)} p-2`}
                          style={{
                            left: array.length > 1 ? `${index * 50}%` : '0.5rem',
                            right: array.length > 1 ? 'auto' : '0.5rem',
                            width: array.length > 1 ? '50%' : 'auto',
                            top: '0.375rem',
                            height: `${(visualDuration / 30 * 4) - 0.75}rem`,
                            minHeight: '3.5rem',
                            maxHeight: `${(visualDuration / 30 * 4) - 0.75}rem`,
                            zIndex: index + 1,
                            overflow: 'hidden',
                          }}
                        >
                          <div className={`font-[--font-bebas-neue] tracking-wide ${getFontSize(classInfo.types)}`}>
                            {classInfo.name}
                            {classInfo.note && (
                              <div className="text-sm font-normal opacity-75">{classInfo.note}</div>
                            )}
                          </div>
                          <div className="text-sm opacity-90">
                            {formatTime(classInfo.startTime)} • {formatDuration(classInfo.duration)}
                            {normalizeUniforms(classInfo.uniform).length > 0 &&
                              !normalizeTypes(classInfo.types).includes('womens') &&
                              !normalizeTypes(classInfo.types).includes('muay-thai') &&
                              ` • ${normalizeUniforms(classInfo.uniform).join('/')}`}
                          </div>
                        </div>
                      );
                    })}
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Mobile List Schedule */}
        <div className="md:hidden space-y-6">
          {days.map((day) => {
            const dayClasses = Object.values(initialSchedule[day] || {})
              .filter(classInfo => shouldDisplayClass(classInfo))
              .sort((a, b) => {
                const timeCompare = a.startTime.localeCompare(b.startTime);
                if (timeCompare !== 0) return timeCompare;
                return (normalizeTypes(a.types)[0] || '').localeCompare(normalizeTypes(b.types)[0] || '');
              });
            if (dayClasses.length === 0) return null;

            return (
              <div key={day} className="bg-[#111111] border border-gray-800 rounded-lg overflow-hidden">
                <div className="bg-gray-800/80 p-4">
                  <h3 className="font-[--font-bebas-neue] text-xl text-white tracking-wide">{day}</h3>
                </div>
                <div className="divide-y divide-gray-800">
                  {dayClasses.map((classInfo, index) => (
                    <div
                      key={`${day}-${classInfo.startTime}-${index}`}
                      className={`p-3 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 border-l-4 ${getClassColor(classInfo.types)}`}
                    >
                      <div className={`font-[--font-bebas-neue] tracking-wide ${getFontSize(classInfo.types)}`}>
                        {classInfo.name}
                        {classInfo.note && (
                          <div className="text-sm font-normal opacity-75">{classInfo.note}</div>
                        )}
                      </div>
                      <div className="text-sm opacity-90 sm:text-right">
                        {formatTime(classInfo.startTime)} • {formatDuration(classInfo.duration)}
                        {normalizeUniforms(classInfo.uniform).length > 0 &&
                          !normalizeTypes(classInfo.types).includes('womens') &&
                          !normalizeTypes(classInfo.types).includes('muay-thai') &&
                          ` • ${normalizeUniforms(classInfo.uniform).join('/')}`}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <p className="text-gray-400 text-center mb-8 mt-10">
          Can&apos;t make it to class?{' '}
          <a href="tel:4155591404" className="text-[#AA4A44] hover:underline">
            Contact us
          </a>{' '}
          to schedule a private lesson.
        </p>
      </div>
    </main>
  );
}
