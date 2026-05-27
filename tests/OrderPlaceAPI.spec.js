
const { test, expect } = require("@playwright/test")

test("order place API test", async ({ request }) => {
    const loginResponse = await request.post("https://rahulshettyacademy.com/api/ecom/auth/login", {
        data: { userEmail: "tts@gmail.com", userPassword: "Federal#89" }
    });
    expect(loginResponse.ok()).toBeTruthy();
    const loginResponseJson = await loginResponse.json();
    expect(loginResponseJson.token).toBeTruthy();
});

    