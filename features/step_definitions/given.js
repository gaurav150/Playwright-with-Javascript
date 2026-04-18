const { Given } = require("@cucumber/cucumber");

Given(
  "the user has been logged in to the Ecommerce website with {string} and {string}",
  async function (username, password) {
    const loginPage = this.poManager.getLoginPage();
    await loginPage.gotoPage("https://rahulshettyacademy.com/client/");
    await loginPage.loginToApp(username, password);
  },
);
