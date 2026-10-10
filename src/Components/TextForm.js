import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Copy,
  Download,
  Trash2,
  Undo2,
  Redo2,
  RotateCcw,
  Upload,
  Search,
  FileText,
  SplitSquareVertical,
  Layers,
  Sparkles,
  Maximize2,
  Minimize2,
  ChevronDown,
  BarChart2,
  Check,
  Type
} from 'lucide-react';
import { calculateStatistics } from '../utils/textStatistics';
import { analyzeTextIntelligence } from '../utils/textIntelligence';
import * as transform from '../utils/textTransformations';

const SAMPLES = {
  essay: `The advent of digital technology has fundamentally transformed how human knowledge is generated, organized, and communicated across generations. In modern research environments, analytical tools facilitate rapid pattern recognition that previously required months of manual tabulation. Yet, true intellectual insight depends not merely on speed, but on clarity of expression and rigorous logical coherence. Clear prose reflects clear thinking, allowing complex ideas to bridge disciplines with effortless grace.`,
  email: `Subject: Project Milestone Review & Strategic Priorities for Q3\n\nHi Team,\n\nI hope you're having a productive week. Following our quarterly roadmap review yesterday, I wanted to summarize the key takeaways and immediate action items:\n\n1. Product Infrastructure: The text processing pipeline latency has decreased by 35%.\n2. Security Audits: Local client-side processing policies are fully in place.\n3. Next Steps: Please submit your feature requests by Friday at 5:00 PM EST.\n\nThank you for your dedicated efforts!\n\nBest regards,\nElena Vance`,
  notes: `Meeting Notes: Architecture Review\nDate: October 10, 2026\nParticipants: Alex, Sarah, David, Marcus\n\nKey Decisions:\n- All data transformations must run client-side for absolute user privacy.\n- Implement responsive UI design following clean typography and zero-pill discipline.\n- Integrate server-side Gemini 3.8 Flash proxy for writing assistance.\n- Add support for JSON, Base64, and Regex developer tooling.`
};

