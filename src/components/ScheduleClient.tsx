'use client';

import { useState } from 'react';
import ScrollIndicator from "@/components/ScrollIndicator";

interface ClassInfo {
  name: string;
  startTime: string;
  duration: number;
  types: string[] | string; 
  uniform?: string[] | string;
  isNoGi?: boolean; // Keep for backward compatibility
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
  const [selectedUniforms, setSelectedUniforms] = useState<Set<string>>(new Set(['gi', 'nogi', 'no-uniform']));

  const filterSections = {
    age: [
      { id: 'tiny-kids', label: 'Tiny Kids', color: 'blue' },
      { id: 'kids', label: 'Kids', color: 'green' },
      { id: 'adults', label: 'Adults', color: 'purple' },
      { id: 'womens', label: "Women's", color: 'red' },
      { id: 'muay-thai', label: "Muay Thai", color: 'orange' },
    ],
    uniform: [
      { id: 'gi', label: 'Gi', color: 'cyan' },
      { id: 'nogi', label: 'No Gi', color: 'yellow' },
      { id: 'no-uniform', label: 'No Uniform', color: 'gray' },
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

  const isNoGiDay = (day: string) => {
    return day === 'Wednesday' || day === 'Thursday';
  };

  const normalizeTypes = (types: string[] | string): string[] => {
    if (Array.isArray(types)) {
      return types;
    }
    return types ? [types] : [];
  };

  const normalizeUniforms = (uniforms: string[] | string | undefined, isNoGi?: boolean): string[] => {
    // If the new uniform field is present, use it
    if (uniforms) {
      if (Array.isArray(uniforms)) {
        return uniforms;
      }
      return uniforms ? [uniforms] : [];
    }
    
    // Fall back to legacy isNoGi field
    if (isNoGi) {
      return ['nogi'];
    }
    
    // Default to gi for BJJ classes if no uniform is specified
    return ['gi'];
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
    const uniformArray = normalizeUniforms(classInfo.uniform, classInfo.isNoGi);
    
    const hasSelectedType = typeArray.some(type => selectedTypes.has(type));
    const hasSelectedUniform = uniformArray.some(uniform => selectedUniforms.has(uniform));
    
    // Special case for Muay Thai classes which don't have a uniform requirement
    if (typeArray.includes('muay-thai') && selectedUniforms.has('no-uniform')) {
      return hasSelectedType;
    }
    
    return hasSelectedType && hasSelectedUniform;
  };

  const getFontSize = (types: string[] | string) => {
    const typeArray = normalizeTypes(types);
    return typeArray.includes('tiny-kids') || typeArray.includes('kids') ? 'text-sm' : 'text-lg';
  };

  const toggleType = (typeId: string) => {
    const newSelectedTypes = new Set(selectedTypes);
    if (newSelectedTypes.has(typeId)) {
      newSelectedTypes.delete(typeId);
    } else {
      newSelectedTypes.add(typeId);
    }
    setSelectedTypes(newSelectedTypes);
  };

  const toggleUniform = (uniformId: string) => {
    const newSelectedUniforms = new Set(selectedUniforms);
    if (newSelectedUniforms.has(uniformId)) {
      newSelectedUniforms.delete(uniformId);
    } else {
      newSelectedUniforms.add(uniformId);
    }
    setSelectedUniforms(newSelectedUniforms);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl md:text-5xl font-[--font-bebas-neue] text-white mb-8 tracking-wider">
        Class Schedule
      </h1>
      
      <div className="mb-8">
        <ScrollIndicator />
      </div>
      
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-1 space-y-6">
          <div className="bg-[#111111] border border-gray-800 rounded-lg p-6 space-y-6">
            <div>
              <h3 className="text-white font-[--font-bebas-neue] text-xl mb-3">Class Type</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {filterSections.age.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => toggleType(type.id)}
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {filterSections.uniform.map((uniform) => (
                  <button
                    key={uniform.id}
                    onClick={() => toggleUniform(uniform.id)}
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
                className={`p-4 font-[--font-bebas-neue] text-lg ${
                  isNoGiDay(day) ? 'text-gray-400' : 'text-gray-400'
                }`}
              >
                {day}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-8">
            {timeSlots.map((time, index) => (
              <div key={index} className="contents">
                {time === 'gap' ? (
                  <div className="col-span-8 py-2 border-b border-gray-800 bg-[#0a0a0a] text-center text-xs text-gray-500">
                    • • •
                  </div>
                ) : (
                  <>
                    <div className="p-4 border-b border-r border-gray-800 text-gray-400">
                      {formatTime(time)}
                    </div>
                    
                    {days.map((day) => {
                      const classesAtTime = initialSchedule[day]?.[time];
                      
                      return (
                        <div 
                          key={`${day}-${time}`} 
                          className="p-2 border-b border-r border-gray-800 relative"
                        >
                          {classesAtTime && shouldDisplayClass(classesAtTime) && (
                            <div 
                              className={`p-2 rounded-lg ${getClassColor(classesAtTime.types)} border`}
                            >
                              <div className={`font-medium ${getFontSize(classesAtTime.types)} text-white`}>
                                {classesAtTime.name}
                              </div>
                              <div className="text-xs text-gray-400 mt-1">
                                {formatDuration(classesAtTime.duration)}
                              </div>
                              {classesAtTime.note && (
                                <div className="text-xs text-yellow-400 mt-1 italic">
                                  {classesAtTime.note}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* Mobile schedule view */}
        <div className="md:hidden space-y-6">
          {days.map((day) => (
            <div key={day} className="bg-[#111111] border border-gray-800 rounded-lg overflow-hidden">
              <div className="p-4 font-[--font-bebas-neue] text-xl text-white border-b border-gray-800 bg-[#0a0a0a]">
                {day}
              </div>
              
              <div className="p-4 space-y-4">
                {Object.entries(initialSchedule[day] || {}).map(([time, classInfo]) => {
                  if (!shouldDisplayClass(classInfo)) return null;
                  
                  return (
                    <div 
                      key={`${day}-${time}`}
                      className={`p-3 rounded-lg ${getClassColor(classInfo.types)} border`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className={`font-medium ${getFontSize(classInfo.types)} text-white`}>
                            {classInfo.name}
                          </div>
                          <div className="text-xs text-gray-300 mt-1">
                            {formatTime(time)} • {formatDuration(classInfo.duration)}
                          </div>
                        </div>
                      </div>
                      {classInfo.note && (
                        <div className="text-xs text-yellow-400 mt-2 italic">
                          {classInfo.note}
                        </div>
                      )}
                    </div>
                  );
                })}
                
                {Object.keys(initialSchedule[day] || {}).filter(time => 
                  shouldDisplayClass(initialSchedule[day][time])
                ).length === 0 && (
                  <div className="text-gray-500 text-center py-4">
                    No classes scheduled
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
