import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'motion/react';

const WORKFLOW_STEPS = [
  { id: 'intent', label: 'User Intent', sublabel: 'Developer input' },
  { id: 'planning', label: 'Planning', sublabel: 'Task decomposition' },
  { id: 'context', label: 'Context', sublabel: 'Project awareness' },
  { id: 'selection', label: 'Agent Selection', sublabel: 'Role assignment' },
  { id: 'execution', label: 'Execution', sublabel: 'Agent operations' },
  { id: 'validation', label: 'Validation', sublabel: 'Result checking' },
  { id: 'result', label: 'Result', sublabel: 'Delivered output' },
];

const ANIM_DURATION = 600; // ms per step
const PAUSE_DURATION = 2000; // pause at end before restart

const prefersReduced =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const WorkflowDiagram: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: false, margin: '-100px' });
  const [activeStep, setActiveStep] = useState<number>(-1);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (prefersReduced) {
      setActiveStep(WORKFLOW_STEPS.length - 1);
      return;
    }

    if (!inView) {
      setActiveStep(-1);
      if (timerRef.current) clearTimeout(timerRef.current);
      return;
    }

    let step = 0;

    const advance = () => {
      setActiveStep(step);
      if (step < WORKFLOW_STEPS.length - 1) {
        step++;
        timerRef.current = setTimeout(advance, ANIM_DURATION);
      } else {
        // loop
        timerRef.current = setTimeout(() => {
          step = 0;
          setActiveStep(-1);
          timerRef.current = setTimeout(advance, 200);
        }, PAUSE_DURATION);
      }
    };

    timerRef.current = setTimeout(advance, 300);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [inView]);

  return (
    <section id="workflow" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Heading */}
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
            From intent to execution.
          </h2>
          <p className="text-sm sm:text-base max-w-xl mx-auto" style={{ color: 'var(--kb-text-muted)' }}>
            KernelBase orchestrates a structured workflow that transforms developer intent into coordinated agent execution.
          </p>
        </motion.div>

        {/* Workflow nodes */}
        <div ref={ref} className="overflow-x-auto pb-4">
          <div className="flex items-center min-w-max mx-auto justify-center gap-0">
            {WORKFLOW_STEPS.map((step, i) => {
              const isActive = activeStep >= i;
              const isCurrent = activeStep === i;

              return (
                <React.Fragment key={step.id}>
                  {/* Node */}
                  <div className="flex flex-col items-center gap-2">
                    <motion.div
                      animate={{
                        scale: isCurrent ? 1.08 : 1,
                        borderColor: isActive ? 'var(--kb-accent)' : 'var(--kb-border)',
                        backgroundColor: isActive
                          ? 'var(--kb-surface-elevated)'
                          : 'var(--kb-surface)',
                      }}
                      transition={{ duration: 0.3 }}
                      className="w-24 sm:w-28 rounded-lg border px-2 py-3 text-center shadow-sm"
                      style={{
                        borderColor: 'var(--kb-border)',
                        backgroundColor: 'var(--kb-surface)',
                        boxShadow: isCurrent
                          ? '0 0 12px color-mix(in srgb, var(--kb-accent) 25%, transparent)'
                          : 'none',
                      }}
                    >
                      <div
                        className="w-2 h-2 rounded-full mx-auto mb-2 transition-colors duration-300"
                        style={{
                          backgroundColor: isActive ? 'var(--kb-accent)' : 'var(--kb-border)',
                        }}
                      />
                      <div
                        className="text-xs font-semibold leading-tight"
                        style={{ color: isActive ? 'var(--kb-text)' : 'var(--kb-text-subtle)' }}
                      >
                        {step.label}
                      </div>
                      <div
                        className="text-[10px] mt-0.5 leading-tight"
                        style={{ color: 'var(--kb-text-faint)' }}
                      >
                        {step.sublabel}
                      </div>
                    </motion.div>
                  </div>

                  {/* Connector arrow (not after last) */}
                  {i < WORKFLOW_STEPS.length - 1 && (
                    <div className="flex items-center mx-1">
                      <div
                        className="h-px w-6 sm:w-8 transition-colors duration-300"
                        style={{
                          backgroundColor:
                            activeStep > i ? 'var(--kb-accent)' : 'var(--kb-border)',
                          opacity: activeStep > i ? 0.7 : 0.4,
                        }}
                      />
                      <div
                        className="w-0 h-0 transition-colors duration-300"
                        style={{
                          borderTop: '4px solid transparent',
                          borderBottom: '4px solid transparent',
                          borderLeft: `6px solid ${activeStep > i ? 'var(--kb-accent)' : 'var(--kb-border)'}`,
                          opacity: activeStep > i ? 0.7 : 0.4,
                        }}
                      />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