export default function TextForm({ showAlert }) {
  const [text, setText] = useState('');
  const [originalText, setOriginalText] = useState('');
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isMonospace, setIsMonospace] = useState(false);
  const [fontSize, setFontSize] = useState('md'); // sm, md, lg
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [showInsightsDrawer, setShowInsightsDrawer] = useState(false);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const [copiedRecently, setCopiedRecently] = useState(false);

  // Targets
  const [wordTarget, setWordTarget] = useState(500);
  const [charTarget, setCharTarget] = useState(3000);

  // Drawers
  const [showFindReplace, setShowFindReplace] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [replaceQuery, setReplaceQuery] = useState('');
  const [matchCase, setMatchCase] = useState(false);
  const [useRegex, setUseRegex] = useState(false);

  const [showPrefixSuffix, setShowPrefixSuffix] = useState(false);
  const [linePrefix, setLinePrefix] = useState('');
  const [lineSuffix, setLineSuffix] = useState('');

  const [showMoreActions, setShowMoreActions] = useState(false);
  const [showDiffModal, setShowDiffModal] = useState(false);

  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  // Restore previous session from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('textutil_draft');
      if (saved) {
        setText(saved);
        setOriginalText(saved);
        setHistory([saved]);
        setHistoryIndex(0);
      } else {
        setText(SAMPLES.essay);
        setOriginalText(SAMPLES.essay);
        setHistory([SAMPLES.essay]);
        setHistoryIndex(0);
      }
    } catch {
      setText(SAMPLES.essay);
      setOriginalText(SAMPLES.essay);
      setHistory([SAMPLES.essay]);
      setHistoryIndex(0);
    }
  }, []);

  // Debounced Auto-save
  useEffect(() => {
    if (!autoSaveEnabled) return;
    const timer = setTimeout(() => {
      try {
        localStorage.setItem('textutil_draft', text);
      } catch (e) {
        console.warn('LocalStorage save failed:', e);
      }
    }, 800);
    return () => clearTimeout(timer);
  }, [text, autoSaveEnabled]);

  // Real-time statistics & Readability
  const stats = useMemo(() => calculateStatistics(text), [text]);
  const intel = useMemo(() => analyzeTextIntelligence(text), [text]);

  const pushState = (newText, description = 'Transformation applied') => {
    if (newText === text) return;
    const nextHistory = history.slice(0, historyIndex + 1);
    nextHistory.push(newText);
    if (nextHistory.length > 50) nextHistory.shift();
    setHistory(nextHistory);
    setHistoryIndex(nextHistory.length - 1);
    setText(newText);
    if (showAlert) showAlert(description, 'success');
  };

  const handleTextChange = e => {
    const val = e.target.value;
    setText(val);
    if (history.length === 0 || Math.abs(val.length - (history[historyIndex] || '').length) > 25) {
      const nextHistory = history.slice(0, historyIndex + 1);
      nextHistory.push(val);
      if (nextHistory.length > 50) nextHistory.shift();
      setHistory(nextHistory);
      setHistoryIndex(nextHistory.length - 1);
    }
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const nextIdx = historyIndex - 1;
      setHistoryIndex(nextIdx);
      setText(history[nextIdx]);
      if (showAlert) showAlert('Undo', 'info');
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const nextIdx = historyIndex + 1;
      setHistoryIndex(nextIdx);
      setText(history[nextIdx]);
      if (showAlert) showAlert('Redo', 'info');
    }
  };

  const handleCopy = async () => {
    if (!text) {
      if (showAlert) showAlert('Nothing to copy', 'warning');
      return;
    }
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        textareaRef.current?.select();
        document.execCommand('copy');
      }
      setCopiedRecently(true);
      setTimeout(() => setCopiedRecently(false), 2000);
      if (showAlert) showAlert('Copied text to clipboard', 'success');
    } catch {
      textareaRef.current?.select();
      document.execCommand('copy');
      setCopiedRecently(true);
      setTimeout(() => setCopiedRecently(false), 2000);
      if (showAlert) showAlert('Copied text to clipboard', 'success');
    }
  };

  const handleDownload = () => {
    if (!text) {
      if (showAlert) showAlert('Text is empty', 'warning');
      return;
    }
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `textutil-${new Date().toISOString().slice(0, 10)}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    if (showAlert) showAlert('Downloaded .txt file', 'success');
  };

  const handleFileUpload = e => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = event => {
      const content = event.target?.result;
      if (typeof content === 'string') {
        setOriginalText(content);
        pushState(content, `Imported: ${file.name}`);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleClear = () => {
    if (!text.trim()) return;
    if (window.confirm('Clear all text from workspace?')) {
      pushState('', 'Cleared workspace');
    }
  };

  const applyTransform = (fn, label) => {
    try {
      const res = fn(text);
      pushState(res, label);
    } catch (err) {
      if (showAlert) showAlert(`Error: ${err.message}`, 'danger');
    }
  };

  // One-click Auto Polish: cleans spacing, trims lines, fixes sentence casing
  const handleAutoPolish = () => {
    if (!text.trim()) return;
    applyTransform(transform.autoPolish, '⚡ Auto-polished spacing & casing');
  };

  const handleFindReplaceSubmit = e => {
    e.preventDefault();
    try {
      const res = transform.findAndReplace(text, searchQuery, replaceQuery, {
        matchCase,
        useRegex,
      });
      pushState(res, 'Find & replace completed');
      setShowFindReplace(false);
    } catch (err) {
      if (showAlert) showAlert(err.message, 'danger');
    }
  };

  const handlePrefixSuffixSubmit = e => {
    e.preventDefault();
    const res = transform.prefixAndSuffix(text, linePrefix, lineSuffix);
    pushState(res, 'Wrapped lines');
    setShowPrefixSuffix(false);
  };

  const loadSample = type => {
    const sample = SAMPLES[type] || SAMPLES.essay;
    setOriginalText(sample);
    pushState(sample, `Loaded ${type} sample`);
  };

  // Keyboard Shortcuts inside editor
  const handleKeyDown = e => {
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'c') {
      e.preventDefault();
      handleCopy();
    } else if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
      if (e.shiftKey) {
        e.preventDefault();
        handleRedo();
      } else {
        e.preventDefault();
        handleUndo();
      }
    } else if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
      e.preventDefault();
      handleRedo();
    }
  };

  const wordPercentage = wordTarget > 0 ? Math.min(100, Math.round((stats.wordCount / wordTarget) * 100)) : 0;
  const isOverWordTarget = stats.wordCount > wordTarget;

  return (
    <div className="workspace-container">
      {/* Main Workspace Card */}
      <div className={`workspace-card ${isFocusMode ? 'focus-mode' : ''}`}>
        {/* Top Control Toolbar */}
        <div className="workspace-toolbar">
          <div className="toolbar-cluster">
            {/* Undo / Redo */}
            <button
              type="button"
              className="tool-btn"
              onClick={handleUndo}
              disabled={historyIndex <= 0}
              title="Undo (Ctrl+Z)"
            >
              <Undo2 size={13} />
            </button>
            <button
              type="button"
              className="tool-btn"
              onClick={handleRedo}
              disabled={historyIndex >= history.length - 1}
              title="Redo (Ctrl+Y)"
            >
              <Redo2 size={13} />
            </button>

            <span className="toolbar-divider" />

            {/* High-Value 1-Click Auto Polish */}
            <button
              type="button"
              className="tool-btn btn-accent"
              onClick={handleAutoPolish}
              title="Clean extra spaces, trim all lines & normalize sentence casing in 1 click"
            >
              <Sparkles size={13} />
              <span>Auto Polish</span>
            </button>

            <span className="toolbar-divider" />

            {/* Case Converters directly accessible */}
            <button
              type="button"
              className="tool-btn"
              onClick={() => applyTransform(transform.toSentenceCase, 'Sentence case')}
              title="Sentence case"
            >
              Sentence
            </button>
            <button
              type="button"
              className="tool-btn"
              onClick={() => applyTransform(transform.toTitleCase, 'Title Case')}
              title="Title Case"
            >
              Title
            </button>
            <button
              type="button"
              className="tool-btn"
              onClick={() => applyTransform(transform.toUpperCase, 'UPPERCASE')}
              title="UPPERCASE"
            >
              UPPER
            </button>
            <button
              type="button"
              className="tool-btn"
              onClick={() => applyTransform(transform.toLowerCase, 'lowercase')}
              title="lowercase"
            >
              lower
            </button>

            {/* More Actions Dropdown */}
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                className={`tool-btn ${showMoreActions ? 'btn-primary' : ''}`}
                onClick={() => setShowMoreActions(!showMoreActions)}
              >
                <span>More Tools</span>
                <ChevronDown size={12} />
              </button>

              {showMoreActions && (
                <div
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    marginTop: '4px',
                    backgroundColor: 'var(--bg-card)',
                    border: '1px solid var(--border-app)',
                    borderRadius: '8px',
                    boxShadow: 'var(--shadow-md)',
                    padding: '0.5rem',
                    zIndex: 200,
                    width: '240px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.25rem'
                  }}
                >
                  <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)', padding: '0.2rem 0.5rem', textTransform: 'uppercase' }}>
                    Formatting & Cleaning
                  </div>
                  <button
                    type="button"
                    className="tool-btn text-start border-0"
                    onClick={() => {
                      applyTransform(transform.removeExtraSpaces, 'Removed Extra Spaces');
                      setShowMoreActions(false);
                    }}
                  >
                    Strip Extra Spaces
                  </button>
                  <button
                    type="button"
                    className="tool-btn text-start border-0"
                    onClick={() => {
                      applyTransform(transform.removeDuplicateLines, 'Removed Duplicates');
                      setShowMoreActions(false);
                    }}
                  >
                    Remove Duplicate Lines
                  </button>
                  <button
                    type="button"
                    className="tool-btn text-start border-0"
                    onClick={() => {
                      applyTransform(transform.removeEmptyLines, 'Removed Empty Lines');
                      setShowMoreActions(false);
                    }}
                  >
                    Remove Empty Lines
                  </button>
                  <button
                    type="button"
                    className="tool-btn text-start border-0"
                    onClick={() => {
                      applyTransform(transform.trimEveryLine, 'Trimmed Lines');
                      setShowMoreActions(false);
                    }}
                  >
                    Trim All Lines
                  </button>

                  <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)', padding: '0.3rem 0.5rem 0.1rem', textTransform: 'uppercase', borderTop: '1px solid var(--border-app)' }}>
                    Sorting & Organization
                  </div>
                  <button
                    type="button"
                    className="tool-btn text-start border-0"
                    onClick={() => {
                      applyTransform(t => transform.sortLinesAlphabetical(t, false), 'Sorted A-Z');
                      setShowMoreActions(false);
                    }}
                  >
                    Sort Lines (A → Z)
                  </button>
                  <button
                    type="button"
                    className="tool-btn text-start border-0"
                    onClick={() => {
                      applyTransform(t => transform.sortLinesAlphabetical(t, true), 'Sorted Z-A');
                      setShowMoreActions(false);
                    }}
                  >
                    Sort Lines (Z → A)
                  </button>
                  <button
                    type="button"
                    className="tool-btn text-start border-0"
                    onClick={() => {
                      applyTransform(transform.addLineNumbers, 'Numbered lines');
                      setShowMoreActions(false);
                    }}
                  >
                    Add Line Numbers
                  </button>
                  <button
                    type="button"
                    className="tool-btn text-start border-0"
                    onClick={() => {
                      applyTransform(transform.removeLineNumbers, 'Removed line numbers');
                      setShowMoreActions(false);
                    }}
                  >
                    Remove Line Numbers
                  </button>

                  <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)', padding: '0.3rem 0.5rem 0.1rem', textTransform: 'uppercase', borderTop: '1px solid var(--border-app)' }}>
                    Extraction & Utilities
                  </div>
                  <button
                    type="button"
                    className="tool-btn text-start border-0"
                    onClick={() => {
                      applyTransform(transform.extractEmailsAndUrls, 'Extracted links & emails');
                      setShowMoreActions(false);
                    }}
                  >
                    Extract Emails & URLs
                  </button>
                  <button
                    type="button"
                    className="tool-btn text-start border-0"
                    onClick={() => {
                      applyTransform(transform.extractUniqueWords, 'Extracted unique words');
                      setShowMoreActions(false);
                    }}
                  >
                    Extract Unique Words
                  </button>
                  <button
                    type="button"
                    className="tool-btn text-start border-0"
                    onClick={() => {
                      applyTransform(transform.removePunctuation, 'Stripped punctuation');
                      setShowMoreActions(false);
                    }}
                  >
                    Strip Punctuation
                  </button>
                  <button
                    type="button"
                    className="tool-btn text-start border-0"
                    onClick={() => {
                      applyTransform(transform.reverseText, 'Reversed text');
                      setShowMoreActions(false);
                    }}
                  >
                    Reverse Text
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Tools (Find, View, Import, Copy, Clear) */}
          <div className="toolbar-cluster">
            <button
              type="button"
              className={`tool-btn ${showFindReplace ? 'btn-primary' : ''}`}
              onClick={() => setShowFindReplace(!showFindReplace)}
              title="Find and Replace"
            >
              <Search size={13} />
              <span className="d-none d-sm-inline">Find</span>
            </button>

            <button
              type="button"
              className={`tool-btn ${showPrefixSuffix ? 'btn-primary' : ''}`}
              onClick={() => setShowPrefixSuffix(!showPrefixSuffix)}
              title="Prefix / Suffix each line"
            >
              <Layers size={13} />
              <span className="d-none d-sm-inline">Wrap</span>
            </button>

            <button
              type="button"
              className="tool-btn"
              onClick={() => setShowDiffModal(true)}
              title="Compare with baseline"
            >
              <SplitSquareVertical size={13} />
              <span className="d-none d-sm-inline">Diff</span>
            </button>

            <span className="toolbar-divider" />

            {/* Typography & Zen options */}
            <button
              type="button"
              className="tool-btn"
              onClick={() => setFontSize(prev => prev === 'sm' ? 'md' : prev === 'md' ? 'lg' : 'sm')}
              title={`Font Size: ${fontSize.toUpperCase()}`}
            >
              <Type size={13} />
              <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>{fontSize.toUpperCase()}</span>
            </button>

            <button
              type="button"
              className="tool-btn"
              onClick={() => setIsMonospace(!isMonospace)}
              title={isMonospace ? 'Switch to Proportional font' : 'Switch to Monospace font'}
            >
              <FileText size={13} />
            </button>

            <button
              type="button"
              className="tool-btn"
              onClick={() => setIsFocusMode(!isFocusMode)}
              title={isFocusMode ? 'Exit Fullscreen Focus' : 'Fullscreen Zen Focus'}
            >
              {isFocusMode ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
            </button>

            <span className="toolbar-divider" />

            {/* File Actions */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".txt,.md,.json,.csv,.js,.html"
              style={{ display: 'none' }}
            />
            <button
              type="button"
              className="tool-btn"
              onClick={() => fileInputRef.current?.click()}
              title="Upload text file"
            >
              <Upload size={13} />
            </button>

            <button
              type="button"
              className="tool-btn"
              onClick={handleDownload}
              title="Download text file"
            >
              <Download size={13} />
            </button>

            {/* Primary Copy Button with Visual Feedback */}
            <button
              type="button"
              className="tool-btn btn-primary"
              onClick={handleCopy}
              title="Copy to clipboard (Ctrl+Shift+C)"
            >
              {copiedRecently ? <Check size={13} /> : <Copy size={13} />}
              <span>{copiedRecently ? 'Copied!' : 'Copy'}</span>
            </button>

            <button
              type="button"
              className="tool-btn btn-danger"
              onClick={handleClear}
              title="Clear text"
            >
              <Trash2 size={13} />
            </button>
          </div>
        </div>

        {/* Find & Replace Drawer */}
        {showFindReplace && (
          <form onSubmit={handleFindReplaceSubmit} style={{
            backgroundColor: 'var(--bg-subtle)',
            borderBottom: '1px solid var(--border-app)',
            padding: '0.6rem 1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            flexWrap: 'wrap'
          }}>
            <input
              type="text"
              placeholder="Find text..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="form-control form-control-sm"
              style={{ width: '180px' }}
              required
            />
            <input
              type="text"
              placeholder="Replace with..."
              value={replaceQuery}
              onChange={e => setReplaceQuery(e.target.value)}
              className="form-control form-control-sm"
              style={{ width: '180px' }}
            />
            <label style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={matchCase}
                onChange={e => setMatchCase(e.target.checked)}
              />
              Match case
            </label>
            <label style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={useRegex}
                onChange={e => setUseRegex(e.target.checked)}
              />
              Regex
            </label>
            <button type="submit" className="tool-btn btn-primary">
              Replace All
            </button>
            <button type="button" className="tool-btn" onClick={() => setShowFindReplace(false)}>
              Close
            </button>
          </form>
        )}

        {/* Prefix / Suffix Drawer */}
        {showPrefixSuffix && (
          <form onSubmit={handlePrefixSuffixSubmit} style={{
            backgroundColor: 'var(--bg-subtle)',
            borderBottom: '1px solid var(--border-app)',
            padding: '0.6rem 1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            flexWrap: 'wrap'
          }}>
            <input
              type="text"
              placeholder="Prefix each line with..."
              value={linePrefix}
              onChange={e => setLinePrefix(e.target.value)}
              className="form-control form-control-sm"
              style={{ width: '180px' }}
            />
            <input
              type="text"
              placeholder="Suffix each line with..."
              value={lineSuffix}
              onChange={e => setLineSuffix(e.target.value)}
              className="form-control form-control-sm"
              style={{ width: '180px' }}
            />
            <button type="submit" className="tool-btn btn-primary">
              Apply
            </button>
            <button type="button" className="tool-btn" onClick={() => setShowPrefixSuffix(false)}>
              Close
            </button>
          </form>
        )}

        {/* Main Comfortable Textarea */}
        <textarea
          ref={textareaRef}
          className={`editor-textarea ${isMonospace ? 'font-mono' : ''} size-${fontSize}`}
          value={text}
          onChange={handleTextChange}
          onKeyDown={handleKeyDown}
          placeholder="Start typing, paste an article, or load sample notes..."
          aria-label="Workspace document"
        />

        {/* Docked Telemetry Ribbon */}
        <div className="editor-telemetry-ribbon">
          <div className="telemetry-stats-inline">
            <span className="telemetry-item">
              <strong>{stats.wordCount.toLocaleString()}</strong> words
            </span>
            <span className="telemetry-dot">·</span>
            <span className="telemetry-item">
              <strong>{stats.characterCount.toLocaleString()}</strong> characters ({stats.characterNoSpacesCount.toLocaleString()} no spaces)
            </span>
            <span className="telemetry-dot">·</span>
            <span className="telemetry-item">
              <strong>~{stats.readingTimeMinutes}</strong> min read
            </span>
            <span className="telemetry-dot">·</span>
            <span className="telemetry-item">
              Flesch <strong>{intel.fleschReadingEase}</strong> ({intel.readingDifficultyLevel})
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            {/* Quick Sample Selector */}
            <div className="d-none d-md-flex align-items-center gap-1">
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Load:</span>
              <button
                type="button"
                className="btn btn-link p-0 text-decoration-none"
                style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}
                onClick={() => loadSample('essay')}
              >
                Essay
              </button>
              <span style={{ color: 'var(--border-app)' }}>·</span>
              <button
                type="button"
                className="btn btn-link p-0 text-decoration-none"
                style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}
                onClick={() => loadSample('email')}
              >
                Email
              </button>
              <span style={{ color: 'var(--border-app)' }}>·</span>
              <button
                type="button"
                className="btn btn-link p-0 text-decoration-none"
                style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}
                onClick={() => loadSample('notes')}
              >
                Notes
              </button>
            </div>

            <button
              type="button"
              className={`tool-btn ${showInsightsDrawer ? 'btn-primary' : ''}`}
              onClick={() => setShowInsightsDrawer(!showInsightsDrawer)}
            >
              <BarChart2 size={13} />
              <span>{showInsightsDrawer ? 'Hide Insights' : 'Deep Insights'}</span>
            </button>
          </div>
        </div>

        {/* Collapsible Insights Drawer */}
        {showInsightsDrawer && (
          <div className="insights-drawer">
            <div className="insights-grid mb-3">
              <div className="insight-metric-tile">
                <div className="insight-tile-label">Sentences & Lines</div>
                <div className="insight-tile-value">{stats.sentenceCount} s / {stats.lineCount} l</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{stats.paragraphCount} paragraphs</div>
              </div>

              <div className="insight-metric-tile">
                <div className="insight-tile-label">Speaking Time</div>
                <div className="insight-tile-value">~{stats.speakingTimeMinutes} min</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>at 130 words / minute</div>
              </div>

              <div className="insight-metric-tile">
                <div className="insight-tile-label">Average Word Length</div>
                <div className="insight-tile-value">{stats.averageWordLength} chars</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>vocabulary density</div>
              </div>

              <div className="insight-metric-tile">
                <div className="insight-tile-label">Target Progress</div>
                <div className="insight-tile-value" style={{ color: isOverWordTarget ? '#ef4444' : 'inherit' }}>
                  {wordPercentage}%
                </div>
                <div className="progress-track">
                  <div
                    className={`progress-fill ${isOverWordTarget ? 'over-limit' : ''}`}
                    style={{ width: `${Math.min(100, wordPercentage)}%` }}
                  />
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-app)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Goals:</span>
                <input
                  type="number"
                  min="50"
                  step="50"
                  value={wordTarget}
                  onChange={e => setWordTarget(Number(e.target.value) || 100)}
                  className="form-control form-control-sm"
                  style={{ width: '75px' }}
                />
                <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>words ·</span>
                <input
                  type="number"
                  min="100"
                  step="100"
                  value={charTarget}
                  onChange={e => setCharTarget(Number(e.target.value) || 500)}
                  className="form-control form-control-sm"
                  style={{ width: '80px' }}
                />
                <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>chars</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.8125rem', display: 'flex', alignItems: 'center', gap: '0.35rem', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                  <input
                    type="checkbox"
                    checked={autoSaveEnabled}
                    onChange={e => setAutoSaveEnabled(e.target.checked)}
                  />
                  <span>Auto-save draft in browser</span>
                </label>
                <button
                  type="button"
                  className="tool-btn"
                  onClick={() => {
                    const saved = localStorage.getItem('textutil_draft');
                    if (saved) {
                      pushState(saved, 'Restored saved session');
                    } else {
                      if (showAlert) showAlert('No saved session found', 'info');
                    }
                  }}
                >
                  <RotateCcw size={12} />
                  <span>Restore Saved</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Before / After Diff Comparison Modal */}
      {showDiffModal && (
        <div className="modal-overlay" onClick={() => setShowDiffModal(false)}>
          <div className="modal-dialog" onClick={e => e.stopPropagation()} style={{ maxWidth: '800px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '1rem 1.25rem',
              borderBottom: '1px solid var(--border-app)'
            }}>
              <div style={{ fontWeight: 600, fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <SplitSquareVertical size={18} />
                <span>Text Comparison: Baseline vs Current</span>
              </div>
              <button
                type="button"
                className="tool-btn"
                onClick={() => setShowDiffModal(false)}
              >
                Close
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', padding: '1.25rem' }}>
              <div>
                <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                  ORIGINAL BASELINE ({originalText.length} chars)
                </div>
                <div style={{
                  maxHeight: '340px',
                  overflowY: 'auto',
                  padding: '0.75rem',
                  backgroundColor: 'var(--bg-subtle)',
                  border: '1px solid var(--border-app)',
                  borderRadius: '6px',
                  fontSize: '0.8125rem',
                  fontFamily: 'var(--font-mono)',
                  whiteSpace: 'pre-wrap'
                }}>
                  {originalText || '<empty>'}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>
                  CURRENT WORKSPACE ({text.length} chars)
                </div>
                <div style={{
                  maxHeight: '340px',
                  overflowY: 'auto',
                  padding: '0.75rem',
                  backgroundColor: 'var(--bg-subtle)',
                  border: '1px solid var(--border-app)',
                  borderRadius: '6px',
                  fontSize: '0.8125rem',
                  fontFamily: 'var(--font-mono)',
                  whiteSpace: 'pre-wrap'
                }}>
                  {text || '<empty>'}
                </div>
              </div>
            </div>

            <div style={{
              padding: '0.75rem 1.25rem',
              backgroundColor: 'var(--bg-subtle)',
              borderTop: '1px solid var(--border-app)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <button
                type="button"
                className="tool-btn"
                onClick={() => {
                  setOriginalText(text);
                  if (showAlert) showAlert('Updated baseline to current text', 'info');
                }}
              >
                Set Current as New Baseline
              </button>
              <button
                type="button"
                className="tool-btn btn-primary"
                onClick={() => setShowDiffModal(false)}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
