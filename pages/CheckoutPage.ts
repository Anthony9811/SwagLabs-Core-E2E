import { Page } from "@playwright/test";
import { BasePage } from "./BasePage";


export class CheckoutPage extends BasePage {
  private readonly firstNameField;
  private readonly lastNameField;
  private readonly postalCodeField;
  private readonly continueButton;

  constructor(page: Page) {
    super(page);
    this.firstNameField = page.getByTestId('firstName');
    this.lastNameField = page.getByTestId('lastName');
    this.postalCodeField = page.getByTestId('postalCode');
    this.continueButton = page.getByTestId('continue');
  }

  async checkout(firstName: string, lastName: string, zipCode: string) {
    await this.firstNameField.fill(firstName);
    await this.lastNameField.fill(lastName);
    await this.postalCodeField.fill(zipCode);
    await this.continueButton.click();
  }
}