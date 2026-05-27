const { test, expect } = require('@playwright/test');

test('Browser context playwright test', async ({ browser }) => {
    // Create a new browser context
    const context = await browser.newContext();
    const page = await context.newPage();

    // Navigate to login page
    await page.goto('https://rahulshettyacademy.com/client/#/auth/login');

    // Fill login credentials
    await page.locator('#userEmail').fill('rakeshfnptest5@gmail.com');
    await page.locator('#userPassword').fill('Federal#89');

    // Click Login button
    await page.locator('#login').click();

    // Wait for dashboard to load
    await page.waitForLoadState('networkidle');

    // Validate successful login
    await expect(page).toHaveURL(/dashboard/);
    console.log('Login Successful');
    // Wait for product titles to appear
    const productTitles = page.locator('.card-body b');
    await productTitles.first().waitFor();

    // Fetch all product titles
    const titles = await productTitles.allTextContents();

    // FIX: log variable, not string
    console.log(titles);
});
