const { test, expect } = require("@playwright/test");
const { customTest } = require("../utils/customTest");
const { POManager } = require("../pageobjects/POManager");
// JSON -> String ->  JS Object
const dataset = JSON.parse(
  JSON.stringify(require("../utils/placeorderTestData.json")),
);
for (let data of dataset) {
  test(`Client App Test - ${data.productName}`, async ({ page }) => {
    const userName = data.username;
    const userPassword = data.password;
    const productName = data.productName;
    const poManager = new POManager(page);

    const loginPage = poManager.getLoginPage();
    await loginPage.gotoPage("https://rahulshettyacademy.com/client/");
    await loginPage.loginToApp(userName, userPassword);
    const dashboardPage = poManager.getDashboardPage();
    await dashboardPage.searchProductAddToCart(productName);
    await dashboardPage.navigateToCart();

    const cartPage = poManager.getCartPage();
    await cartPage.VerifyProductIsDisplayed(productName);
    await cartPage.Checkout();

    const ordersReviewPage = poManager.getOrdersReviewPage();
    await ordersReviewPage.searchCountryAndSelect("ind", "India");
    const orderId = await ordersReviewPage.SubmitAndGetOrderId();
    console.log(orderId);
    await dashboardPage.navigateToOrders();
    const ordersHistoryPage = poManager.getOrdersHistoryPage();
    await ordersHistoryPage.searchOrderAndSelect(orderId);
    expect(orderId.includes(await ordersHistoryPage.getOrderId())).toBeTruthy();
  });

  customTest(
    `Client App Test fixtures for ${data.productName}`,
    async ({ page, testDataForOrder }) => {
      const userName = testDataForOrder.username;
      const userPassword = testDataForOrder.password;
      const productName = testDataForOrder.productName;
      const poManager = new POManager(page);

      const loginPage = poManager.getLoginPage();
      await loginPage.gotoPage("https://rahulshettyacademy.com/client/");
      await loginPage.loginToApp(userName, userPassword);
      const dashboardPage = poManager.getDashboardPage();
      await dashboardPage.searchProductAddToCart(productName);
      await dashboardPage.navigateToCart();

      const cartPage = poManager.getCartPage();
      await cartPage.VerifyProductIsDisplayed(productName);
      await cartPage.Checkout();
    },
  );
}
