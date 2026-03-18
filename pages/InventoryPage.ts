import { Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class InventoryPage extends BasePage {
  readonly productContainer;
  constructor(page:Page){
    super(page);
    this.productContainer = page.getByTestId('inventory-item');
  }

  async addProductToCart(productName:string) {
    this.productContainer.filter({ hasText: productName })
    .getByRole('button', {name: 'Add to cart'})
    .click();
  }

  getButtonByProductName(productName:string){
    return this.productContainer
    .filter({ hasText: productName })
    .getByRole('button', { name:  /remove/i}) //The i is to ignore whether it's uppercase or lowercase
  }
}