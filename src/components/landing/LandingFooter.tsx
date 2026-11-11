import React from 'react';
import { Github } from 'lucide-react';
import { KernelBaseLogo } from '../layout/KernelBaseLogo';

const FOOTER_LINKS = [
  {
    heading: 'Product',
    links: [
      { label: 'Overview', href: '#product', type: 'scroll' as const },
      { label: 'Architecture', href: '#architecture', type: 'scroll' as const },
      { label: 'Workflow', href: '#workflow', type: 'scroll' as const },
    ],
  },
  {
    heading: 'Documentation',
    links: [
      { label: 'Get Started', slug: 'get-started/overview', type: 'doc' as const },
      { label: 'Agents', slug: 'agents/overview', type: 'doc' as const },
      { label: 'Architecture', slug: 'architecture/overview', type: 'doc' as const },
    ],
  },
  {
    heading: 'Project',
    links: [
      { label: 'GitHub', href: 'https://github.com/Sujoymoulick/kernelbase-docs', type: 'external' as const },
    ],
  },
];

export const LandingFooter: React.FC = () => {
  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleDoc = (slug: string) => {
    window.location.hash = slug;
  };

  return (
    <footer
      className="border-t mt-8"
      style={{ borderColor: 'var(--kb-border)', backgroundColor: 'var(--kb-surface)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              <KernelBaseLogo size={24} showWordmark showDescriptor />
            </a>
            <p
              className="text-xs mt-3 leading-relaxed max-w-[180px]"
              style={{ color: 'var(--kb-text-subtle)' }}
            >
              An AI-native development environment for multi-agent software workflows.
            </p>
            <a
              href="https://github.com/Sujoymoulick/kernelbase-docs"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 mt-4 text-xs transition-colors duration-150"
              style={{ color: 'var(--kb-text-faint)' }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--kb-text-muted)')}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--kb-text-faint)')}
            >
              <Github size={13} />
              GitHub
            </a>
          </div>

          {/* Link columns */}
          {FOOTER_LINKS.map((col) => (
            <div key={col.heading}>
              <div
                className="text-xs font-semibold tracking-wider uppercase mb-3"
                style={{ color: 'var(--kb-text-subtle)' }}
              >
                {col.heading}
              </div>
              <ul className="flex flex-col gap-2">
                {col.links.map((link) => {
                  if (link.type === 'scroll') {
                    return (
                      <li key={link.label}>
                        <a
                          href={link.href}
                          onClick={(e) => handleScroll(e, link.href!)}
                          className="text-xs transition-colors duration-150"
                          style={{ color: 'var(--kb-text-faint)' }}
                          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--kb-text-muted)')}
                          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--kb-text-faint)')}
                        >
                          {link.label}
                        </a>
                      </li>
                    );
                  }
                  if (link.type === 'doc') {
                    return (
                      <li key={link.label}>
                        <button
                          onClick={() => handleDoc(link.slug!)}
                          className="text-xs transition-colors duration-150 text-left"
                          style={{ color: 'var(--kb-text-faint)' }}
                          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--kb-text-muted)')}
                          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--kb-text-faint)')}
                        >
                          {link.label}
                        </button>
                      </li>
                    );
                  }
                  return (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs transition-colors duration-150"
                        style={{ color: 'var(--kb-text-faint)' }}
                        onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--kb-text-muted)')}
                        onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--kb-text-faint)')}
                      >
                        {link.label}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          className="mt-10 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-2"
          style={{ borderColor: 'var(--kb-border)' }}
        >
          <span className="text-xs" style={{ color: 'var(--kb-text-faint)' }}>
            © {new Date().getFullYear()} KernelBase. All rights reserved.
          </span>
          <span className="text-xs" style={{ color: 'var(--kb-text-faint)' }}>
            Local-first · Multi-agent · Developer-focused
          </span>
        </div>
      </div>
    </footer>
  );
};
