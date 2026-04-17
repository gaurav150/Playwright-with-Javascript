const { test, expect } = require("@playwright/test");
const { POManager } = require("../pageobjects/POManager");

test("Client App Test", async ({ page }) => {
  const userName = "abhishek03.sharma@example.com";
  const userPassword = "Abhishek@123";
  const productName = "ZARA COAT 3";
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
