import { Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class ProductDetailPage extends BasePage{ 
  readonly itemName;
  readonly itemDescription;
  readonly itemPrice;
  readonly addToCartButton;
  readonly removeButton;

  constructor(page:Page){
    super(page);
    this.itemName = page.getByTestId('inventory-item-name');
    this.itemDescription = page.getByTestId('inventory-item-desc');
    this.itemPrice = page.getByTestId('inventory-item-price');
    this.addToCartButton = page.getByTestId('add-to-cart');
    this.removeButton = page.getByTestId('remove');
  }
}