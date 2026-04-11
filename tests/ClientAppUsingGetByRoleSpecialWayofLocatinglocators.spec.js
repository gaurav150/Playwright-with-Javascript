const { test, expect } = require("@playwright/test");


test.only("Logging in with existing credentials using GetByRole", async ({ page }) => {
  await page.goto("https://rahulshettyacademy.com/client/");
  console.log(await page.title());
  const emailIdValue = "abhishek03.sharma@example.com";
  const passwordValue = "Abhishek@123";
  const email = page.getByPlaceholder("email@example.com");
  const password = page.getByPlaceholder("enter your passsword");
  const loginBtn = page.getByRole("button", {name: "Login"});
  const products = page.locator(".card-body");
  const productName = "ZARA COAT 3";
  const cartButton = page.getByRole("listitem").getByRole("button", {name: "Cart"});
  const monthDropdown = page.locator("select.ddl").nth(0);
  const dateDropdown = page.locator("select.ddl").nth(1);
  await email.fill(emailIdValue);
  await password.fill("");
  await password.fill(passwordValue);
  await loginBtn.click();
  await page.waitForLoadState("networkidle"); // Wait for the page to load completely
  await page.locator(".card-body b").first().waitFor(); // Wait for the first card to be visible
  const allTitles = await page.locator(".card-body b").allTextContents();
  console.log(allTitles);
  const count = await products.count();
  console.log("count is -> " + count);
  await products.filter({hasText: productName})
  .getByRole("button", {name: "Add To Cart"}).click();
  await cartButton.click();
  await page.locator("div li").first().waitFor();
  await expect(page.getByText(productName)).toBeVisible();
  await page.getByText("Checkout").click(); //await page.getByRole("button", {name: "Checkout"}).click(); both will do same operation.
  await monthDropdown.selectOption("12");
  await dateDropdown.selectOption("20");
  await page.getByPlaceholder("Select Country").pressSequentially("ind");
  const options = page.locator(".ta-results");
  await options.waitFor();
  const countryOptions = await options.locator("button").allTextContents();
  console.log(countryOptions);
  await page.getByRole("button", {name: "India"}).nth(1).click();
  const userEmail = await page.locator(".user__name label").textContent();
  console.log("Email is -> " + userEmail.trim());
  expect(userEmail).toBe(emailIdValue);
  await page.locator(".actions a.btnn").click();
  const headerText = await page.locator("h1").textContent();
  console.log("Header text is -> " + headerText.trim());
  expect(page.getByText("Thankyou for the order.")).toBeVisible();
  const rawOrderId = await page
    .locator(".em-spacer-1 .ng-star-inserted")
    .textContent();
  const cleanedOrderId = rawOrderId.replace(/\|/g, "").trim();
  console.log("Order ID is -> " + cleanedOrderId);

  await page.locator("button[routerlink*='myorders']").click();
  await page.locator("tbody").waitFor();
  const rows = page.locator("tbody tr");

  for (let i = 0; i < (await rows.count()); ++i) {
    const rowOrderId = await rows.nth(i).locator("th").textContent();
    if (cleanedOrderId.includes(rowOrderId)) {
      await rows.nth(i).locator("button").first().click();
      break;
    }
  }
  const orderIdDetails = await page.locator(".col-text").textContent();
  expect(cleanedOrderId.includes(orderIdDetails)).toBeTruthy();
  // we are going to buy a product - let's say we want to buy ZARA COAT 3
});
