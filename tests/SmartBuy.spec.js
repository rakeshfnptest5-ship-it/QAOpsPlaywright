const { test, expect } = require('@playwright/test');

test('Browser context playwright test', async ({ browser }) => {
    // Create a new browser context
    const context = await browser.newContext();
    const page = await context.newPage();

    // Navigate to login page
    await page.goto('https://uat-new.fnp.com/gift-rewards-lp?jh=dbd');

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Wait for the personalization modal to appear
    await page.waitForSelector('input[placeholder*="incode"]');

     // Enter pincode in the input field - target by placeholder
    const pincodeInput = page.locator('input[placeholder*="incode"]');
    await pincodeInput.click();
    await pincodeInput.fill('110019');

    // Wait for location to be displayed
    await page.waitForTimeout(3000);

    // Fill login credentials
    //await page.locator('#userEmail').fill('rakeshfnptest5@gmail.com');
    //await page.locator('#userPassword').fill('Federal#89');

    // Verify pincode was entered
    await expect(pincodeInput).toHaveValue('110019'); 

    // Wait for login modal to appear
    await page.waitForSelector('input[placeholder*="email"]');

    // Enter email address
    const emailInput = page.locator('input[placeholder*="email"]');
    await emailInput.click();
    await emailInput.fill('fnpdemouser@gmail.com');

    // Click Continue button
    await page.locator('button:has-text("Continue")').click();

    // Wait for OTP input to appear
    await page.waitForTimeout(1500);
    await page.waitForSelector('input[placeholder*="OTP"], input[placeholder*="otp"], input[type="text"]');

    // Enter OTP
    const otpInput = page.locator('input[placeholder*="OTP"], input[placeholder*="otp"]').first();
    await otpInput.click();
    await otpInput.fill('1234');

    // Wait for verification to complete
    await page.waitForTimeout(3000);

    // Close the context
    await context.close();
});