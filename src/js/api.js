import { server } from './config.js';

/** @typedef {import('../../backend/shared/api').GameCommand} GameCommand */
/** @typedef {import('../../backend/shared/api').GameResponse} GameResponse */

export class ApiError extends Error {
  /** @param {'http' | 'network' | 'timeout' | 'invalid-response'} kind @param {number} [status] */
  constructor(kind, status) {
    super('API request failed: ' + kind);
    this.name = 'ApiError';
    this.kind = kind;
    this.status = status;
  }
}

/** @param {unknown} error */
export function apiErrorMessage(error) {
  if (!(error instanceof ApiError)) return 'Unable to reach the server. Check your connection and try again.';
  if (error.kind === 'timeout') return 'Connection timed out. Please try again.';
  if (error.kind === 'invalid-response') return 'The server returned an unreadable response. Please try again.';
  if (error.kind === 'http') return 'The server could not complete that command. Please try again.';
  return 'Unable to reach the server. Check your connection and try again.';
}

/** @param {unknown} value @returns {GameResponse} */
function validateResponse(value) {
  /** @type {(item: unknown) => item is Record<string, unknown>} */
  const object = item => item !== null && typeof item === 'object' && !Array.isArray(item);
  /** @param {unknown} item */
  const strings = item => Array.isArray(item) && item.every(entry => typeof entry === 'string');
  if (!object(value) || typeof value.username !== 'string' || !Number.isFinite(value.clearanceLevel) || !strings(value.keywords) || !strings(value.terminalMessages)) throw new ApiError('invalid-response');
  /** @type {Record<string, (item: unknown) => boolean>} */
  const fields = {
    command: item => typeof item === 'string', username: item => typeof item === 'string',
    context: item => typeof item === 'string', clearanceLevel: Number.isFinite,
    keywords: strings, terminalMessages: strings,
    newContext: item => typeof item === 'string', changeRoom: item => typeof item === 'string',
    conversationResponse: item => typeof item === 'string', eventMoment: item => typeof item === 'boolean',
    messages: object, characters: object, rooms: object, files: object, characterFiles: object,
  };
  for (const [field, valid] of Object.entries(fields)) {
    if (value[field] != null && !valid(value[field])) throw new ApiError('invalid-response');
  }
  // Required fields and optional field shapes have been validated above.
  return /** @type {GameResponse} */ (/** @type {unknown} */ (value));
}

export function createApiClient({ baseUrl = server, fetchImpl = globalThis.fetch, timeoutMs = 10000 } = {}) {
  /**
   * @overload
   * @param {string} path
   * @param {GameCommand} body
   * @param {true} json
   * @returns {Promise<GameResponse>}
   */
  /**
   * @overload
   * @param {string} path
   * @param {GameCommand | undefined} body
   * @param {false} json
   * @returns {Promise<string>}
   */
  /** @param {string} path @param {GameCommand | undefined} body @param {boolean} json */
  async function request(path, body, json) {
    const controller = new AbortController();
    /** @type {ReturnType<typeof setTimeout> | undefined} */
    let timer;
    const operation = async () => {
      const response = await fetchImpl(baseUrl + path, {
        method: body === undefined ? 'GET' : 'POST',
        signal: controller.signal,
        ...(body === undefined ? {} : { headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }),
      });
      if (!response.ok) throw new ApiError('http', response.status);
      const text = await response.text();
      if (!json) return text;
      try { return validateResponse(JSON.parse(text)); }
      catch (error) {
        if (error instanceof ApiError) throw error;
        throw new ApiError('invalid-response');
      }
    };
    try {
      // Include response-body consumption in the timeout. Never retry game commands automatically.
      return await Promise.race([
        operation(),
        /** @type {Promise<never>} */ (new Promise((_, reject) => {
          timer = setTimeout(() => {
            reject(new ApiError('timeout'));
            controller.abort();
          }, timeoutMs);
        })),
      ]);
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('network');
    } finally { clearTimeout(timer); }
  }
  return {
    health: () => request('/api/hello', undefined, false),
    /** @param {GameCommand} command @returns {Promise<GameResponse>} */
    respond: command => request('/api/respond', command, true),
    /** @param {GameCommand} command */
    combat: command => request('/api/combat', command, false),
  };
}

export const api = createApiClient();
