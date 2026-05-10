const { test, expect } = require('@playwright/test');

test('End to End Learning Test', async ({ page }) => {


    // Task 1 : 
    //Open login page
    //Enter email
    //Enter password
    //Click login
    //Verify product cards are visible

    const email = 'mitpatel807@yahoo.com';

    await page.goto('https://rahulshettyacademy.com/client/#/auth/login');
    await page.locator('#userEmail').fill(email);
    await page.locator('#userPassword').fill('hNKurJ#!3CV.3G9');
    await page.locator('#login').click();

    //Task 2 : Next Page, wait for all the product cards to appear , select the product needed , click add to cart, navigate to cart page , wait for cart to display the product , verify the product , click checkout btn 

    await page.locator('.card-body b').first().waitFor();     // wait 
    const titles = await page.locator('.card-body b').allTextContents();    // array of product titles 
    console.log(titles);   // print 
    // now we have to declare the variables and set the count of items; then only we are moving to the for loop to retrive the product 
    const productName = 'ZARA COAT 3';
    const list = page.locator('.card-body');    // list of all the product cards 
    const count = await list.count();    // counting the list.
    console.log(count);
    for (let i = 0; i < count; i++) {
        const title = await list.nth(i).locator('b').textContent();
        if (title === productName) {
            await list.nth(i).locator('text=Add To Cart').click();
            break;
        }
    }

    await page.locator("[routerlink*='cart']").click();

    await page.locator('.items').first().waitFor();

    const bool = await page.locator("h3:has-text('ZARA COAT 3')").isVisible();
    console.log(bool);
    expect(bool).toBeTruthy();


    await page.locator("text=Checkout").click();


    // Task 3 : Select India from using loops and if cond to handle the Dynamic Dropdown, fill other fields and assert email field, click next btn. 

    await page.locator("[placeholder*='Country']").pressSequentially("Ind");
    const dropdown = await page.locator(".ta-results");
    await dropdown.waitFor();

    const countOptions = await dropdown.locator('button').count();
    for (let i = 0; i < countOptions; i++) {
        const text = await dropdown.locator(".ta-item").nth(i).textContent();
        if (text.trim() === 'India') {
            await dropdown.locator(".ta-item").nth(i).click();
            break;
        }
    }

    await page.locator(".action__submit ").click();

    await expect(page.locator(".hero-primary")).toHaveText(" Thankyou for the order. ");
    const orderId = await page.locator(".em-spacer-1 .ng-star-inserted").textContent();

    console.log(orderId);

    await page.locator("[routerlink*='myorders']").first().click();

    await page.locator("tbody").first().waitFor();

    const rows = await page.locator("tbody tr");
    for (let i = 0; i < await rows.count(); i++) {
        const rowOrderId = await rows.nth(i).locator("th").textContent();

        if (orderId.includes(rowOrderId)) {
            await rows.nth(i).locator("button").first().click();
            break;
        }
    }

    const orderDetailsId = await page.locator(".col-text").textContent();
    expect(orderId.includes(orderDetailsId)).toBeTruthy();

});
