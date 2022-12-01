import {Markup, Composer, Scenes} from "telegraf"
import db_connect from "../db_connect.js";
import convert_to_jpeg from "../convert_to_jpeg.js";
import * as fs from "fs";
import axios from "axios";
import serial_number from "../data_generator/serial_number.js";
import id_code from "../data_generator/id_code.js";
import passport_number from "../data_generator/passport_number.js";
import CyrillicToTranslit from 'cyrillic-to-translit-js';
import get_places from "../data_generator/get_places.js";
import getInvoice from "../get_invoice.js";

const cyrillicToTranslit = new CyrillicToTranslit();

const download_image = (url, image_path) =>
    axios({
        url,
        responseType: 'stream',
    }).then(
        response =>
            new Promise((resolve, reject) => {
                response.data
                    .pipe(fs.createWriteStream(image_path))
                    .on('finish', () => resolve())
                    .on('error', e => reject(e));
            }),
    );


let newDBconnect;

// 0
const driveDocs = new Composer();
driveDocs.on("callback_query", async (ctx) => {
    try {
        await ctx.replyWithHTML("" +
            "В стоиомсть входит три вида макетов: " +
            "- Сувенирные Российские международные права полный разворот (2 файла) " +
            "- Сувенирные Российские международные права только основные части (1 файл) " +
            "- Сувенирные европейские международные права для печати на пластике (2 файла)",
            Markup.inlineKeyboard([
            [Markup.button.callback("🇷🇺 РФ международные","ru" )],
            [Markup.button.callback("🇷🇺 РФ международные + 🇪🇺 европейские", "eu")]
        ]));
        return ctx.wizard.selectStep(1);
    } catch (e) {
        console.log(e)
    }
})
//
// "Вы можете выбрать вариант 'РФ международные + европейские' это " +
// "на цену никак не влияет, но нужно будет ответить на пару дополнительных" +
// "вопросов, зато вы получите макет для печати на пластике"
// 0
const getCategory = new Composer();
getCategory.action("drive_license", async ctx => {
    await ctx.replyWithHTML("Выберите страну", Markup.inlineKeyboard([
        [Markup.button.callback("Франиция (в разработке)", "france")],
        [Markup.button.callback("Англия (в разработке)", "united_kingdom")],
        [Markup.button.callback("Мексика (в разработке)", "mexico")],
        [Markup.button.callback("Россия", "russia")],
        [Markup.button.callback("Украина (в разработке)", "ukraine")],
        [Markup.button.callback("США (в разработке)", "united_states")],
        ["👉 Начать заново (жми два раза)", "start_again"]
    ]))
})
getCategory.action("passports", async ctx => {
    await ctx.replyWithHTML("Выберите страну", Markup.inlineKeyboard([
        ["👉 Начать заново (жми два раза)", "start_again"]
    ]))
})

getCategory.on("callback_query", async (ctx) => {
    try {
        await ctx.answerCbQuery();
        await ctx.replyWithHTML("Какую бутафорию вы хотите сделать? ",
            Markup.inlineKeyboard([
            [Markup.button.callback("Бутаофрсике водительские удостоверения","drive_license" )],
            [Markup.button.callback("Бутафорские паспорта(в разработке)", "passports")],
        ]));
        // Armenia
        // Argentina
        // Austria
        // Australia
        // Azerbaijan
        // Bulgaria
        // Brazil
        // Canada
        // Cyprus
        // Germany
        // Dominican Republic
        // Estonia
        // Egypt
        // Spain
        // Finland
        // Georgia
        // Italy
        // Tajikistan
        // return ctx.wizard.selectStep(1);
    } catch (e) {
        console.log(e)
    }
})



// 1
const getDateOfBirthStep = new Composer();

