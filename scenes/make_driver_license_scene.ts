import {Composer, Markup, Scenes} from "telegraf";
import db_connect from "../libs/db_connect";
import get_random_data from "../data_generator/get_random_data";
import CyrillicToTranslit from "cyrillic-to-translit-js";
import id_code from "../data_generator/id_code";
import passport_number from "../data_generator/passport_number";
// @ts-ignore
import { v4 as uuidv4 } from 'uuid';
import serial_number from "../data_generator/serial_number";
import convert_to_jpeg from "../libs/convert_to_jpeg";
import * as fs from "fs";
import download_image from "../libs/download";
import {YooCheckout} from "@a2seven/yoo-checkout";
import {bank_card_payload} from "../payment_payloads/bank_card";
import {sberbank} from "../payment_payloads/sberbank";
import random_signature from "../data_generator/random_signature";
import {get_expire_date} from "../data_generator/get_expire_date";
var newDBconnect: db_connect;
// @ts-ignore
const cyrillicToTranslit = new CyrillicToTranslit();

const to_start = async (ctx:any) => {
    try {
        await newDBconnect.updateOrder({key: "payment_status", value: "fail"});
        await newDBconnect.updateOrder({key: "status", value: "fail"});
        await ctx.answerCbQuery("to_start");
        // @ts-ignore
        await ctx.wizard.selectStep(0);
    } catch (e) {
        console.log(e)
    }
}
const random_data = async (ctx:any) => {
    await ctx.answerCbQuery();
    try {
        const fake_data = await get_random_data();
        // @ts-ignore
        const {city_of_birth, country_of_birth, living_index, living_country, living_city, living_street, house_number, subject_id} = fake_data;
        // @ts-ignore
        const first_name = ctx.wizard.state.first_name;
        // @ts-ignore
        const last_name = ctx.wizard.state.last_name;
        // @ts-ignore
        const second_name = ctx.wizard.state.second_name;
        // @ts-ignore
        const sex = ctx.wizard.state.sex;
        // @ts-ignore
        const eyes = ctx.wizard.state.eyes;
        // @ts-ignore
        const height = ctx.wizard.state.height;
        // @ts-ignore
        const date_of_birth = ctx.wizard.state.date_of_birth;
        // @ts-ignore
        ctx.wizard.state.subject_id = subject_id;
        // @ts-ignore
        ctx.wizard.state.city_of_birth = city_of_birth;
        // @ts-ignore
        ctx.wizard.state.country_of_birth = country_of_birth;
        // @ts-ignore
        ctx.wizard.state.living_index = living_index;
        // @ts-ignore
        ctx.wizard.state.living_country = living_country;
        // @ts-ignore
        ctx.wizard.state.living_city = living_city;
        // @ts-ignore
        ctx.wizard.state.living_street = living_street;
        // @ts-ignore
        ctx.wizard.state.house_number = house_number;
        // @ts-ignore
        ctx.wizard.state.subject_id = subject_id;
        // @ts-ignore
        ctx.wizard.state.subject_id_number = subject_id.split(" ")[0];
        // @ts-ignore
        if (ctx.wizard.state.type === "only_ru") {
            await ctx.replyWithHTML(
                `<b>Проверьте правильность введенной информации:</b>
<b>Имя</b>: ${first_name.toUpperCase()}
<b>Фамилия</b>: ${last_name.toUpperCase()}
<b>Отчество</b>: ${second_name.toUpperCase()}
<b>Дата рождения</b>: ${date_of_birth}
<b>Место рождения</b>: ${country_of_birth.toUpperCase()}, ${city_of_birth.toUpperCase()}
<b>Место проживания</b>: ${living_country.toUpperCase()}, ${living_city.toUpperCase()}`,
                Markup.inlineKeyboard([
                    [Markup.button.callback("✔ Все верно", "confirm"), Markup.button.callback("🔁 Сгенерировать заново", "generate_again")],
                    [Markup.button.callback("👉 Начать заново (жми два раза)", "start_again")]
                ])
            )
        }
        // @ts-ignore
        if (ctx.wizard.state.type === "ru_eu") {
            await ctx.replyWithHTML(`<b>Проверьте правильность введенной информации:</b>
<b> Имя </b>: ${first_name.toUpperCase()}
<b> Фамилия </b>: ${last_name.toUpperCase()}
<b> Отчество </b>: ${second_name.toUpperCase()}
<b> Дата рождения </b>: ${date_of_birth}
<b> Место рождения </b>: ${country_of_birth.toUpperCase()}, ${city_of_birth.toUpperCase()}
<b> Место проживания </b>: ${living_country.toUpperCase()}, ${living_city.toUpperCase()}, ${living_street.toUpperCase()}, ${house_number}, ${living_index.toUpperCase()}
<b> Пол </b>: ${sex.toUpperCase()}
<b> Цвет глаз </b>: ${eyes.toUpperCase()}
<b> Рост </b>: ${height}
<b> Номер удостоверения </b>:${subject_id}`,
                Markup.inlineKeyboard([
                    [Markup.button.callback("✔ Все верно", "confirm"), Markup.button.callback("🔁 Сгенерировать заново", "generate_again")],
                    [Markup.button.callback("👉 Начать заново (жми два раза)", "start_again")]
                ])
            )
        }
    } catch (e) {
        console.log(e)
    }

}

