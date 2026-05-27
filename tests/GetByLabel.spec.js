import { test, expect } from "@playwright/test";

test("playwright special locators", async ({ page }) => {

    await page.goto("https://rahulshettyacademy.com/angularpractice/");
    await page.getByLabel("Check me out if you Love IceCreams!").click();
    await page.getByLabel("Employed").click();
    await page.getByLabel("Student").check();
    await page.getByPlaceholder("Password").fill("123456ABCD");
    await page.getByRole("button", { name: "Submit" }).click();
    await expect(page.getByText("Success! The Form has been submitted successfully!."))
      .toBeVisible();

    await page.getByRole("link", { name: "Shop" }).click();
    await expect(page).toHaveURL(/shop/);
    await page.locator("app-card").filter({ hasText: 'Nokia Edge' }).getByRole("button", { name: "Add" }).click();


});