import React, { useState, useEffect, useRef } from 'react';
import { CornerDownLeft, X } from 'lucide-react';

export default function CommandPalette({ isOpen, onClose, commands }) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const filteredCommands = (commands || []).filter(cmd =>
    cmd.title.toLowerCase().includes(query.toLowerCase()) ||
    (cmd.category && cmd.category.toLowerCase().includes(query.toLowerCase())) ||
    (cmd.keywords && cmd.keywords.some(k => k.toLowerCase().includes(query.toLowerCase())))
  );

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleKeyDown = e => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % Math.max(1, filteredCommands.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filteredCommands.length) % Math.max(1, filteredCommands.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredCommands[selectedIndex]) {
        filteredCommands[selectedIndex].action();
        onClose();
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" onClick={e => e.stopPropagation()} role="dialog" aria-modal="true">
        <div style={{ position: 'relative' }}>
          <input
            ref={inputRef}
            type="text"
            className="command-search-input"
            placeholder="Type a tool name or action (e.g., uppercase, json, summarize)..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            type="button"
            onClick={onClose}
            className="icon-btn"
            style={{ position: 'absolute', right: '12px', top: '12px', width: '28px', height: '28px' }}
            aria-label="Close command palette"
          >
            <X size={14} />
          </button>
        </div>

        <div className="command-results-list">
          {filteredCommands.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              No tools matching "{query}"
            </div>
          ) : (
            filteredCommands.map((cmd, idx) => (
              <div
                key={cmd.id || idx}
                className={`command-item ${selectedIndex === idx ? 'selected' : ''}`}
                onClick={() => {
                  cmd.action();
                  onClose();
                }}
                onMouseEnter={() => setSelectedIndex(idx)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  {cmd.icon && <span style={{ opacity: 0.8 }}>{cmd.icon}</span>}
                  <div>
                    <div style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{cmd.title}</div>
                    {cmd.category && (
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{cmd.category}</div>
                    )}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {cmd.shortcut && <span className="kbd-shortcut">{cmd.shortcut}</span>}
                  <CornerDownLeft size={14} style={{ opacity: 0.5 }} />
                </div>
              </div>
            ))
          )}
        </div>

        <div style={{
          padding: '0.65rem 1rem',
          backgroundColor: 'var(--bg-subtle)',
          borderTop: '1px solid var(--border-app)',
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '0.75rem',
          color: 'var(--text-muted)'
        }}>
          <span>Use <strong>↑↓</strong> to navigate, <strong>Enter</strong> to select</span>
          <span>Press <strong>Esc</strong> to close</span>
        </div>
      </div>
    </div>
  );
}