//step 0
const chooseCountry = new Composer();
chooseCountry.action("russia", async (ctx) => {
    // @ts-ignore
    newDBconnect = new db_connect(ctx.wizard.state.user_id);
    await newDBconnect.updateOrder({key: "payment_status", value: "fail"});
    await newDBconnect.updateOrder({key: "payment_status", value: "fail"});
    try {
        // @ts-ignore
        ctx.wizard.state.living_country = "RUSSIA";
        // @ts-ignore
        // await ctx.replyWithVideo("/root/driveBot/examples/example.mp4");
        await ctx.replyWithHTML(`<b>В стоимость входит два вида макетов:</b>
- Бутафорские Российские международные права <b>полный разворот</b> (2 файла)
- Бутафорские Российские международные права <b>только основные части</b> (1 файл)
В качестве <b>подарка</b> мы предоставляем вам возможность сделать бутафорию европейского образца (нужно будет ответить на несколько дополнительных вопросов)`,
            Markup.inlineKeyboard([
                [Markup.button.callback("🇷🇺 РФ международные","only_ru" )],
                [Markup.button.callback("🇷🇺 РФ международные + 🇪🇺 европейские", "ru_eu")],
                [Markup.button.callback("Посмотреть образцы", "look_examples")]
            ]));

        // @ts-ignore
        return ctx.wizard.selectStep(1);
    } catch (e) {
        console.log(e)
    }
})
chooseCountry.on("callback_query", async (ctx) => {
    try {
        // @ts-ignore
        ctx.wizard.state.user_id = ctx.update.callback_query.message.chat.id;
        // @ts-ignore
        await ctx.answerCbQuery();
        await ctx.replyWithHTML("Выберите страну", Markup.inlineKeyboard([
            [Markup.button.callback("Франиция (в разработке)", "france")],
            [Markup.button.callback("Англия (в разработке)", "united_kingdom")],
            [Markup.button.callback("Мексика (в разработке)", "mexico")],
            [Markup.button.callback("Россия", "russia")],
            [Markup.button.callback("Украина (в разработке)", "ukraine")],
            [Markup.button.callback("США (в разработке)", "united_states")],
            [Markup.button.callback("👉 Начать заново (жми два раза)", "start_again")]
        ]))
    } catch (e) {
        console.log(e)
    }
})

// step 1
const getDateOfBirthStep = new Composer();
getDateOfBirthStep.action("look_examples", async (ctx) => {
    try {
        // @ts-ignore
        await ctx.answerCbQuery();
        await ctx.replyWithDocument({ source: `/root/driveBot/examples/international_driver_license/Европейские(на пластик)_1.jpg` });
        await ctx.replyWithDocument({ source: `/root/driveBot/examples/international_driver_license/Европейские(на пластик)_2.jpg` });
        await ctx.replyWithDocument({ source: `/root/driveBot/examples/russian_international_driving_permit/full/Полный_разворот_1.jpg` });
        await ctx.replyWithDocument({ source: `/root/driveBot/examples/russian_international_driving_permit/full/Полный_разворот_2.jpg` });
        await ctx.replyWithDocument({ source: `/root/driveBot/examples/russian_international_driving_permit/short/Короткая_версия.jpg` },
            Markup.inlineKeyboard(
                [
                    [Markup.button.callback("⭐ Назад", "prev_step")],
                    [Markup.button.callback("👉 В начало", "to_start")]
                ]
            ));
    } catch (e) {
        console.log(e)
    }
});
getDateOfBirthStep.action("start_again", to_start);
getDateOfBirthStep.action("only_ru", async (ctx) => {
    try {
        await ctx.answerCbQuery();
        // @ts-ignore
        ctx.wizard.state.type = ctx.update.callback_query["data"];
        await ctx.replyWithHTML("Напишите Дату Рождения 🎂 (формат: <b>дд.мм.гггг</b>)",
            Markup.inlineKeyboard([[Markup.button.callback("👉 Начать заново (жми два раза)","start_again")]]))
        // @ts-ignore
        return ctx.wizard.selectStep(5);
    } catch (e) {
        console.log(e)
    }
})
getDateOfBirthStep.action("ru_eu", async (ctx) => {
    try {
        await ctx.answerCbQuery();
        // @ts-ignore
        ctx.wizard.state.type = ctx.update.callback_query["data"];
        await ctx.replyWithHTML("Напишите Дату Рождения 🎂 (формат: <b>дд.мм.гггг</b>)",
            Markup.inlineKeyboard([[Markup.button.callback("👉 Начать заново (жми два раза)","start_again")]]))
        // @ts-ignore
        return ctx.wizard.selectStep(2);
    } catch (e) {
        console.log(e)
    }
})
getDateOfBirthStep.action("prev_step", async (ctx) => {
    try {
        await ctx.answerCbQuery();
        // @ts-ignore
        return ctx.wizard.selectStep(0);
    } catch (e) {
        console.log(e)
    }
});

