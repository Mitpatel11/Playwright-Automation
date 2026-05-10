const { test, expect } = require('@playwright/test');


// test ('First Playwright Test', function ()
//{ step 1
// step 2
//step 3 ...... here there is no garanty that the test will be executed in the same order as we have written the code, so we need to use async and await to make sure that the test will be executed in the same order as we have written the code.
//});



test('Browser Playwright Test', async ({ browser }) => {

    const context = await browser.newContext();
    const page = await context.newPage();
    const userName = page.locator('#username');
    const signInBtn = page.locator('#signInBtn');
    const cardTitles = page.locator('.card-body a');
    await page.goto('https://rahulshettyacademy.com/loginpagePractise/');
    console.log(await page.title());

    await userName.fill('rahulshetty');
    await page.locator("[type='password']").fill('Learning@830$3mK2');
    await signInBtn.click();
    console.log(await page.locator("[style*='block']").textContent());
    await expect(page.locator("[style*='block']")).toContainText('Incorrect');

    await userName.fill('');
    await userName.fill('rahulshettyacademy');
    await signInBtn.click();

    // multiple ways
    console.log(await cardTitles.first().textContent());   // if we comment this line then the test will fail 
    //. textContent have the auto wait feature, but not the allTesxtContents, check playwright document for more details
    console.log(await cardTitles.nth(1).textContent());
    const allTitles = await cardTitles.allTextContents();    // this will return an array of all the titles    // actually it wont fail but return 0 elements. 
    console.log(allTitles);


    //radio and dropdown 




});



test('Page Playwright Test', async ({ page }) => {
    await page.goto('https://rahulshettyacademy.com/loginpagePractise/');
    const userName = page.locator('#username');
    const signInBtn = page.locator('#signInBtn');
    const dropdown = page.locator("select.form-control");
    dropdown.selectOption('consult');

    await page.locator(".radiotextsty").last().click();
    await page.locator("#okayBtn").click();
    await expect(page.locator(".radiotextsty").last()).toBeChecked();
    console.log(await page.locator(".radiotextsty").last().isChecked());   // or .isChecked()    // this will check if the radio button is checked or not. this will return booolean value.
    await page.locator("#terms").click();
    await expect(page.locator("#terms")).toBeChecked();
    await page.locator("#terms").uncheck();
    expect(await page.locator("#terms").isChecked()).toBeFalsy();

    const docLink = page.locator("[href*='documents-request']");
    await expect(docLink).toHaveAttribute('class', 'blinkingText').click();

    // await page.pause();    // this will pause the test execution and open the playwright inspector, where we can see the state of the application and also we can interact with the application.
});


test('Child Window Handling', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto('https://rahulshettyacademy.com/loginpagePractise/');
    const docLink = page.locator("[href*='documents-request']");

    const [newPage] = await Promise.all([
        context.waitForEvent('page'),   //listen for any new page. so we write it before 
        docLink.click(),  // here new page opened    
        // Operation is Promise; promise is pending, fulfilled, rejected. so we need to wait for the promise to be fulfilled.
    ]) // this is an array of promises, so we need to wait for all the promises to be fulfilled. so we use Promise.all() method. this will return an array of results of all the promises. so we can destructure the array to get the new page object.

    const text = await newPage.locator('.red').textContent();
    const array = text.split("@");
    const domain = array[1].split(" ")[0];
    console.log(text);
    console.log(domain);

    await page.locator("#username").fill(domain);
    // await page.pause();
    console.log(await page.locator("#username").inputValue());

});



test.only('Get By Locators', async ({ page }) => {
    await page.goto("https://www.rahulshettyacademy.com/angularpractice/");
    await page.getByLabel("Check me out if you Love IceCreams!").click();
    await page.getByLabel("Employed").check();
    await page.getByLabel("Gender").selectOption("Female");    // this works only if the options are within the selected tag. 


});