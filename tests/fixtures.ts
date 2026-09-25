import { test as base, Page } from '@playwright/test';
import { seConnecter } from './helpers/auth';

type Fixtures = {
  authenticatedPage: Page;
};

export const test = base.extend<Fixtures>({
  authenticatedPage: async ({ page }, use) => {

    // préparation
    await seConnecter(page);

    // fournit la page connectée au test
    await use(page);
    
  },
});

export { expect } from '@playwright/test';