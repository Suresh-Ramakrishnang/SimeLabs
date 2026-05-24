// pages/CartPage.js

import { BasePage } from './BasePage.js';
import logger from '../utils/Logger.js';

export class CartPage extends BasePage {

  constructor(page) {
    super(page);

    // ─── Locators ─────────────────────────────────────────────

    this.cartTable = page.locator('#cart_info_table');

    this.cartProducts = page.locator(
      '#cart_info_table tbody tr'
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

    this.productTotalPrice = page.locator(
      '.cart_total_price'
    );

    this.proceedToCheckoutBtn = page.locator(
      'a.check_out'
    );

    this.emptyCartMsg = page.locator(
      '#empty_cart'
    );
  }

  // ─── Actions ───────────────────────────────────────────────

  /**
   * Navigate to cart page
   */
  async goToCart() {
    logger.info('Navigating to cart page');

    await this.navigate('/view_cart');
    await this.waitForPageLoad();
  }

  /**
   * Proceed to checkout
   */
  async proceedToCheckout() {
    logger.info('Proceeding to checkout');

    await this.click(this.proceedToCheckoutBtn);
    await this.waitForPageLoad();
  }

  // ─── Validations ───────────────────────────────────────────

  /**
   * Validate product exists in cart
   * @param {string} productName
   */
  async isProductInCart(productName) {

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
   * Get total products count in cart
   */
  async getCartProductCount() {
    return this.cartProducts.count();
  }

  /**
   * Get first product name
   */
  async getFirstCartProductName() {
    return this.getText(
      this.productNames.first()
    );
  }

  /**
   * Get first product quantity
   */
  async getFirstProductQuantity() {
    return this.getText(
      this.productQuantity.first()
    );
  }

  /**
   * Get first product total price
   */
  async getFirstProductTotalPrice() {
    return this.getText(
      this.productTotalPrice.first()
    );
  }

}