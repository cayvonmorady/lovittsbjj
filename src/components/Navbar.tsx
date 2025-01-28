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
    { name: 'Gallery', href: '/gallery' },
  ];

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo container */}
          <div className="w-[120px] flex-shrink-0">
            <Link href="/" className="flex items-center py-2">
              <Image
                src="/assets/images/ctaLOGO.svg"
                alt="Lovitts BJJ Logo"
                width={120}
                height={60}
                className="h-auto w-auto"
                priority
              />
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center justify-center flex-1 px-4">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`py-4 px-6 font-[--font-bebas-neue] text-xl uppercase text-gray-800 tracking-wide transition duration-300 ${styles.navLink}`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Empty div for centering */}
          <div className="w-[120px] flex-shrink-0 hidden lg:block"></div>

          {/* Mobile button */}
          <div className="md:hidden">
            <button 
              className="outline-none mobile-menu-button p-2"
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
      <div className={`md:hidden ${isOpen ? 'block' : 'hidden'}`}>
        {menuItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`block py-3 px-4 font-[--font-bebas-neue] text-xl uppercase text-gray-800 hover:bg-gray-50 tracking-wide transition duration-300 ${styles.navLink}`}
            onClick={() => setIsOpen(false)}
          >
            {item.name}
          </Link>
        ))}
      </div>
    </nav>
  );
}
