class APIutils {
  constructor(apiContext, loginPayLoad) {
    this.apiContext = apiContext;
    this.loginPayLoad = loginPayLoad;
  }

  async getToken() {
    const loginResponse = await this.apiContext.post(
      "https://www.rahulshettyacademy.com/api/ecom/auth/login",
      { data: this.loginPayLoad },
    ); //200, 201 .. 299

    const loginResponseJson = await loginResponse.json();
    const loginResponseToken = loginResponseJson.token;
    return loginResponseToken;
  }

  async createOrder(orderPayLoad) {
    let response = {};
    response.token = await this.getToken();
    const headersForOrder = {
      Authorization: response.token,
      "Content-Type": "application/json",
    };

    // Create Order API (needs Authorization from login)
    const orderResponse = await this.apiContext.post(
      "https://rahulshettyacademy.com/api/ecom/order/create-order",
      { data: orderPayLoad, headers: headersForOrder },
    );

    const orderResponseJson = await orderResponse.json();
    // API returns { orders: ["..."] } — first element is the order id string
    response.orderId = Array.isArray(orderResponseJson.orders)
      ? orderResponseJson.orders[0]
      : orderResponseJson.orders;
    console.log("Order ID is -> " + response.orderId);
    return response;
  }
}
module.exports = { APIutils };
