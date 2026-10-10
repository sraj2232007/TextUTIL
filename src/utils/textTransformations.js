/**
 * Comprehensive Text Transformations for TextUtil
 */

export function autoPolish(text) {
  if (!text) return '';
  // Trim lines, collapse multiple whitespace spaces
  const cleanedLines = text
    .split('\n')
    .map(line => line.replace(/[ \t]+/g, ' ').trim());
  const joined = cleanedLines.join('\n').replace(/\n{3,}/g, '\n\n');
  return toSentenceCase(joined);
}

export function toUpperCase(text) {
  return text.toUpperCase();
}

export function toLowerCase(text) {
  return text.toLowerCase();
}

export function toTitleCase(text) {
  const smallWords = new Set([
    'a', 'an', 'and', 'as', 'at', 'but', 'by', 'en', 'for', 'if', 'in',
    'nor', 'of', 'on', 'or', 'per', 'the', 'to', 'v', 'vs', 'via'
  ]);

  return text.replace(/\b[\p{L}\p{N}'’_-]+\b/gu, (word, index) => {
    const lower = word.toLowerCase();
    // First word or not a minor word gets capitalized
    if (index === 0 || !smallWords.has(lower)) {
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    }
    return lower;
  });
}

export function toSentenceCase(text) {
  // Lowercase all, then capitalize after sentence boundaries (.!? or start)
  const lower = text.toLowerCase();
  return lower.replace(/(^\s*|\.\s*|\?\s*|!\s*)([\p{L}])/gu, (match, prefix, char) => {
    return prefix + char.toUpperCase();
  });
}

export function capitalizeEachWord(text) {
  return text.replace(/\b[\p{L}]/gu, char => char.toUpperCase());
}

export function toggleCase(text) {
  return Array.from(text)
    .map(char => {
      if (char === char.toUpperCase()) {
        return char.toLowerCase();
      }
      return char.toUpperCase();
    })
    .join('');
}

export function reverseText(text) {
  return Array.from(text).reverse().join('');
}

export function reverseWords(text) {
  return text
    .split('\n')
    .map(line => line.split(/\s+/).filter(Boolean).reverse().join(' '))
    .join('\n');
}

export function removeExtraSpaces(text) {
  return text
    .split('\n')
    .map(line => line.replace(/[ \t]+/g, ' ').trim())
    .join('\n');
}

export function removeDuplicateLines(text) {
  const lines = text.split('\n');
  const seen = new Set();
  const uniqueLines = [];
  for (const line of lines) {
    if (!seen.has(line)) {
      seen.add(line);
      uniqueLines.push(line);
    }
  }
  return uniqueLines.join('\n');
}

export function sortLinesAlphabetical(text, reverse = false) {
  const lines = text.split('\n');
  lines.sort((a, b) => {
    const cmp = a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
    return reverse ? -cmp : cmp;
  });
  return lines.join('\n');
}

export function removeEmptyLines(text) {
  return text
    .split('\n')
    .filter(line => line.trim().length > 0)
    .join('\n');
}

export function trimEveryLine(text) {
  return text
    .split('\n')
    .map(line => line.trim())
    .join('\n');
}

export function addLineNumbers(text, start = 1, separator = '. ') {
  const lines = text.split('\n');
  return lines
    .map((line, idx) => `${start + idx}${separator}${line}`)
    .join('\n');
}

export function removeLineNumbers(text) {
  return text
    .split('\n')
    .map(line => line.replace(/^\s*\d+[.):-]?\s*/, ''))
    .join('\n');
}

export function findAndReplace(text, searchStr, replaceStr, { matchCase = false, useRegex = false } = {}) {
  if (!searchStr) return text;
  try {
    let regex;
    if (useRegex) {
      regex = new RegExp(searchStr, matchCase ? 'g' : 'gi');
    } else {
      const escaped = searchStr.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      regex = new RegExp(escaped, matchCase ? 'g' : 'gi');
    }
    return text.replace(regex, replaceStr);
  } catch (err) {
    throw new Error(`Invalid search pattern: ${err.message}`);
  }
}

export function removePunctuation(text) {
  return text.replace(/[\p{P}\p{S}]/gu, '');
}

export function extractUniqueWords(text) {
  const words = text.match(/[\p{L}\p{N}'’_-]+/gu) || [];
  const unique = Array.from(new Set(words.map(w => w.toLowerCase())));
  unique.sort((a, b) => a.localeCompare(b));
  return unique.join('\n');
}

export function extractEmailsAndUrls(text) {
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const urlRegex = /https?:\/\/[^\s<>"{}|\\^`[\]]+/g;

  const emails = Array.from(new Set(text.match(emailRegex) || []));
  const urls = Array.from(new Set(text.match(urlRegex) || []));

  const sections = [];
  if (emails.length > 0) {
    sections.push(`--- Extracted Emails (${emails.length}) ---\n` + emails.join('\n'));
  }
  if (urls.length > 0) {
    sections.push(`--- Extracted URLs (${urls.length}) ---\n` + urls.join('\n'));
  }

  if (sections.length === 0) {
    return 'No emails or URLs found in text.';
  }

  return sections.join('\n\n');
}

export function prefixAndSuffix(text, prefix = '', suffix = '') {
  return text
    .split('\n')
    .map(line => `${prefix}${line}${suffix}`)
    .join('\n');
}
