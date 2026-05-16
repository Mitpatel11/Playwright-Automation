class API_Utils {

    constructor(APIContext, loginPayLoad) {
        this.APIContext = APIContext;   // this refers to current class 
        this.loginPayLoad = loginPayLoad;
    }     // constructor when we create object of the API utils class

    async getToken() {
        const loginResponse = await this.APIContext.post('https://rahulshettyacademy.com/api/ecom/auth/login', { data: this.loginPayLoad })    // post -> first url and then data / path of the payload  .json file 
        const loginResponseJSON = await loginResponse.json();
        const token = loginResponseJSON.token;
        console.log(token);
        return token;
    }


    async createOrder(orderPayLoad) {
        let response = {};   // dummy object
        response.token = await this.getToken();
        const orderResponse = await this.APIContext.post('https://rahulshettyacademy.com/api/ecom/order/create-order', {
            data: orderPayLoad,
            headers: {
                'Authorization': response.token,
                'Content-Type': 'application/json'
            },
        })

        const orderResponseJSON = await orderResponse.json();
        console.log(orderResponseJSON);
        const orderId = orderResponseJSON.orders[0];

        response.orderId = orderId;
        return response;
    }
}

module.exports = { API_Utils };