import { Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class InventoryPage extends BasePage {
  readonly inventoryItems;
  readonly productSort;

  constructor(page: Page) {
    super(page);
    this.inventoryItems = page.getByTestId('inventory-item');
    this.productSort = page.getByTestId('product-sort-container');
  }

  async addProductToCart(productName: string) {
    this.inventoryItems.filter({ hasText: productName })
      .getByRole('button', { name: 'Add to cart' })
      .click();
  }

  /**
   * @param option takes 'az', 'za', 'lohi', 'hilo' as values
   * @param: 'az' - Name (A to Z)
   * @param: 'za' - Name (Z to A)
   * @param: 'lohi' - Price (low to high)
   * @param: 'hilo' - Price (high to low)
  */
  async sortBy(option: string){ 
    await this.productSort.selectOption(option);
  }

  async openProductDetails(productName: string) {
    this.inventoryItems.filter({ hasText: productName })
      .getByTestId('inventory-item-name')
      .click();
  }

  getItemPriceByIndex(index: number){
    return this.inventoryItems.nth(index).getByTestId('inventory-item-price');
  }

  getButtonByProductName(productName: string) {
    return this.inventoryItems
      .filter({ hasText: productName })
      .getByRole('button', { name: /remove/i }) //The i is to ignore whether it's uppercase or lowercase
  }

  
}