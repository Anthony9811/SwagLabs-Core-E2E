import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { ProductDetailPage } from '../pages/ProductDetailPage';

test.describe('Product Inventory Suite', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;
  let productDetailsPage: ProductDetailPage;

  test.beforeEach(async ({ page }, testInfo) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    productDetailsPage = new ProductDetailPage(page);
    await loginPage.navigateTo();

    const skipStandardLogin = testInfo.title.includes('SCEE-22') || testInfo.title.includes('SCEE-20');

    if (!skipStandardLogin) {
      await loginPage.login('standard_user', 'secret_sauce');
    }
  });

  test('SCEE-4: should verify total product count on inventory page', async ({ page }) => {
    await expect(inventoryPage.inventoryItems).toHaveCount(6);
  });

  test('SCEE-5: should sort products by price in ascending order', async ({ page }) => {
    await inventoryPage.sortBy('lohi');

    await expect(inventoryPage.getItemPriceByIndex(0)).toHaveText('$7.99');

    await expect(inventoryPage.getItemPriceByIndex(5)).toHaveText('$49.99');
  });

  test('SCEE-6: should open an individual product details from inventory', async ({ page }) => {
    const productName = "Sauce Labs Backpack";

    await inventoryPage.openProductDetails(productName);

    /**
    * @remarks \? escapes the question mark, and \d+ matches any numeric ID.
    */
    await expect(page).toHaveURL(/.*inventory-item.html\?id=\d+/);

    await expect(productDetailsPage.itemName).toHaveText(productName);
    await expect(productDetailsPage.itemPrice).toHaveText('$29.99');
  });

  test('SCEE-7: should reset app state via sidebar menu', async ({ page }) => {
    await inventoryPage.addProductToCart('Sauce Labs Backpack');

    await expect(inventoryPage.cartBadge).toBeVisible();

    await inventoryPage.resetAppState();

    await expect(inventoryPage.cartBadge).toBeHidden();
  });

  test('SCEE-8: should verify twitter social link in footer', async ({ page, context }) => {
    const newTabPromise = context.waitForEvent('page');

    await inventoryPage.goToSocials('twitter');

    const newTab = await newTabPromise;

    await expect(newTab).toHaveURL('https://x.com/saucelabs');
  });

  test('SCEE-16: should verify "Back to products" button functionality', async ({ page }) => {
    const productName = "Sauce Labs Backpack";

    await inventoryPage.openProductDetails(productName);

    await productDetailsPage.backToProducts();

    await expect(page).toHaveURL(/.*inventory.html/);
    await expect(inventoryPage.pageTitle).toHaveText('Products');
  });

  test('SCEE-17: should verify burger menu functionality in mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });

    await inventoryPage.openMenu();

    await expect(inventoryPage.logoutLink).toBeVisible();

    await inventoryPage.closeMenu();

    await expect(inventoryPage.pageTitle).toHaveText('Products');
  });

  test('SCEE-20: should verify sorting failure with problem user', async ({ page }) => {
    test.fail();

    await loginPage.login('problem_user', 'secret_sauce');

    // 1. Captures the initial state of the prices as numbers
    const pricesBefore = await inventoryPage.getAllItemPrices();

    await inventoryPage.sortBy('lohi');

    // 2. Captures the new state of the prices after the action
    const pricesAfter = await inventoryPage.getAllItemPrices();

    /**
     * [...pricesBefore]: Creates a copy so the original array isn't changed
     * .sort((a, b) => a - b) forces a mathematical ascending sort
     */
    const expectedOrder = [...pricesBefore].sort((a, b) => a - b);

    await expect(pricesAfter).toEqual(expectedOrder);
  });

  test('SCEE-22: should verify broken links on Product Detail page', async ({ page }) => {
    test.fail();
    const productName = "Sauce Labs Fleece Jacket";

    await loginPage.login('problem_user', 'secret_sauce');
    await inventoryPage.openProductDetails(productName);

    await expect(productDetailsPage.itemName).toHaveText(productName)
  });
})