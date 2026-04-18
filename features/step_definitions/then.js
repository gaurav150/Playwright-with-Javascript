const { Then } = require("@cucumber/cucumber");
const { expect } = require("@playwright/test");

Then(
  "the user verifies that {string} is displayed in the Cart",
  async function (productName) {
    const cartPage = this.poManager.getCartPage();
    await cartPage.VerifyProductIsDisplayed(productName);
    await cartPage.Checkout();
  },
);

Then(
  "the user verifies that the order is present in the order history with the correct product name {string}",
  async function (productName) {
    const dashboardPage = this.poManager.getDashboardPage();
    await dashboardPage.navigateToOrders();
    const ordersHistoryPage = this.poManager.getOrdersHistoryPage();
    await ordersHistoryPage.searchOrderAndSelect(this.orderId);
    expect(this.orderId.includes(await ordersHistoryPage.getOrderId())).toBeTruthy();
  },
);
