
const {test, expect } = require('../utils/test-base');
 const {POManager} = require('../pageobjects/POManager');
 //JSON >> String  >> JavaScript Object
 const dataset   = JSON.parse(JSON.stringify(require('../utils/placeorderTestData')));

 for (const data of dataset) {
    test(`Clint App login for ${data.productName}`, async ({ page }) => 
        {

   
        //JS file- login js, DashboardPage
   const poManager = new POManager(page);
   const username = data.username;
   const password = data.password;
   const productName = data.productName;
   const products = page.locator(".card-body");

   const loginPage = poManager.LoginPage;
   await loginPage.goTo();
   await loginPage.validLogin(username, password);

   const dashboardPage = poManager.DashboardPage;
   await dashboardPage.searchProduct(productName);
   await dashboardPage.navigateToCart();

   const productLocator = page.locator(`h3:has-text('${productName}')`);
   await expect(productLocator).toBeVisible();
   await page.locator("text=Checkout").click();
 
   await page.locator("[placeholder*='Country']").pressSequentially("ind", { delay: 150 });
   const dropdown = page.locator(".ta-results");;
   await dropdown.waitFor();
   const optionsCount = await dropdown.locator("button").count();
   for (let i = 0; i < optionsCount; ++i) {
      const text = await dropdown.locator("button").nth(i).textContent();
      if (text === " India") {
         await dropdown.locator("button").nth(i).click();
         break;
      }
   }
 
   await expect(page.locator(".user__name [type='text']").first()).toHaveText(username);
   await page.locator(".action__submit").click();
   await expect(page.locator(".hero-primary")).toHaveText(" Thankyou for the order. ");
   const orderId = await page.locator(".em-spacer-1 .ng-star-inserted").textContent();
   console.log(orderId);
 
   await page.locator("button[routerlink*='myorders']").click();
   await page.locator("tbody").waitFor();
   const rows = await page.locator("tbody tr");
 
 
   for (let i = 0; i < await rows.count(); ++i) {
      const rowOrderId = await rows.nth(i).locator("th").textContent();
      if (orderId.includes(rowOrderId)) {
         await rows.nth(i).locator("button").first().click();
         break;
      }
   }
   const orderIdDetails = await page.locator(".col-text").textContent();
   expect(orderId.includes(orderIdDetails)).toBeTruthy();
 
});
 }