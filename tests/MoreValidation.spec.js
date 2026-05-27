 const {test,expect} = require ('@playwright/test');

test("More validations", async ({ page }) => {
    await page.goto("https://rahulshettyacademy.com/AutomationPractice");
    //await page.goto("https://www.facebook.com/");
    //await page.goBack();
    //await page.goForward();
    await expect(page.locator("#displayed-text")).toBeVisible();
    await page.locator("#hide-textbox").click();
    await expect(page.locator("#displayed-text")).toBeHidden();
    await page.locator("#show-textbox").click();
    await expect(page.locator("#displayed-text")).toBeVisible();
    //await page.pause();
    page.on("dialog", dialog => dialog.accept());
    await page.locator("#confirmbtn").click();
    await page.locator("mousehover").hover();
    await page.locator("mousehover").locator("text=Top").click();
    await page.frameLocator("#courses-iframe").locator("text=Courses").click();
    await page.frameLocator("#courses-iframe").locator("li a[href*='lifetime-access']").click();


});
    