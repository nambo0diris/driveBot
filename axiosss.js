import puppeteer from "puppeteer";

const browser = await puppeteer.launch({
    args: ['--no-sandbox'],
});
const page3 = await browser.newPage();
await page3.goto(`https://faketemplate.net/shop-info/checkout-2/?key=wc_order_nHADCpu98BxlE&order-pay=40712`)
let body = await page3.evaluate(() => document.body.innerHTML)
console.log(body)
