const { timingSafeEqual } = require('node:crypto');

function matches(actual, expected) {
  const a = Buffer.from(actual);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

function requireAdmin(req, res, next) {
  res.set('Cache-Control', 'no-store');
  const { ADMIN_USERNAME: username, ADMIN_PASSWORD: password } = process.env;
  if (!username || !password) return res.status(503).json({ error: 'Admin access is not configured' });
  const header = req.get('authorization') || '';
  if (header.startsWith('Basic ')) {
    const credentials = Buffer.from(header.slice(6), 'base64').toString('utf8');
    const separator = credentials.indexOf(':');
    if (separator >= 0 && matches(credentials.slice(0, separator), username) && matches(credentials.slice(separator + 1), password)) {
      return next();
    }
  }
  res.set('WWW-Authenticate', 'Basic realm="Brink administration", charset="UTF-8"');
  return res.status(401).json({ error: 'Admin authentication required' });
}

module.exports = { requireAdmin };
