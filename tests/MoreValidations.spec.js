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

test("Screenshot and Visuals Comparison", async ({ page }) => {
  await page.goto("https://www.rahulshettyacademy.com/AutomationPractice/");
  await expect(page.locator("#displayed-text")).toBeVisible();
  await page.locator("#displayed-text").screenshot({ path: "element.png" }); // to take a screenshot of the element
  await page.locator("#hide-textbox").click();
  await page.screenshot({ path: "screenshot.png", fullPage: true }); // to take a screenshot of the page
  await expect(page.locator("#displayed-text")).toBeHidden();
});

test.skip("Visual Comparison", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto("https://www.flightaware.com/", { waitUntil: "load" });
  await page
    .getByRole("button", { name: "Allow All" })
    .click({ timeout: 5000 })
    .catch(() => {});
  await page.locator("main").waitFor({ state: "visible" });
  // External sites keep loading images/tiles; fullPage height changes between stabilization shots → instability.
  // Viewport-only + mask the live map keeps dimensions and pixels stable enough for toHaveScreenshot.
  await expect(page).toHaveScreenshot("flightaware.png", {
    fullPage: false,
    mask: [page.getByRole("region", { name: "Map" })],
    maxDiffPixels: 40_000,
    threshold: 0.35,
    timeout: 30_000,
  });
});
