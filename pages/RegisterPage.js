// pages/RegisterPage.js
// Registration page POM for automationexercise.com
// Covers: /login (signup section) → /signup (account info form)

import { BasePage } from './BasePage.js';
import logger from '../utils/Logger.js';

export class RegisterPage extends BasePage {
  constructor(page) {
    super(page);

    // ─── Signup Section (on /login page) ─────────────────────────────────
    this.signupNameInput = page.locator('input[data-qa="signup-name"]');
    this.signupEmailInput = page.locator('input[data-qa="signup-email"]');
    this.signupButton = page.locator('button[data-qa="signup-button"]');

    // ─── Account Info Form (/signup) ─────────────────────────────────────
    this.titleMrRadio = page.locator('#id_gender1');
    this.titleMrsRadio = page.locator('#id_gender2');
    this.passwordInput = page.locator('input[data-qa="password"]');
    this.birthDaySelect = page.locator('select[data-qa="days"]');
    this.birthMonthSelect = page.locator('select[data-qa="months"]');
    this.birthYearSelect = page.locator('select[data-qa="years"]');
    this.newsletterCheckbox = page.locator('#newsletter');
    this.optinCheckbox = page.locator('#optin');
    this.firstNameInput = page.locator('input[data-qa="first_name"]');
    this.lastNameInput = page.locator('input[data-qa="last_name"]');
    this.companyInput = page.locator('input[data-qa="company"]');
    this.address1Input = page.locator('input[data-qa="address"]');
    this.address2Input = page.locator('input[data-qa="address2"]');
    this.countrySelect = page.locator('select[data-qa="country"]');
    this.stateInput = page.locator('input[data-qa="state"]');
    this.cityInput = page.locator('input[data-qa="city"]');
    this.zipcodeInput = page.locator('input[data-qa="zipcode"]');
    this.mobileInput = page.locator('input[data-qa="mobile_number"]');
    this.createAccountBtn = page.locator('button[data-qa="create-account"]');

    // ─── Success / Confirmation ───────────────────────────────────────────
    this.accountCreatedHeading = page.locator('h2[data-qa="account-created"]');
    this.continueBtn = page.locator('a[data-qa="continue-button"]');
  }

  // ─── Actions ──────────────────────────────────────────────────────────────

  /**
   * Step 1 — Enter name + email in the "New User Signup" section.
   * @param {string} name
   * @param {string} email
   */
  async enterSignupDetails(name, email) {
    logger.info(`Entering signup details — name: ${name}, email: ${email}`);
    await this.fill(this.signupNameInput, name);
    await this.fill(this.signupEmailInput, email);
    await this.click(this.signupButton);
    await this.waitForURL(/\/signup/);
    await this.waitForPageLoad();
  }

  /**
   * Step 2 — Fill the full account info form and submit.
   * @param {import('../utils/TestDataGenerator.js').default} userData
   */
  async fillAccountInfoForm(userData) {
    logger.info('Filling account info form');

    // Title
    await this.click(this.titleMrRadio);

    // Password
    await this.fill(this.passwordInput, userData.password);

    // Date of birth
    await this.selectByValue(this.birthDaySelect, userData.birthDay);
    await this.selectByValue(this.birthMonthSelect, userData.birthMonth);
    await this.selectByValue(this.birthYearSelect, userData.birthYear);

    // Checkboxes
    const newsletterChecked = await this.newsletterCheckbox.isChecked();
    if (!newsletterChecked) await this.click(this.newsletterCheckbox);

    // First / Last name
    await this.fill(this.firstNameInput, userData.firstName);
    await this.fill(this.lastNameInput, userData.lastName);

    // Company & Address
    await this.fill(this.companyInput, userData.company);
    await this.fill(this.address1Input, userData.address);
    await this.fill(this.address2Input, userData.address2);

    // Location
    await this.selectByLabel(this.countrySelect, userData.country);
    await this.fill(this.stateInput, userData.state);
    await this.fill(this.cityInput, userData.city);
    await this.fill(this.zipcodeInput, userData.zipcode);
    await this.fill(this.mobileInput, userData.mobileNumber);

    // Submit
    await this.scrollIntoView(this.createAccountBtn);
    await this.click(this.createAccountBtn);
    await this.waitForPageLoad();
  }

  /**
   * Click "Continue" on the "Account Created!" confirmation page.
   */
  async clickContinue() {
    logger.info('Clicking Continue on account created page');
    await this.click(this.continueBtn);
    await this.waitForPageLoad();
  }

  // ─── Assertions helpers ───────────────────────────────────────────────────

  /**
   * Returns text of the "ACCOUNT CREATED!" heading.
   * @returns {Promise<string>}
   */
  async getAccountCreatedText() {
    return this.getText(this.accountCreatedHeading);
  }

  /**
   * Returns true if the account created confirmation is visible.
   * @returns {Promise<boolean>}
   */
  async isAccountCreatedVisible() {
    return this.isVisible(this.accountCreatedHeading);
  }
}