getDateOfBirthStep.action("to_start", async (ctx) => {
    try {
        await ctx.answerCbQuery();
        // @ts-ignore
        return ctx.wizard.selectStep(0);
    } catch (e) {
        console.log(e)
    }
});


// 2
const getSex = new Composer();
getSex.action("start_again", to_start);
getSex.on("text", async(ctx) => {
    try {
        // @ts-ignore
        ctx.wizard.state.date_of_birth = ctx.message.text.trim();
        await ctx.replyWithHTML("Укажите ваш пол", Markup.inlineKeyboard([
            [Markup.button.callback("🦸‍♂️М","M"), Markup.button.callback("🦸‍♀️Ж","F")],
            [Markup.button.callback("👉 Начать заново (жми два раза)","start_again")]
        ]))
        // @ts-ignore
        return ctx.wizard.selectStep(3);
    } catch (e) {
        console.log(e)
    }
})


// 3
const getEyesColor = new Composer();
getEyesColor.action("start_again", to_start);
getEyesColor.on("callback_query", async(ctx) => {
    // @ts-ignore
    let sex = ctx.update.callback_query["data"];
    try {
        // @ts-ignore
        ctx.wizard.state.sex = sex;
        await ctx.replyWithHTML("Укажите цвет глаз 👀", Markup.inlineKeyboard([
            [Markup.button.callback("⚪ Серые","GRAY"),Markup.button.callback("🟢 Зеленые","GREEN") ],
            [Markup.button.callback("🔵 Синие", "BLUE"), Markup.button.callback("🟤 Карие","BROWN")],
            [Markup.button.callback("👉 Начать заново (жми два раза)","start_again")]
        ]))
        // @ts-ignore
        return ctx.wizard.selectStep(4);
    } catch (e) {
        console.log(e)
    }
})

// 4
const getHeight = new Composer();
getHeight.action("start_again", to_start);
getHeight.on("callback_query", async (ctx) => {
    // @ts-ignore
    ctx.wizard.state.eyes = ctx.update.callback_query["data"];
    try {
        await ctx.replyWithHTML("<b>Укажите ваш рост в сантиметрах. Например: 183</b>",  Markup.inlineKeyboard([[Markup.button.callback("👉 Начать заново (жми два раза)","start_again")]]))
        // @ts-ignore
        return ctx.wizard.selectStep(5);
    } catch (e) {
        console.log(e)
    }
})


// 5
const getNameStep = new Composer();
getNameStep.action("start_again", to_start)
getNameStep.on("text", async (ctx) => {
    try {
        if (ctx.message.text.split('.').length === 3) {
            // @ts-ignore
            ctx.wizard.state.date_of_birth = ctx.message.text.trim();
        } else {
            // @ts-ignore
            ctx.wizard.state.height = ctx.message.text;
        }
        await ctx.replyWithHTML("Напишите Фамилию Имя Отчество. Пример: <b>Пушкин Александр Сергеевич</b>",  Markup.inlineKeyboard([[Markup.button.callback("👉 Начать заново (жми два раза)","start_again")]]))
        // @ts-ignore
        return ctx.wizard.selectStep(6);
    } catch (e) {
        console.log(e)
    }
})