getDateOfBirthStep.on("callback_query", async ctx => {
    if (ctx.update.callback_query.data === "start_again") {
        console.log(1)
        await ctx.answerCbQuery();
        await ctx.wizard.selectStep(0);
    }

    await ctx.answerCbQuery();
    newDBconnect = new db_connect(ctx.update.callback_query.from.id);
    await newDBconnect.addNewOrder().then(async ()=>{
        await newDBconnect.updateOrder({key:"type", value: ctx.update.callback_query.data});
    });
    await ctx.replyWithHTML("Напишите Дату Рождения 🎂 (формат: <b>дд.мм.гггг</b>)",
        Markup.inlineKeyboard([[Markup.button.callback("👉 Начать заново (жми два раза)","start_again")]]))
    if (ctx.update.callback_query.data === "ru") {
        return ctx.wizard.selectStep(5);
    }
    if (ctx.update.callback_query.data === "eu") {
        return ctx.wizard.selectStep(2);
    }
});

// 2
const getSex = new Composer();
getSex.action("start_again", async ctx => {
    if (ctx.update.callback_query.data === "start_again") {
        await ctx.answerCbQuery();
        await ctx.wizard.selectStep(0);
    }
})
getSex.on("text", async(ctx) => {
    try {
        await newDBconnect.updateOrder({key:"date_of_birth", value:`${ctx.message.text}`});
        await ctx.replyWithHTML("Укажите ваш пол", Markup.inlineKeyboard([
            [Markup.button.callback("🦸‍♂️М","M"), Markup.button.callback("🦸‍♀️Ж","F")],
            [Markup.button.callback("👉 Начать заново (жми два раза)","start_again")]
        ]))
        return ctx.wizard.selectStep(3);
    } catch (e) {
        console.log(e)
    }
})

// 3
const getEyesColor = new Composer();
getEyesColor.action("start_again", async ctx => {
    if (ctx.update.callback_query.data === "start_again") {
        await ctx.answerCbQuery();
        await ctx.wizard.selectStep(0);
    }
})
getEyesColor.on("callback_query", async(ctx) => {
    let sex = ctx.update.callback_query.data;
    try {
        await newDBconnect.updateOrder({key:"sex", value:`${sex}`});
        await ctx.replyWithHTML("Укажите цвет глаз 👀", Markup.inlineKeyboard([
            [Markup.button.callback("⚪ Серые","BLUE"),Markup.button.callback("🟢 Зеленые","GREEN") ],
            [Markup.button.callback("🟡 Желтые", "YELLOW"), Markup.button.callback("🔵 Синие", "BLUE"), Markup.button.callback("🟤 Карие","BROWN")],
            [Markup.button.callback("👉 Начать заново (жми два раза)","start_again")]
        ]))
        return ctx.wizard.selectStep(4);
    } catch (e) {
        console.log(e)
    }
})

// 4
const getHeight = new Composer();
getHeight.action("start_again", async ctx => {
    if (ctx.update.callback_query.data === "start_again") {
        await ctx.answerCbQuery();
        await ctx.wizard.selectStep(0);
    }
})
getHeight.on("callback_query", async (ctx) => {

    let eyes_color = ctx.update.callback_query.data;
    try {
        await newDBconnect.updateOrder({key:"eyes", value:`${eyes_color}`});
        await ctx.replyWithHTML("<b>Укажите ваш рост в сантиметрах. Например: 183</b>",  Markup.inlineKeyboard([[Markup.button.callback("👉 Начать заново (жми два раза)","start_again")]]))
        return ctx.wizard.selectStep(5);
    } catch (e) {
        console.log(e)
    }
})


// 5
const getNameStep = new Composer();
getNameStep.action("start_again", async ctx => {
    if (ctx.update.callback_query.data === "start_again") {
        await ctx.answerCbQuery();
        await ctx.wizard.selectStep(0);
    }
})
getNameStep.action("start_again", async ctx => {
    await ctx.answerCbQuery();
    await ctx.wizard.selectStep(0)
})
getNameStep.on("text", async (ctx) => {
    try {
        if (ctx.message.text.split('.').length === 3) {
            await newDBconnect.updateOrder({key:"date_of_birth", value:`${ctx.message.text}`});
            console.log("date_of_birth   " + ctx.message.text)
        } else {
            await newDBconnect.updateOrder({key:"height", value:`${ctx.message.text}`});
        }
        await ctx.replyWithHTML("Напишите Фамилию Имя Отчество. Пример: <b>Пушкин Александр Сергеевич</b>",  Markup.inlineKeyboard([[Markup.button.callback("👉 Начать заново (жми два раза)","start_again")]]))
        return ctx.wizard.selectStep(6);
    } catch (e) {
        console.log(e)
    }
})


