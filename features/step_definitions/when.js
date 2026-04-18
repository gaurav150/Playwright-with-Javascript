const { When } = require("@cucumber/cucumber");

When("the user adds {string} to the Cart", async function (productName) {
  const dashboardPage = this.poManager.getDashboardPage();
  await dashboardPage.searchProductAddToCart(productName);
  await dashboardPage.navigateToCart();
});

When(
  "the user proceeds to checkout and fills in valid details",
  async function () {
    const ordersReviewPage = this.poManager.getOrdersReviewPage();
    await ordersReviewPage.searchCountryAndSelect("ind", "India");
    this.orderId = await ordersReviewPage.SubmitAndGetOrderId();
    console.log(this.orderId);
  },
);
