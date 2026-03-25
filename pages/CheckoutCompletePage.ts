import { Page } from "@playwright/test";

export class CheckoutCompletePage {
  private readonly homeButton;
  readonly successTitle;
  readonly successImage;

  constructor(page: Page) {
    this.successImage = page.getByTestId('pony-express')
    this.successTitle = page.getByTestId('complete-header');
    this.homeButton = page.getByTestId('back-to-products');
  }

  async goBackToHome() {
    await this.homeButton.click();
  }
}