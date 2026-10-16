import { escapeHtml } from '../../backend/shared/html.cjs';

/** @param {unknown} value @param {string} username */
export function formatStoryHtml(value, username) {
  return String(value ?? '')
    .replace(/<h>/g, "<span class='key'>")
    .replace(/<\/h>/g, '</span>')
    .replace(/<username>/g, () => escapeHtml(username));
}

// Never reveal a partial tag or character entity during a typewriter frame.
/** @param {string} html @param {number} index */
export function nextHtmlIndex(html, index) {
  if (html[index] === '<') {
    const end = html.indexOf('>', index);
    if (end >= 0) return end + 1;
  }
  if (html[index] === '&') {
    const entity = html.slice(index).match(/^&(?:#[0-9]+|#x[0-9a-f]+|[a-z][a-z0-9]+);/i);
    if (entity) return index + entity[0].length;
  }
  return index + 1;
}
