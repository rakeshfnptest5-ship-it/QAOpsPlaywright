const {test: fnplogin-base, expect} = require('@playwright/test');

const test = fnplogin-base.extend({
    testDataForOrder: {
        username: "rakeshfnptest7@gmail.com",
        password: "1234",
        productName: "ZARA COAT 3"
    }
});

module.exports = { test, expect };


