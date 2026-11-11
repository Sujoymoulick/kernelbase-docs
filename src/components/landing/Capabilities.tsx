import React from 'react';
import { motion } from 'motion/react';
import { Users, Database, Cpu, Terminal, Shield, Puzzle, Construction } from 'lucide-react';

interface Capability {
  icon: React.ReactNode;
  title: string;
  description: string;
  badge?: string;
}

const CAPABILITIES: Capability[] = [
  {
    icon: <Users size={20} />,
    title: 'Multi-Agent Development',
    description: 'Coordinate specialized AI agents across development workflows.',
  },
  {
    icon: <Database size={20} />,
    title: 'Project Context',
    description: 'Maintain relevant project information across agent operations.',
  },
  {
    icon: <Cpu size={20} />,
    title: 'Intelligent Planning',
    description: 'Turn developer intent into structured execution workflows.',
  },
  {
    icon: <Terminal size={20} />,
    title: 'Code Execution',
    description: 'Connect agent workflows with actual development operations.',
    badge: 'In Development',
  },
  {
    icon: <Shield size={20} />,
    title: 'Developer Control',
    description: 'Keep the developer in control of execution and changes.',
  },
  {
    icon: <Puzzle size={20} />,
    title: 'Extensible Architecture',
    description: 'Foundation for tools, agents, models, and integrations.',
    badge: 'Planned',
  },
];

const CapabilityCard: React.FC<Capability & { index: number }> = ({
  icon,
  title,
  description,
  badge,
  index,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-50px' }}
    transition={{ duration: 0.4, delay: index * 0.07 }}
    className="rounded-xl border p-5 flex flex-col gap-3 group transition-colors duration-200"
    style={{
      borderColor: 'var(--kb-border)',
      backgroundColor: 'var(--kb-surface)',
    }}
    onMouseEnter={(e) => {
      (e.currentTarget as HTMLElement).style.borderColor = 'var(--kb-border-hover)';
      (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--kb-surface-elevated)';
    }}
    onMouseLeave={(e) => {
      (e.currentTarget as HTMLElement).style.borderColor = 'var(--kb-border)';
      (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--kb-surface)';
    }}
  >
    <div className="flex items-start justify-between gap-2">
      <div
        className="p-2 rounded-lg"
        style={{
          backgroundColor: 'color-mix(in srgb, var(--kb-brand) 15%, transparent)',
          color: 'var(--kb-accent)',
        }}
      >
        {icon}
      </div>
      {badge && (
        <span
          className="text-[10px] font-semibold px-2 py-0.5 rounded-full border flex items-center gap-1"
          style={{
            color: 'var(--kb-text-faint)',
            borderColor: 'var(--kb-border)',
            backgroundColor: 'var(--kb-surface-secondary)',
          }}
        >
          <Construction size={9} />
          {badge}
        </span>
      )}
    </div>
    <div>
      <h3
        className="text-sm font-semibold mb-1"
        style={{ color: 'var(--kb-text)' }}
      >
        {title}
      </h3>
      <p className="text-sm leading-relaxed" style={{ color: 'var(--kb-text-muted)' }}>
        {description}
      </p>
    </div>
  </motion.div>
);

export const Capabilities: React.FC = () => (
  <section className="py-20 px-4 sm:px-6 lg:px-8">
    <div className="max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h2 className="text-2xl sm:text-3xl font-bold mb-3" style={{ color: 'var(--kb-text)' }}>
          What KernelBase provides.
        </h2>
        <p className="text-sm sm:text-base max-w-xl mx-auto" style={{ color: 'var(--kb-text-muted)' }}>
          Core capabilities designed for AI-native software development.
        </p>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {CAPABILITIES.map((cap, i) => (
          <CapabilityCard key={cap.title} {...cap} index={i} />
        ))}
      </div>
    </div>
  </section>
);