// 6
const isRandomAll = new Composer();
isRandomAll.action("start", to_start);
isRandomAll.action("write_myself", async (ctx) => {
    // @ts-ignore
    if (ctx.update.callback_query["data"] === "write_myself") {
        await ctx.replyWithHTML("Укажитете город, где родились. Пример: <b>Москва</b>",
            Markup.inlineKeyboard([
                [Markup.button.callback("👉 Начать заново (жми два раза)","start_again")]
            ]))
        // @ts-ignore
        return ctx.wizard.selectStep(7);
    }
});
isRandomAll.action("random_data", random_data);
isRandomAll.action("generate_again", random_data);
isRandomAll.action("confirm", async (ctx) => {
    try {
        await ctx.answerCbQuery();
        // @ts-ignore
        ctx.wizard.state.id_code = id_code();
        // @ts-ignore
        ctx.wizard.state.passport_number = passport_number();
        // @ts-ignore
        ctx.wizard.state.national_driver_license = passport_number();
        await ctx.replyWithHTML(`Загрузите фото <b>как на документы</b>, соотношение ширины к высоте <b>3:4</b>.
Если уже есть фото 3х4см, сфотографируйте на телефон, обрежьте изображение по краям фотографии и отправляйте. В течение пары минут вам придут образцы.
<b>Внимание!</b>
Если отправляете фото с компьютера, поставьте галочку <b>"сжать изображения/compress images"</b>.
Чтобы подготовить фото с соотношением сторон 3х4, вы можете воспользоваться простейшим приложением, скачать его на андроид можно по 👉 <a href='https://play.google.com/store/apps/details?id=com.arumcomm.cropimage'>этой ссылке</a>👈
для айфона приложение вы можете скачать 
по 👉 <a href='https://apps.apple.com/ru/app/%D0%BE%D0%B1%D1%80%D0%B5%D0%B7%D0%BA%D0%B0-%D1%84%D0%BE%D1%82%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B9/id442008567'>этой ссылке</a>👈`,
            Markup.inlineKeyboard([
                [Markup.button.callback("👉 Начать заново (жми два раза)", "start_again")]
            ]))
        // @ts-ignore
        return ctx.wizard.selectStep(15);
    } catch (e) {
        console.log(e)
    }
});
isRandomAll.on("text", async (ctx) => {
    try {
        // @ts-ignore
        ctx.wizard.state.last_name = cyrillicToTranslit.transform(ctx.message.text.split(" ")[0]).toUpperCase();
        // @ts-ignore
        ctx.wizard.state.first_name = cyrillicToTranslit.transform(ctx.message.text.split(" ")[1]).toUpperCase();
        // @ts-ignore
        ctx.wizard.state.second_name = cyrillicToTranslit.transform(ctx.message.text.split(" ")[2]).toUpperCase();

        await ctx.replyWithHTML("Мы можем заполнить все оставшиеся пункты за вас <b>случайными</b> данными", Markup.inlineKeyboard([
            [Markup.button.callback("🖋 Заполню сам","write_myself"), Markup.button.callback("🔣 Случайные данные", "random_data") ],
            [Markup.button.callback("👉 Начать заново (жми два раза)","start_again")]
        ]))
    } catch (e) {
        console.log(e)
    }
})




// 7
const getCountryOfBirth = new Composer();
getCountryOfBirth.action("start_again", to_start);
getCountryOfBirth.on("text", async (ctx) => {
    try {
        // @ts-ignore
        ctx.wizard.state.city_of_birth = cyrillicToTranslit.transform(ctx.message.text.trim()).toUpperCase()
        await ctx.replyWithHTML("Укажите страну рождения. Пример: <b>Россия или СССР </b>",
            Markup.inlineKeyboard([
                [Markup.button.callback("👉 Начать заново (жми два раза)", "start_again")]
            ]))
        // @ts-ignore
        if(ctx.wizard.state.type === "ru_eu") {
            // @ts-ignore
            return ctx.wizard.selectStep(8);
        }
        // @ts-ignore
        if(ctx.wizard.state.type === "only_ru") {
            // @ts-ignore
            return ctx.wizard.selectStep(12);
        }
    } catch (e) {
        console.log(e)
    }
})

// 8
const getLivingStreet = new Composer();
getLivingStreet.action("start_again", to_start);
getLivingStreet.on("text", async (ctx) => {

    let country = ""
    try {
        if (ctx.message.text.trim().toLowerCase() === "россия") {
            country = "RUSSIA"
        } else if (ctx.message.text.trim().toLowerCase() === "ссср") {
            country = "USSR"
        } else {
            country = cyrillicToTranslit.transform(ctx.message.text).toUpperCase();
        }
        // @ts-ignore
        ctx.wizard.state.country_of_birth = country.toUpperCase();

        await ctx.replyWithHTML("Укажите улицу проживания. Пример: <b>ул.Гагарина</b>",
            Markup.inlineKeyboard([
                [Markup.button.callback("👉 Начать заново (жми два раза)","start_again")]
            ]))
        // @ts-ignore
        return ctx.wizard.selectStep(9);
    } catch (e) {
        console.log(e)
    }
})

// 9
const getHouseNumber = new Composer();
getHouseNumber.action("start_again", to_start);
getHouseNumber.on("text", async (ctx) => {
    try {
        // @ts-ignore
        ctx.wizard.state.living_street = cyrillicToTranslit.transform(ctx.message.text).toUpperCase()
        await ctx.replyWithHTML("Укажите номер дома. Пример: <b>34/2</b>")
        // @ts-ignore
        return ctx.wizard.selectStep(10);
    } catch (e) {
        console.log(e)
    }
})

// 10
const getLivingIndex = new Composer();
getLivingIndex.action("start_again", to_start);
getLivingIndex.on("text", async (ctx) => {
    try {
        // @ts-ignore
        ctx.wizard.state.house_number = ctx.message.text;
        await ctx.replyWithHTML("Укажите почтовый индекс. Пример: <b>192168</b>")
        // @ts-ignore
        return ctx.wizard.selectStep(11);
    } catch (e) {
        console.log(e)
    }
})




