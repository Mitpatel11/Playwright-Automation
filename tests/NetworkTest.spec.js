const { test, expect, request } = require('@playwright/test');
const { API_Utils } = require('../utils/API_Utils');
const { json } = require('node:stream/consumers');
const loginPayLoad = { userEmail: "mitpatel807@yahoo.com", userPassword: "hNKurJ#!3CV.3G9" };
const orderPayLoad = { orders: [{ country: "Cuba", productOrderedId: "6960eac0c941646b7a8b3e68" }] };
const fakePayLoadOrders = { data: [], message: "Orders fetched for customer Successfully" };
let response;
test.beforeAll(async () => {
    const APIContext = await request.newContext();
    const apiUtils = new API_Utils(APIContext, loginPayLoad);
    response = await apiUtils.createOrder(orderPayLoad);
});



test('Web API Test', async ({ page }) => {
    await page.addInitScript(value => { window.localStorage.setItem('token', value); }, response.token);
    await page.goto("https://rahulshettyacademy.com/client");

    await page.route("https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*",
        async route => {
            //flow is : interceting response - api response -> {playwright fake response} -> browser -> render on the front end. 
            const response = await page.request.fetch(route.request());
            let body = JSON.stringify(fakePayLoadOrders);     // convert the Javascript which is declared on global level that is js, so we convert it to JSON. 
            route.fulfill({
                response,
                body,
            }
            );
        })
    // before clicking we have to intercept the API as this listen for the API call and 
    await page.locator("button[routerlink*='myorders']").click();
    // Imp to waitforResponse as if we do not wait then we will run into an error. 
    await page.waitForResponse("https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*");

    console.log(await page.locator(".mt-4").textContent());



});
