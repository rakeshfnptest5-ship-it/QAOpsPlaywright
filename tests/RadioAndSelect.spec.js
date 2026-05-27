const { test, expect } = require('@playwright/test');

test('Browser Radio and Dropdown', async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto('https://rahulshettyacademy.com/loginpagePractise/');

  // Login
  await page.locator('#username').fill('rakeshfnptest6@gmail.com');
  await page.locator('#password').fill('Federal#89');

  const documentLink = page.locator("[href*='document-request']");

  // Select User radio button
  await page.locator('.radiotextsty').last().click();

  // Select dropdown
  const dropdown = page.locator('select.form-control');
  await dropdown.selectOption('consult');

  // Click OK
  await page.locator('#okayBtn').click();

  // Assertions
  await expect(dropdown).toHaveValue('consult');

  await page.locator('#terms').check();
  await expect(page.locator('#terms')).toBeChecked();

  await page.locator('#terms').uncheck();
  await expect(page.locator('#terms')).not.toBeChecked();

  await expect(documentLink).toHaveAttribute('class', 'blinkingText');

  await context.close();
});


test.only('Child window handle', async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto('https://rahulshettyacademy.com/loginpagePractise/');
  const documentLink = page.locator("[href*='document-request']");

  // Wait until link is visible
  await expect(documentLink).toBeVisible();

  // Open new tab
  const [newPage] = await Promise.all([
    context.waitForEvent('page'),
    documentLink.click(),
  ]);

  await newPage.waitForLoadState('domcontentloaded');

  // Read text from child window
  const text = await newPage.locator('.red').textContent();
  console.log('Full Text:', text);

  // Extract email / domain
  const domain = text.split('@')[1].split(' ')[0];
  console.log('Extracted domain:', domain);

  // Use it back on parent page
  await page.locator('#username').fill(domain);

  await context.close();
});

