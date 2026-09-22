import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, BookOpen, Circle } from 'lucide-react';

const prefersReducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const fadeUp = {
  initial: { opacity: 0, y: prefersReducedMotion ? 0 : 24 },
  animate: { opacity: 1, y: 0 },
};

const STATUS_ITEMS = [
  { label: 'Local-first' },
  { label: 'Multi-agent' },
  { label: 'Developer-focused' },
];

// All 14 agents from the actual KernelBase documentation
const ALL_AGENTS = [
  { label: 'Planner',      color: '#a64011', ring: 0 },
  { label: 'Orchestrator', color: '#a64011', ring: 0 },
  { label: 'Coder',        color: '#752c12', ring: 0 },
  { label: 'Debugger',     color: '#752c12', ring: 0 },
  { label: 'Research',     color: '#5a2010', ring: 0 },
  { label: 'Data Analyst', color: '#5a2010', ring: 0 },
  { label: 'QA & Test',    color: '#5a2010', ring: 1 },
  { label: 'Reviewer',     color: '#5a2010', ring: 1 },
  { label: 'Security',     color: '#5a2010', ring: 1 },
  { label: 'UI / UX',      color: '#5a2010', ring: 1 },
  { label: 'SEO',          color: '#3d1508', ring: 1 },
  { label: 'Docs',         color: '#3d1508', ring: 1 },
  { label: 'DevOps',       color: '#3d1508', ring: 1 },
  { label: 'Report',       color: '#3d1508', ring: 1 },
];

// Place agents evenly on two concentric rings around centre
function buildRingPositions(
  cx: number,
  cy: number,
  innerR: number,
  outerR: number,
  agents: typeof ALL_AGENTS
) {
  const inner = agents.filter((a) => a.ring === 0);
  const outer = agents.filter((a) => a.ring === 1);

  const toPos = (list: typeof ALL_AGENTS, r: number, offset = 0) =>
    list.map((a, i) => {
      const angle = (2 * Math.PI * i) / list.length - Math.PI / 2 + offset;
      return { ...a, x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
    });

  return [
    ...toPos(inner, innerR, 0),
    ...toPos(outer, outerR, Math.PI / outer.length),
  ];
}

const CX = 200, CY = 195;
const INNER_R = 68, OUTER_R = 128;
const agentPositions = buildRingPositions(CX, CY, INNER_R, OUTER_R, ALL_AGENTS);

// Radial agent visualization showing all 14 documented agents
const HeroVisualization: React.FC = () => {
  const [pulse, setPulse] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion) return;
    const id = setInterval(() => setPulse((p) => (p + 1) % agentPositions.length), 420);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative w-full max-w-lg mx-auto select-none" aria-hidden>
      <svg viewBox="0 0 400 390" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
        {/* Orbit rings */}
        <circle cx={CX} cy={CY} r={INNER_R} fill="none"
          stroke="var(--kb-border)" strokeWidth="0.8" strokeDasharray="3 4" opacity="0.35" />
        <circle cx={CX} cy={CY} r={OUTER_R} fill="none"
          stroke="var(--kb-border)" strokeWidth="0.8" strokeDasharray="3 6" opacity="0.22" />

        {/* Spoke lines from centre to each agent */}
        {agentPositions.map((a, i) => (
          <motion.line
            key={`spoke-${a.label}`}
            x1={CX} y1={CY}
            x2={a.x} y2={a.y}
            stroke={i === pulse ? 'var(--kb-accent)' : 'var(--kb-border)'}
            strokeWidth={i === pulse ? 1.2 : 0.7}
            opacity={i === pulse ? 0.7 : 0.3}
            style={{ transition: prefersReducedMotion ? 'none' : 'stroke 0.4s, opacity 0.4s' }}
          />
        ))}

        {/* Agent nodes */}
        {agentPositions.map((a, i) => {
          const isActive = i === pulse;
          const isOuter = a.ring === 1;
          const r = isOuter ? 18 : 22;
          return (
            <motion.g
              key={a.label}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: prefersReducedMotion ? 0 : 0.4 + i * 0.08, duration: 0.35 }}
            >
              {/* Glow ring when active */}
              {isActive && !prefersReducedMotion && (
                <circle cx={a.x} cy={a.y} r={r + 5}
                  fill="none" stroke="var(--kb-accent)" strokeWidth="1"
                  opacity="0.35" />
              )}
              <circle
                cx={a.x} cy={a.y} r={r}
                fill={isActive ? 'var(--kb-brand)' : 'var(--kb-surface-elevated)'}
                stroke={isActive ? 'var(--kb-accent)' : 'var(--kb-border)'}
                strokeWidth={isActive ? 1.5 : 1}
                style={{ transition: prefersReducedMotion ? 'none' : 'fill 0.4s, stroke 0.4s' }}
              />
              <text
                x={a.x} y={a.y + 1}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={isOuter ? 6.5 : 7.5}
                fontWeight="600"
                fill={isActive ? '#F8F5F2' : 'var(--kb-text-muted)'}
                fontFamily="ui-sans-serif, system-ui, sans-serif"
                style={{ transition: prefersReducedMotion ? 'none' : 'fill 0.4s', pointerEvents: 'none' }}
              >
                {a.label}
              </text>
            </motion.g>
          );
        })}

        {/* Central KernelBase hub */}
        <motion.g
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: prefersReducedMotion ? 0 : 0.2, duration: 0.5 }}
        >
          {/* Outer glow */}
          <circle cx={CX} cy={CY} r="36" fill="none"
            stroke="var(--kb-brand)" strokeWidth="1" opacity="0.25" />
          {/* Core */}
          <circle cx={CX} cy={CY} r="30"
            fill="var(--kb-brand)" stroke="var(--kb-accent)" strokeWidth="1.5" />
          <text x={CX} y={CY - 5} textAnchor="middle" fontSize="9" fontWeight="700"
            fill="#F8F5F2" fontFamily="ui-sans-serif, system-ui, sans-serif">Kernel</text>
          <text x={CX} y={CY + 7} textAnchor="middle" fontSize="9" fontWeight="700"
            fill="#F8F5F2" fontFamily="ui-sans-serif, system-ui, sans-serif">Base</text>
        </motion.g>

        {/* Developer node above */}
        <motion.g
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: prefersReducedMotion ? 0 : 0.1, duration: 0.4 }}
        >
          <line x1={CX} y1={CY - 30} x2={CX} y2="52"
            stroke="var(--kb-brand)" strokeWidth="1" strokeDasharray="3 3" opacity="0.45" />
          <rect x="148" y="18" width="104" height="32" rx="7"
            fill="var(--kb-surface-elevated)" stroke="var(--kb-brand)" strokeWidth="1.5" />
          <text x={CX} y="38" textAnchor="middle" fontSize="11" fontWeight="600"
            fill="var(--kb-text)" fontFamily="ui-sans-serif, system-ui, sans-serif">Developer</text>
        </motion.g>

        {/* Agent count label */}
        <motion.text
          x={CX} y="380"
          textAnchor="middle" fontSize="8.5" fontWeight="500"
          fill="var(--kb-text-faint)"
          fontFamily="ui-sans-serif, system-ui, sans-serif"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: prefersReducedMotion ? 0 : 1.6, duration: 0.4 }}
        >
          14 specialized agents · coordinated by Agent Runtime
        </motion.text>
      </svg>
    </div>
  );
};

