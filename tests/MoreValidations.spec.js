const { test, expect } = require("@playwright/test");

test("Popup Validations", async ({ page }) => {
  await page.goto("https://www.rahulshettyacademy.com/AutomationPractice/");
  // await page.goto("http://google.com/");
  // await page.goBack(); // to go back to the previous page
  // await page.goForward(); // to go forward to the next page
  // await page.reload(); // to reload the page
  await expect(page.locator("#displayed-text")).toBeVisible();
  await page.locator("#hide-textbox").click();
  await expect(page.locator("#displayed-text")).toBeHidden();
  page.on("dialog", (dialog) => dialog.accept()); //to accept the alert
  // page.on("dialog", dialog => dialog.dismiss()); // to dismiss the alert
  await page.locator("#confirmbtn").click();
  await page.locator("#mousehover").hover();
  const framesPage = page.frameLocator("#courses-iframe");
  await framesPage.locator("li a[href*='lifetime-access']:visible").click();
  await framesPage.locator(".text h2").waitFor();
  const text = await framesPage.locator(".text h2").textContent();
  console.log("Text is -> " + text);
  console.log(text.split(" ")[1].trim());
});
