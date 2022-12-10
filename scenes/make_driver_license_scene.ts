import {Composer, Markup, Scenes} from "telegraf";
import db_connect from "../libs/db_connect";
import get_random_data from "../data_generator/get_random_data";
import CyrillicToTranslit from "cyrillic-to-translit-js";
import id_code from "../data_generator/id_code";
import passport_number from "../data_generator/passport_number";
// @ts-ignore
import { v4 as uuidv4 } from 'uuid';
import serial_number from "../data_generator/serial_number";
import convert_to_jpeg_mask from "../libs/convert_to_jpeg";
import * as fs from "fs";
import download_image from "../libs/download";
import {ICreatePayment, YooCheckout} from "@a2seven/yoo-checkout";
import {login} from "telegraf/typings/button";
let newDBconnect: db_connect;
// @ts-ignore
const cyrillicToTranslit = new CyrillicToTranslit();
//step 0
const chooseCountry = new Composer();
chooseCountry.on("callback_query", async (ctx) => {
    // @ts-ignore
    newDBconnect = new db_connect(ctx.id);
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
    // @ts-ignore
    return ctx.wizard.selectStep(1)
})

// step 1
const description = new Composer();
description.action("russia", async (ctx) => {
    try {
        // @ts-ignore
        ctx.wizard.state.country = "Russia";
        // @ts-ignore
        await ctx.replyWithHTML("В стоиомсть входит три вида макетов: " +
            "- Сувенирные Российские международные права полный разворот (2 файла) " +
            "- Сувенирные Российские международные права только основные части (1 файл) " +
            "- Сувенирные европейские международные права для печати на пластике (2 файла)",
            Markup.inlineKeyboard([
                [Markup.button.callback("🇷🇺 РФ международные","only_ru" )],
                [Markup.button.callback("🇷🇺 РФ международные + 🇪🇺 европейские", "ru_eu")],
                [Markup.button.callback("Посмотреть образцы", "look_examples")]
            ]));
        // @ts-ignore
        return ctx.wizard.selectStep(2);
    } catch (e) {
        console.log(e)
    }
})

// step 2
const getDateOfBirthStep = new Composer();
getDateOfBirthStep.action("look_examples", async (ctx) => {
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
})
getDateOfBirthStep.on("callback_query", async ctx => {
    await ctx.answerCbQuery();
    // @ts-ignore
    ctx.wizard.state.type = ctx.update.callback_query["data"];
    // @ts-ignore
    if (ctx.update.callback_query["data"] === "start_again") {
        // @ts-ignore
        await ctx.wizard.selectStep(0);
    }
    await ctx.replyWithHTML("Напишите Дату Рождения 🎂 (формат: <b>дд.мм.гггг</b>)",
        Markup.inlineKeyboard([[Markup.button.callback("👉 Начать заново (жми два раза)","start_again")]]))
    // @ts-ignore
    if (ctx.update.callback_query["data"] === "only_ru") {
        // @ts-ignore
        return ctx.wizard.selectStep(6);
    }
    // @ts-ignore
    if (ctx.update.callback_query["data"] === "ru_eu") {
        // @ts-ignore
        return ctx.wizard.selectStep(3);
    }
});

