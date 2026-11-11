import React, { useMemo, useRef, useState } from 'react';
import { motion, useScroll, useTransform, type Variants } from 'motion/react';
import {
  Apple,
  ArrowRight,
  BookOpen,
  Bot,
  Check,
  Copy,
  Cpu,
  Download,
  Eye,
  FileDiff,
  GitBranch,
  Github,
  KeyRound,
  Layers,
  Monitor,
  Moon,
  Network,
  Search,
  ShieldCheck,
  Stethoscope,
  Sun,
  Terminal,
  TestTube2,
  Code2,
  Brain,
  Ruler,
  Server,
} from 'lucide-react';
import { KernelScene } from './KernelScene';
import {
  CHECKSUMS_URL,
  IDE_VERSION,
  INSTALLERS,
  detectPlatform,
  downloadUrl,
  formatSize,
  type InstallerBuild,
} from '../../data/downloads';

interface LandingPageProps {
  isDark: boolean;
  onToggleTheme: () => void;
  onOpenDocs: (slug?: string) => void;
}

const GITHUB_URL = 'https://github.com/Sujoymoulick/kernelbase-docs';

// ── Reveal helpers ──────────────────────────────────────────────────────────
const ease = [0.16, 1, 0.3, 1] as const;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 36, filter: 'blur(6px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.8, ease } },
};

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const Reveal: React.FC<{ children: React.ReactNode; className?: string; delay?: number }> = ({
  children,
  className,
  delay = 0,
}) => (
  <motion.div
    className={className}
    initial="hidden"
    whileInView="show"
    viewport={{ once: true, amount: 0.2 }}
    variants={fadeUp}
    transition={{ delay }}
  >
    {children}
  </motion.div>
);

const SectionHeading: React.FC<{ eyebrow: string; title: React.ReactNode; lead?: string }> = ({
  eyebrow,
  title,
  lead,
}) => (
  <Reveal className="max-w-3xl mb-12 sm:mb-16">
    <p className="text-xs font-semibold tracking-[0.22em] uppercase mb-4" style={{ color: 'var(--kb-accent-bright)' }}>
      {eyebrow}
    </p>
    <h2 className="text-3xl sm:text-5xl font-bold tracking-tight leading-[1.08]">{title}</h2>
    {lead && (
      <p className="mt-5 text-base sm:text-lg leading-relaxed" style={{ color: 'var(--kb-text-muted)' }}>
        {lead}
      </p>
    )}
  </Reveal>
);

const glass: React.CSSProperties = {
  backgroundColor: 'color-mix(in srgb, var(--kb-surface) 72%, transparent)',
  borderColor: 'var(--kb-border)',
  backdropFilter: 'blur(14px)',
  WebkitBackdropFilter: 'blur(14px)',
};

// ── Content ────────────────────────────────────────────────────────────────
const FEATURES = [
  { icon: Bot, title: 'Autonomous agent swarm', text: 'Seven specialised agents coordinate through a DAG task graph and stream their reasoning live while they work.' },
  { icon: Code2, title: 'Monaco code editor', text: 'VS Code-grade editing: tabs, dirty-state tracking, multi-language syntax, diagnostics and familiar shortcuts.' },
  { icon: Terminal, title: 'Native terminal', text: 'Multi-tab xterm.js wired to a real PTY shell (zsh / bash) with fit and web-link addons.' },
  { icon: GitBranch, title: 'Git panel', text: 'Stage, unstage, diff, switch branches, commit and push from a visual Git porcelain manager.' },
  { icon: FileDiff, title: 'Diff reviewer', text: 'Inspect every agent proposal side-by-side and accept or reject chunk by chunk before anything touches disk.' },
  { icon: ShieldCheck, title: 'Zero-trust security gate', text: 'A permission broker intercepts file mutations and destructive commands like rm -rf, sudo and dd.' },
  { icon: Network, title: 'Multi-provider models', text: 'Gemini, Claude, OpenAI, custom gateways, or fully local Ollama models running on your own machine.' },
  { icon: KeyRound, title: 'Keychain key storage', text: 'API keys are stored in the OS keychain, never in plain-text config files.' },
];

