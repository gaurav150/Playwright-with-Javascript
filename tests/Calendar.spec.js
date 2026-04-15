const {test, expect} = require("@playwright/test");

test.only('Calendar Validation Test', async ({page}) => {
    await page.goto("https://rahulshettyacademy.com/seleniumPractise/#/offers");
    const monthNumber = "5"; // June (0-based index)
    const year = "2024";
    const date = "15";
    const expectedList = [monthNumber, date, year];
    const datePicker = page.locator(".react-date-picker__inputGroup")
    const monthDropdown = page.locator(".react-calendar__year-view__months__month");
    await datePicker.click();
    await page.locator(".react-calendar__navigation__label").first().waitFor();
    await page.locator(".react-calendar__navigation__label").click();
    await page.locator(".react-calendar__navigation__label").click();
    await page.getByText(year).click();
    await monthDropdown.nth(parseInt(monthNumber)-1).click();
    await page.locator("//abbr[text()='"+date+"']").click();

    const selectedDateInputs = page.locator(".react-date-picker__inputGroup__input");

    // const selectedMonth = await selectedDateInputs.nth(0).inputValue();
    // const selectedDate = await selectedDateInputs.nth(1).inputValue();
    // const selectedYear = await selectedDateInputs.nth(2).inputValue();
    // console.log("Selected month is -> " + selectedMonth);
    // console.log("Selected date is -> " + selectedDate);
    // console.log("Selected year is -> " + selectedYear);
    // expect(selectedMonth).toBe(monthNumber);
    // expect(selectedDate).toBe(date);
    // expect(selectedYear).toBe(year);

    // Alternative way to validate the selected date
    for (let i = 0; i < expectedList.length; ++i) {
        await selectedDateInputs.nth(i).waitFor();
        selectedDateInputs.nth(i).evaluate((element, expectedValue) => {
            if (element.value !== expectedValue) {
                throw new Error(`Expected value: ${expectedValue}, but got: ${element.value}`);
            }
        }, expectedList[i]);
    }

});