import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';

type RootFixtures = {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  loggedInState: void;
};

export const test = base.extend<RootFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  inventoryPage: async ({ page }, use) => {
    await use(new InventoryPage(page));
  },
  loggedInState: async ({ loginPage, inventoryPage }, use, testInfo) => {
    await loginPage.navigateTo();

    let username = 'standard_user';

    if (testInfo.tags.includes('@errorUser')) {
      username = 'error_user';
    } 
    else if (testInfo.tags.includes('@problemUser')) {
      username = 'problem_user';
    }
    else if (testInfo.tags.includes('@lockedUser')) {
      username = 'locked_out_user';
    }

    await loginPage.login(username, 'secret_sauce');

    await use();
  },
});

export { expect } from '@playwright/test';