import { test as base } from './BaseFixtures';

type AuthFixtures = {
  preparedAuthState: void;
};

export const test = base.extend<AuthFixtures>({
  preparedAuthState: [async ({ loggedInState }, use) => {
    await use();
  }, { auto: true }],
});

export { expect } from './BaseFixtures';