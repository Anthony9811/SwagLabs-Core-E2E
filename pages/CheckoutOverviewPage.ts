import { Page } from "@playwright/test";
import { BasePage } from "./BasePage";


export class CheckoutOverviewPage extends BasePage {
  private readonly itemName;
  private readonly itemPrice;
  private readonly subtotal;
  private readonly tax;
  private readonly total;

  constructor(page: Page) {
    super(page);
    this.itemName = page.getByTestId('inventory-item-name');
    this.itemPrice = page.getByTestId('inventory-item-price');
    this.subtotal = page.getByTestId('subtotal-label');
    this.tax = page.getByTestId('tax-label');
    this.total = page.getByTestId('total-label');
  }

  get itemSubtotal() {
    return this.subtotal;
  }

  get itemTax() {
    return this.tax;
  }

  get itemTotal() {
    return this.total;
  }

  async getExpectedTotal(): Promise<number> {
    const subtotal = await this.getSubtotalAmount();
    const tax = parseFloat((subtotal * 0.08).toFixed(2));
    return subtotal + tax;
  }

  async getSubtotalAmount(): Promise<number> {
    const subTotalTag = await this.subtotal.textContent();
    return parseFloat(subTotalTag!.replace('Item total: $', ''));
  }

  async getActualTotalAmount(): Promise<number> {
    const text = await this.total.textContent();
    return parseFloat(text!.replace('Total: $', ''));
  }
}