
import { test, expect } from "@playwright/test";

test("get by label", async ({ page }) => {

await page.goto("https://rahulshettyacademy.com/client/");
await page.getByPlaceholder("Email").fill("tts@gmail.com");
await page.getByPlaceholder("enter your passsword").fill("Federal#89");
await page.getByRole("button", { name: "Login" }).click();

await page.waitForLoadState('networkidle'); 
const titles = await page.locator(".card-body b").first().waitFor();
await page.locator(".card-body").filter({hasText:"ZARA COAT 3"})
   .getByRole("button",{name:"Add to Cart"}).click();
 
   await page.getByRole("listitem").getByRole('button',{name:"Cart"}).click();
 
   //await page.pause();
   await page.locator("div li").first().waitFor();
   await expect(page.getByText("ZARA COAT 3")).toBeVisible();
 
   await page.getByRole("button",{name :"Checkout"}).click();
 
   await page.getByPlaceholder("Select Country").pressSequentially("ind");
 
   await page.getByRole("button",{name :"India"}).nth(1).click();
   await page.getByText("PLACE ORDER").click();
 
   await expect(page.getByText("Thankyou for the order.")).toBeVisible();

});