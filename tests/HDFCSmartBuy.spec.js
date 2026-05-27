const { test, expect } = require('@playwright/test');

test("HDFC SmartBuy", async ({ page }) => {
  await page.goto("https://www.fnp.com/gift-rewards-lp");

  // Enter pincode
  await page.getByTestId('locationLock').getByTestId('input_field').click();
  await page.getByTestId('locationLock').getByTestId('input_field').fill('110018');
  await page.locator('#location-and-country-popup').getByRole('button', { name: 'button' }).click();

  // Dismiss "Stay Updated" popup if it appears
  try {
    await page.getByRole('button', { name: 'No, Thanks' }).click({ timeout: 5000 });
  } catch (e) {}

  // Navigate to Birthday Gifts
  await page.getByRole('link', { name: 'Birthday Gifts Birthday', exact: true }).click();
  await page.waitForLoadState('networkidle');

  // Re-enter pincode if modal appears again
  try {
    await page.getByTestId('locationLock').getByTestId('input_field').click({ timeout: 5000 });
    await page.getByTestId('locationLock').getByTestId('input_field').fill('110018');
    await page.locator('#location-and-country-popup').getByRole('button', { name: 'button' }).click();
  } catch (e) {}

  // Click product — opens in new tab
  const page1Promise = page.waitForEvent('popup');
  await page.getByRole('link', { name: 'Angelic Rose Bouquet n Truffle Birthday Bliss 1 2 3 4 Angelic Rose Bouquet n' }).click();
  const page1 = await page1Promise;
  await page1.waitForLoadState('networkidle');

  // Dismiss "Later" date picker prompt
  try {
    await page1.getByText('Later').first().click({ timeout: 5000 });
  } catch (e) {}

  // Select date 30 from date picker
  try {
    await page1.getByTestId('popover').getByText('30', { exact: true }).click({ timeout: 5000 });
  } catch (e) {}

  // Select first available time slot
  try {
    await page1.locator('input[type="radio"]').first().click({ force: true, timeout: 5000 });
  } catch (e) {}

  // Click Buy Now
  await page1.getByRole('button', { name: 'Buy Now' }).click();
  await page1.waitForTimeout(5000); // Wait for potential login modal to appear
  await page1.waitForLoadState('networkidle');

  // Close any login drawer overlay
  try {
    await page1.locator('.border-0').click({ timeout: 3000 });
  } catch (e) {}

  // Login with email
  await page1.getByTestId('drawer').getByTestId('input_field').click();
  await page1.getByTestId('drawer').getByTestId('input_field').fill('rakeshfnptest6@gmail.com');
  await page1.locator('button').filter({ hasText: 'Continue' }).click();

  // Fill OTP
  await page1.getByRole('textbox', { name: 'Please enter verification' }).fill('1');
  await page1.getByRole('textbox', { name: 'Digit 2' }).fill('2');
  await page1.getByRole('textbox', { name: 'Digit 3' }).fill('3');
  await page1.getByRole('textbox', { name: 'Digit 4' }).fill('4');
  await page1.locator('button').filter({ hasText: 'Confirm OTP' }).click();
  await page1.waitForLoadState('networkidle');

  // Select saved address using "Deliver Here"
  try {
    await page1.getByRole('button', { name: /deliver here/i }).first().click({ timeout: 8000 });
    await page1.waitForLoadState('networkidle');
  } catch (e) {
    // No saved address — fill new address form
    await page1.getByRole('textbox').nth(0).fill('rrk farm');
    await page1.getByRole('textbox').nth(1).fill('red street');
    await page1.getByRole('textbox').nth(2).fill('Near abc school');
    try { await page1.getByRole('radio', { name: 'Home' }).click({ force: true }); } catch (e2) {}
    await page1.getByRole('button', { name: 'Save & Deliver here' }).click();
    await page1.waitForLoadState('networkidle');
  }

  // Proceed to payment
  await page1.locator('#proceed-to-pay-btn').click();
  await page1.waitForLoadState('networkidle');

  console.log('✅ Reached payment page:', page1.url());
});
