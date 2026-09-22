import React, { useState } from 'react';
import { motion } from 'motion/react';

interface NodeDef {
  id: string;
  label: string;
  sublabel: string;
  description: string;
  x: number;
  y: number;
  size: number;
  tier: 'core' | 'runtime' | 'agent' | 'validator';
}

interface EdgeDef {
  from: string;
  to: string;
}

const NODES: NodeDef[] = [
  {
    id: 'kernelbase',
    label: 'KernelBase',
    sublabel: 'Core',
    description: 'The central orchestration system. Routes developer intent to the appropriate agents and manages the overall workflow lifecycle.',
    x: 200,
    y: 60,
    size: 52,
    tier: 'core',
  },
  {
    id: 'runtime',
    label: 'Agent Runtime',
    sublabel: 'Execution layer',
    description: 'Manages agent lifecycle, scheduling, and communication. Provides the execution environment for all agents.',
    x: 200,
    y: 170,
    size: 44,
    tier: 'runtime',
  },
  {
    id: 'planner',
    label: 'Planner',
    sublabel: 'Agent',
    description: 'Decomposes developer intent into structured task plans. Determines the sequence of operations needed to fulfill a request.',
    x: 60,
    y: 280,
    size: 38,
    tier: 'agent',
  },
  {
    id: 'coder',
    label: 'Coder',
    sublabel: 'Agent',
    description: 'Generates, modifies, and refactors code based on task specifications. Works with the project context to produce accurate output.',
    x: 140,
    y: 280,
    size: 38,
    tier: 'agent',
  },
  {
    id: 'research',
    label: 'Research',
    sublabel: 'Agent',
    description: 'Retrieves and synthesizes information from project context, documentation, and available knowledge sources.',
    x: 220,
    y: 280,
    size: 38,
    tier: 'agent',
  },
  {
    id: 'qa',
    label: 'QA',
    sublabel: 'Agent',
    description: 'Validates agent outputs, runs checks, and ensures results meet the quality and correctness requirements.',
    x: 300,
    y: 280,
    size: 38,
    tier: 'agent',
  },
  {
    id: 'validator',
    label: 'Validator',
    sublabel: 'Output check',
    description: 'Final validation layer that reviews combined agent outputs before delivering results to the developer.',
    x: 200,
    y: 380,
    size: 36,
    tier: 'validator',
  },
];

const EDGES: EdgeDef[] = [
  { from: 'kernelbase', to: 'runtime' },
  { from: 'runtime', to: 'planner' },
  { from: 'runtime', to: 'coder' },
  { from: 'runtime', to: 'research' },
  { from: 'runtime', to: 'qa' },
  { from: 'planner', to: 'validator' },
  { from: 'coder', to: 'validator' },
  { from: 'research', to: 'validator' },
  { from: 'qa', to: 'validator' },
];

const TIER_COLORS: Record<string, string> = {
  core: 'var(--kb-brand)',
  runtime: 'var(--kb-brand-secondary)',
  agent: 'var(--kb-surface-elevated)',
  validator: 'var(--kb-surface-secondary)',
};

const TIER_BORDER: Record<string, string> = {
  core: 'var(--kb-accent)',
  runtime: 'var(--kb-brand-secondary)',
  agent: 'var(--kb-border)',
  validator: 'var(--kb-border)',
};

const TIER_TEXT: Record<string, string> = {
  core: '#F8F5F2',
  runtime: '#F8F5F2',
  agent: 'var(--kb-text)',
  validator: 'var(--kb-text-muted)',
};

function getNode(id: string): NodeDef | undefined {
  return NODES.find((n) => n.id === id);
}

