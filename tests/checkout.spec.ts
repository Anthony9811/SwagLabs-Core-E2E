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

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
    checkoutPage = new CheckoutPage(page);
    checkoutOverviewPage = new CheckoutOverviewPage(page);
    checkoutCompletePage = new CheckoutCompletePage(page);
    await loginPage.navigateTo();
    await loginPage.login('standard_user', 'secret_sauce');
  });

  test('SCEE-9: should add multiple items to cart and verify badge count', async ({ page }) => {

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

  test('SCEE-10: should enter personal information in chechout flow', async ({ page }) => {
    await inventoryPage.addProductToCart('Sauce Labs Backpack');
    await inventoryPage.goToCart();

    await expect(page).toHaveURL(/.*cart.html/);

    await cartPage.goToCheckout();
    await expect(page).toHaveURL(/.*checkout-step-one.html/);

    await checkoutPage.checkout('John', 'Doe', '12345');
    await expect(page).toHaveURL(/.*checkout-step-two.html/);
  });

  test('SCEE-11: should verify order overview and price calculations', async () => {
    await inventoryPage.addProductToCart('Sauce Labs Backpack');
    await inventoryPage.goToCart();

    await cartPage.goToCheckout();
    await checkoutPage.checkout('John', 'Doe', '12345');

    const expectedTotal = await checkoutOverviewPage.getExpectedTotal();
    const actualTotal = await checkoutOverviewPage.getActualTotalAmount();

    expect(actualTotal).toBe(expectedTotal);
  });

  test('SCEE-12: should complete a purchase and verify the success message', async ({ page }) => {
    await inventoryPage.addProductToCart('Sauce Labs Backpack');
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

  test('SCEE-13: should cancel checkout and return to inventory', async ({ page }) => {
    const product = 'Sauce Labs Backpack';

    await inventoryPage.addProductToCart('Sauce Labs Backpack');
    await inventoryPage.goToCart();

    await cartPage.goToCheckout();
    await checkoutPage.checkout('John', '', '');

    await checkoutPage.cancelCheckout();

    await expect(cartPage.cartItems.filter({ hasText: product })).toBeVisible();
  });

  test('SCEE-14: should attempt checkout with an empty cart', async ({ page }) => {
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
})