const AGENTS = [
  { icon: Brain, name: 'Orchestrator', role: 'Reads your intent, delegates work and balances the swarm.', skill: 'Task-graph dispatch', color: '#E86526' },
  { icon: Ruler, name: 'Planner', role: 'Breaks a feature request into a dependency-mapped DAG.', skill: 'Dependency resolution', color: '#F59E0B' },
  { icon: Code2, name: 'Coder', role: 'Writes and refactors code across files and produces diffs.', skill: 'Multi-file generation', color: '#D9531E' },
  { icon: TestTube2, name: 'Tester', role: 'Runs vitest, jest, pytest or cargo test and validates fixes.', skill: 'Test synthesis', color: '#22C55E' },
  { icon: Eye, name: 'Reviewer', role: 'Audits quality, type safety, performance and security.', skill: 'Static analysis', color: '#38BDF8' },
  { icon: Search, name: 'Researcher', role: 'Indexes the codebase and pulls API docs and patterns.', skill: 'Semantic search', color: '#A78BFA' },
  { icon: Stethoscope, name: 'Debugger', role: 'Reads stack traces, isolates root causes, ships surgical patches.', skill: 'Patch verification', color: '#F43F5E' },
];

const PIPELINE = [
  { step: '01', title: 'Intent', text: 'Describe the change in plain language, or point at an issue.' },
  { step: '02', title: 'Plan', text: 'The Planner builds a DAG of tasks with explicit dependencies.' },
  { step: '03', title: 'Build', text: 'Coder and Researcher run in parallel on scoped, clean contexts.' },
  { step: '04', title: 'Verify', text: 'Tester and Debugger loop: compile, test, diagnose, self-repair.' },
  { step: '05', title: 'Review', text: 'The Reviewer audits, then you approve each diff in the inspector.' },
  { step: '06', title: 'Commit', text: 'Approved changes are staged and committed from the Git panel.' },
];

const COMPARISON = [
  ['Task scope', 'Linear prompt and response', 'DAG decomposition with dependency tracking'],
  ['Context', 'One monolithic window that forgets', 'Scoped context per agent'],
  ['Safety', 'Runs on the host or needs copy-paste', 'Permission gates and diff approval'],
  ['Verification', 'Text generation, no runtime feedback', 'Compile, test, diagnose, repair loop'],
  ['Models', 'Locked to one cloud provider', 'Cloud, custom gateway or local Ollama'],
];

const STACK = [
  { icon: Layers, title: 'Frontend & editor', items: ['React 19', 'Monaco Editor', 'Tailwind CSS v4', 'xterm.js', 'Motion'] },
  { icon: Cpu, title: 'AI & multi-agent', items: ['Google GenAI SDK', 'DAG task planner', 'Tool execution engine', 'Context manager', 'Ollama / LiteLLM'] },
  { icon: Server, title: 'Desktop runtime', items: ['Electron', 'Node.js 22', 'Native PTY shell', 'Git porcelain', 'Keychain bridge'] },
];

// ── Small components ───────────────────────────────────────────────────────
const CopyButton: React.FC<{ value: string; label?: string }> = ({ value, label = 'Copy' }) => {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        } catch {
          /* clipboard blocked */
        }
      }}
      className="shrink-0 inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium border transition-colors hover:opacity-80"
      style={{ borderColor: 'var(--kb-border)', color: 'var(--kb-text-subtle)' }}
      aria-label={`${label} to clipboard`}
    >
      {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
      {copied ? 'Copied' : label}
    </button>
  );
};

const PlatformIcon: React.FC<{ os: InstallerBuild['os']; className?: string }> = ({ os, className }) =>
  os === 'macOS' ? <Apple className={className} /> : <Monitor className={className} />;

