class APiUtils {
  constructor(apiContext, loginPayload) {
    this.apiContext = apiContext;
    this.loginPayload = loginPayload;
  }

  async login() {
    const response = await this.apiContext.post('https://rahulshettyacademy.com/api/ecom/auth/login', {
      data: this.loginPayload,
    });
    const body = await response.json();
    return body;
  }

  async createOrder(orderPayload) {
    const loginBody = await this.login();
    const token = loginBody.token;

    const orderResponse = await this.apiContext.post('https://rahulshettyacademy.com/api/ecom/order/create-order', {
      data: orderPayload,
      headers: {
        Authorization: token,
      },
    });

    const orderBody = await orderResponse.json();
    return {
      token,
      order: orderBody,
    };
  }
}

module.exports = { APiUtils };