// pages/LoginPage.js
// Login page POM for automationexercise.com (/login)

import { BasePage } from './BasePage.js';
import logger from '../utils/Logger.js';

export class LoginPage extends BasePage {
  constructor(page) {
    super(page);

    // ─── Login Section ────────────────────────────────────────────────────
    this.loginEmailInput = page.locator('input[data-qa="login-email"]');
    this.loginPasswordInput = page.locator('input[data-qa="login-password"]');
    this.loginButton = page.locator('button[data-qa="login-button"]');
    this.loginErrorMsg = page.locator('p:has-text("Your email or password is incorrect")');

    // ─── Page Heading ─────────────────────────────────────────────────────
    this.loginHeading = page.locator('.login-form h2');
  }

  // ─── Actions ──────────────────────────────────────────────────────────────

  /**
   * Navigate to the login/signup page.
   */
  async goToLoginPage() {
    logger.info('Navigating to /login');
    await this.navigate('/login');
    await this.waitForPageLoad();
  }

  /**
   * Perform login with provided credentials.
   * @param {string} email
   * @param {string} password
   */
  async login(email, password) {
    logger.info(`Logging in as: ${email}`);
    await this.fill(this.loginEmailInput, email);
    await this.fill(this.loginPasswordInput, password);
    await this.click(this.loginButton);
    await this.waitForPageLoad();
  }

  /**
   * Returns true if the login error message is visible.
   * @returns {Promise<boolean>}
   */
  async hasLoginError() {
    return this.isVisible(this.loginErrorMsg);
  }

  /**
   * Returns the login error text.
   * @returns {Promise<string>}
   */
  async getLoginErrorText() {
    return this.getText(this.loginErrorMsg);
  }
}