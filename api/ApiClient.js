
import axios from 'axios';
import logger from '../utils/Logger.js';
import dotenv from 'dotenv';

dotenv.config();

class ApiClient {
  /**
   * @param {string} baseURL  - Defaults to API_BASE_URL from .env
   * @param {number} timeout  - Request timeout in ms
   */
  constructor(baseURL = process.env.API_BASE_URL || 'https://reqres.in', timeout = 30000) {
    this.client = axios.create({
      baseURL,
      timeout,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'x-api-key': process.env.API_KEY
      },
    });

    this._attachRequestInterceptor();
    this._attachResponseInterceptor();
  }

  // ─── Interceptors ─────────────────────────────────────────────────────────

  _attachRequestInterceptor() {
    this.client.interceptors.request.use(
      (config) => {
        logger.info(`→ ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`, {
          headers: config.headers,
          params: config.params,
          data: config.data,
        });
        return config;
      },
      (error) => {
        logger.error('Request interceptor error', { message: error.message });
        return Promise.reject(error);
      }
    );
  }

  _attachResponseInterceptor() {
    this.client.interceptors.response.use(
      (response) => {
        logger.info(`← ${response.status} ${response.config.method?.toUpperCase()} ${response.config.url}`, {
          status: response.status,
          data: response.data,
        });
        return response;
      },
      (error) => {
        const status = error.response?.status;
        const data = error.response?.data;
        logger.warn(`← ERROR ${status} ${error.config?.method?.toUpperCase()} ${error.config?.url}`, {
          status,
          data,
          message: error.message,
        });
        // Always resolve with the error response so tests can assert on status codes
        if (error.response) return Promise.resolve(error.response);
        return Promise.reject(error);
      }
    );
  }

  // ─── HTTP Methods ─────────────────────────────────────────────────────────

  /**
   * HTTP GET
   * @param {string} endpoint
   * @param {Object} [params]
   * @returns {Promise<import('axios').AxiosResponse>}
   */
  async get(endpoint, params = {}) {
    return this.client.get(endpoint, { params });
  }

  /**
   * HTTP POST
   * @param {string} endpoint
   * @param {Object} body
   * @returns {Promise<import('axios').AxiosResponse>}
   */
  async post(endpoint, body = {}) {
    return this.client.post(endpoint, body);
  }

  /**
   * HTTP PUT
   * @param {string} endpoint
   * @param {Object} body
   * @returns {Promise<import('axios').AxiosResponse>}
   */
  async put(endpoint, body = {}) {
    return this.client.put(endpoint, body);
  }

  /**
   * HTTP PATCH
   * @param {string} endpoint
   * @param {Object} body
   * @returns {Promise<import('axios').AxiosResponse>}
   */
  async patch(endpoint, body = {}) {
    return this.client.patch(endpoint, body);
  }

  /**
   * HTTP DELETE
   * @param {string} endpoint
   * @returns {Promise<import('axios').AxiosResponse>}
   */
  async delete(endpoint) {
    return this.client.delete(endpoint);
  }
}

export default ApiClient;
