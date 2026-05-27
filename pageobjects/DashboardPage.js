class DashboardPage
{

    constructor(page)
    {
        this.page = page;
        this.products = page.locator(".card-body");
        this.productsText = page.locator(".card-body b");
        this.productTitles = page.locator(".card-body b");
        this.cart = page.locator("[routerlink*='cart']");
    }

    async searchProduct(productName) 
    {
        const count = await this.products.count();
        for (let i = 0; i < count; ++i) 
        {
            const text = await this.products.nth(i).locator("b").textContent();
            if (text.trim() === productName) 
            {
                //add to cart
                await this.products.nth(i).locator("text= Add To Cart").click();
                break;
            }
        }
    }

    async navigateToCart()
    {
        await this.cart.click();
    }
}
module.exports = {DashboardPage};