// 3
const getSex = new Composer();
getSex.on("text", async(ctx) => {

    try {
        // @ts-ignore
        ctx.wizard.state.date_of_birth = ctx.message.text.trim();
        await ctx.replyWithHTML("Укажите ваш пол", Markup.inlineKeyboard([
            [Markup.button.callback("🦸‍♂️М","M"), Markup.button.callback("🦸‍♀️Ж","F")],
            [Markup.button.callback("👉 Начать заново (жми два раза)","start_again")]
        ]))
        // @ts-ignore
        return ctx.wizard.selectStep(4);
    } catch (e) {
        console.log(e)
    }
})
getSex.action("start_again", async ctx => {
    // @ts-ignore
    if (ctx.update.callback_query["data"] === "start_again") {
        await ctx.answerCbQuery();
        // @ts-ignore
        await ctx.wizard.selectStep(0);
    }
})
// // 4
const getEyesColor = new Composer();
getEyesColor.action("start_again", async ctx => {
    // @ts-ignore
    if (ctx.update.callback_query["data"] === "start_again") {
        await ctx.answerCbQuery();
        // @ts-ignore
        await ctx.wizard.selectStep(0);
    }
})
getEyesColor.on("callback_query", async(ctx) => {
    // @ts-ignore
    let sex = ctx.update.callback_query["data"];
    try {
        // @ts-ignore
        ctx.wizard.state.sex = sex;
        await ctx.replyWithHTML("Укажите цвет глаз 👀", Markup.inlineKeyboard([
            [Markup.button.callback("⚪ Серые","BLUE"),Markup.button.callback("🟢 Зеленые","GREEN") ],
            [Markup.button.callback("🟡 Желтые", "YELLOW"), Markup.button.callback("🔵 Синие", "BLUE"), Markup.button.callback("🟤 Карие","BROWN")],
            [Markup.button.callback("👉 Начать заново (жми два раза)","start_again")]
        ]))
        // @ts-ignore
        return ctx.wizard.selectStep(5);
    } catch (e) {
        console.log(e)
    }
})

// 5
const getHeight = new Composer();
getHeight.action("start_again", async ctx => {
    // @ts-ignore
    if (ctx.update.callback_query["data"] === "start_again") {
        await ctx.answerCbQuery();
        // @ts-ignore
        await ctx.wizard.selectStep(0);
    }
})
getHeight.on("callback_query", async (ctx) => {

    // @ts-ignore
    let eyes_color = ctx.update.callback_query["data"];
    try {
        // @ts-ignore
        ctx.wizard.state.eyes = eyes_color;
        await ctx.replyWithHTML("<b>Укажите ваш рост в сантиметрах. Например: 183</b>",  Markup.inlineKeyboard([[Markup.button.callback("👉 Начать заново (жми два раза)","start_again")]]))
        // @ts-ignore
        return ctx.wizard.selectStep(6);
    } catch (e) {
        console.log(e)
    }
})


// 6
const getNameStep = new Composer();
getNameStep.action("start_again", async ctx => {
    await ctx.answerCbQuery();
    // @ts-ignore
    await ctx.wizard.selectStep(0)
})
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
        return ctx.wizard.selectStep(7);
    } catch (e) {
        console.log(e)
    }
})


// 7
const isRandomAll = new Composer();
isRandomAll.action("start_again", async ctx => {
    // @ts-ignore
    if (ctx.update.callback_query["data"] === "start_again") {
        await ctx.answerCbQuery();
        // @ts-ignore
        await ctx.wizard.selectStep(0);
    }
})
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

        // @ts-ignore
        return ctx.wizard.selectStep(8);
    } catch (e) {
        console.log(e)
    }
})



