class DashboardPage {
  constructor(page) {
    this.page = page;
    this.products = page.locator(".card-body");
    this.productsText = page.locator(".card-body b");
    this.cartButton = page.locator(".btn-custom[routerlink*='cart']");
    this.orders = page.locator("button[routerlink*='myorders']");
  }

  async searchProductAddToCart(productName) {
    await this.productsText.first().waitFor(); // Wait for the first card to be visible
    const allTitles = await this.productsText.allTextContents();
    console.log(allTitles);
    const count = await this.products.count();
    console.log("count is -> " + count);
    for (let i = 0; i < count; ++i) {
      if (
        (await this.products.nth(i).locator("b").textContent()) === productName
      ) {
        await this.products.nth(i).locator("text= Add To Cart").click();
        break;
      }
    }
  }

  async navigateToCart() {
    await this.cartButton.click();
  }

  async navigateToOrders() {
    await this.orders.click();
  }
}
module.exports = { DashboardPage };
