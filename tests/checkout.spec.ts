import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';

test.describe('Cart & Checkout Suite', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
    await loginPage.navigateTo();
    await loginPage.login('standard_user', 'secret_sauce');
  });

  test.only('SCEE-9: should add multiple items to cart and verify badge count', async ({ page }) => {
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
  })
})