const DownloadCard: React.FC<{ build: InstallerBuild; primary: boolean }> = ({ build, primary }) => (
  <motion.div
    variants={fadeUp}
    className="relative rounded-2xl border p-6 flex flex-col h-full"
    style={{
      ...glass,
      borderColor: primary ? 'var(--kb-accent)' : 'var(--kb-border)',
      boxShadow: primary ? '0 0 0 1px var(--kb-accent), 0 24px 60px -24px rgba(232,101,38,0.55)' : undefined,
    }}
  >
    {primary && (
      <span
        className="absolute -top-3 left-6 rounded-full px-3 py-0.5 text-[11px] font-semibold text-white"
        style={{ background: 'linear-gradient(90deg, var(--kb-brand-secondary), var(--kb-accent-bright))' }}
      >
        Recommended for you
      </span>
    )}
    <div className="flex items-center gap-3 mb-4">
      <div className="h-11 w-11 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--kb-surface-secondary)' }}>
        <PlatformIcon os={build.os} className="h-5 w-5" />
      </div>
      <div>
        <h3 className="font-semibold text-lg leading-tight">{build.os}</h3>
        <p className="text-sm" style={{ color: 'var(--kb-text-subtle)' }}>{build.arch}</p>
      </div>
    </div>

    <p className="text-sm mb-5" style={{ color: 'var(--kb-text-muted)' }}>{build.requirements}</p>

    <a
      href={downloadUrl(build)}
      download={build.fileName}
      className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 font-semibold text-white transition-transform hover:-translate-y-0.5 active:translate-y-0"
      style={{ background: 'linear-gradient(135deg, var(--kb-brand-secondary), var(--kb-accent-bright))' }}
    >
      <Download className="h-4 w-4" />
      {build.format} · {formatSize(build.sizeBytes)}
    </a>

    <ol className="mt-6 space-y-3 text-sm flex-1">
      {build.installSteps.map((s, i) => (
        <li key={i} className="flex gap-3">
          <span
            className="h-5 w-5 shrink-0 rounded-full text-[11px] font-semibold flex items-center justify-center mt-0.5"
            style={{ backgroundColor: 'var(--kb-surface-secondary)', color: 'var(--kb-accent-bright)' }}
          >
            {i + 1}
          </span>
          <div className="min-w-0 flex-1">
            <p style={{ color: 'var(--kb-text-muted)' }}>{s.text}</p>
            {s.code && (
              <div
                className="mt-2 flex items-center gap-2 rounded-lg px-3 py-2"
                style={{ backgroundColor: 'var(--kb-code-bg)', color: 'var(--kb-code-text)' }}
              >
                <code className="text-[12px] flex-1 min-w-0 overflow-x-auto whitespace-nowrap">{s.code}</code>
                <CopyButton value={s.code} />
              </div>
            )}
          </div>
        </li>
      ))}
    </ol>

    <div className="mt-6 pt-4 border-t" style={{ borderColor: 'var(--kb-border)' }}>
      <div className="flex items-center justify-between gap-2 mb-1">
        <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--kb-text-faint)' }}>SHA-256</span>
        <CopyButton value={build.sha256} />
      </div>
      <code className="block text-[11px] break-all leading-relaxed" style={{ color: 'var(--kb-text-subtle)' }}>
        {build.sha256}
      </code>
    </div>
  </motion.div>
);

