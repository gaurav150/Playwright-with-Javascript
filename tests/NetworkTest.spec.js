const { test, expect, request } = require("@playwright/test");
const { APIutils } = require("../utils/APIutils");
const loginPayLoad = {
  userEmail: "abhishek03.sharma@example.com",
  userPassword: "Abhishek@123",
};
const orderPayLoad = {
  orders: [{ country: "India", productOrderedId: "6960eac0c941646b7a8b3e68" }],
};
const fakePayLoadOrders = { data: [], message: "No Orders" };
let response = {};
// beforeAll hook will run before all the tests in this file and it will run only once.
// It is used to perform some setup operations before running the tests.
// For example, we can use beforeAll hook to log in to the application before running the tests.
test.beforeAll(async () => {
  // Login API — must run first so we have a token for create-order
  const apiContext = await request.newContext();
  const apiUtils = new APIutils(apiContext, loginPayLoad);

  // Create Order API — must run after login to get the token
  response = await apiUtils.createOrder(orderPayLoad);
  console.log("Order ID is -> " + response.orderId);
  console.log("Login response token is -> " + response.token);
});

//create order is success
test("@SP Place the order", async ({ page }) => {
  await page.goto("https://rahulshettyacademy.com/client/");
  console.log(await page.title());

  await page.addInitScript((token) => {
    window.localStorage.setItem("token", token);
  }, response.token);

  await page.goto("https://rahulshettyacademy.com/client/");

  page.route(
    "https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*",
    async (route) => {
      const response = await page.request.fetch(route.request());
      let body = JSON.stringify(fakePayLoadOrders);
      route.fulfill({
        response,
        body,
      });
      //intercepting response -APi response-> { playwright fakeresponse}->browser->render data on front end
    },
  );
  await page.locator("button[routerlink*='myorders']").click();
  await page.waitForResponse(
    "https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*",
  );

  console.log(await page.locator(".mt-4").textContent());
});
