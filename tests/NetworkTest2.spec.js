const { test, expect, request } = require("@playwright/test");
const { APIutils } = require("./utils/APIutils");
const loginPayLoad = {
  userEmail: "abhishek03.sharma@example.com",
  userPassword: "Abhishek@123",
};
const orderPayLoad = {
  orders: [{ country: "India", productOrderedId: "6960eac0c941646b7a8b3e68" }],
};
let response = {};
// beforeAll runs once per file: build API request context, log in, create an order via APIutils.
// createOrder() calls getToken() then POST /order/create-order; result has { token, orderId } for tests.
test.beforeAll(async () => {
  const apiContext = await request.newContext();
  const apiUtils = new APIutils(apiContext, loginPayLoad);

  response = await apiUtils.createOrder(orderPayLoad);
  console.log("Order ID is -> " + response.orderId);
  console.log("Login response token is -> " + response.token);
});

test("Security test request interception", async ({ page }) => {
  await page.goto("https://rahulshettyacademy.com/client/");
  console.log(await page.title());

  await page.addInitScript((token) => {
    window.localStorage.setItem("token", token);
  }, response.token);

  await page.goto("https://rahulshettyacademy.com/client/");

  page.route(
    "https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=*",
    async (route) => {
      // Intercept the real API call and continue with a rewritten URL (different order id).
      // The server still responds; this is not route.fulfill() with a fake body.
      await route.continue({
        url: "https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=69e0ea83f86ba51a656b6fc2",
      });
    },
  );
  await page.locator("button[routerlink*='myorders']").click();
  await page.getByRole("button", { name: "View" }).first().click();

  await expect(page.locator(".blink_me")).toHaveText("You are not authorize to view this order");

});
