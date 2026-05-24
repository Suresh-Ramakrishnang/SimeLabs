// api/UserApiService.js
// Service layer for reqres.in /api/users endpoint.
// Wraps ApiClient with domain-specific methods — tests consume this, never ApiClient directly.
//
// NOTE: ReqRes is a mock API. POST/PUT/PATCH return fabricated responses
// but do NOT persist data between requests. Validations are scoped accordingly.

import ApiClient from './ApiClient.js';
import logger from '../utils/Logger.js';

const USERS_ENDPOINT = '/api/users';

class UserApiService {
  constructor() {
    this.apiClient = new ApiClient();
  }

  // ─── CREATE ───────────────────────────────────────────────────────────────

  /**
   * Create a new user.
   * POST /api/users
   *
   * @param {{ name: string, job: string }} payload
   * @returns {Promise<import('axios').AxiosResponse>}
   */
  async createUser(payload) {
    logger.info('UserApiService.createUser', { payload });
    return this.apiClient.post(USERS_ENDPOINT, payload);
  }

  // ─── READ ─────────────────────────────────────────────────────────────────

  /**
   * Retrieve a single user by ID.
   * GET /api/users/{id}
   *
   * @param {number|string} userId
   * @returns {Promise<import('axios').AxiosResponse>}
   */
  async getUserById(userId) {
    logger.info(`UserApiService.getUserById — id: ${userId}`);
    return this.apiClient.get(`${USERS_ENDPOINT}/${userId}`);
  }

  /**
   * Retrieve a paginated list of users.
   * GET /api/users?page={page}
   *
   * @param {number} [page=1]
   * @returns {Promise<import('axios').AxiosResponse>}
   */
  async listUsers(page = 1) {
    logger.info(`UserApiService.listUsers — page: ${page}`);
    return this.apiClient.get(USERS_ENDPOINT, { page });
  }

  // ─── UPDATE ───────────────────────────────────────────────────────────────

  /**
   * Full update (replace) a user.
   * PUT /api/users/{id}
   *
   * @param {number|string} userId
   * @param {{ name: string, job: string }} payload
   * @returns {Promise<import('axios').AxiosResponse>}
   */
  async updateUser(userId, payload) {
    logger.info(`UserApiService.updateUser — id: ${userId}`, { payload });
    return this.apiClient.put(`${USERS_ENDPOINT}/${userId}`, payload);
  }

  /**
   * Partial update a user.
   * PATCH /api/users/{id}
   *
   * @param {number|string} userId
   * @param {Object} payload
   * @returns {Promise<import('axios').AxiosResponse>}
   */
  async patchUser(userId, payload) {
    logger.info(`UserApiService.patchUser — id: ${userId}`, { payload });
    return this.apiClient.patch(`${USERS_ENDPOINT}/${userId}`, payload);
  }

  // ─── DELETE ───────────────────────────────────────────────────────────────

  /**
   * Delete a user by ID.
   * DELETE /api/users/{id}
   *
   * @param {number|string} userId
   * @returns {Promise<import('axios').AxiosResponse>}
   */
  async deleteUser(userId) {
    logger.info(`UserApiService.deleteUser — id: ${userId}`);
    return this.apiClient.delete(`${USERS_ENDPOINT}/${userId}`);
  }

  // ─── NEGATIVE / EDGE CASE HELPERS ────────────────────────────────────────

  /**
   * Request a non-existent user (for 404 assertion).
   * @param {number|string} invalidId
   * @returns {Promise<import('axios').AxiosResponse>}
   */
  async getNonExistentUser(invalidId) {
    logger.info(`UserApiService.getNonExistentUser — id: ${invalidId}`);
    return this.apiClient.get(`${USERS_ENDPOINT}/${invalidId}`);
  }

  /**
   * GET a completely invalid endpoint (for 404 assertion).
   * @returns {Promise<import('axios').AxiosResponse>}
   */
  async postToInvalidEndpoint() {
    logger.info('UserApiService.postToInvalidEndpoint');
    return this.apiClient.get('/api/users/2/invalid');
  }

  /**
   * Create user with an empty payload (for 400 / validation error assertion).
   * @returns {Promise<import('axios').AxiosResponse>}
   */
  async createUserWithEmptyPayload() {
    logger.info('UserApiService.createUserWithEmptyPayload');
    return this.apiClient.post(USERS_ENDPOINT, {});
  }
}

export default UserApiService;
