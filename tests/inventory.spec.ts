import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { ProductDetailPage } from '../pages/ProductDetailPage';

test.describe('Product Inventory Suite', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;
  let productDetailsPage: ProductDetailPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    productDetailsPage = new ProductDetailPage(page);
    await loginPage.navigateTo();
  });

  test('SCEE-4: should verify total product count on inventory page', async ({ page }) => {
    await loginPage.login('standard_user', 'secret_sauce');
    await expect(inventoryPage.inventoryItems).toHaveCount(6);
  });

  test('SCEE-5: should sort products by price in ascending order', async ({ page }) => {
    await loginPage.login('standard_user', 'secret_sauce');
    await inventoryPage.sortBy('lohi');

    await expect(inventoryPage.getItemPriceByIndex(0)).toHaveText('$7.99');

    await expect(inventoryPage.getItemPriceByIndex(5)).toHaveText('$49.99');
  });

  test('SCEE-6: should open an individual product details from inventory', async ({ page }) => {
    const productName = "Sauce Labs Backpack";

    await loginPage.login('standard_user', 'secret_sauce');
    await inventoryPage.openProductDetails(productName);

    /**
    * @remarks \? escapes the question mark, and \d+ matches any numeric ID.
    */
    await expect(page).toHaveURL(/.*inventory-item.html\?id=\d+/);

    await expect(productDetailsPage.itemName).toHaveText(productName);
    await expect(productDetailsPage.itemPrice).toHaveText('$29.99');
  });

  test('SCEE-7: should reset app state via sidebar menu', async ({ page }) => {
    await loginPage.login('standard_user', 'secret_sauce');
    await inventoryPage.addProductToCart('Sauce Labs Backpack');

    await expect(inventoryPage.cartBadgeNumber).toBeVisible();

    await inventoryPage.resetAppState();

    await expect(inventoryPage.cartBadgeNumber).toBeHidden();
  });

  test('SCEE-8: should verify twitter social link in footer', async ({ page, context }) => {
    const newTabPromise = context.waitForEvent('page');

    await loginPage.login('standard_user', 'secret_sauce');
    await inventoryPage.goToSocials('twitter');

    const newTab = await newTabPromise;

    await expect(newTab).toHaveURL('https://x.com/saucelabs');
  });

  test('SCEE-16: should verify "Back to products" button functionality', async ({ page }) => {
    const productName = "Sauce Labs Backpack";

    await loginPage.login('standard_user', 'secret_sauce');
    await inventoryPage.openProductDetails(productName);

    await productDetailsPage.backToProducts();

    await expect(page).toHaveURL(/.*inventory.html/);
    await expect(inventoryPage.pageTitle).toHaveText('Products');
  });
})