// =============================================================================
// crypto.js - Cryptographic utilities for frontend
// =============================================================================

/**
 * Hash password using SHA-256
 * @param {string} password - Plain text password
 * @returns {Promise<string>} - Hex string (64 characters)
 */
export async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Generate random UUID for idempotency
 * @returns {string} - UUID v4
 */
export function generateIdempotencyKey() {
  return crypto.randomUUID();
}

/**
 * Store idempotency key in sessionStorage with timestamp
 * @param {string} key - Idempotency key
 * @param {string} action - Action type (e.g., 'register_school')
 */
export function storeIdempotencyKey(key, action) {
  const data = {
    key,
    timestamp: Date.now(),
    action,
  };
  sessionStorage.setItem(`idempotency_${action}`, JSON.stringify(data));
}

/**
 * Get stored idempotency key for an action
 * @param {string} action - Action type
 * @returns {string|null} - Key if valid (less than 5 minutes old)
 */
export function getStoredIdempotencyKey(action) {
  const stored = sessionStorage.getItem(`idempotency_${action}`);
  if (!stored) return null;

  const data = JSON.parse(stored);
  const fiveMinutes = 5 * 60 * 1000;

  if (Date.now() - data.timestamp > fiveMinutes) {
    sessionStorage.removeItem(`idempotency_${action}`);
    return null;
  }

  return data.key;
}

/**
 * Clear stored idempotency key
 * @param {string} action - Action type
 */
export function clearIdempotencyKey(action) {
  sessionStorage.removeItem(`idempotency_${action}`);
}