// 8
const getCityOfBirth = new Composer();
getCityOfBirth.action("start_again", async ctx => {
    try {
        // @ts-ignore
        if (ctx.update.callback_query["data"] === "start_again") {
            await ctx.answerCbQuery();
            // @ts-ignore
            await ctx.wizard.selectStep(0);
        }
    } catch (e) {
        console.log(e)
    }

})
getCityOfBirth.action("confirm", async ctx => {
    try {
        await ctx.answerCbQuery();
        // @ts-ignore
        ctx.wizard.state.id_code = id_code();
        // @ts-ignore
        ctx.wizard.state.passport_number = passport_number();
        // @ts-ignore
        ctx.wizard.state.national_driver_license = passport_number();

        await ctx.replyWithHTML("<b>Загрузите фото как на документы, соотношение ширины к высоте 3:4. " +
            "Если уже есть фото 3х4см, сфотографируйте на телефон, обрежьте изображение по краям фотографии и отправляйте. В течение пары минут вам придут образцы.</b>",
            Markup.inlineKeyboard([
                [Markup.button.callback("👉 Начать заново (жми два раза)", "start_again")]
            ]))
        // @ts-ignore
        return ctx.wizard.selectStep(16);
    } catch (e) {
        console.log(e)
    }

})
getCityOfBirth.on("callback_query", async (ctx) => {
    try {
        // @ts-ignore
        if (ctx.update.callback_query["data"] === "random_data" || ctx.update.callback_query["data"] === "generate_again") {

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
            ctx.wizard.state.user_id = ctx.update.callback_query.message.chat.id;
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

            await ctx.replyWithHTML(`<b>Проверьте правильность введенной информации:</b>
                    Имя: ${first_name}
                    Фамилия: ${last_name}
                    Отчество: ${second_name}
                    Пол: ${sex || "этот пункт для европейского образца"}
                    Цвет глаз: ${eyes || "этот пункт для европейского образца"}
                    Рост: ${height || "этот пункт для европейского образца"}
                    Дата рождения: ${date_of_birth}
                    Место рождения: ${city_of_birth}, ${country_of_birth}
                    Место проживания: ${living_index}, ${living_country}, ${living_city}, ${living_street}, ${house_number}
                    Номер удостоверения: ${subject_id}`,
                Markup.inlineKeyboard([
                    [Markup.button.callback("✔ Все верно", "confirm"), Markup.button.callback("🔁 Сгенерировать заново", "generate_again")],
                    [Markup.button.callback("👉 Начать заново (жми два раза)", "start_again")]
                ])
            )
        }


        // @ts-ignore
        if (ctx.update.callback_query["data"] === "write_myself") {
            await ctx.replyWithHTML("Укажитете город, где родились. Пример: <b>Москва</b>",
                Markup.inlineKeyboard([
                    [Markup.button.callback("👉 Начать заново (жми два раза)","start_again")]
                ]))
            // @ts-ignore
            return ctx.wizard.selectStep(9);
        }
        // // @ts-ignore
        // return ctx.wizard.selectStep(7);
    } catch (e) {
        console.log(e)
    }
})

// 9
const getCountryOfBirth = new Composer();
getCountryOfBirth.action("start_again", async ctx => {
    // @ts-ignore
    if (ctx.update.callback_query["data"] === "start_again") {
        await ctx.answerCbQuery();
        // @ts-ignore
        await ctx.wizard.selectStep(0);
    }
})
getCountryOfBirth.on("text", async (ctx) => {
    try {
        // @ts-ignore
        ctx.wizard.state.city_of_birth = cyrillicToTranslit.transform(ctx.message.text.trim()).toUpperCase()
        await ctx.replyWithHTML("Укажите страну рождения. Пример: <b>Россия или СССР </b>",
            Markup.inlineKeyboard([
                [Markup.button.callback("👉 Начать заново (жми два раза)", "start_again")]
            ]))
        // @ts-ignore
        return ctx.wizard.selectStep(10);
    } catch (e) {
        console.log(e)
    }
})

// 10
const getLivingStreet = new Composer();
getLivingStreet.action("start_again", async ctx => {
    // @ts-ignore
    if (ctx.update.callback_query["data"] === "start_again") {
        await ctx.answerCbQuery();
        // @ts-ignore
        await ctx.wizard.selectStep(0);
    }
})
getLivingStreet.on("text", async (ctx) => {
    let country = ""
    try {
        if (ctx.message.text.trim().toLowerCase() === "россия") {
            country = "Russia"
        } else if (ctx.message.text.trim().toLowerCase() === "ссср") {
            country = "USSR"
        } else {
            country = cyrillicToTranslit.transform(ctx.message.text).toUpperCase();
        }
        // @ts-ignore
        ctx.wizard.state.country_of_birth = country

        await ctx.replyWithHTML("Укажите улицу проживания. Пример: <b>ул.Гагарина</b>",
            Markup.inlineKeyboard([
                [Markup.button.callback("👉 Начать заново (жми два раза)","start_again")]
            ]))
        // @ts-ignore
        return ctx.wizard.selectStep(11);
    } catch (e) {
        console.log(e)
    }
})

