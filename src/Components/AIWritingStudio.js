import React, { useState, useEffect } from 'react';
import {
  PenTool,
  Copy,
  Check,
  AlertCircle,
  FileCheck,
  Download
} from 'lucide-react';

const WRITING_TASKS = [
  { id: 'summarize', name: 'Summarize Document', desc: 'Create a succinct summary preserving the core arguments.' },
  { id: 'rewrite', name: 'Rewrite & Polish', desc: 'Fresh phrasing preserving meaning with clear expression.' },
  { id: 'grammar', name: 'Proofread & Fix Grammar', desc: 'Correct typos, punctuation, agreement, and tense.' },
  { id: 'clarity', name: 'Improve Clarity & Flow', desc: 'Remove convoluted sentences and tighten prose flow.' },
  { id: 'tone', name: 'Adjust Tone', desc: 'Adapt voice to your target audience.' },
  { id: 'expand', name: 'Elaborate & Expand', desc: 'Add thoughtful context and supporting details.' },
  { id: 'headings', name: 'Generate Section Headings', desc: 'Organize text with clear section headings.' },
  { id: 'para_to_bullets', name: 'Paragraphs to Bullets', desc: 'Convert dense prose into scannable key bullet points.' },
  { id: 'bullets_to_para', name: 'Bullets to Paragraphs', desc: 'Weave bullet points into coherent narrative paragraphs.' },
  { id: 'email_draft', name: 'Compose Email Draft', desc: 'Transform notes into an executive-ready email.' },
  { id: 'linkedin', name: 'Draft Executive Post', desc: 'Create a clean, well-spaced post with a hook.' },
  { id: 'titles', name: 'Headlines & Descriptions', desc: 'Create captivating titles and meta summaries.' },
  { id: 'key_points', name: 'Extract Key Takeaways', desc: 'Isolate essential conclusions and action items.' },
  { id: 'eli5', name: 'Explain in Plain Terms', desc: 'Demystify dense concepts into plain, accessible language.' },
  { id: 'translate', name: 'Translate Language', desc: 'Translate text accurately while preserving nuance.' },
  { id: 'alternatives', name: 'Generate 3 Variations', desc: 'Produce three distinct stylistic variations.' },
];

const TONES = [
  'Professional',
  'Concise',
  'Friendly',
  'Academic',
  'Persuasive',
  'Executive',
  'Casual',
  'Technical'
];

const LANGUAGES = [
  'English',
  'Spanish',
  'French',
  'German',
  'Japanese',
  'Chinese (Simplified)',
  'Hindi',
  'Arabic',
  'Portuguese',
  'Italian',
  'Dutch'
];