// 11
const getLivingCity = new Composer();
getLivingCity.action("start_again", to_start);
getLivingCity.on("text", async (ctx) => {
    try {
        // @ts-ignore
        ctx.wizard.state.living_index = ctx.message.text.toUpperCase();
        await ctx.replyWithHTML("Укажите город проживания. Пример: <b>Москва</b>");
        // @ts-ignore
        return ctx.wizard.selectStep(13);
    } catch (e) {
        console.log(e)
    }
});

// 12
const getLivingCity_ru = new Composer();
getLivingCity_ru.on("text", async (ctx) => {
    try {
        let country = "";
        if (ctx.message.text.trim().toLowerCase() === "россия") {
            country = "RUSSIA";
        } else if (ctx.message.text.trim().toLowerCase() === "ссср") {
            country = "USSR";
        } else {
            country = cyrillicToTranslit.transform(ctx.message.text).toUpperCase();
        }
        // @ts-ignore
        ctx.wizard.state.country_of_birth = country;
        // @ts-ignore
        ctx.wizard.state.living_index = ctx.message.text.toUpperCase();
        await ctx.replyWithHTML("Укажите город проживания. Пример: <b>Москва</b>");
        // @ts-ignore
        return ctx.wizard.selectStep(13);
    } catch (e) {
        console.log(e)
    }
});
// 13
const getSubjectIdAndMakeSerialNumber = new Composer();
getSubjectIdAndMakeSerialNumber.action("start_again", to_start);
getSubjectIdAndMakeSerialNumber.on("text", async (ctx) => {
    try {
        // @ts-ignore
        ctx.wizard.state.living_city = cyrillicToTranslit.transform(ctx.message.text).toUpperCase();
        await ctx.replyWithHTML("Напишите двузначный ГИБДД-код субьекта РФ, к которому относится место проживания, указанное на предыдущем шаге.<a href='https://ru.wikipedia.org/wiki/%D0%9A%D0%BE%D0%B4%D1%8B_%D1%81%D1%83%D0%B1%D1%8A%D0%B5%D0%BA%D1%82%D0%BE%D0%B2_%D0%A0%D0%BE%D1%81%D1%81%D0%B8%D0%B9%D1%81%D0%BA%D0%BE%D0%B9_%D0%A4%D0%B5%D0%B4%D0%B5%D1%80%D0%B0%D1%86%D0%B8%D0%B8'>Узнать код можно тут</a>")
        // @ts-ignore
        return ctx.wizard.selectStep(14);
    } catch (e) {
        console.log(e)
    }
})


// 14
const getApprove = new Composer();
getApprove.action("start_again", to_start);
getApprove.on("text", async (ctx) => {
    try {
        // @ts-ignore
        ctx.wizard.state.subject_id_number = ctx.message.text;
        // @ts-ignore
        ctx.wizard.state.subject_id = serial_number(ctx.message.text);
        // @ts-ignore
        const { type, first_name, last_name, second_name, date_of_birth, city_of_birth, house_number, subject_id, country_of_birth, living_index, living_country, living_city, living_street, sex, eyes, height} = ctx.wizard.state;
        // @ts-ignore
        console.log(ctx.wizard.state)
        // @ts-ignore
        if (type === "ru_eu"){
            console.log("ru_eu")
            await ctx.replyWithHTML(`<b>Проверьте правильность введенной информации:</b>
<b> Имя </b>: ${first_name.toUpperCase()}
<b> Фамилия </b>: ${last_name.toUpperCase()}
<b> Отчество </b>: ${second_name.toUpperCase()}
<b> Дата рождения </b>: ${date_of_birth}
<b> Место рождения </b>: ${country_of_birth.toUpperCase()}, ${city_of_birth.toUpperCase()}
<b> Место проживания </b>: ${living_country.toUpperCase()}, ${living_city.toUpperCase()}, ${living_street.toUpperCase()}, ${house_number}, ${living_index.toUpperCase()}
<b> Пол </b>: ${sex.toUpperCase()}
<b> Цвет глаз </b>: ${eyes.toUpperCase()}
<b> Рост </b>: ${height}
<b> Номер удостоверения </b>:${subject_id}`,
                Markup.inlineKeyboard([
                    [Markup.button.callback("✔ Всё верно","right"),Markup.button.callback("❌ Не верно","wrong") ]
                ])
            )
        } else {
            console.log("ru")
            // @ts-ignore
            await ctx.replyWithHTML(
                `<b>Проверьте правильность введенной информации:</b>
<b>Имя</b>: ${first_name.toUpperCase()}
<b>Фамилия</b>: ${last_name.toUpperCase()}
<b>Отчество</b>: ${second_name.toUpperCase()}
<b>Дата рождения</b>: ${date_of_birth}
<b>Место рождения</b>: ${country_of_birth.toUpperCase()}, ${city_of_birth.toUpperCase()}
<b>Место проживания</b>: ${living_country.toUpperCase()}, ${living_city.toUpperCase()}`,
                Markup.inlineKeyboard([
                    [Markup.button.callback("✔ Всё верно","right"),Markup.button.callback("❌ Не верно","wrong") ]
                ])
            )
        }
        // @ts-ignore
        return ctx.wizard.selectStep(15);
    } catch (e) {
        console.log(e)
    }
})


