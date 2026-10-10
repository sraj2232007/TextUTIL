import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import * as transform from './utils/textTransformations';
import { calculateStatistics } from './utils/textStatistics';
import * as dev from './utils/developerTools';
import { analyzeTextIntelligence } from './utils/textIntelligence';

// Mock react-router-dom for Jest environment compatibility
jest.mock('react-router-dom', () => ({
  BrowserRouter: ({ children }) => <div data-testid="router-mock">{children}</div>,
  Routes: ({ children }) => <div data-testid="routes-mock">{children}</div>,
  Route: ({ element }) => <div data-testid="route-mock">{element}</div>,
  Link: ({ children, to, className, ...props }) => (
    <a href={to} className={className} {...props}>
      {children}
    </a>
  ),
  useNavigate: () => jest.fn(),
  useLocation: () => ({ pathname: '/' }),
}));

describe('TextUtil Core Application', () => {
  test('renders TextUtil brand and primary workspace navigation', () => {
    render(<App />);
    const brandElements = screen.getAllByText(/TextUtil/i);
    expect(brandElements.length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Workspace/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Writing Assistant/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Developer/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Intelligence/i).length).toBeGreaterThan(0);
  });
});

describe('Text Transformations Engine', () => {
  test('transforms case correctly', () => {
    expect(transform.toUpperCase('hello world')).toBe('HELLO WORLD');
    expect(transform.toLowerCase('HELLO WORLD')).toBe('hello world');
    expect(transform.toTitleCase('the quick brown fox')).toBe('The Quick Brown Fox');
    expect(transform.toSentenceCase('hello. world! how are you?')).toBe('Hello. World! How are you?');
    expect(transform.capitalizeEachWord('hello brave new world')).toBe('Hello Brave New World');
    expect(transform.toggleCase('HeLLo')).toBe('hEllO');
  });

  test('reverses and cleans spacing', () => {
    expect(transform.autoPolish('  hello    world.   how are you?  ')).toBe('Hello world. How are you?');
    expect(transform.reverseText('abc')).toBe('cba');
    expect(transform.removeExtraSpaces('hello    world   ')).toBe('hello world');
    expect(transform.removeDuplicateLines('line 1\nline 2\nline 1')).toBe('line 1\nline 2');
    expect(transform.sortLinesAlphabetical('banana\napple\ncherry')).toBe('apple\nbanana\ncherry');
    expect(transform.sortLinesAlphabetical('banana\napple\ncherry', true)).toBe('cherry\nbanana\napple');
    expect(transform.trimEveryLine('  line1  \n  line2  ')).toBe('line1\nline2');
    expect(transform.removeEmptyLines('line1\n\nline2')).toBe('line1\nline2');
    expect(transform.addLineNumbers('a\nb')).toBe('1. a\n2. b');
    expect(transform.removeLineNumbers('1. a\n2. b')).toBe('a\nb');
  });

  test('find and replace works with strings and regex', () => {
    expect(transform.findAndReplace('foo bar foo', 'foo', 'baz')).toBe('baz bar baz');
    expect(transform.findAndReplace('a1 b2 c3', '\\d', 'X', { useRegex: true })).toBe('aX bX cX');
  });

  test('extracts unique words and links', () => {
    expect(transform.extractUniqueWords('apple banana apple orange')).toBe('apple\nbanana\norange');
    const links = transform.extractEmailsAndUrls('Reach test@textutil.com or https://textutil.com');
    expect(links).toContain('test@textutil.com');
    expect(links).toContain('https://textutil.com');
  });
});

describe('Text Statistics Engine', () => {
  test('calculates accurate word and character counts', () => {
    const stats = calculateStatistics('The quick brown fox jumps over the lazy dog.');
    expect(stats.wordCount).toBe(9);
    expect(stats.sentenceCount).toBe(1);
    expect(stats.characterCount).toBe(44);
    expect(stats.characterNoSpacesCount).toBe(36);
    expect(stats.readingTimeMinutes).toBeGreaterThan(0);
    expect(stats.speakingTimeMinutes).toBeGreaterThan(0);
    expect(stats.mostFrequentWords.length).toBeGreaterThan(0);
  });

  test('handles empty and whitespace input gracefully', () => {
    const emptyStats = calculateStatistics('');
    expect(emptyStats.wordCount).toBe(0);
    expect(emptyStats.characterCount).toBe(0);
    expect(emptyStats.sentenceCount).toBe(0);

    const spaceStats = calculateStatistics('     ');
    expect(spaceStats.wordCount).toBe(0);
    expect(spaceStats.characterCount).toBe(5);
  });
});

describe('Developer Tools Utilities', () => {
  test('validates, formats and minifies JSON', () => {
    const valid = '{"key":"value","num":42}';
    expect(dev.validateJson(valid).valid).toBe(true);
    expect(dev.validateJson('{invalid json').valid).toBe(false);
    expect(dev.minifyJson('{\n  "a": 1\n}')).toBe('{"a":1}');
    expect(dev.formatJson('{"a":1}', 2)).toBe('{\n  "a": 1\n}');
  });

  test('encodes and decodes Base64 with UTF-8 support', () => {
    const text = 'Hello TextUtil! 🚀';
    const encoded = dev.encodeBase64(text);
    expect(dev.decodeBase64(encoded)).toBe(text);
  });

  test('encodes and decodes URLs and HTML entities', () => {
    expect(dev.encodeUrl('hello world')).toBe('hello%20world');
    expect(dev.decodeUrl('hello%20world')).toBe('hello world');
    expect(dev.encodeHtmlEntities('<b>"Tom & Jerry"</b>')).toContain('&lt;');
    expect(dev.stripHtmlTags('<p>Hello <b>World</b></p>')).toBe('Hello World');
  });

  test('generates clean URL slugs and UUIDs', () => {
    expect(dev.generateSlug('Hello World: How Are You?')).toBe('hello-world-how-are-you');
    const uuids = dev.generateUuidV4(2);
    expect(uuids.split('\n').length).toBe(2);
  });

  test('converts CSV to JSON and JSON to CSV', () => {
    const csv = 'name,role\nAlice,Admin\nBob,User';
    const jsonStr = dev.csvToJson(csv);
    const parsed = JSON.parse(jsonStr);
    expect(parsed.length).toBe(2);
    expect(parsed[0].name).toBe('Alice');

    const csvBack = dev.jsonToCsv(jsonStr);
    expect(csvBack).toContain('"Alice"');
  });

  test('tests regex patterns accurately', () => {
    const res = dev.testRegex('\\d+', 'g', 'abc 123 def 456');
    expect(res.count).toBe(2);
    expect(res.matches[0].match).toBe('123');
    expect(res.matches[1].match).toBe('456');
  });
});

describe('Text Intelligence Lab Diagnostics', () => {
  test('computes Flesch Reading Ease and detects sentence complexity', () => {
    const text = 'This is a simple sentence. Reading it is very easy for everyone. We can clearly test it.';
    const result = analyzeTextIntelligence(text);
    expect(result.fleschReadingEase).toBeGreaterThan(60);
    expect(result.sentenceCount).toBe(3);
    expect(result.suggestions.length).toBeGreaterThan(0);
    expect(result.avgSentenceLength).toBeGreaterThan(0);
  });
});
