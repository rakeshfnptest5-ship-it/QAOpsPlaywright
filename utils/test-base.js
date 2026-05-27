const {test: baseTest, expect} = require('@playwright/test');

const test = baseTest.extend({
    testDataForOrder: {
        username: "tts@gmail.com",
        password: "Federal#89",
        productName: "ZARA COAT 3"
    }
});

module.exports = { test, expect };


