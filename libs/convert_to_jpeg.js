
import puppeteer from "puppeteer";
import * as fs from "fs";
import random_signature from "../data_generator/random_signature.js";

const convert_to_jpeg = async (props, type) => {
    console.log(props)
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
            <div id="serial-number-main"><span>${props.subject_id.split(' ')[0]}</span><span id="serial-number_letters">${props.subject_id.split(' ')[1]}</span><span>${props.subject_id.split(' ')[2]}</span></div>
            <div id="expire-date">12.10.2024</div>
            <div id="issued-by">State Road Traffic Safety Inspection</div>
            <div id="issued-at">${props.living_city}</div>
            <div id="date">12.10.2021</div>
            <img id="stamp_on_main" src="../../../document_templates/russian_international_driving_permit/full/assets/images/stamp/Circulation%20Automobile%20International%20копия%20${props.subject_id_number}.png"/>
            <div id="national-licence-serial-number">${props.national_driver_license}</div>
            <img id="official-signature" src="../../../document_templates/russian_international_driving_permit/full/assets/images/signatures/official/signature_${random_signature()}.png"/>
          </div>
        </body>
      </html>`;
        await fs.writeFile(`/root/driveBot/temp/users/${props.user_id}/Полный_разворот_1.html`, russian_full_side_1, async (error) => {
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
        });


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
            <div id="living-place">${props.living_city}, ${props.living_country.toUpperCase()}</div>
            <div id="serial-number"><span>${props.subject_id.split(' ')[0]} </span><span id="serial-number_letters"> ${props.subject_id.split(' ')[1]} </span><span> ${props.subject_id.split(' ')[2]}</span></div>
            <img id="photo" src="${props.user_id}.jpg"/>
            <img id="category-stamp" src="../../../document_templates/russian_international_driving_permit/full/assets/images/category_stamp/МВД%20РОССИИ%20копия%20${props.subject_id_number}.png"/>
            <img id="category-stamp_2" src="../../../document_templates/russian_international_driving_permit/full/assets/images/category_stamp/МВД%20РОССИИ%20копия%20${props.subject_id_number}.png"/>
            <img id="stamp" src="../../../document_templates/russian_international_driving_permit/full/assets/images/stamp/Circulation%20Automobile%20International%20копия%20${props.subject_id_number}.png"/>
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
                <div id="serial-number-main"><span>${props.subject_id.split(' ')[0]}</span><span id="serial-number_letters">${props.subject_id.split(' ')[1]}</span><span>${props.subject_id.split(' ')[2]}</span></div>
                <div id="expire-date">12.10.2023</div>
                <div id="issued-by">State Road Traffic Safety Inspection</div>
                <div id="issued-at">${props.living_city}</div>
                <div id="date">12.10.2020</div>
                <div id="national-licence-serial-number">${props.national_driver_license}</div>
                <img id="official-signature" src="../../../document_templates/russian_international_driving_permit/short/assets/images/signatures/official/signature_${random_signature()}.png"/>
            
                <div id="first-name">${props.first_name}</div>
                <div id="last-name">${props.last_name}</div>
                <div id="place-of-birth">${props.city_of_birth}, ${props.country_of_birth}</div>
                <div id="date-of-birth">${props.date_of_birth}</div>
                <div id="living-place">${props.living_city}, ${props.living_country.toUpperCase()}</div>
            
                <img class="category_stamp_1" src="../../../document_templates/russian_international_driving_permit/short/assets/images/category_stamp/МВД%20РОССИИ%20копия%20${props.subject_id_number}.png">
                <img class="category_stamp_2" src="../../../document_templates/russian_international_driving_permit/short/assets/images/category_stamp/МВД%20РОССИИ%20копия%20${props.subject_id_number}.png">
            
            
                <img id="stamp" src="../../../document_templates/russian_international_driving_permit/short/assets/images/stamp/Circulation%20Automobile%20International%20копия%20${props.subject_id_number}.png"/>
                <img id="stamp2" src="../../../document_templates/russian_international_driving_permit/short/assets/images/stamp/Circulation%20Automobile%20International%20копия%20${props.subject_id_number}.png"/>
                <img id="stamp3" src="../../../document_templates/russian_international_driving_permit/short/assets/images/stamp/Circulation%20Automobile%20International%20копия%20${props.subject_id_number}.png"/>
                <img id="photo" src="${props.user_id}.jpg"/>
                <div id="serial-number"><span>${props.subject_id.split(' ')[0]}</span><span id="serial-number_letters">${props.subject_id.split(' ')[1]}</span><span>${props.subject_id.split(' ')[2]}</span></div>
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
            <div id="living-index-and-country">${props.living_index}, ${props.living_country.toUpperCase()}</div>
            <div id="sex">${props.sex}</div>
            <div id="eyes">${props.eyes}</div>
            <div id="ht">${props.height}</div>
            <div id="category">A, A1, B, B1</div>
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
                <div id="id-code">DL1238440</div>
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



export default convert_to_jpeg;



//
// Республика Адыгея	01
// Республика Алтай	04
// Республика Башкортостан	02
// Республика Бурятия	03
// Республика Дагестан	05
// Республика Ингушетия	06
// Кабардино-Балкарская Республика	07
// Республика Калмыкия	08
// Карачаево-Черкесская Республика	09
// Республика Карелия	10
// Республика Коми	11
// Республика Крым	82
// Республика Марий Эл	12
// Республика Мордовия	13
// Республика Саха (Якутия)	14
// Республика Северная Осетия — Алания	15
// Республика Татарстан	16
// Республика Тыва	17
// Удмуртская Республика	18
// Республика Хакасия	19
// Чеченская Республика	20
// Чувашская Республика	21
// Алтайский край	22
// Забайкальский край	75
// Камчатский край	41
// Краснодарский край	23
// Красноярский край	24
// Пермский край	59
// Приморский край	25
// Ставропольский край	26
// Хабаровский край	27
// Амурская область	28
// Архангельская область	29
// Астраханская область	30
// Белгородская область	31
// Брянская область	32
// Владимирская область	33
// Волгоградская область	34
// Вологодская область	35
// Воронежская область	36
// Ивановская область	37
// Иркутская область	38
// Калининградская область	39
// Калужская область	40
// Кемеровская область	42
// Кировская область	43
// Костромская область	44
// Курганская область	45
// Курская область	46
// Ленинградская область	47
// Липецкая область	48
// Магаданская область	49
// Московская область	50
// Мурманская область	51
// Нижегородская область	52
// Новгородская область	53
// Новосибирская область	54
// Омская область	55
// Оренбургская область	56
// Орловская область	57
// Пензенская область	58
// Псковская область	60
// Ростовская область	61
// Рязанская область	62
// Самарская область	63
// Саратовская область	64
// Сахалинская область	65
// Свердловская область	66
// Смоленская область	67
// Тамбовская область	68
// Тверская область	69
// Томская область	70
// Тульская область	71
// Тюменская область	72
// Ульяновская область	73
// Челябинская область	74
// Ярославская область	76
// Москва	77
// Санкт-Петербург	78
// Севастополь	92
// Еврейская автономная область	79
// Ненецкий автономный округ	83
// Донецкая Народная Республика	80
// Луганская Народная Республика	81
// Херсонская область	84
// Запорожская область	85
// Ханты-Мансийский автономный округ — Югра	86
// Чукотский автономный округ	87
// Ямало-Ненецкий автономный округ	89
// Территории, находящиеся за пределами РФ и обслуживаемые Управлением режимных объектов МВД России, Байконур	94