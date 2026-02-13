'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  applyTheme,
  getStoredTheme,
  resolveInitialTheme,
  setStoredTheme,
  toggleTheme,
  type ThemeMode,
} from '@/lib/theme';

export default function Navbar() {
  const SCROLL_THRESHOLD = 2;
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [theme, setTheme] = useState<ThemeMode>('light');
  const [hasStoredPreference, setHasStoredPreference] = useState(false);
  const pathname = usePathname();

  const menuItems = [
    { name: 'Home', href: '/' },
    { name: 'Instructor', href: '/instructor' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Schedule', href: '/schedule' },
  ];

  useEffect(() => {
    const stored = getStoredTheme();
    const initialTheme = stored ?? resolveInitialTheme();
    applyTheme(initialTheme);
    setTheme(initialTheme);
    setHasStoredPreference(stored !== null);
  }, []);

  useEffect(() => {
    if (hasStoredPreference) return;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (event: MediaQueryListEvent) => {
      const nextTheme: ThemeMode = event.matches ? 'dark' : 'light';
      applyTheme(nextTheme);
      setTheme(nextTheme);
    };

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }

    mediaQuery.addListener(handleChange);
    return () => mediaQuery.removeListener(handleChange);
  }, [hasStoredPreference]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > SCROLL_THRESHOLD);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleThemeToggle = () => {
    const nextTheme = toggleTheme(theme);
    applyTheme(nextTheme);
    setStoredTheme(nextTheme);
    setHasStoredPreference(true);
    setTheme(nextTheme);
  };

  const themeToggleLabel = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';

  return (
    <nav
      className={`sticky top-0 z-50 border-b transition-colors duration-300 ${
        isScrolled
          ? 'border-border bg-surface/95 backdrop-blur-md'
          : 'border-transparent bg-bg'
      }`}
    >
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center h-20">
          {/* Logo container */}
          <Link href="/" className="flex items-center gap-3 flex-shrink-0 justify-self-start">
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
          </Link>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center justify-center px-4 gap-1">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`nav-link ${pathname === item.href ? 'nav-link-active' : ''}`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Social links */}
          <div className="flex-shrink-0 hidden lg:flex items-center justify-self-end">
            <button
              type="button"
              onClick={handleThemeToggle}
              aria-label={themeToggleLabel}
              aria-pressed={theme === 'dark'}
              className="h-10 w-10 inline-flex items-center justify-center rounded-lg text-muted hover:text-text hover:bg-surface2 transition-colors focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 focus:ring-offset-bg"
            >
              {theme === 'dark' ? (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2m0 14v2m9-9h-2M5 12H3m15.364 6.364-1.414-1.414M7.05 7.05 5.636 5.636m12.728 0-1.414 1.414M7.05 16.95l-1.414 1.414M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
                </svg>
              )}
            </button>
            <a href="https://www.instagram.com/lovittsbjj/" className="h-10 w-10 inline-flex items-center justify-center rounded-lg text-muted hover:text-text hover:bg-surface2 transition-colors" aria-label="Instagram">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
              </svg>
            </a>
            <a href="https://www.facebook.com/people/Lovitt-s-Jiujitsu-of-Concord/100063572163018/" className="h-10 w-10 inline-flex items-center justify-center rounded-lg text-muted hover:text-text hover:bg-surface2 transition-colors" aria-label="Facebook">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
          </div>

          {/* Mobile button */}
          <div className="md:hidden">
            <button
              className="outline-none p-2 rounded-lg hover:bg-surface2 transition-colors duration-300"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6 text-text2"
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
        <div className="bg-surface border-t border-border py-2">
          <div className="flex items-center justify-between px-6 py-2 border-b border-border mb-2">
            <span className="text-sm text-muted">Theme</span>
            <button
              type="button"
              onClick={handleThemeToggle}
              aria-label={themeToggleLabel}
              aria-pressed={theme === 'dark'}
              className="p-2 rounded-lg text-muted hover:text-text hover:bg-surface2 transition-colors focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 focus:ring-offset-bg"
            >
              {theme === 'dark' ? (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2m0 14v2m9-9h-2M5 12H3m15.364 6.364-1.414-1.414M7.05 7.05 5.636 5.636m12.728 0-1.414 1.414M7.05 16.95l-1.414 1.414M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
                </svg>
              )}
            </button>
          </div>
          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`block py-3 px-6 font-[--font-bebas-neue] text-xl uppercase tracking-wide transition-all duration-300 ${
                pathname === item.href
                  ? 'bg-surface2 text-brand'
                  : 'text-muted hover:bg-surface2 hover:text-text'
              }`}
              onClick={() => setIsOpen(false)}
            >
              {item.name}
            </Link>
          ))}
          {/* Social links in mobile menu */}
          <div className="flex items-center gap-5 px-6 py-3 border-t border-border mt-2">
            <a href="https://www.instagram.com/lovittsbjj/" className="text-muted hover:text-text transition-colors" aria-label="Instagram">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
              </svg>
            </a>
            <a href="https://www.facebook.com/people/Lovitt-s-Jiujitsu-of-Concord/100063572163018/" className="text-muted hover:text-text transition-colors" aria-label="Facebook">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