// 15
const getPhoto = new Composer();
getPhoto.action("start_again", to_start);

getPhoto.action("make_payment", async ctx => {
    try {
        await ctx.answerCbQuery("make_payment");
        await ctx.replyWithHTML("Выберите подходящий способ оплаты", Markup.inlineKeyboard([
            [Markup.button.callback("Банковской картой","bank_card" )],
            [Markup.button.callback("Sberpay","sberbank" )],
        ]));
        // @ts-ignore
        return ctx.wizard.selectStep(16);
    } catch (e) {
        console.log(e)
    }

});

getPhoto.action("wrong", async ctx => {
    try {
        await ctx.answerCbQuery();
        await ctx.replyWithHTML("<b>Чтобы перейти к началу заполнения анкеты, нажмите кнопку '👉 Начать заново'</b>",
            Markup.inlineKeyboard([[Markup.button.callback("👉 Начать заново (жми два раза)","start_again")]]));
        // @ts-ignore
        return ctx.wizard.selectStep(0);
    } catch (e) {
        console.log(e)
    }
});

getPhoto.on("photo", async (ctx) => {

    const date = get_expire_date();
    console.log(date)
    // @ts-ignore
    ctx.wizard.state.rus_license_date = date;
    // @ts-ignore
    ctx.wizard.state.rus_license_exp_date = {
        dd: date["dd"],
        mm: date["mm"],
        yy: date["yy"] + 3
    };
    const client_signature = random_signature();
    // @ts-ignore
    ctx.wizard.state.client_signature = client_signature;
    const official_signature = random_signature();
    // @ts-ignore
    ctx.wizard.state.official_signature = official_signature;



    // @ts-ignore
    const picture = ctx.message.photo[2].file_id || ctx.message.photo[1].file_id || ctx.message.photo[0].file_id;
    console.log("picture " + picture)
    const fileUrl = await ctx.telegram.getFileLink(picture);
    console.log("fileUrl " + fileUrl)
    try {
        fs.stat(`/root/driveBot/temp/users/${ctx.message.chat.id}`, async (err) => {
            if (!err) {
                // console.log("папка создана")
                await download_image(fileUrl.href, `/root/driveBot/temp/users/${ctx.message.chat.id}/${ctx.message.chat.id}.jpg`);
            } else if (err.code === 'ENOENT') {
                // console.log('директории нет');
                fs.mkdir(`/root/driveBot/temp/users/${ctx.message.chat.id}`, async (err) => {
                    if (err)
                        throw err; // не удалось создать папку
                    // console.log("папку создал")
                    await download_image(fileUrl.href, `/root/driveBot/temp/users/${ctx.message.chat.id}/${ctx.message.chat.id}.jpg`);
                });
            }
            // @ts-ignore
            if (ctx.message.from.username === "vansaal" || ctx.message.from.username === "DiduBaba" || "xeroxDoc_bot_support") {
                // @ts-ignore
                await convert_to_jpeg(ctx.wizard.state).then( async () => {
                    // абсолютный путь E:///myProjects/driveBot/temp/users/${ctx.message.chat.id}/.jpg
                    // @ts-ignore
                    await ctx.replyWithDocument({ source: `/root/driveBot/temp/users/${ctx.message.chat.id}/Полный_разворот_1.jpg` });
                    // @ts-ignore
                    await ctx.replyWithDocument({ source: `/root/driveBot/temp/users/${ctx.message.chat.id}/Полный_разворот_2.jpg` });
                    // @ts-ignore
                    await ctx.replyWithDocument({ source: `/root/driveBot/temp/users/${ctx.message.chat.id}/Короткая_версия.jpg` });
                    // @ts-ignore
                    if (ctx.wizard.state.type === "ru_eu"){
                        // @ts-ignore
                        await ctx.replyWithDocument({ source: `/root/driveBot/temp/users/${ctx.message.chat.id}/Европейские(на пластик)_1.jpg` });
                        // @ts-ignore
                        await ctx.replyWithDocument({ source: `/root/driveBot/temp/users/${ctx.message.chat.id}/Европейские(на пластик)_2.jpg` });
                    }
                    await ctx.replyWithHTML(`Если образцы вышли хорошо, жмите кнопку <b>Оплатить</b>. В течение 1-5 минут после оплаты, вам придут файлы для печати. Чтобы 👉 начать заново жмите соотвествующую кнопку`,
                        Markup.inlineKeyboard([
                            [Markup.button.callback("💳 Оплатить","make_payment"), Markup.button.callback("🎭 Загрузить другое фото","update_photo")],
                            [Markup.button.callback("👉 Начать заново (жми два раза)","start_again")]
                        ])
                    )
                });
            } else {
                // @ts-ignore
                await convert_to_jpeg(ctx.wizard.state, "example").then( async () => {
                    // абсолютный путь E:///myProjects/driveBot/temp/users/${ctx.message.chat.id}/.jpg
                    // @ts-ignore
                    await ctx.replyWithDocument({ source: `/root/driveBot/temp/users/${ctx.message.chat.id}/Полный_разворот_1.jpg` });
                    // @ts-ignore
                    await ctx.replyWithDocument({ source: `/root/driveBot/temp/users/${ctx.message.chat.id}/Полный_разворот_2.jpg` });
                    // @ts-ignore
                    await ctx.replyWithDocument({ source: `/root/driveBot/temp/users/${ctx.message.chat.id}/Короткая_версия.jpg` });
                    // @ts-ignore
                    if (ctx.wizard.state.type === "ru_eu"){
                        // @ts-ignore
                        await ctx.replyWithDocument({ source: `/root/driveBot/temp/users/${ctx.message.chat.id}/Европейские(на пластик)_1.jpg` });
                        // @ts-ignore
                        await ctx.replyWithDocument({ source: `/root/driveBot/temp/users/${ctx.message.chat.id}/Европейские(на пластик)_2.jpg` });
                    }
                    await ctx.replyWithHTML(`Если образцы вышли хорошо, жмите кнопку <b>Оплатить</b>. В течение 1-5 минут после оплаты, вам придут файлы для печати. Чтобы 👉 начать заново жмите соотвествующую кнопку`,
                        Markup.inlineKeyboard([
                            [Markup.button.callback("💳 Оплатить","make_payment"), Markup.button.callback("🎭 Загрузить другое фото","update_photo")],
                            [Markup.button.callback("👉 Начать заново (жми два раза)","start_again")]
                        ])
                    )
                });
            }
        });
    } catch (e) {
        console.log(e)
    }
});

