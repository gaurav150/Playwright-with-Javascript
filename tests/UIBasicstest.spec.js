const {test, expect} = require('@playwright/test');


test('Browser context first PlayWright test', async ({browser}) => {
    // playwright code -
    // chrome - plugins/cookies
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto('https://www.rahulshettyacademy.com/loginpagePractise/');
    console.log(await page.title());
    await expect(page).toHaveTitle("LoginPage Practise | Rahul Shetty Academy");
    // await page.locator('#checkBoxOption1').check();
    // console.log(await page.locator('#checkBoxOption1').isChecked());
    await context.close();
});


test('First PlayWright test without browser context', async ({page}) => {

    await page.goto('https://www.google.com/');
    console.log(await page.title());
    // expect(await page.title()).toBe('Google');
    await expect(page).toHaveTitle("Google");
});

test('Logging in to the application with wrong credentials', async ({page}) => {
    await page.goto('https://www.rahulshettyacademy.com/loginpagePractise/');
    console.log(await page.title());
    await expect(page).toHaveTitle("LoginPage Practise | Rahul Shetty Academy");
    await page.locator('#username').fill('rahulshetty');
    await page.locator('#password').fill('learning');
    await page.locator('#signInBtn').click();
    console.log(await page.locator("[style*='block']").textContent());
    await expect(page.locator('.alert-danger')).toHaveText('Incorrect username/password.');
    await expect(page.locator("[style*='block']")).toContainText('Incorrect');
});

test('Logging in to the application with correct credentials', async ({page}) => {
    await page.goto('https://www.rahulshettyacademy.com/loginpagePractise/');
    console.log(await page.title());
    await expect(page).toHaveTitle("LoginPage Practise | Rahul Shetty Academy");
    const userName = page.locator('#username');
    const passWord = page.locator('#password');
    const signInBtn = page.locator('#signInBtn');
    const cardTitles = page.locator(".card-body a");
    await userName.fill("")
    await userName.fill('rahulshettyacademy');
    await passWord.fill("");
    await passWord.fill('Learning@830$3mK2');
    await signInBtn.click();
    console.log(await cardTitles.first().textContent());
    console.log(await cardTitles.nth(1).textContent()); // 1st and 2nd card
    // await expect(page.locator('.alert-danger')).toHaveText('Incorrect username/password.');
    // await expect(page.locator("[style*='block']")).toContainText('Incorrect');
    const allTitles = await cardTitles.allTextContents();
    console.log(allTitles);
});

test('UI Controls', async ({page}) => {
    await page.goto('https://www.rahulshettyacademy.com/loginpagePractise/');
    const userName = page.locator('#username');
    const passWord = page.locator('#password');
    const signInBtn = page.locator('#signInBtn');
    const dropdown = page.locator('select.form-control');
    const documentLink = page.locator("[href*='documents-request']");
    await userName.fill("rahulshettyacademy");
    await passWord.fill("Learning@830$3mK2");
    await dropdown.selectOption('consult');
    await page.locator('.radiotextsty').last().click(); // this is for selecting the last radio button
    // await page.locator('.radiotextsty').nth(1).click(); // this is for selecting the 2nd radio button
    await page.locator("#okayBtn").click();
    await expect(page.locator('.radiotextsty').last()).toBeChecked();
    await page.pause();
    await page.locator('#terms').check();
    await expect(page.locator('#terms')).toBeChecked();
    await page.locator('#terms').uncheck();
    await expect(page.locator('#terms')).not.toBeChecked();
    await expect(documentLink).toHaveAttribute('class', 'blinkingText');
    await signInBtn.click();
    // await documentLink.click();
    // console.log(await page.locator('.red').textContent());
});

test('Handling child windows', async ({browser}) => {

    const context = await browser.newContext();
    const page = await context.newPage();
    const userName = page.locator('#username');
    await page.goto('https://www.rahulshettyacademy.com/loginpagePractise/');
    const documentLink = page.locator("[href*='documents-request']");
    const [newPage] = await Promise.all(
        [
    context.waitForEvent('page'), // Wait for the new page to open after clicking the link
    documentLink.click(),
        ]);
    const text = await newPage.locator('.red').textContent();
    console.log("text is -> "+text);
    const arrayText = text.split('@');
    const domain = arrayText[1].split(' ')[0];
    console.log(domain);
    await userName.fill(domain);
    await page.pause();
    console.log("Username is -> " + await userName.inputValue());
    
});