export default function AIWritingStudio({ showAlert, onApplyToWorkspace }) {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [selectedTask, setSelectedTask] = useState('rewrite');
  const [selectedTone, setSelectedTone] = useState('Professional');
  const [outputLength, setOutputLength] = useState('Balanced');
  const [targetLanguage, setTargetLanguage] = useState('Spanish');
  const [customInstructions, setCustomInstructions] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorInfo, setErrorInfo] = useState(null);
  const [apiConfigured, setApiConfigured] = useState(true);
  const [copiedRecently, setCopiedRecently] = useState(false);

  // Check backend status on mount
  useEffect(() => {
    fetch('/api/gemini/status')
      .then(res => res.json())
      .then(data => {
        setApiConfigured(Boolean(data.configured));
      })
      .catch(() => {});

    try {
      const draft = localStorage.getItem('textutil_draft');
      if (draft && draft.trim()) {
        setInputText(draft);
      }
    } catch {}
  }, []);

  const handleGenerate = async () => {
    if (!inputText.trim()) {
      if (showAlert) showAlert('Enter text in the source box to begin', 'warning');
      return;
    }

    if (inputText.length > 30000) {
      if (showAlert) showAlert('Input text exceeds the 30,000 character limit', 'danger');
      return;
    }

    setLoading(true);
    setErrorInfo(null);

    const lengthGuide = `Length target: ${outputLength}.`;
    const toneGuide = `Tone: ${selectedTone}.`;
    let taskPrompt = '';

    switch (selectedTask) {
      case 'summarize':
        taskPrompt = `Summarize the following text accurately. ${lengthGuide} ${toneGuide}`;
        break;
      case 'expand':
        taskPrompt = `Expand upon the following text with meaningful details and context. ${lengthGuide} ${toneGuide}`;
        break;
      case 'rewrite':
        taskPrompt = `Rewrite the following text with polished expression while preserving original meaning. ${lengthGuide} ${toneGuide}`;
        break;
      case 'grammar':
        taskPrompt = `Correct all grammatical errors, typos, punctuation, and syntax flaws. Preserve original voice. Return corrected text.`;
        break;
      case 'clarity':
        taskPrompt = `Improve clarity, readability, and sentence flow. Eliminate clumsy phrasing. ${toneGuide}`;
        break;
      case 'tone':
        taskPrompt = `Rewrite the following text specifically in a ${selectedTone} tone. ${lengthGuide}`;
        break;
      case 'headings':
        taskPrompt = `Analyze the text and organize it with clean Markdown section headings.`;
        break;
      case 'para_to_bullets':
        taskPrompt = `Convert the following paragraphs into a well-structured list of bullet points highlighting key insights.`;
        break;
      case 'bullets_to_para':
        taskPrompt = `Convert the following bullet points into coherent narrative paragraphs. ${toneGuide}`;
        break;
      case 'email_draft':
        taskPrompt = `Transform the following text into a professional email draft with Subject line, greeting, body, and sign-off. ${toneGuide}`;
        break;
      case 'linkedin':
        taskPrompt = `Write an engaging post based on the following text. Include a compelling hook and 3-5 hashtags.`;
        break;
      case 'titles':
        taskPrompt = `Generate 5 title ideas and a 160-character description for the following text.`;
        break;
      case 'key_points':
        taskPrompt = `Extract the essential takeaways and findings as a numbered list.`;
        break;
      case 'eli5':
        taskPrompt = `Explain the following text in plain, accessible terms without technical jargon.`;
        break;
      case 'translate':
        taskPrompt = `Translate the following text into natural ${targetLanguage}. Maintain original formatting.`;
        break;
      case 'alternatives':
        taskPrompt = `Generate 3 distinct stylistic variations of the following text: 1) Concise, 2) Authoritative, 3) Conversational.`;
        break;
      default:
        taskPrompt = `Refine the following text. ${toneGuide}`;
    }

    if (customInstructions.trim()) {
      taskPrompt += `\nSpecific guidelines: ${customInstructions.trim()}`;
    }

    const fullPrompt = `${taskPrompt}\n\n--- SOURCE TEXT ---\n${inputText}`;

    try {
      const response = await fetch('/api/gemini/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: fullPrompt,
          systemInstruction: 'You are an expert editorial writer. Deliver direct, high-quality revised prose without conversational pleasantries.'
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Server responded with status ${response.status}`);
      }

      if (!data.text) {
        throw new Error('Received an empty response from server.');
      }

      setOutputText(data.text);
      if (showAlert) showAlert('Draft generated', 'success');
    } catch (err) {
      setErrorInfo(err.message);
      if (showAlert) showAlert(`Error: ${err.message}`, 'danger');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyOutput = async () => {
    if (!outputText) return;
    try {
      await navigator.clipboard.writeText(outputText);
      setCopiedRecently(true);
      setTimeout(() => setCopiedRecently(false), 2000);
      if (showAlert) showAlert('Copied to clipboard', 'success');
    } catch {
      if (showAlert) showAlert('Failed to copy', 'warning');
    }
  };

  const handleApplyToEditor = () => {
    if (!outputText) return;
    if (onApplyToWorkspace) {
      onApplyToWorkspace(outputText);
      if (showAlert) showAlert('Applied to workspace', 'success');
    } else {
      localStorage.setItem('textutil_draft', outputText);
      if (showAlert) showAlert('Saved to workspace draft', 'success');
    }
  };

  return (
    <div className="ai-studio-container">
      <div className="page-header">
        <h1 className="page-title">Writing Assistant</h1>
        <p className="page-subtitle">
          Editorial tools for summarization, tone adjustment, grammar refinement, and translation.
        </p>
      </div>

      {!apiConfigured && (
        <div className="panel-card" style={{ borderColor: 'var(--border-app)', backgroundColor: 'var(--bg-subtle)' }}>
          <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'center', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
            <AlertCircle size={16} />
            <span>Server credential not configured. Set <code>GEMINI_API_KEY</code> in your environment variables to enable editorial generation.</span>
          </div>
        </div>
      )}

      {/* Task & Controls */}
      <div className="panel-card">
        {/* Quick Editorial Presets */}
        <div style={{ marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-muted)' }}>Quick Presets:</span>
          <button
            type="button"
            className="tool-btn"
            onClick={() => {
              setSelectedTask('para_to_bullets');
              setOutputLength('Concise');
              setSelectedTone('Concise');
            }}
          >
            3-Bullet Summary
          </button>
          <button
            type="button"
            className="tool-btn"
            onClick={() => {
              setSelectedTask('rewrite');
              setSelectedTone('Professional');
              setOutputLength('Balanced');
            }}
          >
            Professional Polish
          </button>
          <button
            type="button"
            className="tool-btn"
            onClick={() => {
              setSelectedTask('grammar');
              setOutputLength('Balanced');
            }}
          >
            Proofread & Fix
          </button>
          <button
            type="button"
            className="tool-btn"
            onClick={() => {
              setSelectedTask('eli5');
              setSelectedTone('Friendly');
              setOutputLength('Concise');
            }}
          >
            Plain English
          </button>
          <button
            type="button"
            className="tool-btn"
            onClick={() => {
              setSelectedTask('translate');
              setTargetLanguage('Spanish');
            }}
          >
            Translate (Spanish)
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.75rem', marginBottom: '0.85rem' }}>
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>
              Action
            </label>
            <select
              className="form-select form-select-sm"
              value={selectedTask}
              onChange={e => setSelectedTask(e.target.value)}
              style={{ fontSize: '0.8125rem' }}
            >
              {WRITING_TASKS.map(task => (
                <option key={task.id} value={task.id}>
                  {task.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>
              Tone
            </label>
            <select
              className="form-select form-select-sm"
              value={selectedTone}
              onChange={e => setSelectedTone(e.target.value)}
              style={{ fontSize: '0.8125rem' }}
            >
              {TONES.map(tone => (
                <option key={tone} value={tone}>
                  {tone}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>
              Length
            </label>
            <select
              className="form-select form-select-sm"
              value={outputLength}
              onChange={e => setOutputLength(e.target.value)}
              style={{ fontSize: '0.8125rem' }}
            >
              <option value="Concise">Concise</option>
              <option value="Balanced">Balanced</option>
              <option value="Detailed">Detailed</option>
            </select>
          </div>

          {selectedTask === 'translate' && (
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>
                Target Language
              </label>
              <select
                className="form-select form-select-sm"
                value={targetLanguage}
                onChange={e => setTargetLanguage(e.target.value)}
                style={{ fontSize: '0.8125rem' }}
              >
                {LANGUAGES.map(lang => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div>
          <label style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>
            Custom Guidance (Optional)
          </label>
          <input
            type="text"
            className="form-control form-control-sm"
            placeholder="e.g. 'Keep tone direct and brief', 'Highlight 3 action items'..."
            value={customInstructions}
            onChange={e => setCustomInstructions(e.target.value)}
            style={{ fontSize: '0.8125rem' }}
          />
        </div>
      </div>

      {errorInfo && (
        <div className="panel-card" style={{ borderColor: 'var(--danger-border)', backgroundColor: 'var(--danger-bg)' }}>
          <div style={{ display: 'flex', gap: '0.5rem', color: 'var(--danger-text)', alignItems: 'center', fontSize: '0.8125rem' }}>
            <AlertCircle size={16} />
            <span>{errorInfo}</span>
          </div>
        </div>
      )}

      {/* Dual Panel Editor */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
        {/* Source Text Input */}
        <div className="workspace-card">
          <div className="workspace-toolbar">
            <span style={{ fontSize: '0.78rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
              Source Text ({inputText.length} chars)
            </span>
            <div style={{ display: 'flex', gap: '0.3rem' }}>
              <button
                type="button"
                className="tool-btn"
                onClick={() => {
                  try {
                    const draft = localStorage.getItem('textutil_draft');
                    if (draft) setInputText(draft);
                  } catch {}
                }}
              >
                Sync Workspace
              </button>
              <button
                type="button"
                className="tool-btn"
                onClick={() => setInputText('')}
              >
                Clear
              </button>
            </div>
          </div>

          <textarea
            className="editor-textarea"
            style={{ minHeight: '340px' }}
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            placeholder="Paste or type text to refine..."
          />

          <div style={{ padding: '0.65rem 0.85rem', backgroundColor: 'var(--bg-subtle)', borderTop: '1px solid var(--border-app)', textAlign: 'right' }}>
            <button
              type="button"
              className="tool-btn btn-primary"
              onClick={handleGenerate}
              disabled={loading || !inputText.trim()}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true" />
                  Processing...
                </>
              ) : (
                <>
                  <PenTool size={13} />
                  <span>Generate Draft</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Refined Result Output */}
        <div className="workspace-card">
          <div className="workspace-toolbar">
            <span style={{ fontSize: '0.78rem', fontWeight: 500, color: 'var(--text-primary)' }}>
              Refined Output ({outputText.length} chars)
            </span>
            <div style={{ display: 'flex', gap: '0.3rem' }}>
              <button
                type="button"
                className="tool-btn"
                onClick={handleCopyOutput}
                disabled={!outputText}
              >
                {copiedRecently ? <Check size={13} /> : <Copy size={13} />}
                <span>{copiedRecently ? 'Copied' : 'Copy'}</span>
              </button>
              <button
                type="button"
                className="tool-btn btn-primary"
                onClick={handleApplyToEditor}
                disabled={!outputText}
              >
                <FileCheck size={13} />
                <span>Apply to Workspace</span>
              </button>
            </div>
          </div>

          <textarea
            className="editor-textarea"
            style={{ minHeight: '340px' }}
            value={outputText}
            onChange={e => setOutputText(e.target.value)}
            placeholder="Refined draft will appear here..."
          />

          <div style={{ padding: '0.65rem 0.85rem', backgroundColor: 'var(--bg-subtle)', borderTop: '1px solid var(--border-app)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {outputText ? `${outputText.split(/\s+/).filter(Boolean).length} words` : 'Awaiting input'}
            </span>
            {outputText && (
              <button
                type="button"
                className="tool-btn"
                onClick={() => {
                  const blob = new Blob([outputText], { type: 'text/plain' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `draft-${Date.now()}.txt`;
                  a.click();
                  URL.revokeObjectURL(a.href);
                }}
              >
                <Download size={13} />
                <span>Download</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