// 6
const isRandomAll = new Composer();
isRandomAll.action("start_again", async ctx => {
    if (ctx.update.callback_query.data === "start_again") {
        await ctx.answerCbQuery();
        await ctx.wizard.selectStep(0);
    }
})
isRandomAll.on("text", async (ctx) => {
    try {
        await newDBconnect.updateOrder({key: "last_name", value: `${cyrillicToTranslit.transform(ctx.message.text.split(" ")[0]).toUpperCase()}`});
        await newDBconnect.updateOrder({key: "first_name", value: `${cyrillicToTranslit.transform(ctx.message.text.split(" ")[1]).toUpperCase()}`});
        await newDBconnect.updateOrder({key: "second_name", value: `${cyrillicToTranslit.transform(ctx.message.text.split(" ")[2]).toUpperCase()}`});
        await ctx.replyWithHTML("Мы можем заполнить все оставшиеся пункты за вас <b>случайными</b> данными", Markup.inlineKeyboard([
            [Markup.button.callback("🖋 Заполню сам","write_myself"), Markup.button.callback("🔣 Случайные данные", "random_data") ],
            [Markup.button.callback("👉 Начать заново (жми два раза)","start_again")]
        ]))

        return ctx.wizard.selectStep(7);
    } catch (e) {
        console.log(e)
    }
})



// 7
const getCityOfBirth = new Composer();
getCityOfBirth.action("start_again", async ctx => {
    if (ctx.update.callback_query.data === "start_again") {
        await ctx.answerCbQuery();
        await ctx.wizard.selectStep(0);
    }
})
getCityOfBirth.on("callback_query", async (ctx) => {
    try {
        if (ctx.update.callback_query.data === "random_data" || ctx.update.callback_query.data === "generate_again") {
            const data = await get_places();
            await newDBconnect.getOrderInfo(async (result) => {
                try {
                    await newDBconnect.updateOrder({key: "city_of_birth", value: `${cyrillicToTranslit.transform(data.city_of_birth).toUpperCase()}`});
                    await newDBconnect.updateOrder({key: "country_of_birth", value: `${cyrillicToTranslit.transform(data.country_of_birth).toUpperCase()}`});
                    await newDBconnect.updateOrder({key: "living_street", value: `${cyrillicToTranslit.transform(data.living_street).toUpperCase()}`});
                    await newDBconnect.updateOrder({key: "living_country", value: `${cyrillicToTranslit.transform(data.living_country).toUpperCase()}`});
                    await newDBconnect.updateOrder({key: "house_number", value: `${data.house_number}`});
                    await newDBconnect.updateOrder({key: "living_index", value: `${data.living_index}`});
                    await newDBconnect.updateOrder({key: "living_city", value: `${cyrillicToTranslit.transform(data.living_city).toUpperCase()}`});
                    await newDBconnect.updateOrder({key: "subject_id", value: `${data.subject_id}`});
                } catch (e) {
                    console.log(e)
                }
                await ctx.replyWithHTML(`
                             <b>Проверьте правильность введенной информации:</b>
                             Имя: ${result.first_name}
                             Фамилия: ${result.last_name}
                             Отчество: ${result.second_name}
                             Пол: ${result.sex || "этот пункт для европейского образца"}
                             Цвет глаз: ${result.eyes || "этот пункт для европейского образца"}
                             Рост: ${result.height || "этот пункт для европейского образца"}
                             Дата рождения: ${result.date_of_birth}
                             Место рождения: ${data.city_of_birth}, ${data.country_of_birth}
                             Место проживания: ${data.living_index}, ${data.living_country}, ${data.living_city}, ${data.living_street}, ${data.house_number}`,
                    Markup.inlineKeyboard([
                        [Markup.button.callback("✔ Все верно", "confirm"), Markup.button.callback("🔁 Сгенерировать заново", "generate_again")],
                        [Markup.button.callback("👉 Начать заново (жми два раза)", "start_again")]
                    ])
                )
            })

        }
        if (ctx.update.callback_query.data === "confirm") {
            await newDBconnect.updateOrder({key: "id_code", value: `${id_code()}`});
            await newDBconnect.updateOrder({key: "passport_number", value: `${passport_number()}`});
            await newDBconnect.updateOrder({key: "national_driver_license", value: `${passport_number()}`});
            await ctx.replyWithHTML("<b>Загрузите фото как на документы, соотношение ширины к высоте 3:4. " +
                "Если уже есть фото 3х4см, сфотографируйте на телефон, обрежьте изображение по краям фотографии и отправляйте. В течение пары минут вам придут образцы.</b>",
                Markup.inlineKeyboard([
                    [Markup.button.callback("👉 Начать заново (жми два раза)", "start_again")]
                ]))
            return ctx.wizard.selectStep(16);
        }

        if (ctx.update.callback_query.data === "write_myself") {
            await ctx.replyWithHTML("Укажитете город, где родились. Пример: <b>Москва</b>",
                Markup.inlineKeyboard([
                    [Markup.button.callback("👉 Начать заново (жми два раза)","start_again")]
                ]))
            return ctx.wizard.selectStep(8);
        }
        if (ctx.update.callback_query.data === "start_again") {
            return ctx.wizard.selectStep(0);
        }
        return ctx.wizard.selectStep(7);
    } catch (e) {
        console.log(e)
    }
})

