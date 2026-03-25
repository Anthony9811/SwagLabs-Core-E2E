import { Page } from "@playwright/test";
import { BasePage } from "./BasePage";


export class CheckoutPage extends BasePage {
  private readonly firstNameField;
  readonly lastNameField;
  private readonly postalCodeField;
  private readonly continueButton;
  private readonly cancelButton;

  constructor(page: Page) {
    super(page);
    this.firstNameField = page.getByTestId('firstName');
    this.lastNameField = page.getByTestId('lastName');
    this.postalCodeField = page.getByTestId('postalCode');
    this.continueButton = page.getByTestId('continue');
    this.cancelButton = page.getByTestId('cancel');
  }

  async checkout(firstName: string, lastName: string, zipCode: string) {
    await this.firstNameField.fill(firstName);
    await this.lastNameField.fill(lastName);
    await this.postalCodeField.fill(zipCode);
    await this.continueButton.click();
  }

  async cancelCheckout() {
    await this.cancelButton.click();
  }
}