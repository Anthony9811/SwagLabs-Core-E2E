import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';

test.describe('Cart & Checkout Suite', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;
  let checkoutPage: CheckoutPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
    checkoutPage = new CheckoutPage(page);
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
})