const { test, expect } = require('@playwright/test');
let webContext;
test.describe.configure({ mode: 'parallel' });

test.beforeEach(async({browser, context}) => { 
    const page = await context.newPage();
    await page.goto('https://rahulshettyacademy.com/client/#/auth/login');

    // Login    
    await page.locator('#userEmail').fill('tts@gmail.com');
    await page.locator('#userPassword').fill('Federal#89');
    await page.locator('#login').click();
    await page.waitForLoadState('networkidle'); 
    await context.storageState({path:'state.json'});    
    webContext=await browser.newContext({storageState:'state.json'});

})

test('order place juirney', async ({ browser }) => {
    // Create a new browser context
    const context = await browser.newContext();
    const page = await context.newPage();

    const email = 'tts@gmail.com';
    await page.goto('https://rahulshettyacademy.com/client/#/auth/login');
    // Page title
    console.log(await page.title());

    // Login
    const productName = 'ZARA COAT 3';
    
    await page.locator('#userEmail').fill('tts@gmail.com');
    await page.locator('#userPassword').fill('Federal#89');
    await page.locator('#login').click();
    await page.waitForLoadState('networkidle');

    console.log('Login successful');
    
    // Get all product titles
    const titles = await page.locator('.card-body b').allTextContents();
    console.log('Products available:', titles);
    
    // Find and add the specific product to cart
    const productCard = page.locator('.card-body').filter({ has: page.locator(`text=${productName}`) });
    await productCard.locator('text=Add To Cart').click();
    console.log(`${productName} added to cart successfully`);
    //pause for 10 seconds
    await page.waitForTimeout(5000);

    // Go to cart
    await page.locator('[routerlink*="cart"]').click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(5000);

    // Verify product is in cart
    const cartItems = await page.locator('.cartSection h3').allTextContents();
    expect(cartItems).toContain(productName);
    console.log(`${productName} is present in the cart`);   
    // Proceed to checkout
    await page.locator('text=Checkout').click();
    await page.waitForLoadState('networkidle');

    // Fill in country details
    await page.locator('[placeholder*="Country"]').pressSequentially('India');
    const countryInput = page.locator('[placeholder*="Country"]');
    await countryInput.fill('India');   
    await page.waitForTimeout(5000);
    // Select the country from suggestions
    await page.locator('.ta-results').locator('button').nth(1).click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    expect(page.locator(".user__name [type='text']").first()).toHaveText('tts@gmail.com');
    console.log('Email verified successfully on checkout page');
    await page.locator('.btnn.action__submit.ng-star-inserted').click();
    console.log('Proceeded to payment page');   
    await page.waitForTimeout(2000);
     
    // Place the order
    await page.locator('a:has-text("Place Order")').click();
    await page.waitForLoadState('networkidle'); 
    console.log('Order placed, awaiting confirmation');

    // Verify order confirmation
    const confirmationMessage = await page.locator('.hero-primary').textContent();
    expect(confirmationMessage).toContain('Thankyou for the order.');
    console.log('Order placed successfully and confirmation received');

    await expect(page.locator('.hero-primary')).toHaveText('Thankyou for the order.');
    const orderNumber = await page.locator('.em-spacer-1 .ng-star-inserted').textContent();
    console.log('Order Number:', orderNumber);
    //click on order details button
    await page.locator('button:has-text("ORDERS")').click();
    
    
    // Close the context
    await context.close();
});