import { useState, useEffect } from 'react';
import config from '../config';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled ? 'bg-background shadow-md' : 'bg-transparent'
      }`}
    >
      <nav aria-label="Main navigation" className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <a href="#home" className="flex items-center gap-3">
          <img src={config.logo} alt={`${config.siteName} logo`} className="h-10 w-10 object-contain" />
          <span className={`text-lg font-semibold transition-colors ${isScrolled ? 'text-text' : 'text-white'}`}>
            {config.siteName}
          </span>
        </a>

        {/* Desktop nav */}
        <ul className="hidden gap-8 md:flex">
          {config.sections.filter((s) => s !== 'home').map((section) => (
            <li key={section}>
              <a
                href={`#${section}`}
                className={`capitalize transition-colors hover:text-primary ${isScrolled ? 'text-text' : 'text-white'}`}
              >
                {section}
              </a>
            </li>
          ))}
        </ul>

        {/* Mobile toggle */}
        <button
          className="flex flex-col gap-1.5 md:hidden"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          aria-expanded={isMobileOpen}
          aria-controls="mobile-menu"
          aria-label="Toggle navigation menu"
        >
          <span className={`block h-0.5 w-6 transition-all ${isScrolled ? 'bg-text' : 'bg-white'} ${isMobileOpen ? 'translate-y-2 rotate-45' : ''}`} />
          <span className={`block h-0.5 w-6 transition-all ${isScrolled ? 'bg-text' : 'bg-white'} ${isMobileOpen ? 'opacity-0' : ''}`} />
          <span className={`block h-0.5 w-6 transition-all ${isScrolled ? 'bg-text' : 'bg-white'} ${isMobileOpen ? '-translate-y-2 -rotate-45' : ''}`} />
        </button>
      </nav>

      {/* Mobile menu */}
      {isMobileOpen && (
        <div id="mobile-menu" className="bg-background px-6 pb-6 shadow-md md:hidden">
          <ul className="flex flex-col gap-4">
            {config.sections.filter((s) => s !== 'home').map((section) => (
              <li key={section}>
                <a
                  href={`#${section}`}
                  className="block capitalize text-text hover:text-primary"
                  onClick={() => setIsMobileOpen(false)}
                >
                  {section}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
