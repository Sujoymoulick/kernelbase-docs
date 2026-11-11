import React from 'react';
import { motion } from 'motion/react';
import { Monitor, Terminal, AppWindow, Download } from 'lucide-react';

type PlatformStatus = 'available' | 'coming-soon';

interface Platform {
  id: string;
  name: string;
  description: string;
  status: PlatformStatus;
  downloadUrl?: string;
  icon: React.ReactNode;
}

const platforms: Platform[] = [
  {
    id: 'macos',
    name: 'macOS',
    description: 'KernelBase for Mac',
    status: 'coming-soon',
    downloadUrl: undefined,
    icon: <Monitor size={24} />,
  },
  {
    id: 'linux',
    name: 'Linux',
    description: 'KernelBase for Linux',
    status: 'coming-soon',
    downloadUrl: undefined,
    icon: <Terminal size={24} />,
  },
  {
    id: 'windows',
    name: 'Windows',
    description: 'KernelBase for Windows',
    status: 'coming-soon',
    downloadUrl: undefined,
    icon: <AppWindow size={24} />,
  },
];

const PlatformDownloadCard: React.FC<Platform & { index: number }> = ({
  name,
  description,
  status,
  downloadUrl,
  icon,
  index,
}) => {
  const isAvailable = status === 'available' && !!downloadUrl;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="rounded-xl border p-6 flex flex-col gap-4"
      style={{
        borderColor: 'var(--kb-border)',
        backgroundColor: 'var(--kb-surface)',
      }}
    >
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center"
        style={{
          backgroundColor: 'color-mix(in srgb, var(--kb-brand) 12%, transparent)',
          color: 'var(--kb-accent)',
        }}
      >
        {icon}
      </div>

      <div>
        <div className="text-sm font-semibold mb-0.5" style={{ color: 'var(--kb-text)' }}>
          {name}
        </div>
        <div className="text-xs" style={{ color: 'var(--kb-text-muted)' }}>
          {description}
        </div>
      </div>

      {isAvailable ? (
        <a
          href={downloadUrl}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors duration-150"
          style={{
            backgroundColor: 'var(--kb-brand)',
            color: '#F8F5F2',
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = 'var(--kb-brand-secondary)')}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = 'var(--kb-brand)')}
        >
          <Download size={14} />
          Download
        </a>
      ) : (
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border cursor-not-allowed select-none"
          style={{
            color: 'var(--kb-text-faint)',
            borderColor: 'var(--kb-border)',
            backgroundColor: 'var(--kb-surface-secondary)',
          }}
          aria-disabled="true"
        >
          Coming soon
        </div>
      )}
    </motion.div>
  );
};

export const DesktopDownloads: React.FC = () => (
  <section className="py-20 px-4 sm:px-6 lg:px-8">
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h2 className="text-2xl sm:text-3xl font-bold mb-3" style={{ color: 'var(--kb-text)' }}>
          Run KernelBase on your desktop.
        </h2>
        <p className="text-sm sm:text-base max-w-lg mx-auto" style={{ color: 'var(--kb-text-muted)' }}>
          A local-first desktop application. No cloud dependency. Your project, your agents, your machine.
        </p>
      </motion.div>

      <div className="grid sm:grid-cols-3 gap-4">
        {platforms.map((p, i) => (
          <PlatformDownloadCard key={p.id} {...p} index={i} />
        ))}
      </div>
    </div>
  </section>
);
