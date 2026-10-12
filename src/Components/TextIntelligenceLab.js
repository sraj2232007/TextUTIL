import React, { useState, useEffect, useMemo } from 'react';
import {
  Lightbulb,
  AlertTriangle,
  FileText,
  SplitSquareVertical,
  Layers,
  Info
} from 'lucide-react';
import { analyzeTextIntelligence } from '../utils/textIntelligence';

export default function TextIntelligenceLab({ showAlert }) {
  const [text, setText] = useState('');
  const [baselineText, setBaselineText] = useState('');
  const [compareMode, setCompareMode] = useState(false);

  useEffect(() => {
    setText('');
    setBaselineText('');
  }, []);

  const analysis = useMemo(() => analyzeTextIntelligence(text), [text]);
  const baselineAnalysis = useMemo(() => analyzeTextIntelligence(baselineText), [baselineText]);

  // Color helper for Flesch score
  const getFleschColor = score => {
    if (score >= 70) return '#10b981'; // Green
    if (score >= 50) return '#3b82f6'; // Blue
    if (score >= 30) return '#f59e0b'; // Amber
    return '#ef4444'; // Red
  };

  return (
    <div className="intelligence-lab-container">
      <div className="page-header">
        <h1 className="page-title">Text Intelligence Lab</h1>
        <p className="page-subtitle">
          Heuristic linguistic diagnostics, readability grading, sentence complexity detection, and style auditing.
        </p>
      </div>

      {/* Heuristic Transparency Notice */}
      <div className="panel-card" style={{ backgroundColor: 'var(--bg-subtle)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
          <Info size={18} color="var(--accent-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            <strong>Heuristic Analysis Notice:</strong> Readability formulas (Flesch-Kincaid) and structural indicators calculated here are approximate algorithmic estimates intended to guide editing. They run 100% locally in your browser and are not definitive substitutes for human professional copyediting.
          </div>
        </div>
      </div>

      {/* Top Input & Controls */}
      <div className="panel-card">
        <div className="panel-card-header">
          <span className="panel-title">
            <FileText size={16} />
            <span>Document for Intelligence Audit</span>
          </span>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              type="button"
              className="tool-btn"
              onClick={() => {
                try {
                  const draft = localStorage.getItem('textutil_draft');
                  if (draft) {
                    setText(draft);
                    if (showAlert) showAlert('Loaded document from workspace', 'info');
                  }
                } catch {}
              }}
            >
              Sync from Workspace
            </button>
            <button
              type="button"
              className={`tool-btn ${compareMode ? 'btn-primary' : ''}`}
              onClick={() => setCompareMode(!compareMode)}
            >
              <SplitSquareVertical size={14} />
              <span>{compareMode ? 'Exit Comparison' : 'Before / After Compare'}</span>
            </button>
          </div>
        </div>

        {compareMode ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                Baseline Baseline Text ({baselineText.split(/\s+/).filter(Boolean).length} words · Flesch {baselineAnalysis.fleschReadingEase})
              </label>
              <textarea
                className="editor-textarea"
                style={{ minHeight: '220px' }}
                value={baselineText}
                onChange={e => setBaselineText(e.target.value)}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--accent-primary)', display: 'block', marginBottom: '0.35rem' }}>
                Current Edited Text ({text.split(/\s+/).filter(Boolean).length} words · Flesch {analysis.fleschReadingEase})
              </label>
              <textarea
                className="editor-textarea"
                style={{ minHeight: '220px' }}
                value={text}
                onChange={e => setText(e.target.value)}
              />
            </div>
          </div>
        ) : (
          <textarea
            className="editor-textarea"
            style={{ minHeight: '180px', marginBottom: '0.5rem' }}
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Type or paste prose to run deep intelligence analysis..."
          />
        )}
      </div>

      {/* Primary Intelligence Metrics Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
        {/* Flesch Reading Ease */}
        <div className="panel-card mb-0">
          <div style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.04em' }}>
            Flesch Reading Ease
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', margin: '0.5rem 0 0.25rem' }}>
            <span style={{ fontSize: '2.5rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: getFleschColor(analysis.fleschReadingEase) }}>
              {analysis.fleschReadingEase}
            </span>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>/ 100</span>
          </div>
          <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            {analysis.readingLevelDescription}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Higher scores represent easier readability
          </div>
        </div>

        {/* Flesch-Kincaid Grade Level */}
        <div className="panel-card mb-0">
          <div style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.04em' }}>
            US Grade Level
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', margin: '0.5rem 0 0.25rem' }}>
            <span style={{ fontSize: '2.5rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
              {analysis.fleschKincaidGrade}
            </span>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>grade</span>
          </div>
          <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            Difficulty: {analysis.readingDifficultyLevel}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Years of formal education required to comfortably comprehend
          </div>
        </div>

        {/* Sentence Density */}
        <div className="panel-card mb-0">
          <div style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.04em' }}>
            Average Sentence Length
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', margin: '0.5rem 0 0.25rem' }}>
            <span style={{ fontSize: '2.5rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: analysis.avgSentenceLength > 20 ? '#f59e0b' : 'var(--text-primary)' }}>
              {analysis.avgSentenceLength}
            </span>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>words / sentence</span>
          </div>
          <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            {analysis.avgSentenceLength <= 15 ? 'Concise & brisk pacing' : analysis.avgSentenceLength <= 22 ? 'Standard academic/prose balance' : 'Dense & complex pacing'}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Total {analysis.sentenceCount} sentence{analysis.sentenceCount === 1 ? '' : 's'} analyzed
          </div>
        </div>

        {/* Syllable Profile */}
        <div className="panel-card mb-0">
          <div style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.04em' }}>
            Vocabulary Weight
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', margin: '0.5rem 0 0.25rem' }}>
            <span style={{ fontSize: '2.5rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
              {analysis.avgWordLength}
            </span>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>chars / word</span>
          </div>
          <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            {analysis.syllableCount} syllables across {analysis.wordCount} words
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Multi-syllable terms increase perceived cognitive load
          </div>
        </div>
      </div>

      {/* Suggestions & Diagnostics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
        {/* Actionable Editorial Suggestions */}
        <div className="panel-card mb-0">
          <div className="panel-card-header">
            <span className="panel-title">
              <Lightbulb size={18} color="#f59e0b" />
              <span>Diagnostic Recommendations</span>
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {analysis.suggestions.map((sug, idx) => {
              let border = 'var(--border-app)';
              let bg = 'var(--bg-subtle)';
              if (sug.type === 'warning') {
                border = 'var(--danger-border)';
                bg = 'var(--danger-bg)';
              } else if (sug.type === 'caution') {
                border = 'var(--warning-border)';
                bg = 'var(--warning-bg)';
              } else if (sug.type === 'success') {
                border = 'var(--success-border)';
                bg = 'var(--success-bg)';
              }

              return (
                <div
                  key={idx}
                  style={{
                    padding: '0.75rem',
                    borderRadius: '6px',
                    border: `1px solid ${border}`,
                    backgroundColor: bg,
                  }}
                >
                  <div style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                    {sug.title}
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    {sug.detail}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Style Patterns: Passive Voice & Overused Words */}
        <div className="panel-card mb-0">
          <div className="panel-card-header">
            <span className="panel-title">
              <Layers size={18} />
              <span>Stylistic Patterns & Word Hygiene</span>
            </span>
          </div>

          {/* Overused Filler Words */}
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
              Overused Filler Words Detected ({analysis.fillerWordsFound.length}):
            </div>
            {analysis.fillerWordsFound.length === 0 ? (
              <div style={{ fontSize: '0.8125rem', color: '#10b981' }}>
                ✓ No common filler words detected (clean and direct style).
              </div>
            ) : (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                {analysis.fillerWordsFound.map((item, idx) => (
                  <span
                    key={idx}
                    style={{
                      padding: '0.2rem 0.5rem',
                      backgroundColor: 'var(--bg-subtle)',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      border: '1px solid var(--border-app)'
                    }}
                  >
                    "{item.word}" ({item.count}×)
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Passive Voice Constructions */}
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
              Potential Passive Voice Phrases ({analysis.passiveVoiceIndicators.length}):
            </div>
            {analysis.passiveVoiceIndicators.length === 0 ? (
              <div style={{ fontSize: '0.8125rem', color: '#10b981' }}>
                ✓ No frequent passive auxiliary constructions flagged.
              </div>
            ) : (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                {analysis.passiveVoiceIndicators.map((phrase, idx) => (
                  <span
                    key={idx}
                    style={{
                      padding: '0.2rem 0.5rem',
                      backgroundColor: 'var(--bg-subtle)',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      fontFamily: 'var(--font-mono)',
                      border: '1px solid var(--border-app)'
                    }}
                  >
                    {phrase}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Repeated Phrases (2-gram / 3-gram) */}
          <div>
            <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
              Repeated Key Phrases:
            </div>
            {analysis.repeatedPhrases.length === 0 ? (
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                No significantly repeated multi-word clusters found.
              </div>
            ) : (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                {analysis.repeatedPhrases.map((phraseObj, idx) => (
                  <span
                    key={idx}
                    style={{
                      padding: '0.2rem 0.5rem',
                      backgroundColor: 'var(--bg-subtle)',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      border: '1px solid var(--border-app)'
                    }}
                  >
                    "{phraseObj.phrase}" ({phraseObj.count}×)
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Complex Sentences Section */}
      {analysis.complexSentences.length > 0 && (
        <div className="panel-card">
          <div className="panel-card-header">
            <span className="panel-title">
              <AlertTriangle size={18} color="#f59e0b" />
              <span>Complex & Long Sentences (> 22 words)</span>
            </span>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
              {analysis.complexSentences.length} identified
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {analysis.complexSentences.map((item, idx) => (
              <div
                key={idx}
                style={{
                  padding: '0.75rem 1rem',
                  backgroundColor: 'var(--bg-subtle)',
                  borderRadius: '6px',
                  border: '1px solid var(--border-app)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  gap: '1rem'
                }}
              >
                <div style={{ fontSize: '0.875rem', lineHeight: 1.6 }}>
                  <span style={{ fontWeight: 600, color: 'var(--text-muted)', marginRight: '0.5rem' }}>
                    Sentence #{item.index}:
                  </span>
                  <span>"{item.text}"</span>
                </div>
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: '#f59e0b',
                  backgroundColor: 'rgba(245, 158, 11, 0.1)',
                  padding: '0.2rem 0.5rem',
                  borderRadius: '4px',
                  whiteSpace: 'nowrap'
                }}>
                  {item.wordCount} words
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
