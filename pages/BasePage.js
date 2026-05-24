// pages/BasePage.js
// Base Page Object — all page classes extend this.
// Contains shared utilities: navigation, waits, screenshots, element helpers.

import logger from '../utils/Logger.js';
import path from 'path';
import fs from 'fs';

export class BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
  }

  // ─── Navigation ───────────────────────────────────────────────────────────

  /**
   * Navigate to a URL relative to baseURL or absolute.
   * @param {string} url
   */
  async navigate(url) {
    logger.info(`Navigating to: ${url}`);
    await this.page.goto(url, { waitUntil: 'domcontentloaded' });
  }

  /**
   * Wait for page to reach networkidle (after navigation / heavy Ajax)
   */
  async waitForPageLoad() {
    await this.page.waitForLoadState('domcontentloaded');
  }

  // ─── Element Actions ──────────────────────────────────────────────────────

  /**
   * Click an element, waiting for it to be visible first.
   * @param {string|import('@playwright/test').Locator} locator
   */
  async click(locator) {
    const el = typeof locator === 'string' ? this.page.locator(locator) : locator;
    await el.waitFor({ state: 'visible', timeout: 15000 });
    logger.debug(`Clicking: ${typeof locator === 'string' ? locator : 'locator'}`);
    await el.click();
  }

  /**
   * Fill an input, clearing it first.
   * @param {string|import('@playwright/test').Locator} locator
   * @param {string} value
   */
  async fill(locator, value) {
    const el = typeof locator === 'string' ? this.page.locator(locator) : locator;
    await el.waitFor({ state: 'visible', timeout: 15000 });
    await el.clear();
    await el.fill(value);
    logger.debug(`Filled value into: ${typeof locator === 'string' ? locator : 'locator'}`);
  }

  /**
   * Select dropdown option by visible text.
   * @param {string|import('@playwright/test').Locator} locator
   * @param {string} label
   */
  async selectByLabel(locator, label) {
    const el = typeof locator === 'string' ? this.page.locator(locator) : locator;
    await el.waitFor({ state: 'visible', timeout: 15000 });
    await el.selectOption({ label });
    logger.debug(`Selected option "${label}"`);
  }

  /**
   * Select dropdown option by value.
   * @param {string|import('@playwright/test').Locator} locator
   * @param {string} value
   */
  async selectByValue(locator, value) {
    const el = typeof locator === 'string' ? this.page.locator(locator) : locator;
    await el.waitFor({ state: 'visible', timeout: 15000 });
    await el.selectOption({ value });
  }

  /**
   * Get trimmed inner text of an element.
   * @param {string|import('@playwright/test').Locator} locator
   * @returns {Promise<string>}
   */
  async getText(locator) {
    const el = typeof locator === 'string' ? this.page.locator(locator) : locator;
    await el.waitFor({ state: 'visible', timeout: 15000 });
    return (await el.innerText()).trim();
  }

  /**
   * Check if an element is visible on the page.
   * @param {string|import('@playwright/test').Locator} locator
   * @returns {Promise<boolean>}
   */
  async isVisible(locator) {
    const el = typeof locator === 'string' ? this.page.locator(locator) : locator;
    return el.isVisible();
  }

  /**
   * Scroll element into view.
   * @param {string|import('@playwright/test').Locator} locator
   */
  async scrollIntoView(locator) {
    const el = typeof locator === 'string' ? this.page.locator(locator) : locator;
    await el.scrollIntoViewIfNeeded();
  }

  /**
   * Wait for a URL to match a pattern.
   * @param {string|RegExp} urlOrPattern
   */
  async waitForURL(urlOrPattern) {
    await this.page.waitForURL(urlOrPattern, { timeout: 30000 });
  }

  /**
   * Wait for a selector to be visible.
   * @param {string} selector
   */
  async waitForSelector(selector) {
    await this.page.waitForSelector(selector, { state: 'visible', timeout: 15000 });
  }

  // ─── Screenshot ───────────────────────────────────────────────────────────

  /**
   * Capture a screenshot with a descriptive name.
   * @param {string} name
   */
  async takeScreenshot(name) {
    const dir = path.resolve('screenshots');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    const file = path.join(dir, `${name}_${Date.now()}.png`);
    await this.page.screenshot({ path: file, fullPage: true });
    logger.info(`Screenshot saved: ${file}`);
    return file;
  }

  // ─── Ad / Overlay Dismissal ───────────────────────────────────────────────

  /**
   * Silently dismiss any ad overlay that might appear on automationexercise.com
   */
  async dismissAdOverlay() {
    try {
      const overlay = this.page.locator('div#Ad_xxx, .adsbygoogle, iframe[id*="google_ads"]').first();
      if (await overlay.isVisible({ timeout: 3000 })) {
        await this.page.keyboard.press('Escape');
        logger.debug('Ad overlay dismissed');
      }
    } catch {
      // No overlay — continue
    }
  }

  /**
   * Get current page title.
   * @returns {Promise<string>}
   */
  async getTitle() {
    return this.page.title();
  }

  /**
   * Get current page URL.
   * @returns {string}
   */
  getCurrentURL() {
    return this.page.url();
  }
}