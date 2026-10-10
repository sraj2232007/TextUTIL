/**
 * Developer Toolbox Utilities for TextUtil
 * Safe execution: No eval(), comprehensive input validation
 */

// JSON Utilities
export function formatJson(input, indent = 2) {
  const parsed = JSON.parse(input);
  const indentStr = indent === 'tab' ? '\t' : Number(indent);
  return JSON.stringify(parsed, null, indentStr);
}

export function minifyJson(input) {
  const parsed = JSON.parse(input);
  return JSON.stringify(parsed);
}

export function validateJson(input) {
  if (!input || !input.trim()) {
    return { valid: false, error: 'Input is empty.' };
  }
  try {
    JSON.parse(input);
    return { valid: true, error: null };
  } catch (err) {
    return { valid: false, error: err.message };
  }
}

// Base64 UTF-8 Safe
export function encodeBase64(str) {
  try {
    return btoa(unescape(encodeURIComponent(str)));
  } catch (err) {
    throw new Error(`Base64 encoding failed: ${err.message}`);
  }
}

export function decodeBase64(base64) {
  try {
    return decodeURIComponent(escape(atob(base64.trim())));
  } catch (err) {
    throw new Error(`Base64 decoding failed: ${err.message}`);
  }
}

// URL Encode / Decode
export function encodeUrl(str, componentOnly = false) {
  return componentOnly ? encodeURIComponent(str) : encodeURI(str);
}

export function decodeUrl(str, componentOnly = false) {
  return componentOnly ? decodeURIComponent(str) : decodeURI(str);
}

// HTML Entities
export function encodeHtmlEntities(str) {
  return str.replace(/[&<>"']/g, char => {
    switch (char) {
      case '&': return '&amp;';
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '"': return '&quot;';
      case "'": return '&#39;';
      default: return char;
    }
  });
}

export function decodeHtmlEntities(str) {
  const map = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
    '&apos;': "'",
  };
  return str
    .replace(/&(?:amp|lt|gt|quot|apos|#39);/g, entity => map[entity] || entity)
    .replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(dec))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
}

// HTML Tag Stripper
export function stripHtmlTags(str) {
  return str.replace(/<\/?[^>]+(>|$)/g, '');
}

// Slug Generator
export function generateSlug(str, separator = '-') {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9 ]/g, '')
    .replace(/\s+/g, separator);
}

// Whitespace Visualizer
export function visualizeWhitespace(str) {
  return str
    .replace(/ /g, '·')
    .replace(/\t/g, '→   ')
    .replace(/\n/g, '↵\n');
}

// UUID v4 Generator
export function generateUuidV4(count = 1, options = { uppercase: false, hyphens: true }) {
  const uuids = [];
  for (let i = 0; i < count; i++) {
    let id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
    if (!options.hyphens) {
      id = id.replace(/-/g, '');
    }
    if (options.uppercase) {
      id = id.toUpperCase();
    }
    uuids.push(id);
  }
  return uuids.join('\n');
}

// CSV to JSON
export function csvToJson(csvText) {
  const lines = csvText.trim().split('\n');
  if (lines.length < 2) {
    throw new Error('CSV must have a header row and at least one data row.');
  }

  // Parse CSV line handling quotes
  const parseLine = line => {
    const row = [];
    let insideQuotes = false;
    let entry = '';
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        if (insideQuotes && line[i + 1] === '"') {
          entry += '"';
          i++;
        } else {
          insideQuotes = !insideQuotes;
        }
      } else if (char === ',' && !insideQuotes) {
        row.push(entry.trim());
        entry = '';
      } else {
        entry += char;
      }
    }
    row.push(entry.trim());
    return row;
  };

  const headers = parseLine(lines[0]);
  const result = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const values = parseLine(line);
    const obj = {};
    headers.forEach((h, idx) => {
      obj[h || `column_${idx + 1}`] = values[idx] !== undefined ? values[idx] : '';
    });
    result.push(obj);
  }

  return JSON.stringify(result, null, 2);
}

// JSON to CSV
export function jsonToCsv(jsonText) {
  const parsed = JSON.parse(jsonText);
  if (!Array.isArray(parsed) || parsed.length === 0) {
    throw new Error('JSON input must be a non-empty array of objects.');
  }

  const allKeys = Array.from(new Set(parsed.flatMap(item => Object.keys(item || {}))));
  const csvRows = [];
  csvRows.push(allKeys.map(k => `"${String(k).replace(/"/g, '""')}"`).join(','));

  for (const item of parsed) {
    const values = allKeys.map(k => {
      const val = item ? item[k] : '';
      if (val === null || val === undefined) return '""';
      const strVal = typeof val === 'object' ? JSON.stringify(val) : String(val);
      return `"${strVal.replace(/"/g, '""')}"`;
    });
    csvRows.push(values.join(','));
  }

  return csvRows.join('\n');
}

// Regex Tester
export function testRegex(pattern, flags, testString) {
  if (!pattern) return { matches: [], error: null, count: 0 };
  try {
    const regex = new RegExp(pattern, flags);
    const matches = [];
    let match;

    if (flags.includes('g')) {
      let lastIndex = 0;
      while ((match = regex.exec(testString)) !== null) {
        matches.push({
          index: match.index,
          match: match[0],
          groups: match.slice(1),
        });
        if (regex.lastIndex === lastIndex) {
          regex.lastIndex++; // Prevent infinite loop on zero-width match
        }
        lastIndex = regex.lastIndex;
      }
    } else {
      match = regex.exec(testString);
      if (match) {
        matches.push({
          index: match.index,
          match: match[0],
          groups: match.slice(1),
        });
      }
    }

    return { matches, error: null, count: matches.length };
  } catch (err) {
    return { matches: [], error: err.message, count: 0 };
  }
}

// Line by Line Text Diff
export function computeTextDiff(original, modified) {
  const origLines = (original || '').split('\n');
  const modLines = (modified || '').split('\n');

  const diffResult = [];
  const maxLen = Math.max(origLines.length, modLines.length);

  for (let i = 0; i < maxLen; i++) {
    const orig = origLines[i];
    const mod = modLines[i];

    if (orig === undefined) {
      diffResult.push({ type: 'added', line: mod, lineNum: i + 1 });
    } else if (mod === undefined) {
      diffResult.push({ type: 'removed', line: orig, lineNum: i + 1 });
    } else if (orig === mod) {
      diffResult.push({ type: 'unchanged', line: orig, lineNum: i + 1 });
    } else {
      diffResult.push({ type: 'removed', line: orig, lineNum: i + 1 });
      diffResult.push({ type: 'added', line: mod, lineNum: i + 1 });
    }
  }

  return diffResult;
}
