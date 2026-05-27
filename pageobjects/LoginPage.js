class LoginPage {

    constructor(page) 
    {
        this.page = page;
        this.SignInButton = page.locator("[value='Login']");
        this.userName = page.locator("#userEmail");
        this.password = page.locator("#userPassword");
    }

    async goTo()
    {
        await this.page.goto('https://rahulshettyacademy.com/client/#/auth/login');
    }

    async  validLogin(username, password) 
    {
    await this.userName.fill(username);
    await this.password.fill(password);
    await this.SignInButton.click(); 
    await this.page.waitForLoadState('networkidle');
    }
}

module.exports = { LoginPage };
