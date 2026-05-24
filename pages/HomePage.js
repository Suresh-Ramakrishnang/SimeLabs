// pages/HomePage.js
// Home page POM for automationexercise.com

import { BasePage } from './BasePage.js';
import logger from '../utils/Logger.js';

export class HomePage extends BasePage {
  constructor(page) {
    super(page);

    // ─── Locators ────────────────────────────────────────────────────────
    this.navSignupLogin = page.locator('a[href="/login"]');
    this.navLoggedInUser = page.locator('a:has-text("Logged in as")');
    this.navLogout = page.locator('a[href="/logout"]');
    this.navDeleteAccount = page.locator('a[href="/delete_account"]');
    this.navCart = page.locator('a[href="/view_cart"]');
    this.navProducts = page.locator('a[href="/products"]');
    this.logo = page.locator('#header .logo');
    this.subscribeEmail = page.locator('#susbscribe_email');
    this.subscribeBtn = page.locator('#subscribe');
    this.homeSlider = page.locator('#slider');
    this.accountDeletedHeading = page.locator('h2[data-qa="account-deleted"]');
    this.continueButton = page.locator('a[data-qa="continue-button"]');
  }

  // ─── Actions ──────────────────────────────────────────────────────────────

  /**
   * Navigate to the home page root.
   */
  async goToHome() {
    logger.info('Navigating to Home page');
    await this.navigate('/');
    await this.waitForPageLoad();
  }

  /**
   * Click the Signup / Login nav link.
   */
  async clickSignupLogin() {
    logger.info('Clicking Signup / Login nav link');
    await this.click(this.navSignupLogin);
  }

  /**
   * Navigate to Products page via nav.
   */
  async goToProducts() {
    logger.info('Navigating to Products page');
    await this.click(this.navProducts);
    await this.waitForPageLoad();
  }

  /**
   * Navigate to Cart via nav.
   */
  async goToCart() {
    logger.info('Navigating to Cart');
    await this.click(this.navCart);
    await this.waitForPageLoad();
  }

  /**
   * Returns the "Logged in as {name}" text from the nav.
   * @returns {Promise<string>}
   */
  async getLoggedInUsername() {
    return this.getText(this.navLoggedInUser);
  }

  /**
   * Check if user appears logged in (nav shows username).
   * @returns {Promise<boolean>}
   */
  async isLoggedIn() {
    return this.isVisible(this.navLoggedInUser);
  }

  /**
   * Delete account via nav link.
   */
  async deleteAccount() {
    logger.info('Clicking Delete Account nav link');
    await this.click(this.navDeleteAccount);
    await this.waitForPageLoad();
  }

  /**
   * Logout the currently signed-in user.
   */
  async logout() {
    logger.info('Clicking Logout nav link');
    await this.click(this.navLogout);
    await this.waitForPageLoad();
  }

  /**
   * Click Continue on the account deleted confirmation page.
   */
  async continueAfterAccountDeletion() {
    logger.info('Clicking Continue after account deletion');
    await this.click(this.continueButton);
    await this.waitForPageLoad();
  }
}
