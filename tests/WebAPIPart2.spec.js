const { test, expect } = require("@playwright/test");

let webContext;
test.beforeAll(async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto("https://rahulshettyacademy.com/client/");
  console.log(await page.title());
  const email = page.locator("#userEmail");
  const password = page.locator("#userPassword");
  const loginBtn = page.locator("#login");
  await email.fill("abhishek03.sharma@example.com");
  await password.fill("");
  await password.fill("Abhishek@123");
  await loginBtn.click();
  // Avoid networkidle — SPAs often never go idle; wait for authenticated UI instead.
  await expect(page.getByRole("button", { name: "Sign Out" })).toBeVisible();
  await expect(page.locator(".card-body").first()).toBeVisible();
  await context.storageState({ path: "state.json" });
  await context.close();
  webContext = await browser.newContext({ storageState: "state.json" });
});

test("Logging in with existing credentials", async () => {
  const page = await webContext.newPage();
  await page.goto("https://rahulshettyacademy.com/client/");
  const products = page.locator(".card-body");
  const productName = "ZARA COAT 3";
  const cartButton = page.locator(".btn-custom[routerlink*='cart']");
  const monthDropdown = page.locator("select.ddl").nth(0);
  const dateDropdown = page.locator("select.ddl").nth(1);

  await page.locator(".card-body b").first().waitFor(); // Wait for the first card to be visible
  const allTitles = await page.locator(".card-body b").allTextContents();
  console.log(allTitles);
  const count = await products.count();
  console.log("count is -> " + count);
  for (let i = 0; i < count; ++i) {
    if ((await products.nth(i).locator("b").textContent()) === productName) {
      await products.nth(i).locator("text= Add To Cart").click();
      break;
    }
  }
  await cartButton.click();
  await page.locator("div li").first().waitFor();
  const bool = await page.locator("h3:has-text('ZARA COAT 3')").isVisible();
  expect(bool).toBeTruthy();
  await page.locator("text=Checkout").click();
  await monthDropdown.selectOption("12");
  await dateDropdown.selectOption("20");
  await page
    .locator("input[placeholder='Select Country']")
    .pressSequentially("ind", { delay: 50 });
  const indiaOption = page.locator(".ta-results button", { hasText: "India" }).first();
  await expect(indiaOption).toBeVisible({ timeout: 20_000 });
  await indiaOption.click();
  const userEmail = await page.locator(".user__name label").textContent();
  console.log("Email is -> " + userEmail.trim());
  expect(userEmail.trim()).toBe("abhishek03.sharma@example.com");
  await page.locator(".actions a.btnn").click();
  const headerText = await page.locator("h1").textContent();
  console.log("Header text is -> " + headerText.trim());
  expect(headerText.trim()).toBe("Thankyou for the order.");
  const rawOrderId = await page
    .locator(".em-spacer-1 .ng-star-inserted")
    .textContent();
  const cleanedOrderId = rawOrderId.replace(/\|/g, "").trim();
  console.log("Order ID is -> " + cleanedOrderId);

  await page.locator("button[routerlink*='myorders']").click();
  await expect(page.locator("tbody")).toBeVisible({ timeout: 20_000 });
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
});
