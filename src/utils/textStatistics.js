/**
 * Comprehensive Text Statistics Utilities for TextUtil
 */

export function calculateStatistics(text = '') {
  if (!text || typeof text !== 'string') {
    return {
      wordCount: 0,
      characterCount: 0,
      characterNoSpacesCount: 0,
      sentenceCount: 0,
      paragraphCount: 0,
      lineCount: 0,
      readingTimeMinutes: 0,
      speakingTimeMinutes: 0,
      averageWordLength: 0,
      mostFrequentWords: [],
      longestWord: '',
      shortestWord: '',
    };
  }

  const characterCount = text.length;
  const characterNoSpacesCount = text.replace(/\s/g, '').length;

  // Accurate word extraction with Unicode support
  const wordMatches = text.trim().match(/[\p{L}\p{N}'’_-]+/gu) || [];
  const wordCount = wordMatches.length;

  // Sentences: match terminals [.!?] or end of string
  const sentenceMatches = text.trim()
    ? text.trim().split(/[.!?]+(?:\s+|$)/).filter(s => s.trim().length > 0)
    : [];
  const sentenceCount = sentenceMatches.length;

  // Paragraphs: split by double newlines or lines with content
  const paragraphMatches = text.trim()
    ? text.split(/\n\s*\n/).filter(p => p.trim().length > 0)
    : [];
  const paragraphCount = paragraphMatches.length;

  // Line count
  const lineCount = text.length === 0 ? 0 : text.split('\n').length;

  // Reading time (average 200 wpm) & Speaking time (average 130 wpm)
  const readingTimeMinutes = wordCount > 0 ? Number((wordCount / 200).toFixed(2)) : 0;
  const speakingTimeMinutes = wordCount > 0 ? Number((wordCount / 130).toFixed(2)) : 0;

  // Average word length
  const totalLettersInWords = wordMatches.reduce((acc, w) => acc + w.length, 0);
  const averageWordLength = wordCount > 0 ? Number((totalLettersInWords / wordCount).toFixed(1)) : 0;

  // Word frequency analysis (ignoring case and common punctuation)
  const frequencyMap = {};
  let longestWord = '';
  let shortestWord = wordMatches[0] || '';

  for (const rawWord of wordMatches) {
    const cleanWord = rawWord.toLowerCase();
    frequencyMap[cleanWord] = (frequencyMap[cleanWord] || 0) + 1;

    if (rawWord.length > longestWord.length) {
      longestWord = rawWord;
    }
    if (rawWord.length < shortestWord.length) {
      shortestWord = rawWord;
    }
  }

  const mostFrequentWords = Object.entries(frequencyMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([word, count]) => ({ word, count }));

  return {
    wordCount,
    characterCount,
    characterNoSpacesCount,
    sentenceCount,
    paragraphCount,
    lineCount,
    readingTimeMinutes,
    speakingTimeMinutes,
    averageWordLength,
    mostFrequentWords,
    longestWord,
    shortestWord: wordCount > 0 ? shortestWord : '',
  };
}
