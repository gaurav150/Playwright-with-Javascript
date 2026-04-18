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
    // Avoid networkidle (SPAs often never go idle); wait for post-login UI.
    await this.page
      .getByRole("button", { name: "Sign Out" })
      .waitFor({ state: "visible", timeout: 60_000 });
  }
}
module.exports = { LoginPage };
