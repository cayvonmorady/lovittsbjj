'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Navbar.module.css';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { name: 'Home', href: '/' },
    { name: 'Instructor', href: '/instructor' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Schedule', href: '/schedule' },
    // { name: 'Gallery', href: '/gallery' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200">
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo container */}
          <div className="w-[140px] flex-shrink-0">
            <Link href="/" className="flex items-center py-2 transition-transform duration-300 hover:scale-105">
              <Image
                src="/assets/images/ctaLOGO.svg"
                alt="Lovitts BJJ Logo"
                width={140}
                height={70}
                className="h-auto w-auto"
                priority
              />
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center justify-center flex-1 px-4 gap-2">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`relative py-2 px-4 font-[--font-bebas-neue] text-xl uppercase text-gray-700 tracking-wide transition-all duration-300 hover:text-black after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-blue-600 after:scale-x-0 after:origin-center after:transition-transform after:duration-300 hover:after:scale-x-100 ${styles.navLink}`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Empty div for centering */}
          <div className="w-[140px] flex-shrink-0 hidden lg:block"></div>

          {/* Mobile button */}
          <div className="md:hidden">
            <button 
              className="outline-none mobile-menu-button p-2 rounded-lg hover:bg-gray-100 transition-colors duration-300"
              onClick={() => setIsOpen(!isOpen)}
            >
              <svg
                className="w-6 h-6 text-gray-600 hover:text-gray-900"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div 
        className={`md:hidden transition-all duration-300 ease-in-out ${
          isOpen 
            ? 'max-h-[400px] opacity-100' 
            : 'max-h-0 opacity-0 overflow-hidden'
        }`}
      >
        <div className="bg-white/95 backdrop-blur-md border-t border-gray-100 py-2">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`block py-3 px-6 font-[--font-bebas-neue] text-xl uppercase text-gray-700 hover:bg-gray-50 hover:text-black tracking-wide transition-all duration-300 ${styles.navLink}`}
              onClick={() => setIsOpen(false)}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