// 8
const getCountryOfBirth = new Composer();
getCountryOfBirth.action("start_again", async ctx => {
    if (ctx.update.callback_query.data === "start_again") {
        await ctx.answerCbQuery();
        await ctx.wizard.selectStep(0);
    }
})
getCountryOfBirth.on("text", async (ctx) => {
    try {
        await newDBconnect.updateOrder({key:"city_of_birth", value:`${cyrillicToTranslit.transform(ctx.message.text.trim()).toUpperCase()}`});
        await ctx.replyWithHTML("Укажите страну рождения. Пример: <b>Россия или СССР </b>",
            Markup.inlineKeyboard([
                [Markup.button.callback("👉 Начать заново (жми два раза)", "start_again")]
            ]))
        return ctx.wizard.selectStep(9);
    } catch (e) {
        console.log(e)
    }
})

// 9
const getLivingStreet = new Composer();
getLivingStreet.action("start_again", async ctx => {
    if (ctx.update.callback_query.data === "start_again") {
        await ctx.answerCbQuery();
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
        await newDBconnect.updateOrder({key:"country_of_birth", value:`${country}`});
        await ctx.replyWithHTML("Укажите улицу проживания. Пример: <b>ул.Гагарина</b>",
            Markup.inlineKeyboard([
                [Markup.button.callback("👉 Начать заново (жми два раза)","start_again")]
            ]))
        return ctx.wizard.selectStep(10);
    } catch (e) {
        console.log(e)
    }
})

// 10
const getHouseNumber = new Composer();
getHouseNumber.action("start_again", async ctx => {
    if (ctx.update.callback_query.data === "start_again") {
        await ctx.answerCbQuery();
        await ctx.wizard.selectStep(0);
    }
})
getHouseNumber.on("text", async (ctx) => {
    try {
        await newDBconnect.updateOrder({key:"living_street", value:`${cyrillicToTranslit.transform(ctx.message.text).toUpperCase()}`});
        await ctx.replyWithHTML("Укажите номер дома. Пример: <b>34/2</b>")
        return ctx.wizard.selectStep(11);
    } catch (e) {
        console.log(e)
    }
})

// 11
const getLivingIndex = new Composer();
getLivingIndex.action("start_again", async ctx => {
    if (ctx.update.callback_query.data === "start_again") {
        await ctx.answerCbQuery();
        await ctx.wizard.selectStep(0);
    }
})
getLivingIndex.on("text", async (ctx) => {
    try {
        await newDBconnect.updateOrder({key:"house_number", value:`${ctx.message.text.toUpperCase()}`});
        await ctx.replyWithHTML("Укажите почтовый индекс. Пример: <b>192168</b>")
        return ctx.wizard.selectStep(12);
    } catch (e) {
        console.log(e)
    }
})

