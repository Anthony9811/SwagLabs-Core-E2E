import { test, expect } from '../fixtures/AuthFixtures';

test.describe('Authentication Suite', () => {
  test('SCEE-1: should login a standard user successfully', async ({ loginPage, page }) => {
    await expect(page).toHaveURL(/.*inventory.html/);
  });

  test('SCEE-2: should receive an error message with locked out user',
    { tag: ['@lockedUser'] }, async ({ loginPage }) => {
      await expect(loginPage.errorMessage).toBeVisible();
      await expect(loginPage.errorMessage).toContainText('Sorry, this user has been locked out.');
    });

  test('SCEE-3: should logout successfully from inventory page', async ({ loginPage, inventoryPage, page }) => {
    await inventoryPage.logout();
    await expect(page).toHaveURL(/.*www.saucedemo.com/);
    await expect(loginPage.loginButton).toBeVisible();
  });

  test('SCEE-18: should verify ui anomalies with problem user',
    { tag: ['@problemUser'] }, async ({ page }) => {
      test.fail(true, 'Bug: Images should show the actual products, but for this user, they all display a "dog" placeholder image.');

      const backpackImage = page
        .getByTestId('inventory-item')
        .filter({ hasText: 'Sauce Labs Backpack' })
        .getByRole('img');

      const imageSource = await backpackImage.getAttribute('src');
      expect(imageSource).toContain('/static/media/sauce-backpack-1200x1500.0a0b85a385945026062b.jpg');
    });

  test('SCEE-19: should verify functional failures with error user',
    { tag: ['@errorUser'] }, async ({ loginPage, inventoryPage }) => {
      test.fail(true, 'Bug: The button remains "Add to Cart" and does not update, or throws a console error.');
      await loginPage.login('error_user', 'secret_sauce');

      await inventoryPage.addProductToCart('Sauce Labs Backpack');
      await expect(inventoryPage.getRemoveButtonByProductName('Sauce Labs Backpack')).toBeVisible();

      await inventoryPage.addProductToCart('Sauce Labs Fleece Jacket');
      await expect(inventoryPage.getRemoveButtonByProductName('Sauce Labs Fleece Jacket')).toBeVisible();
    })
});