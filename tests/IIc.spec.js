import {test, expect} from "@playwright/test";

test('PlayWright Special locators', async ({page}) => {
    await page.goto("https://rahulshettyacademy.com/angularpractice/");
    const pageTitle = await page.title();
    console.log(pageTitle);
    expect(pageTitle).toBe("ProtoCommerce");
    await page.getByLabel("Check me out if you Love IceCreams!").check(); // using label locator
    await page.getByLabel("Employed").check();
    await page.getByLabel("Gender").selectOption("Female");
    await page.getByPlaceholder("Password").fill("Abhishek@123");
    await page.getByRole("button", { name: "Submit" }).click();
    const isFormSubmitted = await page.getByText("Success! The Form has been submitted successfully!.").isVisible();
    console.log("Is form submitted -> " + isFormSubmitted);
    await page.getByRole("link", {name: "Shop"}).click();
    await page.pause();
    await page.locator("app-card").filter({hasText: "Nokia Edge"}).getByRole("button").click();
});