// 11
const getHouseNumber = new Composer();
getHouseNumber.action("start_again", async ctx => {
    // @ts-ignore
    if (ctx.update.callback_query["data"] === "start_again") {
        await ctx.answerCbQuery();
        // @ts-ignore
        await ctx.wizard.selectStep(0);
    }
})
getHouseNumber.on("text", async (ctx) => {
    try {
        // @ts-ignore
        ctx.wizard.state.living_street = cyrillicToTranslit.transform(ctx.message.text).toUpperCase()
        await ctx.replyWithHTML("Укажите номер дома. Пример: <b>34/2</b>")
        // @ts-ignore
        return ctx.wizard.selectStep(12);
    } catch (e) {
        console.log(e)
    }
})

// 12
const getLivingIndex = new Composer();
getLivingIndex.action("start_again", async ctx => {
    // @ts-ignore
    if (ctx.update.callback_query["data"] === "start_again") {
        await ctx.answerCbQuery();
        // @ts-ignore
        await ctx.wizard.selectStep(0);
    }
})
getLivingIndex.on("text", async (ctx) => {
    try {
        // @ts-ignore
        ctx.wizard.state.house_number = ctx.message.text;
        await ctx.replyWithHTML("Укажите почтовый индекс. Пример: <b>192168</b>")
        // @ts-ignore
        return ctx.wizard.selectStep(13);
    } catch (e) {
        console.log(e)
    }
})

// 13
const getLivingCity = new Composer();
getLivingCity.action("start_again", async ctx => {
    // @ts-ignore
    if (ctx.update.callback_query["data"] === "start_again") {
        await ctx.answerCbQuery();
        // @ts-ignore
        await ctx.wizard.selectStep(0);
    }
})
getLivingCity.on("text", async (ctx) => {
    try {
        // @ts-ignore
        ctx.wizard.state.living_country = "RUSSIA";
        // @ts-ignore
        ctx.wizard.state.living_index = ctx.message.text.toUpperCase();
        await newDBconnect.updateOrder({key:"living_index", value:`${ctx.message.text.toUpperCase()}`});
        await ctx.replyWithHTML("Укажите город проживания. Пример: <b>Москва</b>")
        // @ts-ignore
        return ctx.wizard.selectStep(14);
    } catch (e) {
        console.log(e)
    }
})



// 14
const getSubjectIdAndMakeSerialNumber = new Composer();
getSubjectIdAndMakeSerialNumber.action("start_again", async ctx => {
    // @ts-ignore
    if (ctx.update.callback_query["data"] === "start_again") {
        await ctx.answerCbQuery();
        // @ts-ignore
        await ctx.wizard.selectStep(0);
    }
})
getSubjectIdAndMakeSerialNumber.on("text", async (ctx) => {
    try {
        // @ts-ignore
        ctx.wizard.state.living_city = cyrillicToTranslit.transform(ctx.message.text).toUpperCase();
        await ctx.replyWithHTML("Напишите двузначный ГИБДД-код субьекта РФ, к которому относится место проживания, указанное на предыдущем шаге.<a href='https://ru.wikipedia.org/wiki/%D0%9A%D0%BE%D0%B4%D1%8B_%D1%81%D1%83%D0%B1%D1%8A%D0%B5%D0%BA%D1%82%D0%BE%D0%B2_%D0%A0%D0%BE%D1%81%D1%81%D0%B8%D0%B9%D1%81%D0%BA%D0%BE%D0%B9_%D0%A4%D0%B5%D0%B4%D0%B5%D1%80%D0%B0%D1%86%D0%B8%D0%B8'>Узнать код можно тут</a>")
        // @ts-ignore
        return ctx.wizard.selectStep(15);
    } catch (e) {
        console.log(e)
    }
})


