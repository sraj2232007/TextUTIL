import React, { useState } from 'react';
import {
  FileJson,
  Binary,
  Code,
  FileText,
  GitCompare,
  FileSpreadsheet,
  KeyRound,
  Eye,
  Hash,
  Copy
} from 'lucide-react';
import * as dev from '../utils/developerTools';

const DEV_TABS = [
  { id: 'json', name: 'JSON Tools', icon: FileJson },
  { id: 'diff', name: 'Diff Checker', icon: GitCompare },
  { id: 'regex', name: 'Regex Tester', icon: Hash },
  { id: 'base64', name: 'Base64 & URL', icon: Binary },
  { id: 'markdown', name: 'Markdown Preview', icon: FileText },
  { id: 'csv', name: 'CSV ↔ JSON', icon: FileSpreadsheet },
  { id: 'uuid', name: 'UUID Generator', icon: KeyRound },
  { id: 'html', name: 'HTML & Entities', icon: Code },
  { id: 'whitespace', name: 'Whitespace & Slug', icon: Eye },
];

export default function DeveloperTools({ showAlert }) {
  const [activeTab, setActiveTab] = useState('json');

  // JSON State
  const [jsonInput, setJsonInput] = useState('{\n  "name": "TextUtil",\n  "version": "2.0.0",\n  "features": ["text-transform", "ai-studio", "developer-toolbox"],\n  "active": true\n}');
  const [jsonIndent, setJsonIndent] = useState(2);
  const [jsonValidationResult, setJsonValidationResult] = useState(null);

  // Diff State
  const [diffOrig, setDiffOrig] = useState('The quick brown fox jumps over the lazy dog.\nTextUtil provides powerful developer tools.\nBuild fast and clean interfaces.');
  const [diffMod, setDiffMod] = useState('The fast brown fox jumps over the sleepy dog.\nTextUtil delivers intelligent developer tools.\nBuild resilient, responsive and clean interfaces.\nAdded a brand new fourth line.');

  // Regex State
  const [regexPattern, setRegexPattern] = useState('\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}\\b');
  const [regexFlags, setRegexFlags] = useState('g');
  const [regexText, setRegexText] = useState('Contact support@textutil.dev or sales@enterprise.io for questions. Also info@acme.org.');

  // Base64 & URL
  const [b64Input, setB64Input] = useState('Hello World from TextUtil! 🚀');
  const [b64Output, setB64Output] = useState('');

  // Markdown
  const [mdInput, setMdInput] = useState('# TextUtil Developer Tools\n\nWelcome to **Markdown Live Preview**.\n\n- [x] High performance\n- [x] Client-side private\n- [ ] Export to PDF\n\n```javascript\nconst toolkit = new TextUtil();\ntoolkit.run();\n```\n\n> "Simplicity is prerequisite for reliability." — Edsger Dijkstra');

  // CSV <-> JSON
  const [csvInput, setCsvInput] = useState('id,name,role,department\n1,Sarah Connor,Engineer,Security\n2,John Doe,Designer,Product\n3,Elena Vance,Scientist,R&D');
  const [csvJsonOutput, setCsvJsonOutput] = useState('');

  // UUID
  const [uuidCount, setUuidCount] = useState(5);
  const [uuidHyphens, setUuidHyphens] = useState(true);
  const [uuidUpper, setUuidUpper] = useState(false);
  const [uuidResult, setUuidResult] = useState('');

  // HTML
  const [htmlInput, setHtmlInput] = useState('<div class="header"><h1>Welcome to &quot;TextUtil&quot;</h1><p>Enjoy &amp; explore.</p></div>');
  const [htmlResult, setHtmlResult] = useState('');

  // Whitespace & Slug
  const [slugInput, setSlugInput] = useState('How to Build a Modern SaaS Application in 2026!');
  const [slugResult, setSlugResult] = useState('');
  const [wsInput, setWsInput] = useState('Line 1   with multiple    spaces.\nLine 2\twith a tab character.\nLine 3 with end.');
  const [wsResult, setWsResult] = useState('');

  const copyToClipboard = async text => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      if (showAlert) showAlert('Copied to clipboard!', 'success');
    } catch {
      if (showAlert) showAlert('Failed to copy', 'warning');
    }
  };

  return (
    <div className="dev-tools-container">
      <div className="page-header">
        <h1 className="page-title">Developer Toolbox</h1>
        <p className="page-subtitle">
          Essential developer utilities for JSON validation, encoding, diffing, regex testing, and data conversion.
        </p>
      </div>

      {/* Segmented Tab Controls */}
      <div className="panel-card p-2 mb-3" style={{ overflowX: 'auto' }}>
        <div style={{ display: 'flex', gap: '0.35rem', minWidth: 'max-content' }}>
          {DEV_TABS.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                className={`tool-btn ${isActive ? 'btn-primary' : ''}`}
                onClick={() => setActiveTab(tab.id)}
                style={{ padding: '0.45rem 0.85rem' }}
              >
                <Icon size={15} />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 1: JSON TOOLS */}
      {activeTab === 'json' && (
        <div className="panel-card">
          <div className="panel-card-header">
            <span className="panel-title">
              <FileJson size={18} />
              <span>JSON Formatter, Validator & Minifier</span>
            </span>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Indent:</label>
              <select
                className="form-select form-select-sm"
                value={jsonIndent}
                onChange={e => setJsonIndent(e.target.value)}
                style={{ width: '90px' }}
              >
                <option value={2}>2 Spaces</option>
                <option value={4}>4 Spaces</option>
                <option value="tab">Tabs</option>
              </select>
            </div>
          </div>

          <textarea
            className="editor-textarea font-mono"
            style={{ minHeight: '340px' }}
            value={jsonInput}
            onChange={e => {
              setJsonInput(e.target.value);
              setJsonValidationResult(null);
            }}
            placeholder="Paste raw JSON here..."
          />

          {jsonValidationResult && (
            <div style={{
              marginTop: '0.75rem',
              padding: '0.65rem 1rem',
              borderRadius: '6px',
              backgroundColor: jsonValidationResult.valid ? 'var(--success-bg)' : 'var(--danger-bg)',
              color: jsonValidationResult.valid ? 'var(--success-text)' : 'var(--danger-text)',
              border: `1px solid ${jsonValidationResult.valid ? 'var(--success-border)' : 'var(--danger-border)'}`,
              fontSize: '0.8125rem'
            }}>
              {jsonValidationResult.valid ? '✓ Valid JSON syntax' : `✗ Invalid JSON: ${jsonValidationResult.error}`}
            </div>
          )}

          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="tool-btn btn-primary"
              onClick={() => {
                try {
                  const res = dev.formatJson(jsonInput, jsonIndent);
                  setJsonInput(res);
                  setJsonValidationResult({ valid: true });
                  if (showAlert) showAlert('Formatted JSON successfully', 'success');
                } catch (err) {
                  setJsonValidationResult({ valid: false, error: err.message });
                  if (showAlert) showAlert(`JSON Error: ${err.message}`, 'danger');
                }
              }}
            >
              Format JSON
            </button>
            <button
              type="button"
              className="tool-btn"
              onClick={() => {
                const res = dev.validateJson(jsonInput);
                setJsonValidationResult(res);
                if (res.valid && showAlert) showAlert('JSON is completely valid!', 'success');
              }}
            >
              Validate Only
            </button>
            <button
              type="button"
              className="tool-btn"
              onClick={() => {
                try {
                  const res = dev.minifyJson(jsonInput);
                  setJsonInput(res);
                  setJsonValidationResult({ valid: true });
                  if (showAlert) showAlert('Minified JSON successfully', 'success');
                } catch (err) {
                  setJsonValidationResult({ valid: false, error: err.message });
                  if (showAlert) showAlert(`JSON Error: ${err.message}`, 'danger');
                }
              }}
            >
              Minify JSON
            </button>
            <button
              type="button"
              className="tool-btn"
              onClick={() => copyToClipboard(jsonInput)}
            >
              <Copy size={14} />
              <span>Copy JSON</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: DIFF CHECKER */}
      {activeTab === 'diff' && (
        <div className="panel-card">
          <div className="panel-card-header">
            <span className="panel-title">
              <GitCompare size={18} />
              <span>Text Diff & Comparison Checker</span>
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem', display: 'block' }}>
                Original Text
              </label>
              <textarea
                className="editor-textarea font-mono"
                style={{ minHeight: '180px' }}
                value={diffOrig}
                onChange={e => setDiffOrig(e.target.value)}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--accent-primary)', marginBottom: '0.35rem', display: 'block' }}>
                Modified Text
              </label>
              <textarea
                className="editor-textarea font-mono"
                style={{ minHeight: '180px' }}
                value={diffMod}
                onChange={e => setDiffMod(e.target.value)}
              />
            </div>
          </div>

          <div style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
            Diff Visualizer (Additions in green, Deletions in red):
          </div>

          <div style={{
            backgroundColor: 'var(--bg-subtle)',
            border: '1px solid var(--border-app)',
            borderRadius: '6px',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.8125rem',
            maxHeight: '320px',
            overflowY: 'auto'
          }}>
            {dev.computeTextDiff(diffOrig, diffMod).map((chunk, idx) => {
              let bg = 'transparent';
              let color = 'var(--text-primary)';
              let prefix = ' ';
              if (chunk.type === 'added') {
                bg = 'rgba(16, 185, 129, 0.15)';
                color = '#10b981';
                prefix = '+';
              } else if (chunk.type === 'removed') {
                bg = 'rgba(239, 68, 68, 0.15)';
                color = '#ef4444';
                prefix = '-';
              }
              return (
                <div
                  key={idx}
                  style={{
                    backgroundColor: bg,
                    color: color,
                    padding: '0.2rem 0.75rem',
                    display: 'flex',
                    gap: '0.5rem'
                  }}
                >
                  <span style={{ opacity: 0.5, userSelect: 'none', width: '25px', textAlign: 'right' }}>{chunk.lineNum}</span>
                  <span style={{ fontWeight: 600, userSelect: 'none' }}>{prefix}</span>
                  <span style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>{chunk.line}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: REGEX TESTER */}
      {activeTab === 'regex' && (
        <div className="panel-card">
          <div className="panel-card-header">
            <span className="panel-title">
              <Hash size={18} />
              <span>Regex Expression Tester</span>
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 140px', gap: '0.75rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.8125rem', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>
                Regular Expression Pattern
              </label>
              <input
                type="text"
                className="form-control font-mono"
                value={regexPattern}
                onChange={e => setRegexPattern(e.target.value)}
                placeholder="e.g. \\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}\\b"
              />
            </div>
            <div>
              <label style={{ fontSize: '0.8125rem', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>
                Flags
              </label>
              <input
                type="text"
                className="form-control font-mono"
                value={regexFlags}
                onChange={e => setRegexFlags(e.target.value)}
                placeholder="g, i, m, s"
              />
            </div>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ fontSize: '0.8125rem', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>
              Test String
            </label>
            <textarea
              className="editor-textarea font-mono"
              style={{ minHeight: '140px' }}
              value={regexText}
              onChange={e => setRegexText(e.target.value)}
            />
          </div>

          {/* Regex Results */}
          {(() => {
            const result = dev.testRegex(regexPattern, regexFlags, regexText);
            if (result.error) {
              return (
                <div style={{
                  padding: '0.65rem 1rem',
                  backgroundColor: 'var(--danger-bg)',
                  color: 'var(--danger-text)',
                  borderRadius: '6px',
                  border: '1px solid var(--danger-border)',
                  fontSize: '0.8125rem'
                }}>
                  ✗ Regex Syntax Error: {result.error}
                </div>
              );
            }
            return (
              <div>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                  Matches Found ({result.count}):
                </div>
                {result.matches.length === 0 ? (
                  <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>No matches in test string.</div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', maxHeight: '200px', overflowY: 'auto' }}>
                    {result.matches.map((m, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          padding: '0.35rem 0.65rem',
                          backgroundColor: 'var(--bg-subtle)',
                          borderRadius: '4px',
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.8125rem'
                        }}
                      >
                        <span style={{ fontWeight: 600, color: 'var(--accent-primary)' }}>{m.match}</span>
                        <span style={{ color: 'var(--text-muted)' }}>index {m.index}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      )}

      {/* TAB 4: BASE64 & URL */}
      {activeTab === 'base64' && (
        <div className="panel-card">
          <div className="panel-card-header">
            <span className="panel-title">
              <Binary size={18} />
              <span>Base64 & URL Encoder / Decoder</span>
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.8125rem', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>
                Input Text
              </label>
              <textarea
                className="editor-textarea font-mono"
                style={{ minHeight: '220px' }}
                value={b64Input}
                onChange={e => setB64Input(e.target.value)}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.8125rem', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>
                Result
              </label>
              <textarea
                className="editor-textarea font-mono"
                style={{ minHeight: '220px', backgroundColor: 'var(--bg-card)' }}
                value={b64Output}
                readOnly
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="tool-btn btn-primary"
              onClick={() => {
                try {
                  const res = dev.encodeBase64(b64Input);
                  setB64Output(res);
                  if (showAlert) showAlert('Encoded to Base64', 'success');
                } catch (err) {
                  if (showAlert) showAlert(err.message, 'danger');
                }
              }}
            >
              Base64 Encode
            </button>
            <button
              type="button"
              className="tool-btn"
              onClick={() => {
                try {
                  const res = dev.decodeBase64(b64Input);
                  setB64Output(res);
                  if (showAlert) showAlert('Decoded from Base64', 'success');
                } catch (err) {
                  if (showAlert) showAlert(err.message, 'danger');
                }
              }}
            >
              Base64 Decode
            </button>
            <button
              type="button"
              className="tool-btn"
              onClick={() => {
                const res = dev.encodeUrl(b64Input, true);
                setB64Output(res);
                if (showAlert) showAlert('URL Encoded', 'success');
              }}
            >
              URL Encode
            </button>
            <button
              type="button"
              className="tool-btn"
              onClick={() => {
                try {
                  const res = dev.decodeUrl(b64Input, true);
                  setB64Output(res);
                  if (showAlert) showAlert('URL Decoded', 'success');
                } catch (err) {
                  if (showAlert) showAlert(err.message, 'danger');
                }
              }}
            >
              URL Decode
            </button>
            <button
              type="button"
              className="tool-btn"
              onClick={() => copyToClipboard(b64Output)}
              disabled={!b64Output}
            >
              <Copy size={14} />
              <span>Copy Result</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 5: MARKDOWN PREVIEW */}
      {activeTab === 'markdown' && (
        <div className="panel-card">
          <div className="panel-card-header">
            <span className="panel-title">
              <FileText size={18} />
              <span>Markdown Editor with Live Render</span>
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.8125rem', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>
                Markdown Source
              </label>
              <textarea
                className="editor-textarea font-mono"
                style={{ minHeight: '340px' }}
                value={mdInput}
                onChange={e => setMdInput(e.target.value)}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.8125rem', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>
                Live HTML Preview
              </label>
              <div
                style={{
                  minHeight: '340px',
                  padding: '1rem',
                  backgroundColor: 'var(--bg-subtle)',
                  border: '1px solid var(--border-app)',
                  borderRadius: '6px',
                  overflowY: 'auto',
                  lineHeight: 1.6
                }}
                dangerouslySetInnerHTML={{
                  // Safe simple Markdown renderer without eval
                  __html: mdInput
                    .replace(/^# (.*$)/gim, '<h2 style="font-size:1.4rem;font-weight:700;margin:0.5rem 0;">$1</h2>')
                    .replace(/^## (.*$)/gim, '<h3 style="font-size:1.2rem;font-weight:600;margin:0.5rem 0;">$1</h3>')
                    .replace(/^### (.*$)/gim, '<h4 style="font-size:1rem;font-weight:600;margin:0.5rem 0;">$1</h4>')
                    .replace(/^> (.*$)/gim, '<blockquote style="border-left:3px solid var(--accent-primary);padding-left:0.75rem;margin:0.5rem 0;color:var(--text-muted);">$1</blockquote>')
                    .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
                    .replace(/\*(.*)\*/gim, '<em>$1</em>')
                    .replace(/```([\s\S]*?)```/gim, '<pre style="background:var(--bg-card);padding:0.75rem;border-radius:4px;overflow-x:auto;"><code>$1</code></pre>')
                    .replace(/`([^`]+)`/gim, '<code style="background:var(--bg-card);padding:0.1rem 0.35rem;border-radius:3px;">$1</code>')
                    .replace(/\n$/gim, '<br />')
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: CSV <-> JSON */}
      {activeTab === 'csv' && (
        <div className="panel-card">
          <div className="panel-card-header">
            <span className="panel-title">
              <FileSpreadsheet size={18} />
              <span>CSV ↔ JSON Bidirectional Converter</span>
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.8125rem', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>
                CSV or JSON Input
              </label>
              <textarea
                className="editor-textarea font-mono"
                style={{ minHeight: '260px' }}
                value={csvInput}
                onChange={e => setCsvInput(e.target.value)}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.8125rem', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>
                Converted Result
              </label>
              <textarea
                className="editor-textarea font-mono"
                style={{ minHeight: '260px', backgroundColor: 'var(--bg-card)' }}
                value={csvJsonOutput}
                readOnly
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              type="button"
              className="tool-btn btn-primary"
              onClick={() => {
                try {
                  const res = dev.csvToJson(csvInput);
                  setCsvJsonOutput(res);
                  if (showAlert) showAlert('Converted CSV to JSON successfully', 'success');
                } catch (err) {
                  if (showAlert) showAlert(err.message, 'danger');
                }
              }}
            >
              CSV → JSON
            </button>
            <button
              type="button"
              className="tool-btn btn-primary"
              onClick={() => {
                try {
                  const res = dev.jsonToCsv(csvInput);
                  setCsvJsonOutput(res);
                  if (showAlert) showAlert('Converted JSON to CSV successfully', 'success');
                } catch (err) {
                  if (showAlert) showAlert(err.message, 'danger');
                }
              }}
            >
              JSON → CSV
            </button>
            <button
              type="button"
              className="tool-btn"
              onClick={() => copyToClipboard(csvJsonOutput)}
              disabled={!csvJsonOutput}
            >
              <Copy size={14} />
              <span>Copy Result</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 7: UUID GENERATOR */}
      {activeTab === 'uuid' && (
        <div className="panel-card">
          <div className="panel-card-header">
            <span className="panel-title">
              <KeyRound size={18} />
              <span>UUID v4 Generator</span>
            </span>
          </div>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.8125rem' }}>Quantity:</label>
              <input
                type="number"
                min="1"
                max="100"
                value={uuidCount}
                onChange={e => setUuidCount(Number(e.target.value) || 1)}
                className="form-control form-control-sm"
                style={{ width: '80px' }}
              />
            </div>
            <label style={{ fontSize: '0.8125rem', display: 'flex', alignItems: 'center', gap: '0.35rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={uuidHyphens}
                onChange={e => setUuidHyphens(e.target.checked)}
              />
              Include Hyphens
            </label>
            <label style={{ fontSize: '0.8125rem', display: 'flex', alignItems: 'center', gap: '0.35rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={uuidUpper}
                onChange={e => setUuidUpper(e.target.checked)}
              />
              UPPERCASE
            </label>
            <button
              type="button"
              className="tool-btn btn-primary"
              onClick={() => {
                const res = dev.generateUuidV4(uuidCount, { hyphens: uuidHyphens, uppercase: uuidUpper });
                setUuidResult(res);
                if (showAlert) showAlert(`Generated ${uuidCount} UUIDs`, 'success');
              }}
            >
              Generate UUIDs
            </button>
          </div>

          <textarea
            className="editor-textarea font-mono"
            style={{ minHeight: '200px', backgroundColor: 'var(--bg-card)' }}
            value={uuidResult}
            readOnly
            placeholder="Click Generate UUIDs..."
          />

          {uuidResult && (
            <div style={{ marginTop: '0.75rem' }}>
              <button
                type="button"
                className="tool-btn"
                onClick={() => copyToClipboard(uuidResult)}
              >
                <Copy size={14} />
                <span>Copy UUIDs</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 8: HTML & ENTITIES */}
      {activeTab === 'html' && (
        <div className="panel-card">
          <div className="panel-card-header">
            <span className="panel-title">
              <Code size={18} />
              <span>HTML Entity Encoder & Tag Stripper</span>
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.8125rem', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>
                HTML Source Input
              </label>
              <textarea
                className="editor-textarea font-mono"
                style={{ minHeight: '220px' }}
                value={htmlInput}
                onChange={e => setHtmlInput(e.target.value)}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.8125rem', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>
                Processed Output
              </label>
              <textarea
                className="editor-textarea font-mono"
                style={{ minHeight: '220px', backgroundColor: 'var(--bg-card)' }}
                value={htmlResult}
                readOnly
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="tool-btn btn-primary"
              onClick={() => {
                const res = dev.encodeHtmlEntities(htmlInput);
                setHtmlResult(res);
                if (showAlert) showAlert('Encoded HTML entities', 'success');
              }}
            >
              Encode Entities
            </button>
            <button
              type="button"
              className="tool-btn"
              onClick={() => {
                const res = dev.decodeHtmlEntities(htmlInput);
                setHtmlResult(res);
                if (showAlert) showAlert('Decoded HTML entities', 'success');
              }}
            >
              Decode Entities
            </button>
            <button
              type="button"
              className="tool-btn"
              onClick={() => {
                const res = dev.stripHtmlTags(htmlInput);
                setHtmlResult(res);
                if (showAlert) showAlert('Stripped all HTML tags', 'success');
              }}
            >
              Strip HTML Tags
            </button>
            <button
              type="button"
              className="tool-btn"
              onClick={() => copyToClipboard(htmlResult)}
              disabled={!htmlResult}
            >
              <Copy size={14} />
              <span>Copy Output</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 9: WHITESPACE & SLUG */}
      {activeTab === 'whitespace' && (
        <div className="panel-card">
          <div className="panel-card-header">
            <span className="panel-title">
              <Eye size={18} />
              <span>Slug Generator & Whitespace Visualizer</span>
            </span>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ fontSize: '0.8125rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>
              URL Slug Generator
            </label>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <input
                type="text"
                className="form-control"
                value={slugInput}
                onChange={e => setSlugInput(e.target.value)}
                placeholder="Enter title or sentence..."
              />
              <button
                type="button"
                className="tool-btn btn-primary"
                onClick={() => {
                  const res = dev.generateSlug(slugInput);
                  setSlugResult(res);
                  if (showAlert) showAlert('Generated URL slug', 'success');
                }}
              >
                Generate
              </button>
            </div>
            {slugResult && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.5rem 0.75rem',
                backgroundColor: 'var(--bg-subtle)',
                borderRadius: '6px',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.875rem'
              }}>
                <span>{slugResult}</span>
                <button
                  type="button"
                  className="btn btn-sm btn-link p-0 text-decoration-none"
                  onClick={() => copyToClipboard(slugResult)}
                >
                  Copy Slug
                </button>
              </div>
            )}
          </div>

          <div>
            <label style={{ fontSize: '0.8125rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>
              Whitespace Visualizer (Reveals spaces as ·, tabs as →, newlines as ↵)
            </label>
            <textarea
              className="editor-textarea font-mono"
              style={{ minHeight: '120px', marginBottom: '0.75rem' }}
              value={wsInput}
              onChange={e => setWsInput(e.target.value)}
            />
            <button
              type="button"
              className="tool-btn btn-primary"
              onClick={() => {
                const res = dev.visualizeWhitespace(wsInput);
                setWsResult(res);
              }}
            >
              Reveal Whitespace Characters
            </button>
            {wsResult && (
              <div style={{
                marginTop: '0.75rem',
                padding: '0.75rem',
                backgroundColor: 'var(--bg-subtle)',
                border: '1px solid var(--border-app)',
                borderRadius: '6px',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8125rem',
                whiteSpace: 'pre-wrap'
              }}>
                {wsResult}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