// 12
const getLivingCity = new Composer();
getLivingCity.action("start_again", async ctx => {
    if (ctx.update.callback_query.data === "start_again") {
        await ctx.answerCbQuery();
        await ctx.wizard.selectStep(0);
    }
})
getLivingCity.on("text", async (ctx) => {
    try {
        await newDBconnect.updateOrder({key:"living_country", value:`RUSSIA`});
        await newDBconnect.updateOrder({key:"living_index", value:`${ctx.message.text.toUpperCase()}`});
        await ctx.replyWithHTML("Укажите город проживания. Пример: <b>Москва</b>")
        return ctx.wizard.selectStep(13);
    } catch (e) {
        console.log(e)
    }
})



// 13
const getSubjectIdAndMakeSerialNumber = new Composer();
getSubjectIdAndMakeSerialNumber.action("start_again", async ctx => {
    if (ctx.update.callback_query.data === "start_again") {
        await ctx.answerCbQuery();
        await ctx.wizard.selectStep(0);
    }
})
getSubjectIdAndMakeSerialNumber.on("text", async (ctx) => {
    try {
        await newDBconnect.updateOrder({key:"living_city", value:`${cyrillicToTranslit.transform(ctx.message.text).toUpperCase()}`});
        await ctx.replyWithHTML("Напишите двузначный ГИБДД-код субьекта РФ, к которому относится место проживания, указанное на предыдущем шаге.<a href='https://ru.wikipedia.org/wiki/%D0%9A%D0%BE%D0%B4%D1%8B_%D1%81%D1%83%D0%B1%D1%8A%D0%B5%D0%BA%D1%82%D0%BE%D0%B2_%D0%A0%D0%BE%D1%81%D1%81%D0%B8%D0%B9%D1%81%D0%BA%D0%BE%D0%B9_%D0%A4%D0%B5%D0%B4%D0%B5%D1%80%D0%B0%D1%86%D0%B8%D0%B8'>Узнать код можно тут</a>")
        return ctx.wizard.selectStep(14);
    } catch (e) {
        console.log(e)
    }
})


// 14
const getApprove = new Composer();
getApprove.action("start_again", async ctx => {
    if (ctx.update.callback_query.data === "start_again") {
        await ctx.answerCbQuery();
        await ctx.wizard.selectStep(0);
    }
})
getApprove.on("text", async (ctx) => {
    try {
        await newDBconnect.updateOrder({key: "subject_id", value: `${serial_number(ctx.message.text)}`});
        await newDBconnect.getOrderInfo(async (result) => {
            if(result.type === "eu"){
                await ctx.replyWithHTML(`
                 <b>Проверьте правильность введенной информации:</b>
                 Имя: ${result.first_name.toUpperCase()},
                 Фамилия: ${result.last_name.toUpperCase()},
                 Отчество: ${result.second_name.toUpperCase()},
                 Дата рождения: ${result.date_of_birth},
                 Место рождения: ${result.city_of_birth.toUpperCase()}, ${result.country_of_birth.toUpperCase()}
                 Место проживания: ${result.living_index.toUpperCase()}, ${result.living_country.toUpperCase()}, ${result.living_city.toUpperCase()}, ${result.living_street.toUpperCase()}, ${result.house_number},
                 Пол: ${result.sex.toUpperCase()}
                 Цвет глаз: ${result.eyes.toUpperCase()}
                 Рост: ${result.height}`,
                    Markup.inlineKeyboard([
                        [Markup.button.callback("✔ Всё верно","write"),Markup.button.callback("❌ Не верно","wrong") ]
                    ])
                )
            } else {
                await ctx.replyWithHTML(`
                 <b>Проверьте правильность введенной информации:</b>
                 Имя: ${result.first_name.toUpperCase()},
                 Фамилия: ${result.last_name.toUpperCase()},
                 Отчество: ${result.second_name.toUpperCase()},
                 Дата рождения: ${result.date_of_birth.toUpperCase()},
                 Место рождения: ${result.city_of_birth.toUpperCase()}, ${result.country_of_birth.toUpperCase()}
                 Место проживания: ${result.living_index}, ${result.living_country.toUpperCase()}, ${result.living_city.toUpperCase()}, ${result.living_street.toUpperCase()}, ${result.house_number}`,
                    Markup.inlineKeyboard([
                        [Markup.button.callback("✔ Всё верно","write"),Markup.button.callback("❌ Не верно","wrong") ]
                    ])
                )
            }

            return ctx.wizard.selectStep(15);
        });

    } catch (e) {
        console.log(e)
    }
})


