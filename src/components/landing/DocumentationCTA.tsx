import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, BookOpen } from 'lucide-react';

const DOC_LINKS = [
  { label: 'Get Started', slug: 'get-started/overview', description: 'Set up and start using KernelBase.' },
  { label: 'Architecture', slug: 'architecture/overview', description: 'Understand the system design.' },
  { label: 'Agents', slug: 'agents/overview', description: 'Explore the agent model.' },
  { label: 'Workspace', slug: 'workspace/overview', description: 'Working with projects and context.' },
];

export const DocumentationCTA: React.FC = () => {
  const handleNav = (slug: string) => {
    window.location.hash = slug;
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="rounded-2xl border p-8 sm:p-12 text-center"
          style={{
            borderColor: 'var(--kb-border)',
            backgroundColor: 'var(--kb-surface)',
            background: `radial-gradient(ellipse at 50% 0%, color-mix(in srgb, var(--kb-brand) 8%, transparent), transparent 60%), var(--kb-surface)`,
          }}
        >
          <div
            className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-5 mx-auto"
            style={{
              backgroundColor: 'color-mix(in srgb, var(--kb-brand) 18%, transparent)',
              color: 'var(--kb-accent)',
            }}
          >
            <BookOpen size={22} />
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold mb-3" style={{ color: 'var(--kb-text)' }}>
            Explore the architecture.
          </h2>
          <p className="text-sm sm:text-base mb-8 max-w-xl mx-auto" style={{ color: 'var(--kb-text-muted)' }}>
            The docs cover everything from setup to deep dives into the agent model, context system, and execution layer.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
            {DOC_LINKS.map((link) => (
              <button
                key={link.slug}
                onClick={() => handleNav(link.slug)}
                className="rounded-lg border p-3 text-left transition-all duration-150 group"
                style={{
                  borderColor: 'var(--kb-border)',
                  backgroundColor: 'var(--kb-surface-elevated)',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'var(--kb-border-hover)';
                  (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--kb-surface-secondary)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'var(--kb-border)';
                  (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--kb-surface-elevated)';
                }}
              >
                <div className="text-xs font-semibold mb-1 flex items-center justify-between" style={{ color: 'var(--kb-text)' }}>
                  {link.label}
                  <ArrowRight
                    size={11}
                    style={{ color: 'var(--kb-accent)', opacity: 0.6 }}
                  />
                </div>
                <div className="text-[11px] leading-tight" style={{ color: 'var(--kb-text-subtle)' }}>
                  {link.description}
                </div>
              </button>
            ))}
          </div>

          <button
            onClick={() => handleNav('get-started/overview')}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-150"
            style={{ backgroundColor: 'var(--kb-brand)', color: '#F8F5F2' }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = 'var(--kb-brand-secondary)')}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = 'var(--kb-brand)')}
          >
            Read the Docs
            <ArrowRight size={15} />
          </button>
        </motion.div>
      </div>
    </section>
  );
};
