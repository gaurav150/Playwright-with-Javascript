const { test, expect, request } = require("@playwright/test");
const { APIutils } = require("../utils/APIutils");
const loginPayLoad = {
  userEmail: "abhishek03.sharma@example.com",
  userPassword: "Abhishek@123",
};
const orderPayLoad = {
  orders: [{ country: "India", productOrderedId: "6960eac0c941646b7a8b3e68" }],
};

let response = {};
// beforeAll runs once per file: APIutils.createOrder() logs in (getToken) then creates an order;
// response holds { token, orderId } for injecting auth and matching the My Orders row.
test.beforeAll(async () => {
  const apiContext = await request.newContext();
  const apiUtils = new APIutils(apiContext, loginPayLoad);

  response = await apiUtils.createOrder(orderPayLoad);
  console.log("Order ID is -> " + response.orderId);
  console.log("Login response token is -> " + response.token);
});

test("@API Place the order", async ({ page }) => {
  await page.goto("https://rahulshettyacademy.com/client/");
  console.log(await page.title());

  await page.addInitScript((token) => {
    window.localStorage.setItem("token", token);
  }, response.token);

  await page.goto("https://rahulshettyacademy.com/client/");

  await page.locator("button[routerlink*='myorders']").click();
  await page.locator("tbody").waitFor();
  const rows = page.locator("tbody tr");

  for (let i = 0; i < (await rows.count()); ++i) {
    const rowOrderId = await rows.nth(i).locator("th").textContent();
    console.log("row order id is -> " + rowOrderId);
    if (response.orderId.includes(rowOrderId)) {
      await rows.nth(i).locator("button").first().click();
      break;
    }
  }
  const orderIdDetails = await page.locator(".col-text").textContent();
  expect(response.orderId.includes(orderIdDetails)).toBeTruthy();
});
