const { test, expect } = require('@playwright/test');

test('Browser context playwright test', async ({ browser }) => {
    // Open browser context
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
    console.log(await page.title());
});

test('Page playwright test', async ({ page }) => {
    await page.goto("https://www.facebook.com");

    // Get title
    const title = await page.title();
    console.log(title);

    // Assertion 

    //await expect(page).toHaveTitle("Facebook – log in or sign up");
    //css and xpath
   await page.locator('#username').fill("rahulshettyacademy");
   await page.locator('#password').fill("learning");
   await page.locator('#signInBtn').click();


});
