const { test, expect } = require('@playwright/test');

async function selectDateAndTimeSlot(page, options = {}) {
    const {
      navigateToNextMonth = true,
      preferredDate = '15',
      fallbackDates = ['20', '25', '16', '17', '18', '21', '22', '23', '24', '26', '27', '28']
    } = options;

    console.log('📅 Starting date and time slot selection...');

    // Step 1: Remove blocking elements
    try {
      await page.evaluate(() => {
        const blockers = document.querySelectorAll(
          'iframe, .overlay, .popup, div[id*="wzrk"], div[class*="wzrk"], button[id*="wzrk"]'
        );
        blockers.forEach(el => el.remove());
      });
      console.log('✅ Removed blocking elements');
    } catch (error) {
      console.log('📝 No blocking elements to remove');
    }

    // Step 2: Ensure Date Picker is open
    const popover = page.getByTestId('popover');
    let isPickerOpen = await popover.isVisible({ timeout: 3000 });

    if (!isPickerOpen) {
      console.log('⚠️ Date picker popover not visible, attempting to trigger it...');
      const triggerStrategies = [
        { type: 'text', value: 'Later', force: true },
        { type: 'testid', value: 'delivery_date_selector' },
        { type: 'text', value: 'Select Delivery Date' },
        { type: 'text', value: 'Select Date' },
        { type: 'testid', value: 'locationLock' }
      ];

      for (const strategy of triggerStrategies) {
        try {
          const locator = strategy.type === 'testid'
            ? page.getByTestId(strategy.value)
            : page.getByText(strategy.value).first();

          if (await locator.isVisible({ timeout: 2000 })) {
            await locator.click({ force: !!strategy.force });
            console.log(`✅ Clicked ${strategy.value} strategy to trigger picker`);
            await page.waitForTimeout(1000);
            if (await popover.isVisible({ timeout: 3000 })) {
              isPickerOpen = true;
              break;
            }
          }
        } catch (e) {
          // Continue to next strategy
        }
      }
    }

    // Step 3: Click "Later" button if needed (common pattern for FNP PDP)
    if (isPickerOpen) {
      try {
        const laterBtn = page.getByTestId('popover').getByText('Later');
        if (await laterBtn.isVisible({ timeout: 2000 })) {
          await laterBtn.click({ force: true });
          console.log('✅ Clicked Later button inside popover');
          await page.waitForTimeout(1000);
        }
      } catch (e) {
        console.log('📝 Later button not found inside popover, proceeding');
      }
    } else {
      try {
        const laterBtn = page.getByText('Later').first();  // fixed: .first() not .first
        await laterBtn.waitFor({ state: 'visible', timeout: 5000 });
        await laterBtn.click({ force: true });
        console.log('✅ Clicked primary Later button');
        await page.waitForTimeout(1000);
        isPickerOpen = true;
      } catch (error) {
        console.log('⚠️ Primary Later button not found, continuing to date selection');
      }
    }

    // Step 4: Navigate to next month (optional)
    if (navigateToNextMonth) {
      try {
        await page.getByTestId('popover').getByRole('img', { name: 'arrow-right' }).click({ timeout: 5000 });
        console.log('✅ Navigated to next month');
        await page.waitForTimeout(1000);
      } catch (error) {
        console.log('⚠️ Could not navigate to next month, using current month dates');
      }
    }

    // Step 5: Select date with fallback logic
    const datesToTry = [preferredDate, ...fallbackDates];
    let selectedDate = null;

    for (const date of datesToTry) {
      try {
        await page.getByTestId('popover').getByText(date, { exact: true }).click({ timeout: 2000 });
        console.log(`✅ Selected date: ${date}`);
        selectedDate = date;
        break;
      } catch (e) {
        // Continue to next date
      }
    }

    if (!selectedDate) {
      try {
        const anyDate = page.locator('.react-datepicker__day:not(.react-datepicker__day--disabled)').first();
        await anyDate.click({ timeout: 2000 });
        console.log('✅ Selected first available fallback date');
        selectedDate = 'fallback';
      } catch (e) {
        throw new Error('Could not select any delivery date');
      }
    }

    await page.waitForTimeout(1000);

    // Step 6: Select time slot with robust fallback logic
    let selectedTimeSlot = null;

    // Strategy 1: Try "Fixed Time Delivery" + specific slot
    try {
      await page.getByText('Fixed Time Delivery').click({ timeout: 3000 });
      console.log('✅ Clicked Fixed Time Delivery');
      await page.waitForTimeout(500);

      try {
        await page.getByText('pm - 10 pm').click({ timeout: 2000 });
        console.log('✅ Selected time slot: pm - 10 pm');
        selectedTimeSlot = 'pm - 10 pm (Fixed)';
        return { date: selectedDate, timeSlot: selectedTimeSlot };
      } catch (e) {
        console.log('📝 pm - 10 pm not available under Fixed Time Delivery');
      }
    } catch (error) {
      console.log('📝 Fixed Time Delivery not available, trying Morning Delivery');
    }

    // Strategy 2: Try "Morning Delivery" + specific slot
    try {
      await page.getByText('Morning Delivery').click({ timeout: 3000 });
      console.log('✅ Clicked Morning Delivery');
      await page.waitForTimeout(500);

      try {
        await page.getByText('am - 9 am').click({ timeout: 2000 });
        console.log('✅ Selected time slot: am - 9 am');
        selectedTimeSlot = 'am - 9 am (Morning)';
        return { date: selectedDate, timeSlot: selectedTimeSlot };
      } catch (e) {
        console.log('📝 am - 9 am not available under Morning Delivery');
      }
    } catch (error) {
      console.log('📝 Morning Delivery not available, trying first available slot');
    }

    // Strategy 3: Try 'am - 9 am' pattern
    try {
      await page.getByText('am - 9 am').click({ timeout: 2000 });
      console.log('✅ Selected time slot: am - 9 am');
      selectedTimeSlot = 'am - 9 am';
      return { date: selectedDate, timeSlot: selectedTimeSlot };
    } catch (e) {
      console.log('⚠️ am - 9 am pattern not found');
    }

    // Strategy 4: Try radio buttons for time slots
    try {
      const firstRadio = page.locator('label[class*="radio"], input[type="radio"]').first();
      if (await firstRadio.isVisible({ timeout: 2000 })) {
        await firstRadio.click();
        console.log('✅ Selected first available time slot (radio button)');
        selectedTimeSlot = 'first available';
        return { date: selectedDate, timeSlot: selectedTimeSlot };
      }
    } catch (e) {
      console.log('📝 No radio buttons found');
    }

    // Strategy 5: Ultimate fallback - find any clickable element with time pattern
    try {
      const timePattern = page.locator('text=/\\d{1,2}.*\\d{1,2}.*(am|pm|AM|PM|Hrs)/i').first();
      await timePattern.click({ timeout: 2000 });
      console.log('✅ Selected time slot using pattern match');
      selectedTimeSlot = 'pattern matched';
      return { date: selectedDate, timeSlot: selectedTimeSlot };
    } catch (e) {
      console.log('⚠️ Could not select any time slot');
    }

    console.log('📅 Date and time slot selection completed');
    return {
      date: selectedDate,
      timeSlot: selectedTimeSlot || 'none (may be optional)'
    };
}

test("fnpDigital", async ({ page }) => {
    await page.goto("https://www.fnp.com/digital-gifts-lp");

    // Wait for the personalization modal to appear and enter the pincode
    await page.getByTestId('locationLock').getByTestId('input_field').click();
    await page.getByTestId('locationLock').getByTestId('input_field').fill('110018');
    await page.locator('#location-and-country-popup').getByRole('button', { name: 'button' }).click();

    // Handle the "Stay Updated" popup by clicking "No, Thanks" if it appears
    await page.getByRole('button', { name: 'No, Thanks' }).click();

    // Wait for products to load and click on the specific product: Guitarist on Video Call
    await page.waitForLoadState('networkidle');
    await page.locator('a[href*="guitarist-on-video-call"]').first().click();

    // Wait for product page to load
    await page.waitForLoadState('networkidle');

    // Close any unexpected popup on product page
    try {
      await page.locator('[role="dialog"] button:has-text("Close")').click({ timeout: 2000 });
    } catch (e) {
      // ignore if popup doesn't appear
    }

    await selectDateAndTimeSlot(page);
});
