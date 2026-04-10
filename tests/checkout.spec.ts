import { test, expect } from '../fixtures/CheckoutFixtures';

test.describe('Cart & Checkout Suite', () => {

  test('SCEE-9: should add multiple items to cart and verify badge count',
    { tag: '@skipAddingProduct' }, async ({ inventoryPage, cartPage, page }) => {

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

  test('SCEE-10: should enter personal information in checkout flow', async ({ inventoryPage, cartPage, checkoutPage, page }) => {
    await inventoryPage.goToCart();

    await expect(page).toHaveURL(/.*cart.html/);

    await cartPage.goToCheckout();
    await expect(page).toHaveURL(/.*checkout-step-one.html/);

    await checkoutPage.checkout('John', 'Doe', '12345');
    await expect(page).toHaveURL(/.*checkout-step-two.html/);
  });

  test('SCEE-11: should verify order overview and price calculations',
    async ({ inventoryPage, cartPage, checkoutPage, checkoutOverviewPage }) => {
      await inventoryPage.goToCart();

      await cartPage.goToCheckout();
      await checkoutPage.checkout('John', 'Doe', '12345');

      const expectedTotal = await checkoutOverviewPage.getExpectedTotal();
      const actualTotal = await checkoutOverviewPage.getActualTotalAmount();

      expect(actualTotal).toBe(expectedTotal);
    });

  test('SCEE-12: should complete a purchase and verify the success message',
    async ({ inventoryPage, cartPage, checkoutPage, checkoutOverviewPage, checkoutCompletePage, page }) => {
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

  test('SCEE-13: should cancel checkout and return to cart', async ({ inventoryPage, cartPage, checkoutPage }) => {
      await inventoryPage.goToCart();

      await cartPage.goToCheckout();
      await checkoutPage.checkout('John', '', '');

      await checkoutPage.cancelCheckout();

      await expect(cartPage.cartItems.filter({ hasText: 'Sauce Labs Backpack' })).toBeVisible();
    });

  test('SCEE-14: should attempt checkout with an empty cart',
    { tag: '@skipAddingProduct' }, async ({ inventoryPage, cartPage, page }) => {

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

  test('SCEE-15: should verify cart items persist after logout and login', async ({ loginPage, inventoryPage, cartPage, page }) => {
    //A product has already been added in the .beforeEach()
    await expect(inventoryPage.cartBadge).toHaveText('1');

    await inventoryPage.logout();
    await expect(page).toHaveURL(/.*www.saucedemo.com/);

    await loginPage.login('standard_user', 'secret_sauce');
    await expect(inventoryPage.cartBadge).toHaveText('1');

    await inventoryPage.goToCart();
    await expect(cartPage.cartItems.filter({ hasText: 'Sauce Labs Backpack' })).toBeVisible();
  });

  test('SCEE-21: should verify a last name field "lock" for error_user',
    { tag: ['@errorUser'] }, async ({ inventoryPage, cartPage, checkoutPage, page }) => {

      await inventoryPage.goToCart();

      await expect(cartPage.cartItems.filter({ hasText: 'Sauce Labs Backpack' })).toBeVisible();

      await cartPage.goToCheckout();
      await expect(page).toHaveURL(/.*checkout-step-one.html/);

      await checkoutPage.checkout('John', 'Doe', '12345');

      test.fail(true, 'Bug: User cannot type into the last name field of the checkout page.');
      await expect(checkoutPage.lastNameField).toBeEditable();
    });
})