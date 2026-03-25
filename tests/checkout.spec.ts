import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { CheckoutOverviewPage } from '../pages/CheckoutOverviewPage';
import { CheckoutCompletePage } from '../pages/CheckoutCompletePage';

test.describe('Cart & Checkout Suite', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;
  let checkoutPage: CheckoutPage;
  let checkoutOverviewPage: CheckoutOverviewPage;
  let checkoutCompletePage: CheckoutCompletePage;

  let username = 'standard_user';

  test.beforeEach(async ({ page }, testInfo) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
    checkoutPage = new CheckoutPage(page);
    checkoutOverviewPage = new CheckoutOverviewPage(page);
    checkoutCompletePage = new CheckoutCompletePage(page);

    await loginPage.navigateTo();

    if (testInfo.tags.includes('@errorUser')) {
      username = 'error_user';
    }

    await loginPage.login(username, 'secret_sauce');

    if (!testInfo.tags.includes('@skipAddingProduct')) {
      await inventoryPage.addProductToCart('Sauce Labs Backpack');
    }

  });

  test('SCEE-9: should add multiple items to cart and verify badge count', { tag: '@skipAddingProduct' }, async ({ page }) => {

    const products = ['Sauce Labs Backpack', 'Sauce Labs Bike Light', 'Sauce Labs Bolt T-Shirt'];

    for (const product of products) {
      await inventoryPage.addProductToCart(product);
      await expect(inventoryPage.getRemoveButtonByProductName(product)).toBeVisible();
    }

    await inventoryPage.goToCart();
    await expect(page).toHaveURL(/.*cart.html/);

    for (const product of products) {
      await expect(cartPage.cartItems.filter({ hasText: product })).toBeVisible();
    }

    await expect(cartPage.cartBadge).toHaveText(products.length.toString());
  });

  test('SCEE-10: should enter personal information in checkout flow', async ({ page }) => {
    await inventoryPage.goToCart();

    await expect(page).toHaveURL(/.*cart.html/);

    await cartPage.goToCheckout();
    await expect(page).toHaveURL(/.*checkout-step-one.html/);

    await checkoutPage.checkout('John', 'Doe', '12345');
    await expect(page).toHaveURL(/.*checkout-step-two.html/);
  });

  test('SCEE-11: should verify order overview and price calculations', async () => {
    await inventoryPage.goToCart();

    await cartPage.goToCheckout();
    await checkoutPage.checkout('John', 'Doe', '12345');

    const expectedTotal = await checkoutOverviewPage.getExpectedTotal();
    const actualTotal = await checkoutOverviewPage.getActualTotalAmount();

    expect(actualTotal).toBe(expectedTotal);
  });

  test('SCEE-12: should complete a purchase and verify the success message', async ({ page }) => {
    await inventoryPage.goToCart();

    await cartPage.goToCheckout();
    await checkoutPage.checkout('John', 'Doe', '12345');

    await checkoutOverviewPage.finishPurchase();

    await expect(page).toHaveURL(/.*checkout-complete.html/);
    await expect(checkoutCompletePage.successImage).toBeVisible();
    await expect(checkoutCompletePage.successTitle).toHaveText('Thank you for your order!');

    await checkoutCompletePage.goBackToHome()
    await expect(page).toHaveURL(/.*inventory.html/);
  });

  test('SCEE-13: should cancel checkout and return to cart', { tag: '@skipAddingProduct' }, async ({ page }) => {

    const product = 'Sauce Labs Backpack';

    await inventoryPage.addProductToCart(product);
    await inventoryPage.goToCart();

    await cartPage.goToCheckout();
    await checkoutPage.checkout('John', '', '');

    await checkoutPage.cancelCheckout();

    await expect(cartPage.cartItems.filter({ hasText: product })).toBeVisible();
  });

  test('SCEE-14: should attempt checkout with an empty cart', { tag: '@skipAddingProduct' }, async ({ page }) => {
    test.fail(true, 'Bug: Application allows checkout with an empty cart.');

    await inventoryPage.goToCart();

    await expect(page).toHaveURL(/.*cart.html/);

    await cartPage.goToCheckout();

    /** 
     * ASSERT THE REQUIREMENT: We should still be on the cart page.
     * Because the app actually redirects us, THIS assertion will fail
     * */
    await expect(page).toHaveURL(/.*cart.html/);
  });

  test('SCEE-15: should verify cart items persist after fogout and login', async ({ page }) => {
    //A product has already been added in the .beforeEach()
    await expect(inventoryPage.cartBadge).toHaveText('1');

    await inventoryPage.logout();
    await expect(page).toHaveURL(/.*www.saucedemo.com/);

    await loginPage.login('standard_user', 'secret_sauce');
    await expect(inventoryPage.cartBadge).toHaveText('1');

    await inventoryPage.goToCart();
    await expect(cartPage.cartItems.filter({ hasText: 'Sauce Labs Backpack' })).toBeVisible();
  });

  test('SCEE-21: should verify a last name field "lock" for error_user', { tag: ['@errorUser'] }, async ({ page }) => {

    await inventoryPage.goToCart();

    await expect(cartPage.cartItems.filter({ hasText: 'Sauce Labs Backpack' })).toBeVisible();

    await cartPage.goToCheckout();
    await expect(page).toHaveURL(/.*checkout-step-one.html/);

    await checkoutPage.checkout('John', 'Doe', '12345');

    test.fail(true, 'Bug: User cannot type into the last name field of the checkout page.');
    await expect(checkoutPage.lastNameField).toBeEditable();
  });
})