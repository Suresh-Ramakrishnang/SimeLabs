// pages/CheckoutPage.js

import { BasePage } from './BasePage.js';
import logger from '../utils/Logger.js';

export class CheckoutPage extends BasePage {

  constructor(page) {
    super(page);

    // ─── Locators ─────────────────────────────────────────────

    this.checkoutHeading = page.getByRole('heading', {
  name: 'Address Details'
});

    this.deliveryAddress = page.locator(
      '#address_delivery'
    );

    this.billingAddress = page.locator(
      '#address_invoice'
    );

    this.orderCommentBox = page.locator(
      'textarea[name="message"]'
    );

    this.placeOrderBtn = page.locator(
      'a.check_out'
    );

    this.orderProducts = page.locator(
      '#cart_info tbody tr'
    );

    this.productNames = page.locator(
      '.cart_description h4 a'
    );

    this.productPrices = page.locator(
      '.cart_price p'
    );

    this.productQuantity = page.locator(
      '.cart_quantity button'
    );

    this.totalAmount = page.locator(
      '.cart_total_price'
    );
  }

  // ─── Actions ───────────────────────────────────────────────

  /**
   * Add order comments
   * @param {string} comment
   */
  async addComment(comment) {

    logger.info('Adding order comment');

    await this.fill(
      this.orderCommentBox,
      comment
    );
  }

  /**
   * Click Place Order
   */
  async clickPlaceOrder() {

    logger.info('Clicking Place Order');

    await this.click(this.placeOrderBtn);

    await this.waitForPageLoad();
  }

  // ─── Validations ───────────────────────────────────────────

  /**
   * Validate product exists in order summary
   * @param {string} productName
   */
  async isProductVisibleInOrder(productName) {

    const count = await this.productNames.count();

    for (let i = 0; i < count; i++) {

      const text = await this.productNames.nth(i).innerText();

      if (text.trim() === productName.trim()) {
        return true;
      }
    }

    return false;
  }

  /**
   * Get total order products
   */
  async getOrderProductCount() {
    return this.orderProducts.count();
  }

  /**
   * Get first order product name
   */
  async getFirstOrderProductName() {

    return this.getText(
      this.productNames.first()
    );
  }

  /**
   * Get first order product quantity
   */
  async getFirstOrderProductQuantity() {

    return this.getText(
      this.productQuantity.first()
    );
  }

  /**
   * Get first order total amount
   */
  async getFirstOrderTotalAmount() {

    return this.getText(
      this.totalAmount.first()
    );
  }

}