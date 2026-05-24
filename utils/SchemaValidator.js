// utils/SchemaValidator.js
// Lightweight JSON response schema validator.
// Validates shape, types, and required fields without needing a third-party schema lib.

import logger from './Logger.js';

/**
 * Supported type strings that map to typeof checks + special 'array' and 'object' cases.
 */
const VALID_TYPES = ['string', 'number', 'boolean', 'object', 'array', 'null', 'any'];

class SchemaValidator {
  /**
   * Validate a response body object against a schema definition.
   *
   * Schema format:
   * {
   *   fieldName: { type: 'string', required: true },
   *   nested:    { type: 'object', required: true },
   * }
   *
   * @param {Object} data     - The actual response data object
   * @param {Object} schema   - Schema definition
   * @returns {{ valid: boolean, errors: string[] }}
   */
  static validate(data, schema) {
    const errors = [];

    for (const [field, rule] of Object.entries(schema)) {
      const value = data[field];
      const isPresent = value !== undefined && value !== null;

      // ── Required check ──────────────────────────────────────────────────
      if (rule.required && !isPresent) {
        errors.push(`Required field "${field}" is missing or null`);
        continue;
      }

      if (!isPresent) continue; // Optional field absent — skip type check

      // ── Type check ──────────────────────────────────────────────────────
      if (rule.type && rule.type !== 'any') {
        const actualType = Array.isArray(value) ? 'array' : typeof value;
        if (actualType !== rule.type) {
          errors.push(
            `Field "${field}" expected type "${rule.type}" but got "${actualType}"`
          );
        }
      }

      // ── Non-empty string check ───────────────────────────────────────────
      if (rule.nonEmpty && typeof value === 'string' && value.trim() === '') {
        errors.push(`Field "${field}" must not be empty`);
      }

      // ── Minimum value check ─────────────────────────────────────────────
      if (rule.min !== undefined && typeof value === 'number' && value < rule.min) {
        errors.push(`Field "${field}" value ${value} is below minimum ${rule.min}`);
      }
    }

    const valid = errors.length === 0;
    if (!valid) {
      logger.warn('Schema validation failed', { errors });
    } else {
      logger.debug('Schema validation passed');
    }

    return { valid, errors };
  }

  /**
   * Assert schema validity — throws if invalid (for use inside expect blocks)
   * @param {Object} data
   * @param {Object} schema
   */
  static assertValid(data, schema) {
    const { valid, errors } = SchemaValidator.validate(data, schema);
    if (!valid) {
      throw new Error(`Schema validation failed:\n  ${errors.join('\n  ')}`);
    }
  }
}

// ─── Predefined Schemas ──────────────────────────────────────────────────────

/** Schema for POST /api/users (create) response */
export const createUserSchema = {
  name: { type: 'string', required: true, nonEmpty: true },
  job: { type: 'string', required: true, nonEmpty: true },
  id: { type: 'string', required: true, nonEmpty: true },
  createdAt: { type: 'string', required: true, nonEmpty: true },
};

/** Schema for GET /api/users/{id} response (reqres wraps in data{}) */
export const getUserSchema = {
  id: { type: 'number', required: true, min: 1 },
  email: { type: 'string', required: true, nonEmpty: true },
  first_name: { type: 'string', required: true, nonEmpty: true },
  last_name: { type: 'string', required: true, nonEmpty: true },
  avatar: { type: 'string', required: true, nonEmpty: true },
};

/** Schema for PUT /api/users/{id} response */
export const updateUserSchema = {
  name: { type: 'string', required: true, nonEmpty: true },
  job: { type: 'string', required: true, nonEmpty: true },
  updatedAt: { type: 'string', required: true, nonEmpty: true },
};

export default SchemaValidator;