getPhoto.action("right", async ctx => {
    try {
        await ctx.answerCbQuery();
        // @ts-ignore
        ctx.wizard.state.id_code = id_code();
        // @ts-ignore
        ctx.wizard.state.passport_number = passport_number();
        // @ts-ignore
        ctx.wizard.state.national_driver_license = passport_number();


        await ctx.replyWithHTML(`Загрузите фото <b>как на документы</b>, соотношение ширины к высоте <b> строго 3:4</b>.
Если уже есть фото 3х4см, сфотографируйте на телефон, обрежьте изображение по краям фотографии и отправляйте. В течение пары минут вам придут образцы.
<b>Внимание!</b>
Если отправляете фото с компьютера, поставьте галочку <b>"сжать изображения/compress images"</b>`,
            Markup.inlineKeyboard([
                [Markup.button.callback("👉 Начать заново (жми два раза)","start_again")]
            ]))
    } catch (e) {
        console.log(e)
    }
});
getPhoto.action("update_photo", async (ctx) => {
    try {
        await ctx.replyWithHTML(`Загрузите фото <b>как на документы</b>, соотношение ширины к высоте <b>3:4</b>.
Если уже есть фото 3х4см, сфотографируйте на телефон, обрежьте изображение по краям фотографии и отправляйте. В течение пары минут вам придут образцы.
<b>Внимание!</b>
Если отправляете фото с компьютера, поставьте галочку <b>"сжать изображения/compress images"</b>`,
            Markup.inlineKeyboard([[Markup.button.callback("👉 Начать заново (жми два раза)","start_again")]]))
        // @ts-ignore
    } catch (e) {
        console.log(e)
    }
});


// 16
const getCustomerEmail = new Composer();
getCustomerEmail.action("start_again", to_start);
getCustomerEmail.on("callback_query", async (ctx) => {
    try {
        // @ts-ignore
        ctx.wizard.state.payment_type = ctx.update.callback_query["data"];
        // @ts-ignore
        const payment_type = ctx.wizard.state.payment_type;
        await ctx.replyWithHTML("Введите свою почту, чтобы мы могли прислать вам чек об оплате. <b>Пример</b>: example@mail.ru. <b>Важно!</b> Если почта будет введена не корректно, платеж не пройдет.");
        // @ts-ignore
        const user_id = ctx.wizard.state.user_id;
        const order_data = {
            user_id,
            payment_type
        }


        // @ts-ignore
        await newDBconnect.addNewOrder(order_data);

        // @ts-ignore
        return ctx.wizard.selectStep(17);
    } catch (e) {
        console.log(e)
    }
});


