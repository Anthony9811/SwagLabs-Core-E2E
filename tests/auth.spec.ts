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

  test('C1: should login a standard user successfully', async ({ page }) => {
    await loginPage.login('standard_user', 'secret_sauce');
    await expect(page).toHaveURL(/.*inventory.html/);
  });

  test('C2: should receive an error message with locked out user', async () => {
    await loginPage.login('locked_out_user', 'secret_sauce');
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText('Sorry, this user has been locked out.');
  });

  test('C3: should logout successfully from inventory page', async ({ page }) => {
    await loginPage.login('standard_user', 'secret_sauce');
    await inventoryPage.logout();
    await expect(page).toHaveURL(/.*www.saucedemo.com/);
    await expect(loginPage.loginButton).toBeVisible();
  });
});