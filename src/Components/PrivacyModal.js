import React from 'react';
import { ShieldCheck, X } from 'lucide-react';

export default function PrivacyModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" onClick={e => e.stopPropagation()} role="dialog" aria-modal="true" style={{ maxWidth: '580px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1.25rem',
          borderBottom: '1px solid var(--border-app)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontWeight: 600, fontSize: '1.1rem' }}>
            <ShieldCheck size={20} color="#10b981" />
            <span>Privacy Architecture & AI Operations</span>
          </div>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close dialog">
            <X size={16} />
          </button>
        </div>

        <div style={{ padding: '1.25rem', maxHeight: '70vh', overflowY: 'auto' }}>
          <h4 style={{ fontSize: '0.9375rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
            1. Zero-Telemetry Local Execution
          </h4>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1rem' }}>
            All standard text operations — including text transformations, statistics calculations, readability scoring, regex testing, JSON validation, Base64 encoding, and text diffing — run <strong>entirely in your local browser runtime</strong>. No text typed into these tools is ever uploaded to an external server.
          </p>

          <h4 style={{ fontSize: '0.9375rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
            2. AI Writing Studio Security & Proxy Flow
          </h4>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1rem' }}>
            When you explicitly choose to use the AI Writing Studio, your text is sent to our secure server-side proxy route (<code>/api/gemini/generate</code>), which communicates with the official Google Gemini API using server-side credentials.
          </p>
          <ul style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, paddingLeft: '1.25rem', marginBottom: '1rem' }}>
            <li>No API keys are ever stored or exposed in browser bundles or client JavaScript.</li>
            <li>Requests are processed on-demand and are not retained in persistent databases.</li>
            <li>If no Gemini API key is configured on the host server, AI features degrade gracefully while all local utilities remain 100% operational.</li>
          </ul>

          <h4 style={{ fontSize: '0.9375rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
            3. Local Storage & Drafts
          </h4>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '0' }}>
            Optional auto-save drafts and theme preferences are stored exclusively in your browser's private <code>localStorage</code>. You can clear them anytime using the Clear Workspace action.
          </p>
        </div>

        <div style={{
          padding: '0.75rem 1.25rem',
          backgroundColor: 'var(--bg-subtle)',
          borderTop: '1px solid var(--border-app)',
          textAlign: 'right'
        }}>
          <button type="button" className="tool-btn btn-primary" onClick={onClose}>
            Understood
          </button>
        </div>
      </div>
    </div>
  );
}
