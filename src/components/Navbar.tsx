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
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="w-[120px]">
              <Image
                src="/assets/images/ctaLOGO.svg"
                alt="Lovitts BJJ CTA Logo"
                width={120}
                height={60}
                className="h-auto w-auto py-2"
                priority
              />
            </div>
            <div className="h-16 w-16 hidden sm:block">
              <Image
                src="/assets/images/logo.png"
                alt="Lovitts BJJ Logo"
                width={64}
                height={64}
                className="h-full w-full object-contain"
                priority
              />
            </div>
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

          {/* Social links */}
          <div className="w-[140px] flex-shrink-0 hidden lg:flex items-center justify-end gap-4">
            <a href="https://www.instagram.com/lovittsbjj/" className="text-gray-500 hover:text-purple-500 transition-colors" aria-label="Instagram">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
              </svg>
            </a>
            <a href="https://www.facebook.com/people/Lovitt-s-Jiujitsu-of-Concord/100063572163018/" className="text-gray-500 hover:text-blue-600 transition-colors" aria-label="Facebook">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
            <a href="https://www.youtube.com/channel/UCcJRSWbZ_6nxpKwfWH2a8UA" className="text-gray-500 hover:text-red-500 transition-colors" aria-label="YouTube">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </a>
          </div>

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
