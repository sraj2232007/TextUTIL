import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  ArrowRight
} from 'lucide-react';

const CATEGORIES = [
  { id: 'all', name: 'All Tools' },
  { id: 'transform', name: 'Text Transformations' },
  { id: 'stats', name: 'Text Analysis & Stats' },
  { id: 'ai', name: 'AI Writing Studio' },
  { id: 'dev', name: 'Developer Tools' },
  { id: 'intel', name: 'Intelligence Lab' },
];

export default function ToolsLibrary({ onExecuteTool }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const tools = [
    // Transformations
    { id: 'upper', name: 'UPPERCASE', category: 'transform', desc: 'Convert all alphabetic characters into uppercase.', route: '/' },
    { id: 'lower', name: 'lowercase', category: 'transform', desc: 'Convert all alphabetic characters into lowercase.', route: '/' },
    { id: 'title', name: 'Title Case', category: 'transform', desc: 'Capitalize major words according to headline style.', route: '/' },
    { id: 'sentence', name: 'Sentence case', category: 'transform', desc: 'Capitalize the first letter of each sentence.', route: '/' },
    { id: 'cap_words', name: 'Capitalize Each Word', category: 'transform', desc: 'Capitalize the first letter of every individual word.', route: '/' },
    { id: 'toggle', name: 'tOGGLE cASE', category: 'transform', desc: 'Invert case for every character throughout the document.', route: '/' },
    { id: 'extra_spaces', name: 'Remove Extra Spaces', category: 'transform', desc: 'Collapse duplicate and redundant spaces to a single space.', route: '/' },
    { id: 'dup_lines', name: 'Remove Duplicate Lines', category: 'transform', desc: 'Deduplicate repeated lines while keeping unique order.', route: '/' },
    { id: 'sort_az', name: 'Sort Lines A-Z', category: 'transform', desc: 'Sort lines in ascending alphabetical order.', route: '/' },
    { id: 'sort_za', name: 'Sort Lines Z-A', category: 'transform', desc: 'Sort lines in reverse alphabetical order.', route: '/' },
    { id: 'empty_lines', name: 'Remove Empty Lines', category: 'transform', desc: 'Strip out completely blank lines from document.', route: '/' },
    { id: 'trim_lines', name: 'Trim Lines', category: 'transform', desc: 'Strip leading and trailing whitespace from every line.', route: '/' },
    { id: 'line_numbers', name: 'Add Line Numbers', category: 'transform', desc: 'Prepend sequential line numbers to all lines.', route: '/' },
    { id: 'remove_line_numbers', name: 'Remove Line Numbers', category: 'transform', desc: 'Remove leading numerical counters and delimiters.', route: '/' },
    { id: 'reverse_text', name: 'Reverse Characters', category: 'transform', desc: 'Completely mirror and reverse text string.', route: '/' },
    { id: 'reverse_words', name: 'Reverse Word Order', category: 'transform', desc: 'Reverse the order of words per line.', route: '/' },
    { id: 'strip_punctuation', name: 'Strip Punctuation', category: 'transform', desc: 'Strip symbols and punctuation marks from text.', route: '/' },
    { id: 'unique_words', name: 'Extract Unique Words', category: 'transform', desc: 'Compile an alphabetical list of every distinct word.', route: '/' },
    { id: 'extract_links', name: 'Extract Emails & URLs', category: 'transform', desc: 'Parse document and isolate all web addresses and emails.', route: '/' },
    { id: 'find_replace', name: 'Find and Replace', category: 'transform', desc: 'Search and swap words with regex and case sensitivity.', route: '/' },

    // Stats
    { id: 'word_count', name: 'Word Counter', category: 'stats', desc: 'Accurate Unicode-compliant word counter.', route: '/' },
    { id: 'char_count', name: 'Character Counter', category: 'stats', desc: 'Count total characters with and without whitespace.', route: '/' },
    { id: 'read_time', name: 'Reading Time Estimator', category: 'stats', desc: 'Estimate reading duration based on 200 wpm standard.', route: '/' },
    { id: 'speak_time', name: 'Speaking Time Estimator', category: 'stats', desc: 'Estimate presentation duration based on 130 wpm cadence.', route: '/' },
    { id: 'freq_words', name: 'Word Frequency Analyzer', category: 'stats', desc: 'Identify most repeatedly used terms.', route: '/' },

    // AI
    { id: 'ai_summarize', name: 'AI Text Summarizer', category: 'ai', desc: 'Synthesize long articles into clean executive summaries.', route: '/ai-studio' },
    { id: 'ai_rewrite', name: 'AI Style Rewriter', category: 'ai', desc: 'Rephrase text with polished vocabulary and flow.', route: '/ai-studio' },
    { id: 'ai_expand', name: 'AI Text Expander', category: 'ai', desc: 'Elaborate on concepts with thoughtful examples and context.', route: '/ai-studio' },
    { id: 'ai_grammar', name: 'AI Grammar & Proofreader', category: 'ai', desc: 'Correct typos, subject-verb agreement, and syntax.', route: '/ai-studio' },
    { id: 'ai_tone', name: 'AI Tone Shifter', category: 'ai', desc: 'Adjust writing between professional, academic, or casual.', route: '/ai-studio' },
    { id: 'ai_email', name: 'AI Email Composer', category: 'ai', desc: 'Draft executive emails from bullet points or notes.', route: '/ai-studio' },
    { id: 'ai_translate', name: 'AI Multi-Language Translator', category: 'ai', desc: 'Translate text accurately into 10+ languages.', route: '/ai-studio' },

    // Dev
    { id: 'dev_json', name: 'JSON Formatter & Validator', category: 'dev', desc: 'Beautify, validate syntax, and minify JSON data.', route: '/developer' },
    { id: 'dev_diff', name: 'Text Diff Checker', category: 'dev', desc: 'Highlight line additions, deletions, and modifications.', route: '/developer' },
    { id: 'dev_regex', name: 'Regex Pattern Tester', category: 'dev', desc: 'Test regular expressions with real-time match feedback.', route: '/developer' },
    { id: 'dev_base64', name: 'Base64 & URL Encoder', category: 'dev', desc: 'Encode and decode Base64 strings and URL parameters.', route: '/developer' },
    { id: 'dev_markdown', name: 'Markdown Live Preview', category: 'dev', desc: 'Render Markdown into styled HTML in real time.', route: '/developer' },
    { id: 'dev_csv', name: 'CSV ↔ JSON Converter', category: 'dev', desc: 'Convert structured tabular data between CSV and JSON.', route: '/developer' },
    { id: 'dev_uuid', name: 'UUID v4 Generator', category: 'dev', desc: 'Generate batches of cryptographically random UUIDs.', route: '/developer' },
    { id: 'dev_slug', name: 'URL Slug Generator', category: 'dev', desc: 'Convert sentences into clean, SEO-friendly URL slugs.', route: '/developer' },
    { id: 'dev_ws', name: 'Whitespace Visualizer', category: 'dev', desc: 'Reveal invisible spaces, tabs, and newline markers.', route: '/developer' },

    // Intelligence
    { id: 'intel_flesch', name: 'Flesch Readability Scoring', category: 'intel', desc: 'Calculate Flesch Reading Ease and Kincaid Grade level.', route: '/intelligence' },
    { id: 'intel_complex', name: 'Complex Sentence Detector', category: 'intel', desc: 'Flag cognitive strain in sentences exceeding 22 words.', route: '/intelligence' },
    { id: 'intel_fillers', name: 'Overused Filler Detector', category: 'intel', desc: 'Detect weakening filler words like "basically" or "literally".', route: '/intelligence' },
    { id: 'intel_passive', name: 'Passive Voice Auditor', category: 'intel', desc: 'Identify passive grammatical constructions in prose.', route: '/intelligence' },
  ];

  const filteredTools = tools.filter(t => {
    const matchesCategory = activeCategory === 'all' || t.category === activeCategory;
    const matchesQuery = t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         t.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  return (
    <div className="tools-library-container">
      <div className="page-header">
        <h1 className="page-title">Tools Directory</h1>
        <p className="page-subtitle">
          Explore all 40+ text transformations, diagnostic analyzers, developer utilities, and AI assistants.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="panel-card">
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: '0.35rem', overflowX: 'auto', padding: '0.2rem 0' }}>
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                type="button"
                className={`tool-btn ${activeCategory === cat.id ? 'btn-primary' : ''}`}
                onClick={() => setActiveCategory(cat.id)}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <div style={{ position: 'relative', width: '260px' }}>
            <Search size={14} style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Filter tools..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="form-control form-control-sm"
              style={{ paddingLeft: '32px' }}
            />
          </div>
        </div>
      </div>

      {/* Tools Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
        {filteredTools.map(tool => (
          <div
            key={tool.id}
            className="panel-card mb-0"
            style={{
              cursor: 'pointer',
              transition: 'border-color 0.15s ease, transform 0.15s ease',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
            onClick={() => navigate(tool.route)}
          >
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.9375rem', marginBottom: '0.35rem', color: 'var(--text-primary)' }}>
                {tool.name}
              </div>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                {tool.desc}
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border-app)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>
                {tool.category}
              </span>
              <span style={{ fontSize: '0.8125rem', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 500 }}>
                Open <ArrowRight size={14} />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
