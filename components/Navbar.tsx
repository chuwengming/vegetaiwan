'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const navItems = [
  { label: '首頁', href: '/' },
  { label: '社團介紹', href: '/about' },
  { label: '活動專區', href: '/activities' },
  { label: '文宣專區', href: '/promotions' },
  { label: '聯絡我們', href: '/contact' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-container flex items-center justify-center relative">
        {/* Desktop Menu - Centered */}
        <ul className="navbar-menu hidden md:flex justify-center gap-12 w-full">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`navbar-link font-bold text-lg ${pathname === item.href || pathname.startsWith(item.href + '/')
                  ? 'navbar-link--active'
                  : ''
                  }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile Hamburger (Keep but maybe hidden if purely centering? No, keep for mobile) */}
        <button
          className="navbar-hamburger md:hidden absolute right-4"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="開關導航選單"
        >
          <span className={`hamburger-line ${isOpen ? 'open' : ''}`} />
          <span className={`hamburger-line ${isOpen ? 'open' : ''}`} />
          <span className={`hamburger-line ${isOpen ? 'open' : ''}`} />
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="navbar-mobile-menu">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`navbar-mobile-link ${pathname === item.href ? 'navbar-mobile-link--active' : ''
                }`}
              onClick={() => setIsOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
