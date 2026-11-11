import React from 'react';
import { motion } from 'motion/react';

const LAYERS = [
  { label: 'Developer', sublabel: 'You', accent: true },
  { label: 'KernelBase Desktop', sublabel: 'Application shell' },
  { label: 'Workspace / UI', sublabel: 'Project view & controls' },
  { label: 'Agent Orchestration', sublabel: 'Planner · Dispatcher · Scheduler' },
  { label: 'Context / Memory', sublabel: 'Project knowledge & session state' },
  { label: 'Model Layer', sublabel: 'LLM adapters & inference' },
  { label: 'Tool / Execution Layer', sublabel: 'File ops · Shell · Search' },
  { label: 'Project / Filesystem', sublabel: 'Your codebase' },
];

export const ArchitectureSection: React.FC = () => {
  return (
    <section id="architecture" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <h2
            className="text-2xl sm:text-3xl font-bold mb-3"
            style={{ color: 'var(--kb-text)' }}
          >
            Designed as an AI-native development system.
          </h2>
          <p
            className="text-sm sm:text-base max-w-xl mx-auto"
            style={{ color: 'var(--kb-text-muted)' }}
          >
            A layered architecture that places the developer at the top and connects down through agents, context, and execution.
          </p>
        </motion.div>

        <div className="flex flex-col gap-2">
          {LAYERS.map((layer, i) => {
            const widthPercent = 100 - i * 4;
            return (
              <motion.div
                key={layer.label}
                initial={{ opacity: 0, scaleX: 0.85 }}
                whileInView={{ opacity: 1, scaleX: 1 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                style={{ width: `${Math.max(widthPercent, 60)}%`, originX: 0.5 }}
                className="mx-auto"
              >
                <div
                  className="rounded-lg border px-4 py-3 flex items-center justify-between gap-4 transition-colors duration-200 group"
                  style={{
                    borderColor: layer.accent ? 'var(--kb-accent)' : 'var(--kb-border)',
                    backgroundColor: layer.accent
                      ? 'color-mix(in srgb, var(--kb-brand) 20%, var(--kb-surface))'
                      : 'var(--kb-surface)',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'var(--kb-border-hover)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = layer.accent
                      ? 'var(--kb-accent)'
                      : 'var(--kb-border)';
                  }}
                >
                  <div className="flex items-center gap-3">
                    {/* Layer index dot */}
                    <span
                      className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold flex-shrink-0"
                      style={{
                        backgroundColor: layer.accent
                          ? 'var(--kb-accent)'
                          : 'var(--kb-surface-elevated)',
                        color: layer.accent ? '#F8F5F2' : 'var(--kb-text-faint)',
                      }}
                    >
                      {i + 1}
                    </span>
                    <div>
                      <div
                        className="text-xs sm:text-sm font-semibold leading-tight"
                        style={{ color: layer.accent ? 'var(--kb-text)' : 'var(--kb-text)' }}
                      >
                        {layer.label}
                      </div>
                      {layer.sublabel && (
                        <div
                          className="text-[10px] mt-0.5 leading-tight"
                          style={{ color: 'var(--kb-text-faint)' }}
                        >
                          {layer.sublabel}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Animated flow indicator on every non-last layer */}
                  {i < LAYERS.length - 1 && (
                    <div
                      className="w-6 h-px relative overflow-hidden flex-shrink-0"
                      style={{ backgroundColor: 'var(--kb-border)' }}
                    >
                      <div
                        className="absolute inset-y-0 left-0 w-3"
                        style={{
                          backgroundColor: 'var(--kb-accent)',
                          animation: `slideRight 1.4s ease-in-out ${i * 0.18}s infinite`,
                          opacity: 0.7,
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Downward connector */}
                {i < LAYERS.length - 1 && (
                  <div className="flex justify-center">
                    <div
                      className="w-px h-2"
                      style={{ backgroundColor: 'var(--kb-border)', opacity: 0.5 }}
                    />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      <style>{`
        @keyframes slideRight {
          0% { transform: translateX(-100%); opacity: 0; }
          30% { opacity: 0.8; }
          70% { opacity: 0.8; }
          100% { transform: translateX(400%); opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          @keyframes slideRight { 0%, 100% { opacity: 0; } }
        }
      `}</style>
    </section>
  );
};
