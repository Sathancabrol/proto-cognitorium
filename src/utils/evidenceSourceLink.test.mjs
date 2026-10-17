import { test } from 'node:test';
import assert from 'node:assert/strict';
import { safeEvidenceSourceUrl } from './evidenceSourceLink.js';

test('autorise les liens web explicites vers les preuves', () => {
  assert.equal(safeEvidenceSourceUrl(' https://example.org/rapport?page=2 '), 'https://example.org/rapport?page=2');
  assert.equal(safeEvidenceSourceUrl('http://example.org/preuve'), 'http://example.org/preuve');
});

test('refuse les URL dangereuses ou non-web', () => {
  for (const input of ['javascript:alert(1)', 'data:text/html,hello', 'file:///secret', '//example.org', '/document', 'ftp://example.org', 'https://user:pass@example.org', ' https://example.org/\nmalicious', '', '  ']) {
    assert.equal(safeEvidenceSourceUrl(input), null, `URL indésirable: ${JSON.stringify(input)}`);
  }
  assert.equal(safeEvidenceSourceUrl(undefined), null);
  assert.equal(safeEvidenceSourceUrl(42), null);
  assert.equal(safeEvidenceSourceUrl('https://example.org/' + 'x'.repeat(2050)), null);
});
