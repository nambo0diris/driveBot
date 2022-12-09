import puppeteer from "puppeteer";
import * as fs from "fs";
import random_signature from "../data_generator/random_signature.js";

const convert_to_jpeg_mask = async (props, type) => {
    try {
        let russian_full_side_1 = `<!DOCTYPE html>
      <html lang="en">
        <head>
          <link rel="stylesheet" href="../../../document_templates/russian_international_driving_permit/full/style.css">
          <meta charset="utf-8">
        </head>
        <body>
          <div id="main-background">
            <div id="example_1">${type==="example" ? "Образец" : ""}</div>
            <div id="example_2">${type==="example" ? "Образец" : ""}</div>
            <img id="main-background--image" src="../../../document_templates/russian_international_driving_permit/full/assets/images/backgrounds/side_1.jpg" alt=""/>
            <div id="serial-number-main"><span>Б У Т А Ф О Р И Я</span></div>
            <div id="expire-date">12.10.2024</div>
            <div id="issued-by">State Road Traffic Safety Inspection</div>
            <div id="issued-at">${props.living_city}</div>
            <div id="date">12.10.2021</div>
            <div id="national-licence-serial-number">Б У Т А Ф О Р И Я</div>
            <img id="official-signature" src="../../../document_templates/russian_international_driving_permit/full/assets/images/signatures/official/signature_${random_signature()}.png"/>
          </div>
        </body>
      </html>`;
        await fs.writeFile(`/root/driveBot/temp/users/${props.user_id}/Полный_разворот_1.html`, russian_full_side_1, async (error) => {});
        const browser = await puppeteer.launch({
            args: ['--no-sandbox'],
        });
        const page1 = await browser.newPage();
        await page1.goto(`file:///root/driveBot/temp/users/${props.user_id}/Полный_разворот_1.html`);
        await page1.setViewport({
            width: 9606,
            height: 4665,
            deviceScaleFactor: 1,
        });
        await page1.screenshot({path: `/root/driveBot/temp/users/${props.user_id}/Полный_разворот_1.jpg`, quality: 10 });
        await browser.close();

        let russian_full_side_2 = `<!DOCTYPE html>
      <html lang="en">
        <head>
          <link rel="stylesheet" href="../../../document_templates/russian_international_driving_permit/full/style.css">
          <meta charset="utf-8">
        </head>
        <body>
         <div id="main-background">
            <div id="example_1">${type==="example" ? "Образец" : ""}</div>
            <div id="example_2">${type==="example" ? "Образец" : ""}</div>
            <img id="main-background--image" src="../../../document_templates/russian_international_driving_permit/full/assets/images/backgrounds/side_2.jpg" alt=""/>
            <div id="first-name">${props.first_name}</div>
            <div id="last-name">${props.last_name}</div>
            <div id="place-of-birth">${props.city_of_birth}, ${props.country_of_birth}</div>
            <div id="date-of-birth">${props.date_of_birth}</div>
            <div id="living-place">${props.living_city}, ${props.living_country}</div>
            <div id="serial-number">Б У Т А Ф О Р И Я</div>
            <img id="photo" src="${props.user_id}.jpg"/>
            <img id="stamp" src="../../../document_templates/russian_international_driving_permit/full/assets/images/stamp/stamp.png"/>
            <img id="client-signature" src="../../../document_templates/russian_international_driving_permit/full/assets/images/signatures/clients/signature_${random_signature()}.png"/>
         </div>
        </body>
      </html>`;

        await fs.writeFile(`/root/driveBot/temp/users/${props.user_id}/Полный_разворот_2.html`, russian_full_side_2, async (error) => {});
        const browser2 = await puppeteer.launch({
            args: ['--no-sandbox'],
        });
        const page2 = await browser2.newPage();
        await page2.goto(`file:///root/driveBot/temp/users/${props.user_id}/Полный_разворот_2.html`);
        await page2.setViewport({
            width: 9606,
            height: 4665,
            deviceScaleFactor: 1,
        });
        await page2.screenshot({path: `/root/driveBot/temp/users/${props.user_id}/Полный_разворот_2.jpg`, quality: 10});
        await browser2.close();

        let russian_short = `<!DOCTYPE html>
      <html lang="en">
        <head>
          <link rel="stylesheet" href="../../../document_templates/russian_international_driving_permit/short/style.css">
          <meta charset="utf-8">
        </head>
        <body>
            <div id="main-background">
                <div id="example_1">${type==="example" ? "Образец" : ""}</div>
                <div id="example_2">${type==="example" ? "Образец" : ""}</div>
                <img id="main-background--image" src="../../../document_templates/russian_international_driving_permit/short/assets/images/backgrounds/side.jpg" alt="">
                <div id="serial-number-main">Б У Т А Ф О Р И Я</div>
                <div id="expire-date">12.10.2023</div>
                <div id="issued-by">State Road Traffic Safety Inspection</div>
                <div id="issued-at">${props.living_city}</div>
                <div id="date">12.10.2020</div>
                <div id="national-licence-serial-number">Б У Т А Ф О Р И Я</div>
                <img id="official-signature" src="../../../document_templates/russian_international_driving_permit/short/assets/images/signatures/official/signature_${random_signature()}.png"/>
            
                <div id="first-name">${props.first_name}</div>
                <div id="last-name">${props.last_name}</div>
                <div id="place-of-birth">${props.city_of_birth}, ${props.country_of_birth}</div>
                <div id="date-of-birth">${props.date_of_birth}</div>
                <div id="living-place">${props.living_city}, ${props.living_country}</div>
            
                <img class="category_stamp_1" src="../../../document_templates/russian_international_driving_permit/short/assets/images/stamp/licence-stamp.png">
                <img class="category_stamp_2" src="../../../document_templates/russian_international_driving_permit/short/assets/images/stamp/licence-stamp.png">
                <img class="category_stamp_3" src="../../../document_templates/russian_international_driving_permit/short/assets/images/stamp/licence-stamp.png">
            
            
                <img id="stamp2" src="../../../document_templates/russian_international_driving_permit/short/assets/images/stamp/stamp2.png">
                <img id="photo" src="${props.user_id}.jpg"/>
                <div id="serial-number">${props.subject_id}</div>
                <img id="stamp" src="../../../document_templates/russian_international_driving_permit/short/assets/images/stamp/stamp.png"/>
                <img id="client-signature" src="../../../document_templates/russian_international_driving_permit/short/assets/images/signatures/clients/signature_${random_signature()}.png"/>
            </div>
        </body>
      </html>`;

        await fs.writeFile(`/root/driveBot/temp/users/${props.user_id}/Короткая_версия.html`, russian_short, async (error) => {});
        const browser3 = await puppeteer.launch({
            args: ['--no-sandbox'],
        });
        const page3 = await browser3.newPage();
        await page3.goto(`file:///root/driveBot/temp/users/${props.user_id}/Короткая_версия.html`);
        await page3.setViewport({
            width: 4032,
            height: 2992,
            deviceScaleFactor: 1,
        });
        await page3.screenshot({path: `/root/driveBot/temp/users/${props.user_id}/Короткая_версия.jpg`, quality: 50});
        await browser3.close();




        const international_side_1 = `<!DOCTYPE html>
      <html lang="en">
        <head>
            <link rel="stylesheet" href="../../../document_templates/international_driver_license/style.css">
            <meta charset="utf-8">
        </head>
        <body>
          <div id="main-background">
            <div id="example_1">${type==="example" ? "Образец Образец" : ""}</div>
            <div id="example_2">${type==="example" ? "Образец Образец" : ""}</div>
            <img id="main-background--image" src="../../../document_templates/international_driver_license/assets/images/background/side_1.jpg" alt="">
            <div id="first-name">${props.first_name}</div>
            <div id="last-name">${props.last_name}</div>
            <div id="date-of-birth">${props.date_of_birth}</div>
            <div id="place-of-birth">${props.country_of_birth}, ${props.city_of_birth} </div>
            <div id="house_number">${props.house_number}</div>
            <div id="living-street-and-city">${props.living_street}, ${props.living_city}</div>
            <div id="living-index-and-country">${props.living_index}, ${props.living_country}</div>
            <div id="sex">${props.sex}</div>
            <div id="eyes">${props.eyes}</div>
            <div id="ht">${props.height}</div>
            <div id="category">Б У Т А Ф О Р И Я</div>
            <img id="signature" src="../../../document_templates/international_driver_license/assets/images/signatures/clients/signature_${random_signature()}.png">
            <div id="issued">10.10.2019</div>
            <div id="expires">10.10.2029</div>
            <img id="photo" src="${props.user_id}.jpg"/>
          </div>
        </body>
      </html>`;
        await fs.writeFile(`/root/driveBot/temp/users/${props.user_id}/Европейские(на пластик)_1.html`, international_side_1, async (error) => {});
        const browser4 = await puppeteer.launch({
            args: ['--no-sandbox'],
        });
        const page4 = await browser4.newPage();
        await page4.goto(`file:///root/driveBot/temp/users/${props.user_id}/Европейские(на пластик)_1.html`);
        await page4.setViewport({
            width: 1011,
            height: 638,
            deviceScaleFactor: 1,
        });
        await page4.screenshot({path: `/root/driveBot/temp/users/${props.user_id}/Европейские(на пластик)_1.jpg`, quality: 100});
        await browser4.close();


        const international_side_2 = `<!DOCTYPE html>
     <html lang="en">
       <head>
            <link rel="stylesheet" href="../../../document_templates/international_driver_license/style.css">
            <meta charset="utf-8">
       </head>
       <body>
            <div id="main-background">
                <div id="example_1">${type==="example" ? "Образец Образец" : ""}</div>
                <div id="example_2">${type==="example" ? "Образец Образец" : ""}</div>
                <img id="main-background--image" src="../../../document_templates/international_driver_license/assets/images/background/side_2.jpg" alt="">
                <div id="national-driver-license">${props.national_driver_license}</div>
                <div id="national-driver-license-issued-on">24.12.2021</div>
                <div id="issued-on">10.05.2019</div>
                <div id="expires-on">10.05.2029</div>
                <div id="id-code">Б У Т А Ф О Р И Я</div>
                <div id="passport">4015265856</div>
                <div id="a">10.05.2019</div>
                <div id="a1">10.05.2019</div>
                <div id="b">10.05.2021</div>
            </div>
        </body>
      </html>`;

        await fs.writeFile(`/root/driveBot/temp/users/${props.user_id}/Европейские(на пластик)_2.html`, international_side_2, async (error) => {});
        const browser5 = await puppeteer.launch({
            args: ['--no-sandbox'],
        });
        const page5 = await browser5.newPage();
        await page5.goto(`file:///root/driveBot/temp/users/${props.user_id}/Европейские(на пластик)_2.html`);
        await page5.setViewport({
            width: 1011,
            height: 638,
            deviceScaleFactor: 1,
        });
        await page5.screenshot({path: `/root/driveBot/temp/users/${props.user_id}/Европейские(на пластик)_2.jpg`, quality: 100});
        await browser5.close();

    } catch (e) {
        console.log(e)
    }

}



export default convert_to_jpeg_mask;

