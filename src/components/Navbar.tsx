import React from 'react';

export type NavSection = 'home' | 'seating' | 'food' | 'menu' | 'events';

interface NavbarProps {
  activeSection: NavSection;
  onNavigate: (section: NavSection) => void;
  onBookTable: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeSection,
  onNavigate,
  onBookTable,
}) => {
  const navItems: { id: NavSection; label: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'seating', label: 'Interactive Seating' },
    { id: 'food', label: 'Food Menu' },
    { id: 'menu', label: 'Custom Drinks' },
    { id: 'events', label: 'Events' },
  ];

  return (
    <header className="relative z-30 h-14 md:h-16 bg-[#F6F3EC] border-b border-[#2C3E2D]/15 px-4 md:px-8 flex items-center justify-between gap-4 md:gap-8 shrink-0">
      {/* Zone 1: Single-line Brand Wordmark */}
      <a
        href="#top"
        onClick={(e) => {
          e.preventDefault();
          onNavigate('home');
        }}
        className="font-serif-display text-xl md:text-2xl font-semibold tracking-tight text-[#1E241E] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-[#C88A4B]"
      >
        The Daily Bean
      </a>

      {/* Zone 2: Clean Single-Line Nav Links */}
      <nav
        aria-label="Primary navigation"
        className="hidden md:flex items-center gap-7 text-sm font-medium text-[#2C3E2D]"
      >
        {navItems.map((item) => {
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              className={`relative py-1 whitespace-nowrap shrink-0 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[#C88A4B] ${
                isActive
                  ? 'text-[#1E241E] font-semibold'
                  : 'text-[#2C3E2D]/80 hover:text-[#1E241E]'
              }`}
            >
              {item.label}
              {isActive && (
                <span
                  aria-hidden="true"
                  className="absolute left-0 right-0 -bottom-0.5 h-0.5 bg-[#C88A4B]"
                />
              )}
            </button>
          );
        })}
      </nav>

      {/* Zone 3: Single Primary Action */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          type="button"
          onClick={onBookTable}
          className="px-4 py-2 text-xs md:text-sm font-semibold text-[#F6F3EC] bg-[#2C3E2D] hover:bg-[#1E241E] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#C88A4B]"
        >
          Book a Table
        </button>
      </div>
    </header>
  );
};
