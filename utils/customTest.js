// fixtures/customTest.js
const { test, expect } = require("@playwright/test");

exports.customTest = test.extend({
  testDataForOrder: {
    username: "abhishek03.sharma@example.com",
    password: "Abhishek@123",
    productName: "ZARA COAT 3",
  },
});
