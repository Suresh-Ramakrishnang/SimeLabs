// fixtures/apiFixtures.js
// Playwright test fixtures for API tests.
// Injects pre-instantiated service objects and shared test data into every API spec.

import { test as base } from '@playwright/test';
import UserApiService from '../api/UserApiService.js';
import TestDataGenerator from '../utils/TestDataGenerator.js';

/**
 * Extended test object with API-specific fixtures.
 *
 * Usage in spec files:
 *   import { test, expect } from '../../fixtures/apiFixtures.js';
 *
 *   test('example', async ({ userService, newUser }) => { ... });
 */
export const test = base.extend({

  // Shared UserApiService instance per test
  userService: async ({}, use) => {
    const service = new UserApiService();
    await use(service);
  },

  // Pre-generated user payload for create tests
  newUser: async ({}, use) => {
    const userData = TestDataGenerator.generateApiUser();
    await use(userData);
  },

  // Pre-generated update payload
  updatedUser: async ({}, use) => {
    const userData = TestDataGenerator.generateUpdatedApiUser();
    await use(userData);
  },

  // Known valid user ID on reqres.in (static, always returns 200)
  validUserId: async ({}, use) => {
    await use(2); // reqres.in user id=2 is always available
  },

  // Non-existent user ID for 404 tests
  invalidUserId: async ({}, use) => {
    await use(TestDataGenerator.generateNonExistentUserId());
  },
});

export { expect } from '@playwright/test';
