// Login Once Through UI , Collect all the session infomation, Cookies , session , token etc. and then store it in the JSON file and re-use on other tests.

const { test, expect } = require('@playwright/test');
let webContext;
test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto('https://rahulshettyacademy.com/client/');
    await page.locator('#userEmail').fill("mitpatel807@yahoo.com");
    await page.locator('#userPassword').fill('hNKurJ#!3CV.3G9');
    await page.locator('#login').click();
    await page.waitForLoadState('networkidle');

    await context.storageState({ path: 'state.json' });     // here make sure we are using the context level and not page level. 

    // invoke browser with the details captured 
    webContext = await browser.newContext({ storageState: 'state.json' });    // open new browser just like a logged in user .


})





test('Web API Part 2', async () => {
    const email = "";
    const productName = 'ZARA COAT 3';

    const page = await webContext.newPage();   // with the help of this we are creating a new Page with the saved data in the BeforeAll test. 
    // so if we have 2 test the other test will also start with await webContext.newPage();
    await page.goto('https://rahulshettyacademy.com/client/');

    const products = page.locator('.card-body');
    const titles = await page.locator('.card-body b').allTextContents();
    console.log(titles);

    const count = await products.count();

    for (let i = 0; i < count; i++) {
        if (await products.nth(i).locator("b").textContent() === productName) {

            await products.nth(i).locator("text= Add To Cart").click();
            break;
        }
    }

    await page.locator("[routerlink*='cart']").click();
    await page.locator("div li").first().waitFor();
    const bool = await page.locator("h3:has-text('ZARA COAT 3')").isVisible();

    expect(bool).toBeTruthy();

    page.locator("text=Checkout").click();


    await page.locator("[placeholder*='Country']").pressSequentially("ind");
    const dropdown = await page.locator(".ta-results");
    await dropdown.waitFor();

    const optionsCount = await dropdown.locator("button").count();
    for (let i = 0; i < optionsCount; i++) {
        const text = await dropdown.locator("button").nth(i).textContent();
        if (text.trim() === "India") {
            await dropdown.locator("button").nth(i).click();
            break;
        }
    }

    //await expect(page.locator(".user__name [type='text']").first()).toHaveText(email);

    await page.locator(".action__submit").click();

    await expect(page.locator(".hero-primary")).toHaveText(" Thankyou for the order. ");

    const orderid = await page.locator(".em-spacer-1 .ng-star-inserted").textContent();

    console.log(orderid);

    await page.locator("button[routerlink*='myorders']").click();

    await page.locator("tbody").first().waitFor();
    const rows = await page.locator("tbody tr");
    for (let i = 0; i < await rows.count(); i++) {
        const rowOrderId = await rows.nth(i).locator("th").textContent();
        if (orderid.includes(rowOrderId)) {
            await rows.nth(i).locator("button").first().click();
            break;
        }
    }

    const orderDetailsId = await page.locator(".col-text").textContent();
    expect(orderid.includes(orderDetailsId)).toBeTruthy();



});