// 15
const getApprove = new Composer();
getApprove.action("start_again", async ctx => {
    // @ts-ignore
    if (ctx.update.callback_query["data"] === "start_again") {
        await ctx.answerCbQuery();
        // @ts-ignore
        await ctx.wizard.selectStep(0);
    }
})
getApprove.on("text", async (ctx) => {
    try {

        // @ts-ignore
        ctx.wizard.state.subject_id = serial_number(ctx.message.text);
        // @ts-ignore
        const { type, first_name, last_name, second_name, date_of_birth, city_of_birth, house_number, subject_id, country_of_birth, living_index, living_country, living_city, living_street, sex, eyes, height} = ctx.wizard.state;
        // @ts-ignore
        if (type === "ru_eu"){
            await ctx.replyWithHTML(`
                 <b>Проверьте правильность введенной информации:</b>
                 Имя: ${first_name.toUpperCase()},
                 Фамилия: ${last_name.toUpperCase()},
                 Отчество: ${second_name.toUpperCase()},
                 Дата рождения: ${date_of_birth},
                 Место рождения: ${city_of_birth.toUpperCase()}, ${country_of_birth.toUpperCase()}
                 Место проживания: ${living_index.toUpperCase()}, ${living_country.toUpperCase()}, ${living_city.toUpperCase()}, ${living_street.toUpperCase()}, ${house_number},
                 Пол: ${sex.toUpperCase()}
                 Цвет глаз: ${eyes.toUpperCase()}
                 Рост: ${height}
                 Номер удостоверения:${subject_id}`,

                Markup.inlineKeyboard([
                    [Markup.button.callback("✔ Всё верно","right"),Markup.button.callback("❌ Не верно","wrong") ]
                ])
            )
        } else {
            await ctx.replyWithHTML(`<b>Проверьте правильность введенной информации:</b>
                 Имя: ${first_name.toUpperCase()},
                 Фамилия: ${last_name.toUpperCase()},
                 Отчество: ${second_name.toUpperCase()},
                 Дата рождения: ${date_of_birth},
                 Место рождения: ${city_of_birth.toUpperCase()}, ${country_of_birth.toUpperCase()}
                 Место проживания: ${living_index}, ${living_country.toUpperCase()}, ${living_city.toUpperCase()}, ${living_street.toUpperCase()}, ${house_number}`,
                Markup.inlineKeyboard([
                    [Markup.button.callback("✔ Всё верно","right"),Markup.button.callback("❌ Не верно","wrong") ]
                ])
            )
        }

        // @ts-ignore
        return ctx.wizard.selectStep(16);
    } catch (e) {
        console.log(e)
    }
})


// 16
const getPhoto = new Composer();
getPhoto.action("start_again", async ctx => {
    try {
        await ctx.answerCbQuery();
        // @ts-ignore
        await ctx.wizard.selectStep(0);
    } catch (e) {
        console.log(e)
    }

});

