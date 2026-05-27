const { test, expect } = require('@playwright/test');

test('Browser context playwright test', async ({ browser }) => {
    // Create a new browser context
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto('https://rahulshettyacademy.com/loginpagePractise/');

    // Page title
    console.log(await page.title());

    // Login
    await page.locator('#username').fill('rahulshettyacademy');
    await page.locator('#password').fill('learning');
    await page.locator('#signInBtn').click();

    // Wait for products page to load
    await page.waitForSelector('.card-title a');

    console.log('Login successful');

    // Locator for all card titles
    const cardTitles = page.locator('.card-title a');

    // First and second product title
    console.log(await cardTitles.first().textContent());
    console.log(await cardTitles.nth(1).textContent());

    // All product titles
    const allTitles = await cardTitles.allTextContents();
    console.log(allTitles);
});
