"use client";

import { useState } from "react";

interface Program {
  title: string;
  description: string;
}

interface ProgramsAccordionProps {
  programs: Program[];
}

export default function ProgramsAccordion({ programs }: ProgramsAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-3">
      {programs.map((program, index) => {
        const isOpen = openIndex === index;
        return (
          <div
            key={index}
            className="bg-[#111111] rounded-lg border border-gray-800 overflow-hidden"
          >
            <button
              onClick={() => toggle(index)}
              className="w-full flex items-center justify-between px-6 py-5 text-left cursor-pointer focus:outline-none"
            >
              <h3 className="font-[--font-bebas-neue] text-xl text-white tracking-wide whitespace-pre-line">
                {program.title}
              </h3>
              <svg
                className={`w-5 h-5 text-[#AA4A44] flex-shrink-0 ml-4 transition-transform duration-300 ${
                  isOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            <div
              className={`transition-all duration-300 ease-in-out overflow-hidden ${
                isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <div className="px-6 pb-5">
                <p className="text-gray-400 text-md leading-relaxed">
                  {program.description}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}