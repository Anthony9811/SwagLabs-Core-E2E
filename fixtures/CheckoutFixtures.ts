import { test as base } from './BaseFixtures';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { CheckoutOverviewPage } from '../pages/CheckoutOverviewPage';
import { CheckoutCompletePage } from '../pages/CheckoutCompletePage';

type CheckoutFixtures = {
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
  checkoutOverviewPage: CheckoutOverviewPage;
  checkoutCompletePage: CheckoutCompletePage;
  preparedCheckoutState: void; // Logic-only fixture
};

export const test = base.extend<CheckoutFixtures>({
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },
  checkoutOverviewPage: async ({ page }, use) => {
    await use(new CheckoutOverviewPage(page));
  },
  checkoutCompletePage: async ({ page }, use) => {
    await use(new CheckoutCompletePage(page));
  },

  // This fixture encapsulates the setup logic
  preparedCheckoutState: [async ({ loggedInState, inventoryPage }, use, testInfo) => {
    if (!testInfo.tags.includes('@skipAddingProduct')) {
      await inventoryPage.addProductToCart('Sauce Labs Backpack');
    }

    await use();
  }, { auto: true }], // to make it run automatically
});

export { expect } from './BaseFixtures';