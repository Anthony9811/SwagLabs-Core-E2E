import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';

test.describe('Authentication Suite', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    await loginPage.navigateTo();
  });

  test('SCEE-1: should login a standard user successfully', async ({ page }) => {
    await loginPage.login('standard_user', 'secret_sauce');
    await expect(page).toHaveURL(/.*inventory.html/);
  });

  test('SCEE-2: should receive an error message with locked out user', async () => {
    await loginPage.login('locked_out_user', 'secret_sauce');
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText('Sorry, this user has been locked out.');
  });

  test('SCEE-3: should logout successfully from inventory page', async ({ page }) => {
    await loginPage.login('standard_user', 'secret_sauce');
    await inventoryPage.logout();
    await expect(page).toHaveURL(/.*www.saucedemo.com/);
    await expect(loginPage.loginButton).toBeVisible();
  });

  test('SCEE-18: should verify ui anomalies with problem user', async ({ page }) => {
    test.fail();
    await loginPage.login('problem_user', 'secret_sauce');

    const backpackImage = page
      .getByTestId('inventory-item')
      .filter({ hasText: 'Sauce Labs Backpack' })
      .getByRole('img');

    const imageSource = await backpackImage.getAttribute('src');
    expect(imageSource).toContain('/static/media/sauce-backpack-1200x1500.0a0b85a385945026062b.jpg');
  });

  test('SCEE-19: should verify functional failures with error user', async ({ page }) => {
    test.fail();
    await loginPage.login('error_user', 'secret_sauce');

    await inventoryPage.addProductToCart('Sauce Labs Backpack');
    await expect(inventoryPage.getButtonByProductName('Sauce Labs Backpack')).toBeVisible();

    await inventoryPage.addProductToCart('Sauce Labs Fleece Jacket');
    await expect(inventoryPage.getButtonByProductName('Sauce Labs Fleece Jacket')).toBeVisible();
  })
});