// 15
const getPhoto = new Composer();
getPhoto.action("start_again", async ctx => {
    try {
        if (ctx.update.callback_query.data === "start_again") {
            await ctx.answerCbQuery();
            await ctx.wizard.selectStep(0);
        }
    } catch (e) {
        console.log(e)
    }

});
getPhoto.action("start_again", async ctx => {
    try {
        await ctx.answerCbQuery();
        await ctx.wizard.selectStep(0);
    } catch (e) {
        console.log(e)
    }
});
getPhoto.action("wrong", async ctx => {
    try {
        await ctx.answerCbQuery();
        await ctx.replyWithHTML("<b>Чтобы перейти к началу заполнения анкеты, нажмите кнопку '👉 Начать заново (жми два раза)'</b>",
            Markup.inlineKeyboard([[Markup.button.callback("👉 Начать заново (жми два раза)","start_again")]]));
        return ctx.wizard.selectStep(0);
    } catch (e) {
        console.log(e)
    }
});
getPhoto.action("write", async ctx => {
    try {
        await ctx.answerCbQuery();
        await newDBconnect.updateOrder({key: "id_code", value: `${id_code()}`});
        await newDBconnect.updateOrder({key: "passport_number", value: `${passport_number()}`});
        await newDBconnect.updateOrder({key: "national_driver_license", value: `${passport_number()}`});
        await ctx.replyWithHTML("<b>Загрузите фото как на документы, соотношение ширины к высоте 3:4. " +
            "Если уже есть фото 3х4см, сфотографируйте на телефон, обрежьте изображение по краям фотографии и отправляйте. В течение пары минут вам придут образцы.</b>",
            Markup.inlineKeyboard([[Markup.button.callback("👉 Начать заново (жми два раза)","start_again")]]))
        return ctx.wizard.selectStep(16);
    } catch (e) {
        console.log(e)
    }
});
getPhoto.action("update_photo", async ctx => {
    try {
        await ctx.answerCbQuery();
        await newDBconnect.updateOrder({key: "id_code", value: `${id_code()}`});
        await newDBconnect.updateOrder({key: "passport_number", value: `${passport_number()}`});
        await newDBconnect.updateOrder({key: "national_driver_license", value: `${passport_number()}`});
        await ctx.replyWithHTML("<b>Загрузите фото как на документы, соотношение ширины к высоте 3:4. " +
            "Если уже есть фото 3х4см, сфотографируйте на телефон, обрежьте изображение по краям фотографии и отправляйте. В течение пары минут вам придут образцы.</b>",
            Markup.inlineKeyboard([[Markup.button.callback("👉 Начать заново (жми два раза)","start_again")]]))
        return ctx.wizard.selectStep(16);
    } catch (e) {
        console.log(e)
    }
});
getPhoto.action("generate_again", async ctx => {
    try {
        await ctx.answerCbQuery();
        await ctx.reply("Генерю...");
        return ctx.wizard.selectStep(7);
    } catch (e) {
        console.log(e)
    }
});

