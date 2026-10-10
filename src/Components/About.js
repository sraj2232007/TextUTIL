import React from 'react';
import { ShieldCheck, Cpu, Code2 } from 'lucide-react';

export default function About() {
  return (
    <div className="about-container" style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div className="page-header">
        <h1 className="page-title">About TextUtil</h1>
        <p className="page-subtitle">
          An all-in-one text editing, text analysis, AI writing, and developer productivity toolkit.
        </p>
      </div>

      <div className="panel-card mb-4">
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
          Product Mission
        </h2>
        <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
          TextUtil was engineered to replace dozens of single-purpose web converters and formatting utilities with a unified, cohesive, privacy-first workstation. Built for developers, students, researchers, technical writers, and content creators, it combines instant offline text manipulation with server-side AI writing intelligence.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <div className="panel-card mb-0">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
            <ShieldCheck size={18} color="#10b981" />
            <span>100% Client-Side Privacy</span>
          </div>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
            Core text transformations, metrics calculations, developer encoders, and heuristic readability analysis execute in-memory inside your local browser runtime. Zero text data is logged or sent over the network unless you explicitly invoke the AI Writing Studio.
          </p>
        </div>

        <div className="panel-card mb-0">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
            <Cpu size={18} color="var(--accent-primary)" />
            <span>Server-Side Editorial Processing</span>
          </div>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
            The Writing Assistant communicates securely with a server-side proxy endpoint (<code>/api/gemini/generate</code>) for document summarization, translation, and grammar refinement, ensuring API credentials remain private.
          </p>
        </div>

        <div className="panel-card mb-0">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
            <Code2 size={18} color="#8b5cf6" />
            <span>Developer-Grade Utilities</span>
          </div>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
            Includes JSON validation with exact syntax highlighting, regex testers, UTF-8 Base64 conversion, URL encoding, Markdown previewing, and text diff tracking with zero unsafe <code>eval()</code> calls.
          </p>
        </div>
      </div>

      {/* Accordion Specification */}
      <div className="panel-card">
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-primary)' }}>
          Toolkit Capabilities Overview
        </h3>

        <div className="accordion" id="aboutAccordion">
          <div className="accordion-item" style={{ backgroundColor: 'transparent', borderColor: 'var(--border-app)' }}>
            <h2 className="accordion-header">
              <button
                className="accordion-button"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#accOne"
                style={{ backgroundColor: 'var(--bg-subtle)', color: 'var(--text-primary)', fontWeight: 600 }}
              >
                1. Text Workspace & Transformations
              </button>
            </h2>
            <div id="accOne" className="accordion-collapse collapse show" data-bs-parent="#aboutAccordion">
              <div className="accordion-body" style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>
                Includes 20+ transformations: UPPERCASE, lowercase, Title Case, Sentence case, Capitalize Each Word, Toggle case, duplicate line removal, alphabetical sorting, line trimming, sequential line numbering, regex search and replace, punctuation stripping, and email/URL extractor.
              </div>
            </div>
          </div>

          <div className="accordion-item" style={{ backgroundColor: 'transparent', borderColor: 'var(--border-app)' }}>
            <h2 className="accordion-header">
              <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#accTwo"
                style={{ backgroundColor: 'var(--bg-subtle)', color: 'var(--text-primary)', fontWeight: 600 }}
              >
                2. Text Intelligence Lab Heuristics
              </button>
            </h2>
            <div id="accTwo" className="accordion-collapse collapse" data-bs-parent="#aboutAccordion">
              <div className="accordion-body" style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>
                Implements the standard Flesch Reading Ease algorithm, Flesch-Kincaid Grade Level index, overused filler word detector, complex sentence length flag (> 22 words), repeated n-gram phrase clustering, and passive voice heuristics.
              </div>
            </div>
          </div>

          <div className="accordion-item" style={{ backgroundColor: 'transparent', borderColor: 'var(--border-app)' }}>
            <h2 className="accordion-header">
              <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#accThree"
                style={{ backgroundColor: 'var(--bg-subtle)', color: 'var(--text-primary)', fontWeight: 600 }}
              >
                3. Keyboard Accessibility & Shortcuts
              </button>
            </h2>
            <div id="accThree" className="accordion-collapse collapse" data-bs-parent="#aboutAccordion">
              <div className="accordion-body" style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>
                Features quick Command Palette navigation (Ctrl/Cmd + K), copy shortcuts (Ctrl/Cmd + Shift + C), undo/redo stacks (Ctrl/Cmd + Z), and WCAG AA contrast compliance with functional dark and light themes.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
