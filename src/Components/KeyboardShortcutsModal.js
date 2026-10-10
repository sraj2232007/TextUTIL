import React from 'react';
import { X, Keyboard } from 'lucide-react';

export default function KeyboardShortcutsModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const shortcuts = [
    { key: 'Ctrl/Cmd + K', desc: 'Open Command Palette & search tools' },
    { key: 'Ctrl/Cmd + Enter', desc: 'Execute primary action in workspace or studio' },
    { key: 'Ctrl/Cmd + Shift + C', desc: 'Copy current text to clipboard' },
    { key: 'Ctrl/Cmd + Z', desc: 'Undo last text transformation' },
    { key: 'Ctrl/Cmd + Shift + Z / Ctrl + Y', desc: 'Redo text transformation' },
    { key: 'Esc', desc: 'Close open dialogs, drawers, or command palette' },
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" onClick={e => e.stopPropagation()} role="dialog" aria-modal="true" style={{ maxWidth: '520px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1rem 1.25rem',
          borderBottom: '1px solid var(--border-app)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
            <Keyboard size={18} />
            <span>Keyboard Shortcuts</span>
          </div>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close dialog">
            <X size={16} />
          </button>
        </div>

        <div style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {shortcuts.map((s, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.5rem 0',
                  borderBottom: idx < shortcuts.length - 1 ? '1px solid var(--border-app)' : 'none'
                }}
              >
                <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{s.desc}</span>
                <span className="kbd-shortcut" style={{ fontSize: '0.8125rem' }}>{s.key}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{
          padding: '0.75rem 1.25rem',
          backgroundColor: 'var(--bg-subtle)',
          borderTop: '1px solid var(--border-app)',
          textAlign: 'right'
        }}>
          <button type="button" className="tool-btn btn-primary" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