import { TechMarquee } from './TechMarquee';

export const Hero: React.FC = () => {
  const handleDocsNav = () => {
    window.location.hash = 'get-started/overview';
  };

  const handleScrollToProduct = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById('product');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section
      className="relative flex flex-col justify-between pt-20 sm:pt-24 pb-4 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      {/* Subtle grid background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 50% 30%, color-mix(in srgb, var(--kb-brand) 8%, transparent), transparent 60%)`,
        }}
        aria-hidden
      />

      <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-10 lg:gap-16 items-center mb-8">
        {/* Left: Text */}
        <div className="flex flex-col gap-6">
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <span
              className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase px-3 py-1.5 rounded-full border"
              style={{
                color: 'var(--kb-accent)',
                borderColor: 'color-mix(in srgb, var(--kb-brand) 40%, transparent)',
                backgroundColor: 'color-mix(in srgb, var(--kb-brand) 10%, transparent)',
              }}
            >
              AI-NATIVE DEVELOPMENT ENVIRONMENT
            </span>
          </motion.div>

          <motion.h1
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight"
            style={{ color: 'var(--kb-text)' }}
          >
            Build software
            <br />
            <span style={{ color: 'var(--kb-accent)' }}>with intelligent agents.</span>
          </motion.h1>

          <motion.p
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-base sm:text-lg leading-relaxed max-w-xl"
            style={{ color: 'var(--kb-text-muted)' }}
          >
            KernelBase is an AI-native development environment that brings agents, project context,
            execution, and developer workflows into one unified workspace.
          </motion.p>

          {/* CTAs */}
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap gap-3"
          >
            <a
              href="#product"
              onClick={handleScrollToProduct}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-150"
              style={{
                backgroundColor: 'var(--kb-brand)',
                color: '#F8F5F2',
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = 'var(--kb-brand-secondary)')}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = 'var(--kb-brand)')}
            >
              Explore KernelBase
              <ArrowRight size={15} />
            </a>
            <button
              onClick={handleDocsNav}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold border transition-all duration-150"
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
              <BookOpen size={15} />
              Read the Docs
            </button>
          </motion.div>

          {/* Status indicators */}
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex flex-wrap gap-4"
          >
            {STATUS_ITEMS.map((item) => (
              <div key={item.label} className="flex items-center gap-1.5">
                <Circle
                  size={6}
                  fill="var(--kb-accent)"
                  style={{ color: 'var(--kb-accent)' }}
                />
                <span className="text-xs font-medium" style={{ color: 'var(--kb-text-subtle)' }}>
                  {item.label}
                </span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right: Visualization */}
        <motion.div
          initial={{ opacity: 0, x: prefersReducedMotion ? 0 : 32 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex items-center justify-center"
        >
          <HeroVisualization />
        </motion.div>
      </div>

      {/* Tech Marquee directly visible within hero section bottom */}
      <div className="w-full mt-4">
        <TechMarquee />
      </div>
    </section>
  );
};
