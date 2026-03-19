import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';

test.describe('Product Inventory Suite', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
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
  })
})