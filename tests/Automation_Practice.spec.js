const { test, expect } = require('@playwright/test');

test('Automation Practice Test', async ({ page }) => {
    const email = 'mitpatel807@yahoo.com';
    await page.goto('https://rahulshettyacademy.com/client/#/auth/login');
    await page.locator('#userEmail').fill(email);
    await page.locator('#userPassword').fill('hNKurJ#!3CV.3G9');
    await page.locator('#login').click();

    //await page.waitForLoadState('networkidle'); // this will wait for the network to be idle, which means that all the network requests have been completed.
    //alternative solution is : waitFor();
    await page.locator('.card-body b').first().waitFor();
    const titles = await page.locator('.card-body b').allTextContents();
    console.log(titles);

    //await page.locator('.card-body b').first().textContent();    // we cant use this all the time so we use network service calls. 

    // select the product zara coat 3. 
    const productName = "ZARA COAT 3";
    const products = page.locator('.card-body');    // all products
    const count = await products.count();

    for (let i = 0; i < count; i++) {
        if (await products.nth(i).locator("b").textContent() === productName) {
            // add to cart
            await products.nth(i).locator("text= Add To Cart").click();
            break;
        }
    }

    await page.locator("[routerlink*='cart']").click();
    await page.locator("div li").first().waitFor();    // explicit wait for the cart page to load and display the products in the cart. // but here if we use just waitfor then it will wait for all the products to be loaded and it will fail. so we use first() to wait for the first product to be loaded and displayed in the cart.
    const bool = await page.locator("h3:has-text('ZARA COAT 3')").isVisible();   // this will return the element which has the text productName in h3 tag.   // this is not css selector, this is playwright selector. this will return the element which has the text productName in h3 tag.

    expect(bool).toBeTruthy();   // Assertion 

    page.locator("text=Checkout").click();

    // Dynamic Dropdown
    //await page.locator("[placeholder*='Country']").fill("ind");    // here fill is not suitable as after paste the dropdown does not appear, so we need to use pressSequence to trigger the dropdown.
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

    await expect(page.locator(".user__name [type='text']").first()).toHaveText(email);

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
