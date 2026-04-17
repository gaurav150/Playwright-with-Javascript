class LoginPage {
  constructor(page) {
    this.page = page;
    this.signInButton = page.locator("#login");
    this.emailField = page.locator("#userEmail");
    this.passwordField = page.locator("#userPassword");
  }

  async gotoPage(url) {
    await this.page.goto(url);
  }

  async loginToApp(email, password) {
    await this.emailField.fill(email);
    await this.passwordField.fill(password);
    await this.signInButton.click();
    await this.page.waitForLoadState("networkidle"); // Wait for the page to load completely
  }
}
module.exports = { LoginPage };
