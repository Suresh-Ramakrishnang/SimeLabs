// api/ApiAssertions.js
// Reusable API assertion helpers.
// Wraps Playwright's `expect` with descriptive API-level checks.
// Import this in every API test file instead of scattering raw expect() calls.

import { expect } from '@playwright/test';
import logger from '../utils/Logger.js';

class ApiAssertions {

  // ─── Status Code ──────────────────────────────────────────────────────────

  /**
   * Assert HTTP status code.
   * @param {import('axios').AxiosResponse} response
   * @param {number} expectedStatus
   */
  static assertStatus(response, expectedStatus) {
    logger.debug(`Asserting status: expected=${expectedStatus}, actual=${response.status}`);
    expect(
      response.status,
      `Expected HTTP ${expectedStatus} but got ${response.status}`
    ).toBe(expectedStatus);
  }

  // ─── Response Body ────────────────────────────────────────────────────────

  /**
   * Assert that a field in the response body equals the expected value.
   * @param {Object} body
   * @param {string} field
   * @param {*} expectedValue
   */
  static assertFieldEquals(body, field, expectedValue) {
    logger.debug(`Asserting body.${field} === ${expectedValue}`);
    expect(
      body[field],
      `Expected body.${field} to be "${expectedValue}" but got "${body[field]}"`
    ).toBe(expectedValue);
  }

  /**
   * Assert that a field exists and is not null / undefined.
   * @param {Object} body
   * @param {string} field
   */
  static assertFieldExists(body, field) {
    logger.debug(`Asserting body.${field} exists`);
    expect(
      body[field],
      `Expected body.${field} to be defined but it was ${body[field]}`
    ).toBeDefined();
    expect(
      body[field],
      `Expected body.${field} to be non-null`
    ).not.toBeNull();
  }

  /**
   * Assert that a string field is non-empty.
   * @param {Object} body
   * @param {string} field
   */
  static assertFieldNonEmpty(body, field) {
    ApiAssertions.assertFieldExists(body, field);
    expect(
      String(body[field]).trim().length,
      `Expected body.${field} to be non-empty`
    ).toBeGreaterThan(0);
  }

  /**
   * Assert the response body contains all specified keys.
   * @param {Object} body
   * @param {string[]} keys
   */
  static assertHasKeys(body, keys) {
    for (const key of keys) {
      logger.debug(`Asserting key exists: ${key}`);
      expect(
        body,
        `Expected response body to contain key "${key}"`
      ).toHaveProperty(key);
    }
  }

  /**
   * Assert the response body is an array.
   * @param {*} body
   */
  static assertIsArray(body) {
    expect(Array.isArray(body), 'Expected response body to be an array').toBe(true);
  }

  /**
   * Assert the response body array has at least one item.
   * @param {Array} body
   */
  static assertArrayNonEmpty(body) {
    ApiAssertions.assertIsArray(body);
    expect(body.length, 'Expected array to have at least one item').toBeGreaterThan(0);
  }

  // ─── Timestamps ───────────────────────────────────────────────────────────

  /**
   * Assert that a timestamp field is a valid ISO-8601 date string.
   * @param {Object} body
   * @param {string} field
   */
  static assertValidTimestamp(body, field) {
    ApiAssertions.assertFieldExists(body, field);
    const parsed = Date.parse(body[field]);
    expect(
      isNaN(parsed),
      `Expected body.${field} "${body[field]}" to be a valid date string`
    ).toBe(false);
  }

  // ─── Compound assertions ──────────────────────────────────────────────────

  /**
   * Full assertion suite for a CREATE user response.
   * @param {import('axios').AxiosResponse} response
   * @param {{ name: string, job: string }} payload - original request payload
   */
  static assertCreateUserResponse(response, payload) {
    ApiAssertions.assertStatus(response, 201);
    const body = response.data;
    ApiAssertions.assertHasKeys(body, ['name', 'job', 'id', 'createdAt']);
    ApiAssertions.assertFieldEquals(body, 'name', payload.name);
    ApiAssertions.assertFieldEquals(body, 'job', payload.job);
    ApiAssertions.assertFieldNonEmpty(body, 'id');
    ApiAssertions.assertValidTimestamp(body, 'createdAt');
  }

  /**
   * Full assertion suite for a GET single user response.
   * @param {import('axios').AxiosResponse} response
   * @param {number} userId - expected user id
   */
  static assertGetUserResponse(response, userId) {
    ApiAssertions.assertStatus(response, 200);
    const { data } = response.data;  // reqres wraps in { data: {...} }
    ApiAssertions.assertHasKeys(data, ['id', 'email', 'first_name', 'last_name', 'avatar']);
    ApiAssertions.assertFieldEquals(data, 'id', userId);
    ApiAssertions.assertFieldNonEmpty(data, 'email');
    ApiAssertions.assertFieldNonEmpty(data, 'first_name');
    ApiAssertions.assertFieldNonEmpty(data, 'last_name');
  }

  /**
   * Full assertion suite for an UPDATE user response.
   * @param {import('axios').AxiosResponse} response
   * @param {{ name: string, job: string }} payload - update payload
   */
  static assertUpdateUserResponse(response, payload) {
    ApiAssertions.assertStatus(response, 200);
    const body = response.data;
    ApiAssertions.assertHasKeys(body, ['name', 'job', 'updatedAt']);
    ApiAssertions.assertFieldEquals(body, 'name', payload.name);
    ApiAssertions.assertFieldEquals(body, 'job', payload.job);
    ApiAssertions.assertValidTimestamp(body, 'updatedAt');
  }

  /**
   * Full assertion suite for a DELETE user response.
   * @param {import('axios').AxiosResponse} response
   */
  static assertDeleteUserResponse(response) {
    ApiAssertions.assertStatus(response, 204);
  }
}

export default ApiAssertions;
