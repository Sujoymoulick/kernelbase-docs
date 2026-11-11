import React from 'react';
import { LandingNavbar } from '../components/landing/LandingNavbar';
import { Hero } from '../components/landing/Hero';
import { AgentNetwork } from '../components/landing/AgentNetwork';
import { Capabilities } from '../components/landing/Capabilities';
import { WorkflowDiagram } from '../components/landing/WorkflowDiagram';
import { ArchitectureSection } from '../components/landing/ArchitectureSection';
import { DesktopDownloads } from '../components/landing/DesktopDownloads';
import { DocumentationCTA } from '../components/landing/DocumentationCTA';
import { LandingFooter } from '../components/landing/LandingFooter';

export const LandingPage: React.FC = () => {
  return (
    <div
      className="min-h-screen font-sans"
      style={{ backgroundColor: 'var(--kb-bg)', color: 'var(--kb-text)' }}
    >
      <LandingNavbar />

      <main>
        {/* Hero with integrated Marquee */}
        <Hero />

        {/* Divider */}
        <div className="max-w-5xl mx-auto px-4"><div style={{ height: 1, backgroundColor: 'var(--kb-border)', opacity: 0.4 }} /></div>

        {/* Agent Network (Product section) */}
        <AgentNetwork />

        {/* Capabilities */}
        <div className="max-w-5xl mx-auto px-4"><div style={{ height: 1, backgroundColor: 'var(--kb-border)', opacity: 0.4 }} /></div>
        <Capabilities />

        {/* Workflow */}
        <div className="max-w-5xl mx-auto px-4"><div style={{ height: 1, backgroundColor: 'var(--kb-border)', opacity: 0.4 }} /></div>
        <WorkflowDiagram />

        {/* Architecture */}
        <div className="max-w-5xl mx-auto px-4"><div style={{ height: 1, backgroundColor: 'var(--kb-border)', opacity: 0.4 }} /></div>
        <ArchitectureSection />

        {/* Downloads */}
        <div className="max-w-5xl mx-auto px-4"><div style={{ height: 1, backgroundColor: 'var(--kb-border)', opacity: 0.4 }} /></div>
        <DesktopDownloads />

        {/* Docs CTA */}
        <div className="max-w-5xl mx-auto px-4"><div style={{ height: 1, backgroundColor: 'var(--kb-border)', opacity: 0.4 }} /></div>
        <DocumentationCTA />
      </main>

      <LandingFooter />
    </div>
  );
};
