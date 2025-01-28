'use client';

import { useEffect, useState } from 'react';

export default function ScrollIndicator() {
  const [showScroll, setShowScroll] = useState(true);

  useEffect(() => {
    const checkScrollable = () => {
      const isScrollable = document.documentElement.scrollHeight > window.innerHeight;
      const scrolledToBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100;
      setShowScroll(isScrollable && !scrolledToBottom);
    };

    // Initial check
    checkScrollable();

    // Check on scroll and resize
    window.addEventListener('scroll', checkScrollable);
    window.addEventListener('resize', checkScrollable);

    // Add mutation observer to detect content changes
    const observer = new MutationObserver(checkScrollable);
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    return () => {
      window.removeEventListener('scroll', checkScrollable);
      window.removeEventListener('resize', checkScrollable);
      observer.disconnect();
    };
  }, []);

  if (!showScroll) return null;

  return (
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
      <div className="flex flex-col items-center text-gray-400">
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
        <span className="text-sm mt-1 font-[--font-bebas-neue] tracking-wide">Scroll for more</span>
      </div>
    </div>
  );
}
