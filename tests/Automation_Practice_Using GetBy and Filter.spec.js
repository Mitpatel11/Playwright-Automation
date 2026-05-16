const { test, expect } = require('@playwright/test');

test('Automation Practice Test', async ({ page }) => {
    const email = 'mitpatel807@yahoo.com';
    await page.goto('https://rahulshettyacademy.com/client/#/auth/login');
    await page.getByPlaceholder("email@example.com").fill(email);
    await page.getByPlaceholder('enter your passsword').fill('hNKurJ#!3CV.3G9');
    await page.getByRole('button', { name: 'Login' }).click();

    //await page.waitForLoadState('networkidle'); // this will wait for the network to be idle, which means that all the network requests have been completed.
    //alternative solution is : waitFor();
    await page.locator('.card-body b').first().waitFor();
    await page.locator(".card-body").filter({ hasText: "ZARA COAT 3" }).getByRole("button", { name: "Add to Cart" }).click();
    await page.getByRole("listitem").getByRole("button", { name: "Cart" }).click();
    await page.locator("div li").first().waitFor();    
    await page.getByText("ZARA COAT 3").isVisible();   
    page.getByRole("button", { name: "Checkout" }).click();

    await page.getByPlaceholder("Select Country").pressSequentially("ind");
    await page.getByRole("listitem").getByRole("button", { name: "India" }).nth(1).click();
    await page.getByText("PLACE ORDER").click();
    await expect(page.getByText("Thankyou for the order.")).toBeVisible();

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
