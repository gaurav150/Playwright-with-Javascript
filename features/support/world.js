const { setWorldConstructor, World } = require("@cucumber/cucumber");
const { chromium } = require("@playwright/test");
const { POManager } = require("../../pageobjects/POManager");

class PlaywrightWorld extends World {
  constructor(options) {
    super(options);
    this.browser = undefined;
    this.context = undefined;
    this.page = undefined;
    this.poManager = undefined;
    this.orderId = undefined;
  }

  async startBrowser() {
    this.browser = await chromium.launch({ headless: false });
    this.context = await this.browser.newContext();
    this.page = await this.context.newPage();
    this.poManager = new POManager(this.page);
  }

  async stopBrowser() {
    if (this.context) {
      await this.context.close();
      this.context = undefined;
    }
    if (this.browser) {
      await this.browser.close();
      this.browser = undefined;
    }
    this.page = undefined;
    this.poManager = undefined;
  }
}

setWorldConstructor(PlaywrightWorld);

module.exports = { PlaywrightWorld };
