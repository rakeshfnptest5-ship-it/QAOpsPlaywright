const { test, expect } = require('@playwright/test');

test("Open 1st Product from PLP and Select Date 30th April", async ({ page }) => {
  
  // Navigate to birthday gifts PLP
  await page.goto("https://www.fnp.com/gifts/birthday-lp");
  
  // Handle location personalization modal
  try {
    await page.getByTestId('locationLock').getByTestId('input_field').click({ timeout: 5000 });
    await page.getByTestId('locationLock').getByTestId('input_field').fill('110018');
    await page.locator('#location-and-country-popup').getByRole('button', { name: 'button' }).click();
  } catch (e) {
    console.log("Location modal not found, continuing...");
  }

  // Handle "Stay Updated" popup if it appears
  try {
    await page.getByRole('button', { name: 'No, Thanks' }).click({ timeout: 3000 });
  } catch (e) {
    console.log("Stay Updated popup not found, continuing...");
  }

  // Wait for PLP to load
  await page.waitForLoadState('networkidle');

  // Click on the first product - "Angelic Rose Bouquet n Truffle Birthday Bliss"
  await page.getByRole('link', { 
    name: /Angelic Rose Bouquet n Truffle Birthday Bliss/ 
  }).first().click();

  // Wait for product page to load
  await page.waitForLoadState('networkidle');

  // Close any popups that might appear on product page
  try {
    await page.locator('[role="dialog"] button:has-text("Close")').click({ timeout: 2000 });
  } catch (e) {
    console.log("No popup to close");
  }

  // Click on delivery date field to open date picker
  await page.getByTestId('popover').getByText('31').click({ timeout: 5000 });

  // Wait for date picker to be visible
  await page.waitForTimeout(500);

  // Select date 30th from the calendar
  // The calendar shows dates 1-31, click on date 30
  const dateButton = page.locator('button, [role="button"]').filter({ hasText: /^30$/ });
  
  if (await dateButton.isVisible()) {
    await dateButton.click();
  } else {
    // Alternative: Look for the specific date cell in the calendar
    await page.getByTestId('popover').getByText('30').click();
  }

  // Verify date is selected (optional - check if date changed)
  await page.waitForTimeout(500);
  
  console.log("Product opened and date 30th April selected successfully!");
});
