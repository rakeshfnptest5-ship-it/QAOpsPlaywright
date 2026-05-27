const { test, expect } = require('@playwright/test');

test('Browser context playwright test', async ({ browser }) => {
    // Create a new browser context
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto('https://rahulshettyacademy.com/loginpagePractise/');
    console.log(await page.title(".card-title a"));

    // CSS selectors
    await page.locator('#username').fill('rahulshettyacademy');
    await page.locator('#password').fill('learning');
    await page.locator('#signInBtn').click();

    
    
    console.log("login sucessfull");
    console.log(await page.locator(".card-title a").first().textContent());
    console.log(await page.locator(".card-title a").nth(1).textContent());


    // Optional: wait for navigation or success message
    // await page.waitForNavigation();
});
