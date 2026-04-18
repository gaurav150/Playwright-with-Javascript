const { Before, After, setDefaultTimeout, AfterStep } = require("@cucumber/cucumber");
// Load World first so setWorldConstructor runs before step definitions
require("./world");

// Default Cucumber step timeout is 5000 ms — e2e (goto, login) needs more.
setDefaultTimeout(120 * 1000);

const browserTimeout = 120 * 1000;

Before({ timeout: browserTimeout }, async function () {
  await this.startBrowser();
});

After(async function () {
  await this.stopBrowser();
});

AfterStep(async function ({ result }) {
  if (result.status === "FAILED") {
    await this.takeScreenshot();
  }
});
