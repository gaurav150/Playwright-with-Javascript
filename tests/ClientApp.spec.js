const { test, expect } = require("@playwright/test");

test("Logging into the new page and register with new credentials", async ({
  page,
}) => {
  await page.goto("https://rahulshettyacademy.com/client/#/auth/login");
  console.log(await page.title());
  const registerLink = page.locator(".text-reset");
  const firstName = page.locator("#firstName");
  const lastName = page.locator("#lastName");
  const email = page.locator("#userEmail");
  const phoneNumber = page.locator("#userMobile");
  const password = page.locator("#userPassword");
  const confirmPassword = page.locator("#confirmPassword");
  const loginBtnDuringAcccountcreation = page.locator(".login-wrapper button");
  const loginBtn = page.locator("#login");
  await registerLink.click();
  await firstName.fill("abhishek");
  await lastName.fill("sharma");
  await email.fill("abhishek06.sharma@example.com");
  await phoneNumber.fill("1234567890");
  await password.fill("Abhishek@123");
  await confirmPassword.fill("Abhishek@123");
  await page.locator('[type$="checkbox"]').check();
  await page.locator('[type$="submit"]').click();
//   const accountCreationMessage = await page.locator(".login-wrapper h1").textContent();
//   console.log("Account creation message is -> " + accountCreationMessage.trim());
//   expect(accountCreationMessage.trim()).toBe(
//     "Account Created Successfully",
//   );
  await loginBtnDuringAcccountcreation.click();
  await email.fill("");
  await email.fill("abhishek03.sharma@example.com");
  await password.fill("");
  await password.fill("Abhishek@123");
  await loginBtn.click();
  // await expect(page.locator('.toast-message')).toHaveText('Login Successfully');
  console.log(await page.locator(".card-body b").first().textContent());

  // await page.pause(); to pause the test execution and inspect the page
  // await expect(page.locator('.toast-message')).toHaveText('Registration successful');
});

test("Logging in with existing credentials", async ({ page }) => {
  await page.goto("https://rahulshettyacademy.com/client/");
  console.log(await page.title());
  const email = page.locator("#userEmail");
  const password = page.locator("#userPassword");
  const loginBtn = page.locator("#login");
  const products = page.locator(".card-body");
  const productName = "ZARA COAT 3";
  const cartButton = page.locator(".btn-custom[routerlink*='cart']");
  const monthDropdown = page.locator("select.ddl").nth(0);
  const dateDropdown = page.locator("select.ddl").nth(1);
  await email.fill("abhishek03.sharma@example.com");
  await password.fill("");
  await password.fill("Abhishek@123");
  await loginBtn.click();
  await page.waitForLoadState("networkidle"); // Wait for the page to load completely
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
    .pressSequentially("ind");
  const options = page.locator(".ta-results");
  await options.waitFor();
  const countryOptions = await options.locator("button").allTextContents();
  console.log(countryOptions);
  const optionCount = await options.locator("button").count();
  for (let i = 0; i < optionCount; ++i) {
    const text = await options.locator("button").nth(i).textContent();
    if (text.trim() === "India") {
      await options.locator("button").nth(i).click();
      break;
    }
  }
  const userEmail = await page.locator(".user__name label").textContent();
  console.log("Email is -> " + userEmail.trim());
  expect(userEmail).toBe("abhishek03.sharma@example.com");
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
