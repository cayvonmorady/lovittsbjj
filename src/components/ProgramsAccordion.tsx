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
            className="card overflow-hidden"
          >
            <button
              onClick={() => toggle(index)}
              className="w-full flex items-center justify-between px-6 py-5 text-left cursor-pointer focus:outline-none hover:bg-surface2 transition-colors duration-200"
            >
              <h3 className="font-[--font-bebas-neue] text-xl text-text tracking-wide whitespace-normal">
                {program.title}
              </h3>
              <svg
                className={`w-5 h-5 text-brand flex-shrink-0 ml-4 transition-transform duration-300 ${
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
            <div className={`accordion-body ${isOpen ? 'is-open' : ''}`}>
              <div className="accordion-inner">
                <div className="accordion-content px-6 pb-5">
                  <p className="text-muted text-md leading-relaxed">
                    {program.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
