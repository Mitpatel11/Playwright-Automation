const { test, expect, request } = require('@playwright/test');
const { API_Utils } = require('../utils/API_Utils');
const loginPayLoad = { userEmail: "mitpatel807@yahoo.com", userPassword: "hNKurJ#!3CV.3G9" };
const orderPayLoad = { orders: [{ country: "Cuba", productOrderedId: "6960eac0c941646b7a8b3e68" }] };
let response;
test.beforeAll(async () => {
    const APIContext = await request.newContext();
    const apiUtils = new API_Utils(APIContext, loginPayLoad);
    response = await apiUtils.createOrder(orderPayLoad);
});



test('Web API Test', async ({ page }) => {
    await page.addInitScript(value => { window.localStorage.setItem('token', value); }, response.token);
    await page.goto("https://rahulshettyacademy.com/client");
    await page.locator("button[routerlink*='myorders']").click();

    await page.locator("tbody").first().waitFor();
    const rows = await page.locator("tbody tr");
    for (let i = 0; i < await rows.count(); i++) {
        const rowOrderId = await rows.nth(i).locator("th").textContent();
        if (response.orderId.includes(rowOrderId)) {
            await rows.nth(i).locator("button").first().click();
            break;
        }
    }

    const orderDetailsId = await page.locator(".col-text").textContent();
    await page.pause();
    expect(response.orderId.includes(orderDetailsId)).toBeTruthy();



});
