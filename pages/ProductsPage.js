// pages/ProductsPage.js
// Products page POM for automationexercise.com (/products)

import { BasePage } from './BasePage.js';
import logger from '../utils/Logger.js';

export class ProductsPage extends BasePage {
  constructor(page) {
    super(page);

    // ─── Locators ────────────────────────────────────────────────────────
    this.productList = page.locator('.features_items .product-image-wrapper');
    this.firstProductAddToCart = page.locator('.features_items .product-image-wrapper').first()
      .locator('.product-overlay .add-to-cart');
    this.addToCartButtons = page.locator('a.add-to-cart[data-product-id]');
    this.modalContinueShopping = page.locator('.modal-footer button:has-text("Continue Shopping")');
    this.modalViewCart = page.locator('.modal-body a[href="/view_cart"]');
    this.productModal = page.locator('#cartModal');
    this.searchInput = page.locator('#search_product');
    this.searchButton = page.locator('#submit_search');
    this.pageHeading = page.locator('.features_items h2.title');
  }

  // ─── Actions ──────────────────────────────────────────────────────────────

  /**
   * Navigate to products page.
   */
  async goToProducts() {
    logger.info('Navigating to /products');
    await this.navigate('/products');
    await this.waitForPageLoad();
    await this.waitForSelector('.features_items');
  }

  /**
   * Add the first product to cart by hovering to reveal the overlay button.
   */
  async addFirstProductToCart() {
    logger.info('Adding first product to cart');
    const firstProduct = this.productList.first();
    await firstProduct.scrollIntoViewIfNeeded();

    // Hover over product card to reveal the "Add to cart" overlay
    await firstProduct.hover();

    // Click "Add to cart" in overlay
    const overlayAddBtn = firstProduct.locator('.product-overlay a.add-to-cart');
    await overlayAddBtn.waitFor({ state: 'visible', timeout: 10000 });
    await overlayAddBtn.click();

    // Wait for modal to appear
    await this.productModal.waitFor({ state: 'visible', timeout: 10000 });
    logger.info('Add to cart modal appeared');
  }

  /**
   * Add a product by its 1-based index (1 = first product).
   * @param {number} index
   */
  async addProductToCartByIndex(index) {
    logger.info(`Adding product #${index} to cart`);
    const product = this.productList.nth(index - 1);
    await product.scrollIntoViewIfNeeded();
    await product.hover();
    const overlayAddBtn = product.locator('.product-overlay a.add-to-cart');
    await overlayAddBtn.waitFor({ state: 'visible', timeout: 10000 });
    await overlayAddBtn.click();
    await this.productModal.waitFor({ state: 'visible', timeout: 10000 });
  }

  /**
   * Click "Continue Shopping" in the cart modal.
   */
  async continueShopping() {
    logger.info('Clicking Continue Shopping');
    await this.click(this.modalContinueShopping);
    await this.productModal.waitFor({ state: 'hidden', timeout: 10000 });
  }

  /**
   * Click "View Cart" in the cart modal.
   */
  async viewCart() {
    logger.info('Clicking View Cart from modal');
    await this.click(this.modalViewCart);
    await this.waitForURL(/\/view_cart/);
    await this.waitForPageLoad();
  }

  /**
   * Get number of products visible on the page.
   * @returns {Promise<number>}
   */
  async getProductCount() {
    return this.productList.count();
  }

  /**
   * Get name of the first product.
   * @returns {Promise<string>}
   */
  async getFirstProductName() {
    return this.getText(this.productList.first().locator('.productinfo p'));
  }

  /**
   * Search for a product by keyword.
   * @param {string} keyword
   */
  async searchProduct(keyword) {
    logger.info(`Searching product: ${keyword}`);
    await this.fill(this.searchInput, keyword);
    await this.click(this.searchButton);
    await this.waitForPageLoad();
  }
}