export const AgentNetwork: React.FC = () => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const hoveredNode = hoveredId ? NODES.find((n) => n.id === hoveredId) : null;

  const isConnected = (nodeId: string): boolean => {
    if (!hoveredId) return true;
    if (nodeId === hoveredId) return true;
    return EDGES.some(
      (e) =>
        (e.from === hoveredId && e.to === nodeId) ||
        (e.to === hoveredId && e.from === nodeId)
    );
  };

  const isEdgeActive = (edge: EdgeDef): boolean => {
    if (!hoveredId) return false;
    return edge.from === hoveredId || edge.to === hoveredId;
  };

  return (
    <section id="product" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <h2 className="text-2xl sm:text-3xl font-bold mb-3" style={{ color: 'var(--kb-text)' }}>
            Multi-agent coordination.
          </h2>
          <p className="text-sm sm:text-base max-w-xl mx-auto" style={{ color: 'var(--kb-text-muted)' }}>
            KernelBase coordinates specialized agents — each with a defined role — through a unified runtime. Hover nodes to explore.
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8 items-center lg:items-start">
          {/* SVG Network */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="w-full lg:w-auto flex-shrink-0"
          >
            <svg
              viewBox="0 0 360 440"
              className="w-full max-w-sm mx-auto lg:mx-0"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Edges */}
              {EDGES.map((edge) => {
                const fromNode = getNode(edge.from);
                const toNode = getNode(edge.to);
                if (!fromNode || !toNode) return null;
                const active = isEdgeActive(edge);
                return (
                  <line
                    key={`${edge.from}-${edge.to}`}
                    x1={fromNode.x}
                    y1={fromNode.y}
                    x2={toNode.x}
                    y2={toNode.y}
                    stroke={active ? 'var(--kb-accent)' : 'var(--kb-border)'}
                    strokeWidth={active ? 2 : 1}
                    opacity={
                      hoveredId
                        ? active
                          ? 0.9
                          : 0.15
                        : 0.45
                    }
                    style={{ transition: 'all 0.2s' }}
                  />
                );
              })}

              {/* Nodes */}
              {NODES.map((node) => {
                const connected = isConnected(node.id);
                const isHovered = node.id === hoveredId;
                return (
                  <g
                    key={node.id}
                    transform={`translate(${node.x}, ${node.y})`}
                    style={{ cursor: 'pointer' }}
                    onMouseEnter={() => setHoveredId(node.id)}
                    onMouseLeave={() => setHoveredId(null)}
                  >
                    <circle
                      r={node.size / 2}
                      fill={TIER_COLORS[node.tier]}
                      stroke={TIER_BORDER[node.tier]}
                      strokeWidth={isHovered ? 2.5 : 1.5}
                      opacity={hoveredId && !connected ? 0.2 : 1}
                      style={{ transition: 'all 0.2s' }}
                    />
                    {isHovered && (
                      <circle
                        r={node.size / 2 + 6}
                        fill="none"
                        stroke="var(--kb-accent)"
                        strokeWidth="1"
                        opacity="0.4"
                        style={{ transition: 'all 0.2s' }}
                      />
                    )}
                    <text
                      textAnchor="middle"
                      dy="-2"
                      fontSize={node.tier === 'core' ? 10 : 9}
                      fontWeight="600"
                      fill={TIER_TEXT[node.tier]}
                      opacity={hoveredId && !connected ? 0.25 : 1}
                      fontFamily="ui-sans-serif, system-ui, sans-serif"
                      style={{ transition: 'opacity 0.2s', pointerEvents: 'none' }}
                    >
                      {node.label}
                    </text>
                    <text
                      textAnchor="middle"
                      dy="10"
                      fontSize="7.5"
                      fill={TIER_TEXT[node.tier]}
                      opacity={hoveredId && !connected ? 0.2 : 0.65}
                      fontFamily="ui-sans-serif, system-ui, sans-serif"
                      style={{ transition: 'opacity 0.2s', pointerEvents: 'none' }}
                    >
                      {node.sublabel}
                    </text>
                  </g>
                );
              })}
            </svg>
          </motion.div>

          {/* Description panel */}
          <div className="flex-1 w-full">
            <motion.div
              key={hoveredId ?? '__default__'}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
              className="rounded-xl border p-5 min-h-[120px]"
              style={{
                borderColor: 'var(--kb-border)',
                backgroundColor: 'var(--kb-surface)',
              }}
            >
              {hoveredNode ? (
                <>
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className="inline-block w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: 'var(--kb-accent)' }}
                    />
                    <span className="text-sm font-semibold" style={{ color: 'var(--kb-text)' }}>
                      {hoveredNode.label}
                    </span>
                    <span className="text-xs" style={{ color: 'var(--kb-text-faint)' }}>
                      · {hoveredNode.sublabel}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--kb-text-muted)' }}>
                    {hoveredNode.description}
                  </p>
                </>
              ) : (
                <p className="text-sm" style={{ color: 'var(--kb-text-subtle)' }}>
                  Hover over a node to learn about its role in the KernelBase system.
                </p>
              )}
            </motion.div>

            {/* Node list */}
            <div className="mt-4 flex flex-wrap gap-2">
              {NODES.map((node) => (
                <button
                  key={node.id}
                  onMouseEnter={() => setHoveredId(node.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  className="text-xs px-2.5 py-1 rounded-md border transition-colors duration-150 cursor-default"
                  style={{
                    borderColor: hoveredId === node.id ? 'var(--kb-accent)' : 'var(--kb-border)',
                    backgroundColor: hoveredId === node.id ? 'color-mix(in srgb, var(--kb-brand) 15%, transparent)' : 'var(--kb-surface)',
                    color: hoveredId === node.id ? 'var(--kb-text)' : 'var(--kb-text-subtle)',
                  }}
                >
                  {node.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
