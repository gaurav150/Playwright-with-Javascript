const { expect } = require("@playwright/test");
class CartPage {
  constructor(page) {
    this.page = page;
    this.productsText = page.locator(".card-body b");
    this.cart = page.locator("[routerlink*='cart']");
    this.orders = page.locator("button[routerlink*='myorders']");
    this.checkout = page.locator("text=Checkout");
  }

  async VerifyProductIsDisplayed(productName) {
    // Cart line items use headings — not generic div li (empty cart / nav break that selector).
    await expect(this.getProductLocator(productName)).toBeVisible({
      timeout: 20_000,
    });
  }

  async Checkout() {
    await this.checkout.click();
  }

  getProductLocator(productName) {
    return this.page.locator("h3:has-text('" + productName + "')");
  }
}
module.exports = { CartPage };
