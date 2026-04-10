import { test as base } from './BaseFixtures';
import { ProductDetailPage } from '../pages/ProductDetailPage';

type InventoryFixtures = {
  productDetailsPage: ProductDetailPage;
  preparedInventoryState: void;
};

export const test = base.extend<InventoryFixtures>({
  productDetailsPage: async ({ page }, use) => {
    await use(new ProductDetailPage(page));
  },

  preparedInventoryState: [async ({ loggedInState}, use) => {
    await use();
  }, { auto: true }],

});

export { expect } from './BaseFixtures';