getPhoto.action("make_payment", async ctx => {
    try {
        await ctx.answerCbQuery("make_payment");
        await ctx.answerCbQuery();
        const checkout = new YooCheckout({ shopId: '959346', secretKey: 'live_Ov9tXrXrZAyBU840C2LbZnJbgFb58937zgoq65MazK4' });
        const idempotenceKey = uuidv4();
        const createPayload: ICreatePayment = {
            amount: {
                value: '400.00',
                currency: 'RUB'
            },
            payment_method_data: {
                type: 'bank_card',

            },
            confirmation: {
                type: 'redirect',
                locale: "ru_RU",
                return_url: "https://t.me/xeroxDoc_bot",
            },
            description: "Бутафория - Водительское Удостоверение",
            capture: true,
            receipt: {
                customer: {
                    email: "anz77or@gmail.com",
                    phone: "+79633442711",
                },
                items: [
                    {
                        payment_subject:"service",
                        payment_mode: "full_payment",
                        vat_code: 1,
                        quantity: "1",
                        description: "Бутафория - Водительское Удостоверение",
                        amount: {
                            value: "400.00",
                            currency: "RUB",
                        },
                    }
                ],
            },
        };

        try {

            const payment = await checkout.createPayment(createPayload, idempotenceKey);
            const payment_id = payment.id;
            // @ts-ignore
            ctx.wizard.state.payment_id = payment.id;
            const confirmation_url = payment.confirmation.confirmation_url ? payment.confirmation.confirmation_url : 'empty';

            if (confirmation_url != null) {
                await ctx.replyWithHTML(confirmation_url).then(async () => {
                    let payment_result = await checkout.getPayment(payment_id);
                    let counter = 0;
                    async function getPayment() {
                        payment_result = await checkout.getPayment(payment_id);
                        console.log(payment_result.status)
                        if (payment_result.status === "succeeded") {
                            clearInterval(interval_id);
                            // @ts-ignore
                            await ctx.replyWithHTML("Оплата прошла. Спасибо! В течении 5 минут вам придут файлы для печати.");
                            // @ts-ignore
                            await convert_to_jpeg_mask(ctx.wizard.state).then( async () => {
                                // @ts-ignore
                                await ctx.replyWithDocument({ source: `/root/driveBot/temp/users/${ctx.update.callback_query.from.id}/Полный_разворот_1.jpg` });
                                // @ts-ignore
                                await ctx.replyWithDocument({ source: `/root/driveBot/temp/users/${ctx.update.callback_query.from.id}/Полный_разворот_2.jpg` });
                                // @ts-ignore
                                await ctx.replyWithDocument({ source: `/root/driveBot/temp/users/${ctx.update.callback_query.from.id}/Короткая_версия.jpg` });
                                // @ts-ignore
                                if (ctx.wizard.state.type === "ru_eu"){
                                    // @ts-ignore
                                    await ctx.replyWithDocument({ source: `/root/driveBot/temp/users/${ctx.update.callback_query.from.id}/Европейские(на пластик)_1.jpg` });
                                    // @ts-ignore
                                    await ctx.replyWithDocument({ source: `/root/driveBot/temp/users/${ctx.update.callback_query.from.id}/Европейские(на пластик)_2.jpg` });
                                }
                            });
                        }
                        if (counter === 30 && payment_result.status !== "succeeded") {
                            clearInterval(interval_id);
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
    } catch (e) {
        console.log(e)
    }

});

getPhoto.action("wrong", async ctx => {
    try {
        await ctx.answerCbQuery();
        await ctx.replyWithHTML("<b>Чтобы перейти к началу заполнения анкеты, нажмите кнопку '👉 Начать заново (жми два раза)'</b>",
            Markup.inlineKeyboard([[Markup.button.callback("👉 Начать заново (жми два раза)","start_again")]]));
        // @ts-ignore
        return ctx.wizard.selectStep(0);
    } catch (e) {
        console.log(e)
    }
});

getPhoto.on("photo", async (ctx) => {
    // @ts-ignore
    const picture = ctx.message.photo[2].file_id || ctx.message.photo[1].file_id || ctx.message.photo[0].file_id;
    console.log("picture " + picture)

    const fileUrl = await ctx.telegram.getFileLink(picture);
    console.log("fileUrl " + fileUrl)
    try {
        fs.stat(`/root/driveBot/temp/users/${ctx.message.chat.id}`, async (err) => {
            if (!err) {
                console.log("папка создана")
                await download_image(fileUrl.href, `/root/driveBot/temp/users/${ctx.message.chat.id}/${ctx.message.chat.id}.jpg`);
            } else if (err.code === 'ENOENT') {
                console.log('директории нет');
                fs.mkdir(`/root/driveBot/temp/users/${ctx.message.chat.id}`, async (err) => {
                    if (err)
                        throw err; // не удалось создать папку
                    console.log("папку создал")
                    await download_image(fileUrl.href, `/root/driveBot/temp/users/${ctx.message.chat.id}/${ctx.message.chat.id}.jpg`);
                });
            }
        });
        // @ts-ignore
        console.log(ctx.wizard.state)
        // @ts-ignore
        await convert_to_jpeg_mask(ctx.wizard.state, "example").then( async () => {
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
        });
        await ctx.replyWithHTML(`Если образцы вышли хорошо, жмите кнопку <b>Оплатить</b>. В течение 1-5 минут после оплаты, вам придут файлы для печати. Чтобы 👉 начать заново (жми два раза) жмите соотвествующую кнопку`,
            Markup.inlineKeyboard([
                [Markup.button.callback("💳 Оплатить","make_payment"), Markup.button.callback("🎭 Загрузить другое фото","update_photo")],
                [Markup.button.callback("👉 Начать заново (жми два раза)","start_again")]
            ])
        )
    } catch (e) {
        console.log(e)
    }
})
getPhoto.action("right", async ctx => {
    try {
        await ctx.answerCbQuery();
        // @ts-ignore
        ctx.wizard.state.id_code = id_code();
        // @ts-ignore
        ctx.wizard.state.passport_number = passport_number();
        // @ts-ignore
        ctx.wizard.state.national_driver_license = passport_number();

        await ctx.replyWithHTML("<b>Загрузите фото как на документы, соотношение ширины к высоте 3:4. " +
            "Если уже есть фото 3х4см, сфотографируйте на телефон, обрежьте изображение по краям фотографии и отправляйте. В течение пары минут вам придут образцы.</b>",
            Markup.inlineKeyboard([[Markup.button.callback("👉 Начать заново (жми два раза)","start_again")]]))
    } catch (e) {
        console.log(e)
    }
});
getPhoto.action("update_photo", async (ctx) => {
    try {
        await ctx.answerCbQuery();
        // @ts-ignore
        ctx.wizard.state.id_code = id_code();
        // @ts-ignore
        ctx.wizard.state.passport_number = passport_number();
        // @ts-ignore
        ctx.wizard.state.national_driver_license = passport_number();
        await ctx.replyWithHTML("<b>Загрузите фото как на документы, соотношение ширины к высоте 3:4. " +
            "Если уже есть фото 3х4см, сфотографируйте на телефон, обрежьте изображение по краям фотографии и отправляйте. В течение пары минут вам придут образцы.</b>",
            Markup.inlineKeyboard([[Markup.button.callback("👉 Начать заново (жми два раза)","start_again")]]))
        // @ts-ignore
    } catch (e) {
        console.log(e)
    }
});
getPhoto.action("generate_again", async ctx => {
    try {
        await ctx.answerCbQuery();
        await ctx.reply("Генерю...");
        // @ts-ignore
        return ctx.wizard.selectStep(7);
    } catch (e) {
        console.log(e)
    }
});

// 17
const getAnswer = new Composer();
getAnswer.action("start_again", async ctx => {
    await ctx.answerCbQuery();
    // @ts-ignore
    await ctx.wizard.selectStep(0);
})


// 18
const sendFinalData = new Composer();
sendFinalData.action("start_again", async ctx => {
    await ctx.answerCbQuery("update_photo");
    // @ts-ignore
    await ctx.wizard.selectStep(0);
})

sendFinalData.on('text', async (ctx) => {
    try {

    } catch (e) {
        console.log(e)
    }
})




const make_driver_license_scene = new Scenes.WizardScene(
    "make_driver_license_scene",
    chooseCountry,
    description,
    getDateOfBirthStep,
    getSex,
    getEyesColor,
    getHeight,
    getNameStep,
    isRandomAll,
    getCityOfBirth,
    getCountryOfBirth,
    getLivingStreet,
    getHouseNumber,
    getLivingIndex,
    getLivingCity,
    getSubjectIdAndMakeSerialNumber,
    getApprove,
    getPhoto,
    getAnswer,
    sendFinalData,
)

export default make_driver_license_scene;