'use client';

import { useState } from 'react';
import ScrollIndicator from "@/components/ScrollIndicator";

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

export default function ScheduleClient({ initialSchedule }: ScheduleClientProps) {
  const [selectedTypes, setSelectedTypes] = useState<Set<string>>(new Set(['tiny-kids', 'kids', 'adults', 'womens', 'muay-thai']));
  const [selectedUniforms, setSelectedUniforms] = useState<Set<string>>(new Set(['Gi', 'No Gi', 'No Uniform']));

  const filterSections = {
    age: [
      { id: 'tiny-kids', label: 'Tiny Kids', color: 'blue' },
      { id: 'kids', label: 'Kids', color: 'green' },
      { id: 'adults', label: 'Adults', color: 'purple' },
      { id: 'womens', label: "Women's", color: 'red' },
      { id: 'muay-thai', label: "Muay Thai", color: 'orange' },
    ],
    uniform: [
      { id: 'Gi', label: 'Gi', color: 'cyan' },
      { id: 'No Gi', label: 'No Gi', color: 'yellow' },
      { id: 'No Uniform', label: 'No Uniform', color: 'gray' },
    ],
  };

  const timeSlots = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '11:45', '12:00', '12:30', '13:00', '13:30',
    'gap',
    '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00',
  ];

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    return `${hour > 12 ? hour - 12 : hour}:${minutes} ${hour >= 12 ? 'PM' : 'AM'}`;
  };

  const formatDuration = (minutes: number) => {
    return `${minutes} min`;
  };

  const normalizeTypes = (types: string[] | string): string[] => {
    if (Array.isArray(types)) {
      return types;
    }
    return types ? [types] : [];
  };

  const normalizeUniforms = (uniforms: string[]): string[] => {
    if (Array.isArray(uniforms) && uniforms.length > 0) {
      return uniforms;
    }
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
    
    const hasSelectedType = typeArray.some(type => selectedTypes.has(type));
    const hasSelectedUniform = uniformArray.some(uniform => selectedUniforms.has(uniform));
    
    return hasSelectedType && hasSelectedUniform;
  };

  const getFontSize = (types: string[] | string) => {
    const typeArray = normalizeTypes(types);
    return typeArray.includes('tiny-kids') || typeArray.includes('kids') ? 'text-sm' : 'text-lg';
  };

  const getClassKey = (day: string, timeSlot: string, classInfo: ClassInfo) => {
    const typeArray = normalizeTypes(classInfo.types);
    return `${day}-${timeSlot}-${typeArray.join('-')}`;
  };

  return (
    <main className="min-h-[calc(100vh-64px)] py-12 px-4 sm:px-6 lg:px-8">
      <ScrollIndicator />
      <div className="max-w-[1400px] mx-auto">
        <h1 className="text-4xl font-[--font-bebas-neue] text-white mb-8 tracking-wider">
          Class Schedule
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="mb-8 space-y-6">
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

            <div>
              <h3 className="text-white font-[--font-bebas-neue] text-xl mb-3">Uniform</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {filterSections.uniform.map((uniform) => (
                  <button
                    key={uniform.id}
                    onClick={() => setSelectedUniforms(prev => {
                      const newSelected = new Set(prev);
                      if (prev.has(uniform.id)) {
                        newSelected.delete(uniform.id);
                      } else {
                        newSelected.add(uniform.id);
                      }
                      return newSelected;
                    })}
                    className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 text-center
                      ${selectedUniforms.has(uniform.id)
                        ? `border-${uniform.color}-500 bg-${uniform.color}-500/20 text-white`
                        : 'border-gray-600 bg-gray-800/50 text-gray-400'
                      }`}
                  >
                    {uniform.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="md:col-span-2 bg-[#111111] border border-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-[--font-bebas-neue] text-white mb-4 tracking-wider">
              Class Information
            </h2>
            <div className="space-y-4 text-gray-300">
              <p>• All BJJ classes encompass fundamentals and advanced techniques</p>
              <p>• For No Gi classes, wear rash guards and shorts or spats; For Gi classes, wear a BJJ Gi. </p>
              <p>• For Muay Thai classes, wear comfortable athletic clothing, hand wraps, and a mouthguard</p>
              <p>• Please arrive 10-15 minutes before class starts</p>
              <p>• Women&apos;s self-defense classes are on the first Saturday of each month</p>
              <p>• Sunday Open Mat is available to anyone. NO DROP IN FEE.</p>
            </div>
          </div>
        </div>

        <div className="hidden md:block bg-[#111111] border border-gray-800 rounded-lg overflow-hidden">
          <div className="grid grid-cols-8 border-b border-gray-800 bg-[#0a0a0a]">
            <div className="p-4 font-[--font-bebas-neue] text-lg text-gray-400">
              Time
            </div>
            {days.map((day) => (
              <div 
                key={day} 
                className="p-4 font-[--font-bebas-neue] text-lg text-gray-400"
              >
                {day}
              </div>
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
                    .filter(c => c.startTime === timeSlot && shouldDisplayClass(c))
                    .map((classInfo, index, array) => (
                      <div 
                        key={getClassKey(day, timeSlot, classInfo)}
                        className={`absolute rounded-lg border-2 ${getClassColor(classInfo.types)} p-2`}
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
                        <div className={`font-[--font-bebas-neue] tracking-wide ${getFontSize(classInfo.types)}`}>
                          {classInfo.name}
                          {classInfo.note && (
                            <div className="text-sm font-normal opacity-75">
                              {classInfo.note}
                            </div>
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
                    )
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="md:hidden space-y-6">
          {days.map((day) => {
            const dayClasses = Object.values(initialSchedule[day] || {})
              .filter(classInfo => shouldDisplayClass(classInfo))
              .sort((a, b) => {
                const timeCompare = a.startTime.localeCompare(b.startTime);
                if (timeCompare !== 0) return timeCompare;
                
                const aTypes = normalizeTypes(a.types);
                const bTypes = normalizeTypes(b.types);
                return (aTypes[0] || '').localeCompare(bTypes[0] || '');
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
                      className={`p-3 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 border-2 rounded-lg ${getClassColor(classInfo.types)}`}
                    >
                      <div className={`font-[--font-bebas-neue] tracking-wide ${getFontSize(classInfo.types)}`}>
                        {classInfo.name}
                        {classInfo.note && (
                          <div className="text-sm font-normal opacity-75">
                            {classInfo.note}
                          </div>
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
        <p className="text-gray-300 text-center mb-8 mt-10">
          Can&apos;t make it to class? Contact us to schedule a private lesson.
        </p>
      </div>
    </main>
  );
}
