import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/HomePage.js';
import { RegisterPage } from '../../pages/RegisterPage.js';
import { LoginPage } from '../../pages/LoginPage.js';
import { ProductsPage } from '../../pages/ProductsPage.js';
import { CartPage } from '../../pages/CartPage.js';
import { CheckoutPage } from '../../pages/CheckOutPage.js';
import { readFileSync } from 'fs';

const registerUserData = JSON.parse(
  readFileSync('test-data/ui/register-user.json', 'utf-8')
);

test('TC_UI_001 | User can register, login, checkout, and delete account', async ({ page }) => {
  const homePage = new HomePage(page);
  const registerPage = new RegisterPage(page);
  const loginPage = new LoginPage(page);
  const productsPage = new ProductsPage(page);
  const cartPage = new CartPage(page);
  const checkoutPage = new CheckoutPage(page);
  const email = `${registerUserData.emailPrefix}.${Date.now()}@${registerUserData.emailDomain}`;
  const userData = {
    ...registerUserData,
    email,
  };

  await homePage.goToHome();
  await expect(homePage.logo).toBeVisible();

  await homePage.clickSignupLogin();
  await registerPage.enterSignupDetails(userData.name, userData.email);
  await registerPage.fillAccountInfoForm(userData);

  await expect(registerPage.accountCreatedHeading).toBeVisible();
  await registerPage.clickContinue();
  await expect(homePage.navLoggedInUser).toContainText(userData.firstName);

  await homePage.logout();
  await expect(loginPage.loginHeading).toBeVisible();

  await loginPage.login(userData.email, userData.password);
  await expect(homePage.navLoggedInUser).toContainText(userData.firstName);

  await homePage.goToProducts();
  const firstProductName = await productsPage.getFirstProductName();
  await productsPage.addFirstProductToCart();
  await productsPage.viewCart();

  await expect(cartPage.cartTable).toBeVisible();
  await expect(await cartPage.getCartProductCount()).toBeGreaterThan(0);
  await expect(await cartPage.isProductInCart(firstProductName)).toBe(true);
  await expect(await cartPage.getFirstCartProductName()).toBe(firstProductName);
  await expect(await cartPage.getFirstProductQuantity()).toBe('1');

  const cartTotalPrice = await cartPage.getFirstProductTotalPrice();
  await expect(cartTotalPrice).not.toEqual('');

  await cartPage.proceedToCheckout();

  await expect(checkoutPage.checkoutHeading).toContainText('Address Details');
  await expect(checkoutPage.deliveryAddress).toContainText(userData.firstName);
  await expect(checkoutPage.deliveryAddress).toContainText(userData.city);
  await expect(checkoutPage.billingAddress).toContainText(userData.firstName);
  await expect(await checkoutPage.getOrderProductCount()).toBeGreaterThan(0);
  await expect(await checkoutPage.isProductVisibleInOrder(firstProductName)).toBe(true);
  await expect(await checkoutPage.getFirstOrderProductName()).toBe(firstProductName);
  await expect(await checkoutPage.getFirstOrderProductQuantity()).toBe('1');
  await expect(await checkoutPage.getFirstOrderTotalAmount()).toBe(cartTotalPrice);

  await homePage.deleteAccount();
  await expect(homePage.accountDeletedHeading).toBeVisible();
  await homePage.continueAfterAccountDeletion();
});
