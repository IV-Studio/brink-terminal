import { test } from 'node:test';
import assert from 'node:assert/strict';
import { escapeHtml } from '../backend/shared/html.cjs';
import { formatStoryHtml, nextHtmlIndex } from '../src/js/html.js';

test('player text is escaped once while authored formatting stays intact', () => {
  const username = '<img src=x onerror="bad()"> & $& <h>player</h>';
  const result = formatStoryHtml('<h5>Welcome <username></h5><br><h>key</h>', username);
  assert.equal(result, '<h5>Welcome ' + escapeHtml(username) + '</h5><br><span class=\'key\'>key</span>');
  assert.ok(!result.includes('<img'));
  assert.equal(escapeHtml('&<>"\''), '&amp;&lt;&gt;&quot;&#39;');
});

test('typewriter frames consume complete HTML tags and escaped entities', () => {
  const text = '<h5>&lt;img&gt; &amp; &#39; &#x3c;</h5>';
  let index = 0;
  const pieces = [];
  while (index < text.length) {
    const next = nextHtmlIndex(text, index);
    pieces.push(text.slice(index, next));
    index = next;
  }
  assert.deepEqual(pieces, ['<h5>', '&lt;', 'i', 'm', 'g', '&gt;', ' ', '&amp;', ' ', '&#39;', ' ', '&#x3c;', '</h5>']);
});
