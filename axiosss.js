// import puppeteer from "puppeteer";
//
// const browser = await puppeteer.launch({
//     args: ['--no-sandbox'],
// });
// const page3 = await browser.newPage();
// await page3.goto(`https://faketemplate.net/shop-info/checkout-2/?key=wc_order_6EJaPIGhlXfWQ&order-pay=40713`)
// let body = await page3.evaluate(() => document.body.innerHTML)
// console.log(body)
//
//
function qwe(a) {
    console.log("a:" + a)
    return (b) => {
        console.log("b:" + b)
        console.log(`a + b: ${a + b}`)
    }
}
const x = qwe(2);
const y = x(4);
