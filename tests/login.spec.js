const { test, expect } = require('@playwright/test');

test('Browser context playwright test', async ({ browser }) => {
    // Create a new browser context
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto('https://rahulshettyacademy.com/loginpagePractise/');
    console.log(await page.title());

    // CSS selectors
    await page.locator('#username').fill('rahulshettyacademy1');
    await page.locator('#password').fill('learning');
    await page.locator('#signInBtn').click();
    
    await expect(page.locator('.alert-danger')).toBeVisible();
    console.log(await page.locator("[style*='block']").textContent());


    // Optional: wait for navigation or success message
    // await page.waitForNavigation();
});