// 17
const makePayment = new Composer();
makePayment.action("start_again", to_start);
makePayment.on("text", async (ctx) => {
    const checkout = new YooCheckout({ shopId: '959346', secretKey: 'live_Ov9tXrXrZAyBU840C2LbZnJbgFb58937zgoq65MazK4' });
    const idempotenceKey = uuidv4();
    let payment;
    // @ts-ignore
    let email = ctx.message.text.trim();

    try {
        // @ts-ignore
        switch (ctx.wizard.state.payment_type) {
            case "bank_card":
                payment = await checkout.createPayment(bank_card_payload(email), idempotenceKey);
                break;
            case "sberbank":
                payment = await checkout.createPayment(sberbank(email), idempotenceKey);
                break;
        }
        // @ts-ignore
        const payment_id = payment.id;
        // @ts-ignore
        ctx.wizard.state.payment_id = payment_id;
        // @ts-ignore
        await newDBconnect.updateOrder({key: "payment_id", value: ctx.wizard.state.payment_id});
        // @ts-ignore
        const confirmation_url = payment.confirmation.confirmation_url ? payment.confirmation.confirmation_url : 'empty';

        if (confirmation_url != null) {
            await ctx.replyWithHTML(confirmation_url, Markup.inlineKeyboard([[Markup.button.callback("👉 Начать заново (жми два раза)","start_again")]])).then(async () => {
                let payment_result = await checkout.getPayment(payment_id);
                let counter = 0;
                async function getPayment() {
                    payment_result = await checkout.getPayment(payment_id);
                    if (payment_result.status === "succeeded") {
                        clearInterval(interval_id);
                        // @ts-ignore
                        await newDBconnect.updateOrder({key: "payment_status", value: "success"});
                        // @ts-ignore
                        await ctx.replyWithHTML("Оплата прошла. Спасибо! В течении 5 минут вам придут файлы для печати.");
                        // @ts-ignore
                        await convert_to_jpeg(ctx.wizard.state).then( async () => {
                            // @ts-ignore
                            await ctx.replyWithDocument({ source: `/root/driveBot/temp/users/${ctx.wizard.state.user_id}/Полный_разворот_1.jpg` });
                            // @ts-ignore
                            await ctx.replyWithDocument({ source: `/root/driveBot/temp/users/${ctx.wizard.state.user_id}/Полный_разворот_2.jpg` });
                            // @ts-ignore
                            await ctx.replyWithDocument({ source: `/root/driveBot/temp/users/${ctx.wizard.state.user_id}/Короткая_версия.jpg` });
                            // @ts-ignore
                            if (ctx.wizard.state.type === "ru_eu"){
                                // @ts-ignore
                                await ctx.replyWithDocument({ source: `/root/driveBot/temp/users/${ctx.wizard.state.user_id}/Европейские(на пластик)_1.jpg` });
                                // @ts-ignore
                                await ctx.replyWithDocument({ source: `/root/driveBot/temp/users/${ctx.wizard.state.user_id}/Европейские(на пластик)_2.jpg` });
                            }
                            await ctx.replyWithHTML(`🙏 +100500 в карму за отзыв, который вы можете оставить тут 👉 @xeroxDoc_bot_feedback 🙏`)
                            // @ts-ignore
                            await newDBconnect.updateOrder({key: "status", value: "success"});
                        });
                    }
                    if (counter === 30 && payment_result.status !== "succeeded") {
                        clearInterval(interval_id);
                        // @ts-ignore
                        await newDBconnect.updateOrder({key: "status", value: "fail"});
                        // @ts-ignore
                        await newDBconnect.updateOrder({key: "payment_status", value: "fail"});
                        // @ts-ignore
                        await ctx.replyWithHTML("По каким-то причинам оплата еще не поступила. " +
                            "Если у вас списались средства, но файлы не пришли в течении 10 минут, обратитесь в поддержку, нажав соответствующую кнопку.", Markup.inlineKeyboard([
                            [Markup.button.callback("Обратиться в поддержку","support" )],
                            [Markup.button.callback("Начать заново","start_again" )],
                        ]));
                    }
                    counter++;
                }
                const interval_id = setInterval(getPayment, 20000);
            });
        }
    } catch (error) {
        console.error(error);
    }
})

const make_driver_license_scene = new Scenes.WizardScene(
    "make_driver_license_scene",
    chooseCountry,
    getDateOfBirthStep,
    getSex,
    getEyesColor,
    getHeight,
    getNameStep,
    isRandomAll,
    getCountryOfBirth,
    getLivingStreet,
    getHouseNumber,
    getLivingIndex,
    getLivingCity,
    getLivingCity_ru,
    getSubjectIdAndMakeSerialNumber,
    getApprove,
    getPhoto,
    getCustomerEmail,
    makePayment
)

export default make_driver_license_scene;