/**
 * Heuristic Text Intelligence & Readability Analysis for TextUtil
 */

// Heuristic syllable counter
function countSyllablesInWord(word) {
  const w = word.toLowerCase().replace(/[^a-z]/g, '');
  if (!w) return 0;
  if (w.length <= 3) return 1;

  let cleaned = w
    .replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '')
    .replace(/^y/, '');

  const matches = cleaned.match(/[aeiouy]{1,2}/g);
  return matches ? Math.max(1, matches.length) : 1;
}

const FILLER_WORDS = [
  'basically', 'actually', 'literally', 'honestly', 'essentially',
  'virtually', 'obviously', 'simply', 'totally', 'really', 'very',
  'quite', 'just', 'somewhat', 'definitely', 'in order to', 'at the end of the day'
];

export function analyzeTextIntelligence(text = '') {
  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    return {
      wordCount: 0,
      sentenceCount: 0,
      syllableCount: 0,
      fleschReadingEase: 0,
      fleschKincaidGrade: 0,
      readingLevelDescription: 'No text provided',
      readingDifficultyLevel: 'N/A',
      avgSentenceLength: 0,
      avgWordLength: 0,
      complexSentences: [],
      fillerWordsFound: [],
      repeatedPhrases: [],
      passiveVoiceIndicators: [],
      suggestions: [],
    };
  }

  // Sentences
  const rawSentences = text
    .split(/(?<=[.!?])\s+/)
    .map(s => s.trim())
    .filter(s => s.length > 0);
  const sentenceCount = Math.max(1, rawSentences.length);

  // Words
  const words = text.match(/[\p{L}\p{N}'’_-]+/gu) || [];
  const wordCount = words.length;

  if (wordCount === 0) {
    return {
      wordCount: 0,
      sentenceCount: 0,
      syllableCount: 0,
      fleschReadingEase: 0,
      fleschKincaidGrade: 0,
      readingLevelDescription: 'No words detected',
      readingDifficultyLevel: 'N/A',
      avgSentenceLength: 0,
      avgWordLength: 0,
      complexSentences: [],
      fillerWordsFound: [],
      repeatedPhrases: [],
      passiveVoiceIndicators: [],
      suggestions: [],
    };
  }

  // Syllables
  let totalSyllables = 0;
  for (const word of words) {
    totalSyllables += countSyllablesInWord(word);
  }

  // Flesch Reading Ease Formula:
  // 206.835 - 1.015 * (totalWords / totalSentences) - 84.6 * (totalSyllables / totalWords)
  const wordsPerSentence = wordCount / sentenceCount;
  const syllablesPerWord = totalSyllables / wordCount;

  let fleschReadingEase = 206.835 - (1.015 * wordsPerSentence) - (84.6 * syllablesPerWord);
  fleschReadingEase = Math.max(0, Math.min(100, Math.round(fleschReadingEase * 10) / 10));

  // Flesch-Kincaid Grade Level:
  // 0.39 * (totalWords / totalSentences) + 11.8 * (totalSyllables / totalWords) - 15.59
  let fleschKincaidGrade = (0.39 * wordsPerSentence) + (11.8 * syllablesPerWord) - 15.59;
  fleschKincaidGrade = Math.max(0, Math.round(fleschKincaidGrade * 10) / 10);

  let readingLevelDescription = 'Standard';
  let readingDifficultyLevel = 'Moderate';

  if (fleschReadingEase >= 90) {
    readingLevelDescription = 'Very Easy (5th grade level)';
    readingDifficultyLevel = 'Very Easy';
  } else if (fleschReadingEase >= 80) {
    readingLevelDescription = 'Easy (6th grade level)';
    readingDifficultyLevel = 'Easy';
  } else if (fleschReadingEase >= 70) {
    readingLevelDescription = 'Fairly Easy (7th grade level)';
    readingDifficultyLevel = 'Fairly Easy';
  } else if (fleschReadingEase >= 60) {
    readingLevelDescription = 'Standard (8th & 9th grade level)';
    readingDifficultyLevel = 'Standard';
  } else if (fleschReadingEase >= 50) {
    readingLevelDescription = 'Fairly Difficult (10th to 12th grade level)';
    readingDifficultyLevel = 'Fairly Difficult';
  } else if (fleschReadingEase >= 30) {
    readingLevelDescription = 'Difficult (College student level)';
    readingDifficultyLevel = 'Difficult';
  } else {
    readingLevelDescription = 'Very Difficult (Graduate level / Academic)';
    readingDifficultyLevel = 'Very Difficult';
  }

  // Complex Sentences (> 22 words)
  const complexSentences = [];
  rawSentences.forEach((sentence, idx) => {
    const sWords = sentence.match(/[\p{L}\p{N}'’_-]+/gu) || [];
    if (sWords.length >= 22) {
      complexSentences.push({
        index: idx + 1,
        text: sentence,
        wordCount: sWords.length,
      });
    }
  });

  // Filler words detection
  const lowerText = text.toLowerCase();
  const fillerWordsFound = [];
  for (const filler of FILLER_WORDS) {
    const regex = new RegExp(`\\b${filler}\\b`, 'gi');
    const matches = lowerText.match(regex);
    if (matches && matches.length > 0) {
      fillerWordsFound.push({
        word: filler,
        count: matches.length,
      });
    }
  }

  // Repeated 2-word and 3-word phrases
  const phraseCounts = {};
  const normalizedWords = words.map(w => w.toLowerCase());
  for (let i = 0; i < normalizedWords.length - 2; i++) {
    // 2-gram
    const bigram = `${normalizedWords[i]} ${normalizedWords[i + 1]}`;
    phraseCounts[bigram] = (phraseCounts[bigram] || 0) + 1;
    // 3-gram
    const trigram = `${normalizedWords[i]} ${normalizedWords[i + 1]} ${normalizedWords[i + 2]}`;
    phraseCounts[trigram] = (phraseCounts[trigram] || 0) + 1;
  }

  const repeatedPhrases = Object.entries(phraseCounts)
    .filter(([_, count]) => count >= 2)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([phrase, count]) => ({ phrase, count }));

  // Passive voice heuristics
  // Patterns like: is/are/was/were/been/being + past participle (ends with ed, en, or irregulars)
  const passiveRegex = /\b(am|is|are|was|were|be|been|being)\s+([a-z]+ed|[a-z]+en|written|taken|seen|done|given|known|made|found|built|thought)\b/gi;
  const passiveMatches = text.match(passiveRegex) || [];
  const passiveVoiceIndicators = Array.from(new Set(passiveMatches)).slice(0, 8);

  // Improvement Suggestions
  const suggestions = [];

  if (fleschReadingEase < 50) {
    suggestions.push({
      type: 'warning',
      title: 'High reading difficulty',
      detail: `Your Flesch Reading Ease score is ${fleschReadingEase}. Consider breaking down longer sentences and replacing multi-syllable terms.`,
    });
  }

  if (complexSentences.length > 0) {
    suggestions.push({
      type: 'info',
      title: `${complexSentences.length} long or complex sentence${complexSentences.length > 1 ? 's' : ''}`,
      detail: 'Sentences exceeding 22 words can cause cognitive strain. Consider splitting them into concise thoughts.',
    });
  }

  if (fillerWordsFound.length > 0) {
    const totalFillers = fillerWordsFound.reduce((sum, f) => sum + f.count, 0);
    suggestions.push({
      type: 'caution',
      title: `${totalFillers} overused filler word${totalFillers > 1 ? 's' : ''} detected`,
      detail: `Words like "${fillerWordsFound.slice(0, 3).map(f => f.word).join('", "')}" can dilute your message. Removing them tightens your prose.`,
    });
  }

  if (passiveVoiceIndicators.length > 2) {
    suggestions.push({
      type: 'info',
      title: 'Multiple passive-voice constructions',
      detail: 'Active voice generally delivers clearer, more direct impact (e.g. "The team completed the task" vs "The task was completed by the team").',
    });
  }

  if (suggestions.length === 0) {
    suggestions.push({
      type: 'success',
      title: 'Strong readability profile',
      detail: 'Sentence lengths, vocabulary complexity, and voice balance are within clear and accessible ranges.',
    });
  }

  return {
    wordCount,
    sentenceCount,
    syllableCount: totalSyllables,
    fleschReadingEase,
    fleschKincaidGrade,
    readingLevelDescription,
    readingDifficultyLevel,
    avgSentenceLength: Number(wordsPerSentence.toFixed(1)),
    avgWordLength: Number((text.replace(/\s/g, '').length / wordCount).toFixed(1)),
    complexSentences,
    fillerWordsFound,
    repeatedPhrases,
    passiveVoiceIndicators,
    suggestions,
  };
}
