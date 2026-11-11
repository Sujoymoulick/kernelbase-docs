import React, { useState, useEffect } from 'react';
import { Github, Menu, X, Sun, Moon } from 'lucide-react';
import { KernelBaseLogo } from '../layout/KernelBaseLogo';
import { useTheme } from '../../context/ThemeContext';

const NAV_LINKS = [
  { label: 'Product', href: '#product' },
  { label: 'Architecture', href: '#architecture' },
  { label: 'Workflow', href: '#workflow' },
];

export const LandingNavbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setMenuOpen(false);
  };

  const handleDocs = () => {
    window.location.hash = 'get-started/overview';
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        backgroundColor: scrolled
          ? 'color-mix(in srgb, var(--kb-bg) 85%, transparent)'
          : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--kb-border)' : '1px solid transparent',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <a
            href="/"
            className="flex-shrink-0"
            onClick={(e) => {
              e.preventDefault();
              window.location.hash = '';
              window.history.pushState({}, '', '/');
              window.dispatchEvent(new PopStateEvent('popstate'));
            }}
          >
            <KernelBaseLogo size={26} showWordmark showDescriptor={false} />
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="px-3 py-1.5 text-sm font-medium rounded-md transition-colors duration-150"
                style={{ color: 'var(--kb-text-muted)' }}
                onMouseEnter={(e) => ((e.target as HTMLElement).style.color = 'var(--kb-text)')}
                onMouseLeave={(e) => ((e.target as HTMLElement).style.color = 'var(--kb-text-muted)')}
              >
                {link.label}
              </a>
            ))}
            <button
              onClick={handleDocs}
              className="px-3 py-1.5 text-sm font-medium rounded-md transition-colors duration-150"
              style={{ color: 'var(--kb-text-muted)' }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--kb-text)')}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--kb-text-muted)')}
            >
              Docs
            </button>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-2 rounded-md transition-colors duration-150 cursor-pointer"
              style={{ color: 'var(--kb-text-muted)' }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.color = 'var(--kb-text)';
                (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--kb-surface)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.color = 'var(--kb-text-muted)';
                (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
              }}
            >
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            {/* GitHub */}
            <a
              href="https://github.com/Sujoymoulick/kernelbase-docs"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium border transition-colors duration-150"
              style={{
                color: 'var(--kb-text-muted)',
                borderColor: 'var(--kb-border)',
                backgroundColor: 'transparent',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.color = 'var(--kb-text)';
                (e.currentTarget as HTMLElement).style.borderColor = 'var(--kb-border-hover)';
                (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--kb-surface)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.color = 'var(--kb-text-muted)';
                (e.currentTarget as HTMLElement).style.borderColor = 'var(--kb-border)';
                (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
              }}
            >
              <Github size={14} />
              <span>GitHub</span>
            </a>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-label="Toggle menu"
              className="md:hidden p-2 rounded-md transition-colors duration-150"
              style={{ color: 'var(--kb-text-muted)' }}
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div
          className="md:hidden border-t"
          style={{
            backgroundColor: 'color-mix(in srgb, var(--kb-bg) 95%, transparent)',
            borderColor: 'var(--kb-border)',
            backdropFilter: 'blur(16px)',
          }}
        >
          <div className="px-4 py-3 flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="px-3 py-2 text-sm font-medium rounded-md"
                style={{ color: 'var(--kb-text-muted)' }}
              >
                {link.label}
              </a>
            ))}
            <button
              onClick={() => { setMenuOpen(false); handleDocs(); }}
              className="text-left px-3 py-2 text-sm font-medium rounded-md"
              style={{ color: 'var(--kb-text-muted)' }}
            >
              Docs
            </button>
            <a
              href="https://github.com/Sujoymoulick/kernelbase-docs"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md"
              style={{ color: 'var(--kb-text-muted)' }}
              onClick={() => setMenuOpen(false)}
            >
              <Github size={14} />
              GitHub
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