// ── Page ───────────────────────────────────────────────────────────────────
export const LandingPage: React.FC<LandingPageProps> = ({ isDark, onToggleTheme, onOpenDocs }) => {
  const platform = useMemo(detectPlatform, []);
  const primary = INSTALLERS.find((b) => b.id === platform) ?? INSTALLERS[0];

  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress: heroProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(heroProgress, [0, 1], [0, -120]);
  const heroOpacity = useTransform(heroProgress, [0, 0.8], [1, 0]);

  const pipeRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: pipeProgress } = useScroll({ target: pipeRef, offset: ['start 75%', 'end 55%'] });
  const pipeScale = useTransform(pipeProgress, [0, 1], [0, 1]);

  const { scrollYProgress: pageProgress } = useScroll();

  const navLinks = [
    { href: '#features', label: 'Features' },
    { href: '#agents', label: 'Agents' },
    { href: '#how', label: 'How it works' },
    { href: '#security', label: 'Security' },
    { href: '#download', label: 'Download' },
  ];

  const scrollTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="relative min-h-screen overflow-x-clip" style={{ backgroundColor: 'var(--kb-bg)', color: 'var(--kb-text)' }}>
      {/* Ambient gradient behind the WebGL canvas */}
      <div
        aria-hidden
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          background: isDark
            ? 'radial-gradient(ellipse 80% 60% at 70% 30%, rgba(117,44,18,0.35), transparent 70%), radial-gradient(ellipse 60% 50% at 10% 90%, rgba(166,64,17,0.18), transparent 70%)'
            : 'radial-gradient(ellipse 80% 60% at 70% 30%, rgba(232,101,38,0.12), transparent 70%)',
        }}
      />
      <KernelScene isDark={isDark} />

      {/* Scroll progress bar */}
      <motion.div
        aria-hidden
        className="fixed top-0 left-0 right-0 h-[2px] z-50 origin-left"
        style={{ scaleX: pageProgress, background: 'linear-gradient(90deg, var(--kb-brand-secondary), var(--kb-accent-bright))' }}
      />

      {/* ── Nav ─────────────────────────────────────────────────────────── */}
      <header className="fixed top-0 inset-x-0 z-40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 mt-3">
          <nav className="flex items-center justify-between gap-3 rounded-2xl border px-3 sm:px-5 h-14" style={glass}>
            <a href="#top" onClick={(e) => scrollTo(e, '#top')} className="flex items-center gap-2.5 shrink-0">
              <img src="/logo.png" alt="" width={28} height={28} className="object-contain" />
              <span className="font-bold tracking-tight">Kernel Base</span>
            </a>
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={(e) => scrollTo(e, l.href)}
                  className="px-3 py-1.5 rounded-lg text-sm transition-colors hover:opacity-100 opacity-80"
                  style={{ color: 'var(--kb-text-muted)' }}
                >
                  {l.label}
                </a>
              ))}
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                type="button"
                onClick={onToggleTheme}
                className="h-9 w-9 rounded-lg flex items-center justify-center transition-colors"
                style={{ color: 'var(--kb-text-subtle)' }}
                aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
              >
                {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noreferrer"
                className="hidden sm:flex h-9 w-9 rounded-lg items-center justify-center"
                style={{ color: 'var(--kb-text-subtle)' }}
                aria-label="GitHub repository"
              >
                <Github className="h-4 w-4" />
              </a>
              <button
                type="button"
                onClick={() => onOpenDocs()}
                className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border px-3 h-9 text-sm font-medium"
                style={{ borderColor: 'var(--kb-border)' }}
              >
                <BookOpen className="h-4 w-4" /> Docs
              </button>
              <a
                href="#download"
                onClick={(e) => scrollTo(e, '#download')}
                className="inline-flex items-center gap-1.5 rounded-lg px-3 h-9 text-sm font-semibold text-white"
                style={{ background: 'linear-gradient(135deg, var(--kb-brand-secondary), var(--kb-accent-bright))' }}
              >
                <Download className="h-4 w-4" /> <span className="hidden xs:inline sm:inline">Download</span>
              </a>
            </div>
          </nav>
        </div>
      </header>

      <main className="relative z-10">
        {/* ── Hero ──────────────────────────────────────────────────────── */}
        <section id="top" ref={heroRef} className="min-h-[100svh] flex items-center pt-28 pb-16">
          <motion.div style={{ y: heroY, opacity: heroOpacity }} className="mx-auto max-w-7xl w-full px-4 sm:px-6">
            <motion.div initial="hidden" animate="show" variants={stagger} className="max-w-2xl">
              <motion.a
                variants={fadeUp}
                href="#download"
                onClick={(e) => scrollTo(e, '#download')}
                className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium mb-7"
                style={glass}
              >
                <span className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ backgroundColor: 'var(--kb-accent-bright)' }} />
                v{IDE_VERSION} preview · macOS & Linux builds available
                <ArrowRight className="h-3 w-3" />
              </motion.a>

              <motion.h1 variants={fadeUp} className="text-[2.6rem] leading-[1.02] sm:text-6xl lg:text-7xl font-bold tracking-tight">
                The IDE where an
                <br />
                <span
                  className="bg-clip-text text-transparent"
                  style={{ backgroundImage: 'linear-gradient(100deg, var(--kb-accent-bright), #FFB37A 45%, var(--kb-brand-secondary))' }}
                >
                  agent swarm
                </span>{' '}
                ships with you.
              </motion.h1>

              <motion.p variants={fadeUp} className="mt-6 text-lg sm:text-xl leading-relaxed max-w-xl" style={{ color: 'var(--kb-text-muted)' }}>
                Kernel Base is an AI-native desktop IDE. Seven specialised agents plan, write, test, review and debug code
                together in your workspace, and nothing lands on disk until you approve the diff.
              </motion.p>

              <motion.div variants={fadeUp} className="mt-9 flex flex-col sm:flex-row gap-3">
                <a
                  href={downloadUrl(primary)}
                  download={primary.fileName}
                  className="group inline-flex items-center justify-center gap-2.5 rounded-xl px-6 py-3.5 font-semibold text-white shadow-lg transition-transform hover:-translate-y-0.5"
                  style={{
                    background: 'linear-gradient(135deg, var(--kb-brand-secondary), var(--kb-accent-bright))',
                    boxShadow: '0 18px 40px -16px rgba(232,101,38,0.7)',
                  }}
                >
                  <PlatformIcon os={primary.os} className="h-5 w-5" />
                  {primary.label}
                  <span className="text-white/75 text-sm font-normal">{formatSize(primary.sizeBytes)}</span>
                </a>
                <button
                  type="button"
                  onClick={() => onOpenDocs()}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border px-6 py-3.5 font-semibold transition-colors"
                  style={glass}
                >
                  <BookOpen className="h-5 w-5" /> Read the docs
                </button>
              </motion.div>

              <motion.p variants={fadeUp} className="mt-4 text-sm" style={{ color: 'var(--kb-text-faint)' }}>
                Also on{' '}
                {INSTALLERS.filter((b) => b.id !== primary.id).map((b, i, arr) => (
                  <React.Fragment key={b.id}>
                    <a href={downloadUrl(b)} download={b.fileName} className="underline underline-offset-4 hover:opacity-80" style={{ color: 'var(--kb-text-subtle)' }}>
                      {b.shortName}
                    </a>
                    {i < arr.length - 1 ? ' and ' : ''}
                  </React.Fragment>
                ))}
                {' '}· Apache 2.0
              </motion.p>
            </motion.div>
          </motion.div>
        </section>

        {/* ── Stats strip ───────────────────────────────────────────────── */}
        <section className="px-4 sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.4 }}
            variants={stagger}
            className="mx-auto max-w-7xl grid grid-cols-2 lg:grid-cols-4 rounded-2xl border overflow-hidden"
            style={glass}
          >
            {[
              ['7', 'specialised agents'],
              ['3', 'native builds: macOS arm64, Linux x64 & arm64'],
              ['Cloud + local', 'Gemini, Claude, OpenAI or Ollama'],
              ['100%', 'of agent edits gated by your approval'],
            ].map(([n, l], i) => (
              <motion.div
                key={l}
                variants={fadeUp}
                className={`p-6 sm:p-8 ${i % 2 === 0 ? 'border-r' : ''} ${i < 2 ? 'border-b lg:border-b-0' : ''} ${i === 1 ? 'lg:border-r' : ''}`}
                style={{ borderColor: 'var(--kb-border)' }}
              >
                <div className="text-2xl sm:text-4xl font-bold tracking-tight" style={{ color: 'var(--kb-accent-bright)' }}>{n}</div>
                <div className="mt-1 text-sm" style={{ color: 'var(--kb-text-subtle)' }}>{l}</div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* ── What it is ────────────────────────────────────────────────── */}
        <section className="px-4 sm:px-6 py-24 sm:py-32">
          <div className="mx-auto max-w-7xl">
            <SectionHeading
              eyebrow="Why Kernel Base"
              title={<>Not an editor with a chat box.<br className="hidden sm:block" /> A runtime for agent teams.</>}
              lead="Real pull requests need design, library research, tests, security review and edge-case debugging. One model in one context window runs out of room. Kernel Base splits the work into a task graph and gives each step to an agent with its own tools, prompt and clean context."
            />
            <Reveal>
              <div className="rounded-2xl border overflow-hidden" style={glass}>
                <div className="grid grid-cols-[1fr_1fr] sm:grid-cols-[180px_1fr_1fr] text-sm">
                  <div className="hidden sm:block p-4 font-semibold border-b" style={{ borderColor: 'var(--kb-border)', color: 'var(--kb-text-faint)' }} />
                  <div className="p-4 font-semibold border-b" style={{ borderColor: 'var(--kb-border)', color: 'var(--kb-text-faint)' }}>Single-agent assistant</div>
                  <div className="p-4 font-semibold border-b" style={{ borderColor: 'var(--kb-border)', color: 'var(--kb-accent-bright)' }}>Kernel Base</div>
                  {COMPARISON.map(([dim, legacy, kb]) => (
                    <React.Fragment key={dim}>
                      <div className="hidden sm:block p-4 font-medium border-b" style={{ borderColor: 'var(--kb-border)' }}>{dim}</div>
                      <div className="p-4 border-b" style={{ borderColor: 'var(--kb-border)', color: 'var(--kb-text-subtle)' }}>
                        <span className="sm:hidden block text-[11px] font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--kb-text-faint)' }}>{dim}</span>
                        {legacy}
                      </div>
                      <div className="p-4 border-b flex gap-2" style={{ borderColor: 'var(--kb-border)' }}>
                        <Check className="h-4 w-4 shrink-0 mt-0.5 sm:mt-0.5" style={{ color: 'var(--kb-accent-bright)' }} />
                        <span><span className="sm:hidden block text-[11px] font-semibold uppercase tracking-wider mb-1 opacity-0">.</span>{kb}</span>
                      </div>
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── Features ──────────────────────────────────────────────────── */}
        <section id="features" className="px-4 sm:px-6 py-24 sm:py-32 scroll-mt-20">
          <div className="mx-auto max-w-7xl">
            <SectionHeading
              eyebrow="Features"
              title="Everything a desktop IDE needs, built around agents."
              lead="A full editor, terminal and Git workflow, with an agent runtime and a security layer underneath."
            />
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.15 }}
              variants={stagger}
              className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4"
            >
              {FEATURES.map((f) => (
                <motion.div
                  key={f.title}
                  variants={fadeUp}
                  whileHover={{ y: -6 }}
                  className="group rounded-2xl border p-6 transition-colors"
                  style={glass}
                >
                  <div
                    className="h-11 w-11 rounded-xl flex items-center justify-center mb-5 transition-transform group-hover:scale-110"
                    style={{ background: 'linear-gradient(135deg, var(--kb-brand), var(--kb-accent))' }}
                  >
                    <f.icon className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="font-semibold mb-2">{f.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--kb-text-subtle)' }}>{f.text}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── Agents ────────────────────────────────────────────────────── */}
        <section id="agents" className="px-4 sm:px-6 py-24 sm:py-32 scroll-mt-20">
          <div className="mx-auto max-w-7xl">
            <SectionHeading
              eyebrow="The swarm"
              title="Seven agents. One shared task graph."
              lead="Each agent has a narrow job, its own tools and its own context. The Orchestrator keeps them in sync, and you watch their reasoning stream in real time."
            />
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.1 }}
              variants={stagger}
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {AGENTS.map((a, i) => (
                <motion.div
                  key={a.name}
                  variants={fadeUp}
                  whileHover={{ y: -6 }}
                  className={`relative rounded-2xl border p-6 overflow-hidden ${i === 0 ? 'lg:col-span-1 sm:col-span-2 lg:row-span-1' : ''}`}
                  style={glass}
                >
                  <div
                    aria-hidden
                    className="absolute -top-16 -right-16 h-40 w-40 rounded-full blur-3xl opacity-25"
                    style={{ backgroundColor: a.color }}
                  />
                  <div className="relative flex items-start gap-4">
                    <div className="h-12 w-12 shrink-0 rounded-xl flex items-center justify-center border" style={{ borderColor: a.color, color: a.color }}>
                      <a.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg">{a.name}</h3>
                        <span className="text-[10px] font-mono" style={{ color: 'var(--kb-text-faint)' }}>0{i + 1}</span>
                      </div>
                      <p className="mt-1 text-sm leading-relaxed" style={{ color: 'var(--kb-text-muted)' }}>{a.role}</p>
                      <span
                        className="mt-3 inline-block rounded-full px-2.5 py-0.5 text-[11px] font-medium"
                        style={{ backgroundColor: `${a.color}22`, color: a.color }}
                      >
                        {a.skill}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
              <motion.button
                type="button"
                variants={fadeUp}
                onClick={() => onOpenDocs('agents/creating-custom-agents')}
                className="rounded-2xl border border-dashed p-6 flex flex-col items-start justify-center text-left transition-colors hover:opacity-90"
                style={{ borderColor: 'var(--kb-border-hover)', color: 'var(--kb-text-muted)' }}
              >
                <span className="font-semibold" style={{ color: 'var(--kb-text)' }}>Build your own team</span>
                <span className="text-sm mt-1">Compose custom agent teams for your stack in the docs.</span>
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium" style={{ color: 'var(--kb-accent-bright)' }}>
                  Agent docs <ArrowRight className="h-4 w-4" />
                </span>
              </motion.button>
            </motion.div>
          </div>
        </section>

        {/* ── How it works ──────────────────────────────────────────────── */}
        <section id="how" className="px-4 sm:px-6 py-24 sm:py-32 scroll-mt-20">
          <div className="mx-auto max-w-7xl">
            <SectionHeading
              eyebrow="How it works"
              title="From intent to commit, with you in the loop."
              lead="Work flows through a directed acyclic graph. Independent tasks run in parallel; dependent tasks wait for their inputs. Failing tests loop back to the Debugger until they pass."
            />
            <div ref={pipeRef} className="relative">
              {/* Track */}
              <div aria-hidden className="absolute left-[19px] top-2 bottom-2 w-[2px] md:hidden" style={{ backgroundColor: 'var(--kb-border)' }} />
              <motion.div
                aria-hidden
                className="absolute left-[19px] top-2 bottom-2 w-[2px] md:hidden origin-top"
                style={{ scaleY: pipeScale, background: 'linear-gradient(180deg, var(--kb-brand-secondary), var(--kb-accent-bright))' }}
              />
              <div aria-hidden className="hidden md:block absolute left-0 right-0 top-[19px] h-[2px]" style={{ backgroundColor: 'var(--kb-border)' }} />
              <motion.div
                aria-hidden
                className="hidden md:block absolute left-0 right-0 top-[19px] h-[2px] origin-left"
                style={{ scaleX: pipeScale, background: 'linear-gradient(90deg, var(--kb-brand-secondary), var(--kb-accent-bright))' }}
              />
              <motion.ol
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.25 }}
                variants={stagger}
                className="relative grid md:grid-cols-6 gap-8 md:gap-4"
              >
                {PIPELINE.map((p) => (
                  <motion.li key={p.step} variants={fadeUp} className="flex md:flex-col gap-4 md:gap-5">
                    <span
                      className="relative z-10 h-10 w-10 shrink-0 rounded-full border-2 flex items-center justify-center text-xs font-bold"
                      style={{ borderColor: 'var(--kb-accent-bright)', backgroundColor: 'var(--kb-bg)', color: 'var(--kb-accent-bright)' }}
                    >
                      {p.step}
                    </span>
                    <div>
                      <h3 className="font-semibold text-lg">{p.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed" style={{ color: 'var(--kb-text-subtle)' }}>{p.text}</p>
                    </div>
                  </motion.li>
                ))}
              </motion.ol>
            </div>
          </div>
        </section>

        {/* ── Security ──────────────────────────────────────────────────── */}
        <section id="security" className="px-4 sm:px-6 py-24 sm:py-32 scroll-mt-20">
          <div className="mx-auto max-w-7xl grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <SectionHeading
                eyebrow="Zero-trust by default"
                title="Agents ask before they act."
                lead="A permission broker sits between every agent and your machine. Each tool call is classified by risk before it runs."
              />
            </div>
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
              variants={stagger}
              className="space-y-3"
            >
              {[
                { tier: 'Read-only', color: '#22C55E', examples: 'readFile · searchFiles · gitStatus', outcome: 'Runs instantly, no prompt' },
                { tier: 'File mutation', color: '#F59E0B', examples: 'writeFile · deleteFile · applyDiff', outcome: 'Asks for your permission' },
                { tier: 'Destructive command', color: '#F43F5E', examples: 'rm -rf · sudo · mkfs · dd · curl | sh', outcome: 'High-risk alert with full command preview' },
              ].map((r) => (
                <motion.div key={r.tier} variants={fadeUp} className="rounded-2xl border p-5 flex items-center gap-4" style={glass}>
                  <span className="h-3 w-3 rounded-full shrink-0" style={{ backgroundColor: r.color, boxShadow: `0 0 16px ${r.color}` }} />
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                      <h3 className="font-semibold">{r.tier}</h3>
                      <span className="text-sm font-medium" style={{ color: r.color }}>{r.outcome}</span>
                    </div>
                    <code className="mt-1 block text-xs truncate" style={{ color: 'var(--kb-text-subtle)' }}>{r.examples}</code>
                  </div>
                </motion.div>
              ))}
              <motion.p variants={fadeUp} className="text-sm pt-2 flex items-center gap-2" style={{ color: 'var(--kb-text-faint)' }}>
                <KeyRound className="h-4 w-4" /> API keys stay in the OS keychain.
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* ── Stack ─────────────────────────────────────────────────────── */}
        <section className="px-4 sm:px-6 py-24 sm:py-32">
          <div className="mx-auto max-w-7xl">
            <SectionHeading eyebrow="Under the hood" title="A modern, open stack." />
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              variants={stagger}
              className="grid md:grid-cols-3 gap-4"
            >
              {STACK.map((s) => (
                <motion.div key={s.title} variants={fadeUp} className="rounded-2xl border p-6" style={glass}>
                  <s.icon className="h-6 w-6 mb-4" style={{ color: 'var(--kb-accent-bright)' }} />
                  <h3 className="font-semibold mb-4">{s.title}</h3>
                  <div className="flex flex-wrap gap-2">
                    {s.items.map((it) => (
                      <span key={it} className="rounded-lg border px-2.5 py-1 text-xs" style={{ borderColor: 'var(--kb-border)', color: 'var(--kb-text-muted)' }}>
                        {it}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── Download ──────────────────────────────────────────────────── */}
        <section id="download" className="px-4 sm:px-6 py-24 sm:py-32 scroll-mt-20">
          <div className="mx-auto max-w-7xl">
            <SectionHeading
              eyebrow={`Download · v${IDE_VERSION} preview`}
              title="Install Kernel Base."
              lead="Native builds for Apple Silicon Macs and 64-bit Linux. Verify each file against its SHA-256 checksum before installing."
            />
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.1 }}
              variants={stagger}
              className="grid md:grid-cols-3 gap-5 pt-3"
            >
              {INSTALLERS.map((b) => (
                <DownloadCard key={b.id} build={b} primary={b.id === primary.id} />
              ))}
            </motion.div>
            <Reveal className="mt-8 flex flex-col sm:flex-row sm:items-center gap-3 text-sm" delay={0.1}>
              <div className="flex items-center gap-2 rounded-lg px-3 py-2 flex-1 min-w-0" style={{ backgroundColor: 'var(--kb-code-bg)', color: 'var(--kb-code-text)' }}>
                <code className="text-[12px] flex-1 min-w-0 overflow-x-auto whitespace-nowrap">shasum -a 256 -c SHA256SUMS.txt</code>
                <CopyButton value="shasum -a 256 -c SHA256SUMS.txt" />
              </div>
              <a href={CHECKSUMS_URL} download="SHA256SUMS.txt" className="inline-flex items-center gap-1.5 font-medium" style={{ color: 'var(--kb-accent-bright)' }}>
                <Download className="h-4 w-4" /> SHA256SUMS.txt
              </a>
            </Reveal>
          </div>
        </section>

        {/* ── Final CTA ─────────────────────────────────────────────────── */}
        <section className="px-4 sm:px-6 pb-24">
          <Reveal className="mx-auto max-w-7xl">
            <div
              className="relative rounded-3xl border overflow-hidden p-10 sm:p-16 text-center"
              style={{ ...glass, background: 'linear-gradient(135deg, color-mix(in srgb, var(--kb-brand) 55%, transparent), color-mix(in srgb, var(--kb-surface) 80%, transparent))' }}
            >
              <h2 className="text-3xl sm:text-5xl font-bold tracking-tight">Go deeper into the architecture.</h2>
              <p className="mt-4 max-w-2xl mx-auto" style={{ color: 'var(--kb-text-muted)' }}>
                The docs cover the agent runtime, DAG engine, model gateway, sandbox, local models, and the 10-day MVP plan.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  type="button"
                  onClick={() => onOpenDocs()}
                  className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 font-semibold text-white"
                  style={{ background: 'linear-gradient(135deg, var(--kb-brand-secondary), var(--kb-accent-bright))' }}
                >
                  <BookOpen className="h-5 w-5" /> Open documentation
                </button>
                <a
                  href={GITHUB_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border px-6 py-3.5 font-semibold"
                  style={{ borderColor: 'var(--kb-border-hover)' }}
                >
                  <Github className="h-5 w-5" /> Star on GitHub
                </a>
              </div>
            </div>
          </Reveal>
        </section>

        <footer className="px-4 sm:px-6 py-10 border-t" style={{ borderColor: 'var(--kb-border)', backgroundColor: 'color-mix(in srgb, var(--kb-bg) 85%, transparent)' }}>
          <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4 text-sm" style={{ color: 'var(--kb-text-faint)' }}>
            <div className="flex items-center gap-2.5">
              <img src="/logo.png" alt="" width={22} height={22} className="object-contain" />
              <span>Kernel Base · Apache License 2.0</span>
            </div>
            <div className="flex items-center gap-5">
              <button type="button" onClick={() => onOpenDocs()} className="hover:opacity-80">Docs</button>
              <a href="#download" onClick={(e) => scrollTo(e, '#download')} className="hover:opacity-80">Download</a>
              <a href={GITHUB_URL} target="_blank" rel="noreferrer" className="hover:opacity-80">GitHub</a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};