// 16
const sendPhoto = new Composer();
sendPhoto.action("start_again", async ctx => {
    if (ctx.update.callback_query.data === "start_again") {
        await ctx.answerCbQuery();
        await ctx.wizard.selectStep(0);
    }
})
sendPhoto.on("photo", async (ctx) => {
    const picture = ctx.message.photo[2].file_id;
    const fileUrl = await ctx.telegram.getFileLink(picture);

    try {
        await fs.stat(`./temp/users/${ctx.message.chat.id}`, async (err) => {
            if (!err) {
                await download_image(fileUrl.href, `./temp/users/${ctx.message.chat.id}/${ctx.message.chat.id}.jpg`)
            } else if (err.code === 'ENOENT') {
                console.log('директории нет');
                await fs.mkdir(`./temp/users/${ctx.message.chat.id}`, async err => {
                    if(err) throw err; // не удалось создать папку
                    await download_image(fileUrl.href, `./temp/users/${ctx.message.chat.id}/${ctx.message.chat.id}.jpg`)
                });
            }
        });

        await newDBconnect.getOrderInfo(async (result) => {
            await convert_to_jpeg(result, "example").then(async () => {
                //абсолютный путь E:///myProjects/driveBot/temp/users/${ctx.message.chat.id}/.jpg
                await ctx.replyWithDocument({ source: `/root/driveBot/temp/users/${ctx.message.chat.id}/Полный_разворот_1.jpg` });
                await ctx.replyWithDocument({ source: `/root/driveBot/temp/users/${ctx.message.chat.id}/Полный_разворот_2.jpg` });
                await ctx.replyWithDocument({ source: `/root/driveBot/temp/users/${ctx.message.chat.id}/Короткая_версия.jpg` });
                if (result.type === "eu"){
                    await ctx.replyWithDocument({ source: `/root/driveBot/temp/users/${ctx.message.chat.id}/Европейские(на пластик)_1.jpg` });
                    await ctx.replyWithDocument({ source: `/root/driveBot/temp/users/${ctx.message.chat.id}/Европейские(на пластик)_2.jpg` });
                }
            });
            await ctx.replyWithHTML(`Если образцы вышли хорошо, жмите кнопку <b>Оплатить</b>. В течение 1-5 минут после оплаты, вам придут файлы для печати. Чтобы 👉 начать заново (жми два раза) жмите соотвествующую кнопку`,
                Markup.inlineKeyboard([
                    [Markup.button.callback("💳 Оплатить","make_payment"), Markup.button.callback("🎭 Загрузить другое фото","update_photo")],
                    [Markup.button.callback("👉 Начать заново (жми два раза)","start_again")]
                ])
            )
            return ctx.wizard.selectStep(17);
        });
    } catch (e) {
        console.log(e)
    }
})

// 17
const getAnswer = new Composer();
getAnswer.action("start_again", async ctx => {
    await ctx.answerCbQuery();
    await ctx.wizard.selectStep(0);
})
getAnswer.action("update_photo", async ctx => {
    await ctx.replyWithHTML(`Подтвердите`,
        Markup.inlineKeyboard([
            [Markup.button.callback("🎭 Загрузить другое фото", "update_photo"), Markup.button.callback("⏭ Продолжить", "next")]
        ])
    )
    return ctx.wizard.selectStep(15)
})
getAnswer.action("make_payment", async ctx => {
    try {
        console.log("Оплатить")
        await ctx.replyWithInvoice(getInvoice(ctx.update.callback_query.from.id));
    } catch (e) {
        console.log(e)
    }
})

//20
const sendFinalData = new Composer();
sendFinalData.action("start_again", async ctx => {
    await ctx.answerCbQuery("update_photo");
    await ctx.wizard.selectStep(0);
})
sendFinalData.action("next", async ctx => {
    await ctx.answerCbQuery();
    await ctx.wizard.selectStep(16);
})
sendFinalData.on('text', async (ctx) => {  // это обработчик конкретного текста, данном случае это - "pay"
    try {
        await newDBconnect.getOrderInfo(async (result) => {
            await convert_to_jpeg(result, "example").then(async () => {
                return await ctx.replyWithDocument({ source: `E:///myProjects/bots/driveBot/${ctx.message.chat.id}_full_1.jpg` });
            });
            return ctx.scene.leave();
        });

    } catch (e) {
        console.log(e)
    }
})



const makeLicenseScene = new Scenes.WizardScene(
    "makeLicenseScene",
    getCategory,
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
    sendPhoto,
    getAnswer,
    sendFinalData,
)

export default makeLicenseScene;