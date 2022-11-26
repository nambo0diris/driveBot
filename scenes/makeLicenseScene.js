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
const getChoice = new Composer();
getChoice.on("text", async (ctx) => {
    newDBconnect = new db_connect(ctx.message.chat.id);
    await newDBconnect.addNewOrder();
    try {
        await ctx.replyWithHTML("Какие сувенирные права вы хотите сделать? Вы можете выбрать вариант 'РФ международные + европейские' это на цену никак не влияет, но нужно будет ответить на пару дополнительных вопросов, зато вы получите макет для печати на пластике", Markup.keyboard([
            ["РФ международные", "РФ международные + европейские"]
        ]))
        return ctx.wizard.selectStep(1);
    } catch (e) {
        console.log(e)
    }
})



// 1
const getDateOfBirthStep = new Composer();
getDateOfBirthStep.hears("/start", ctx => ctx.scene.leave())
getDateOfBirthStep.on("text", async (ctx) => {
    try {
        ctx.state.prava = ctx.message.text;
        await ctx.replyWithHTML("Напишите Дату Рождения (формат: <b>дд.мм.гггг</b>)", Markup.keyboard([["Начать заново"]]))
        if (ctx.message.text === "РФ международные") {
            return ctx.wizard.selectStep(5);
        }
         if (ctx.message.text === "РФ международные + европейские") {
             return ctx.wizard.selectStep(2);
        }
    } catch (e) {
        console.log(e)
    }
})

// 2
const getSex = new Composer();
getSex.on("text", async(ctx) => {
    try {
        if(ctx.message.text === "/start") {
            return ctx.scene.leave()
        }
        if (ctx.message.text === "Начать заново" ) {
            await ctx.replyWithHTML("Подтвердите", Markup.keyboard([["Начать заново"]]));
            return ctx.wizard.selectStep(0);
        }
        await newDBconnect.updateOrder({key:"date_of_birth", value:`${ctx.message.text}`});
        await ctx.replyWithHTML("Укажите ваш пол", Markup.keyboard([
            ["М", "Ж"],
            ["Начать заново"]
        ]))
        return ctx.wizard.selectStep(3);
    } catch (e) {
        console.log(e)
    }
})

// 3
const getEyesColor = new Composer();
getEyesColor.on("text", async(ctx) => {
    let sex = "";
    try {
        if(ctx.message.text === "/start") {
            return ctx.scene.leave()
        }
        if (ctx.message.text === "Начать заново" ) {
            await ctx.replyWithHTML("Подтвердите", Markup.keyboard([["Начать заново"]]));
            return ctx.wizard.selectStep(0);
        }
        if (ctx.message.text === "М") {
            sex = "M";
        }
        if (ctx.message.text === "Ж") {
            sex = "F";
        }
        await newDBconnect.updateOrder({key:"sex", value:`${sex}`});
        await ctx.replyWithHTML("Укажите цвет глаз", Markup.keyboard([
            ["Серые", "Зеленые"],
            ["Желтые", "Синие", "Карие"],
            ["Начать заново"]
        ]))
        return ctx.wizard.selectStep(4);
    } catch (e) {
        console.log(e)
    }
})

// 4
const getHeight = new Composer();
getHeight.on("text", async(ctx) => {
    let eyes_color = '';
    try {
        if(ctx.message.text === "/start") {
            return ctx.scene.leave()
        }
        if (ctx.message.text === "Начать заново" ) {
            await ctx.replyWithHTML("Подтвердите", Markup.keyboard([["Начать заново"]]));
            return ctx.wizard.selectStep(0);
        }
        switch (ctx.message.text) {
            case "Серые":
                eyes_color = "GREY";
            case "Зеленые":
                eyes_color = "GREEN";
            case "Желтые":
                eyes_color = "YELLOW";
            case "Синие":
                eyes_color = "BLUE";
            case "Карие":
                eyes_color = "BROWN";
        }
        await newDBconnect.updateOrder({key:"eyes", value:`${eyes_color}`});
        await ctx.replyWithHTML("<b>Укажите ваш рост в сантиметрах. Например: 183</b>", Markup.keyboard([["Начать заново"]]))
        return ctx.wizard.selectStep(5);
    } catch (e) {
        console.log(e)
    }
})


// 5
const getNameStep = new Composer();
getNameStep.on("text", async (ctx) => {
    try {
        if(ctx.message.text === "/start") {
            return ctx.scene.leave()
        }
        if (ctx.message.text === "Начать заново" ) {
            await ctx.replyWithHTML("Подтвердите", Markup.keyboard([["Начать заново"]]));
            return ctx.wizard.selectStep(0);
        }
        if (ctx.message.text.split('.').length === 3) {
            await newDBconnect.updateOrder({key:"date_of_birth", value:`${ctx.message.text}`});
            console.log("date_of_birth   " + ctx.message.text)
        } else {
            await newDBconnect.updateOrder({key:"height", value:`${ctx.message.text}`});
        }
        await ctx.replyWithHTML("Напишите Фамилию Имя Отчество. Пример: <b>Пушкин Александр Сергеевич</b>", Markup.keyboard([["Начать заново"]]))
        return ctx.wizard.selectStep(6);
    } catch (e) {
        console.log(e)
    }
})


// 6
const isRandomAll = new Composer();
isRandomAll.on("text", async (ctx) => {
    try {
        if(ctx.message.text === "/start") {
            return ctx.scene.leave()
        }
        if (ctx.message.text === "Начать заново" ) {
            await ctx.replyWithHTML("Подтвердите", Markup.keyboard([["Начать заново"]]));
            return ctx.wizard.selectStep(0);
        }
        await newDBconnect.updateOrder({key: "last_name", value: `${cyrillicToTranslit.transform(ctx.message.text.split(" ")[0]).toUpperCase()}`});
        await newDBconnect.updateOrder({key: "first_name", value: `${cyrillicToTranslit.transform(ctx.message.text.split(" ")[1]).toUpperCase()}`});
        await newDBconnect.updateOrder({key: "second_name", value: `${cyrillicToTranslit.transform(ctx.message.text.split(" ")[2]).toUpperCase()}`});
        await ctx.replyWithHTML("Мы можем заполнить все оставшиеся пункты за вас <b>случайными</b> данными", Markup.keyboard([
            ["Заполню сам"], ["Случайные данные"],["Начать заново"]
        ]))

        return ctx.wizard.selectStep(7);
    } catch (e) {
        console.log(e)
    }
})



// 7
const getCityOfBirth = new Composer();
getCityOfBirth.on("text", async (ctx) => {
    try {
        if(ctx.message.text === "/start") {
            return ctx.scene.leave()
        }
        if (ctx.message.text === "Случайные данные" || ctx.message.text === "Сгенерировать заново") {
            const data = await get_places();
            await newDBconnect.getOrderInfo(async (result) => {
                try {
                    await newDBconnect.updateOrder({key: "city_of_birth", value: `${cyrillicToTranslit.transform(data.city_of_birth.toUpperCase())}`});
                    await newDBconnect.updateOrder({key: "country_of_birth", value: `${cyrillicToTranslit.transform(data.country_of_birth.toUpperCase())}`});
                    await newDBconnect.updateOrder({key: "living_street", value: `${cyrillicToTranslit.transform(data.living_street.toUpperCase())}`});
                    await newDBconnect.updateOrder({key: "living_country", value: `${cyrillicToTranslit.transform(data.living_country.toUpperCase())}`});
                    await newDBconnect.updateOrder({key: "house_number", value: `${data.house_number}`});
                    await newDBconnect.updateOrder({key: "living_index", value: `${data.living_index}`});
                    await newDBconnect.updateOrder({key: "living_city", value: `${cyrillicToTranslit.transform(data.living_city.toUpperCase())}`});
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
                             Место проживания: ${data.living_index}, ${data.living_country}, ${data.living_city}, ${data.living_street}, ${data.house_number}`, Markup.keyboard([["Все верно"],["Сгенерировать заново"],["Начать заново"]])
                )
            })

        }

        if (ctx.message.text === "Все верно") {
            await newDBconnect.updateOrder({key: "id_code", value: `${id_code()}`});
            await newDBconnect.updateOrder({key: "passport_number", value: `${passport_number()}`});
            await newDBconnect.updateOrder({key: "national_driver_license", value: `${passport_number()}`});
            await ctx.replyWithHTML("<b>Загрузите фото как на документы, соотношение ширины к высоте 3:4. " +
                "Если уже есть фото 3х4см, сфотографируйте на телефон, обрежьте изображение по краям фотографии и отправляйте. В течение пары минут вам придут образцы.</b>", Markup.keyboard([["Начать заново"]]))
            return ctx.wizard.selectStep(16);
        }

        if (ctx.message.text === "Заполню сам") {
            await ctx.replyWithHTML("Укажитете город, где родились. Пример: <b>Москва</b>", Markup.keyboard([["Начать заново"]]))
            return ctx.wizard.selectStep(8);
        }
        if (ctx.message.text === "Начать заново" ) {
            await ctx.replyWithHTML("Подтвердите", Markup.keyboard([["Начать заново"]]));
            return ctx.wizard.selectStep(0);
        }
        return ctx.wizard.selectStep(7);
    } catch (e) {
        console.log(e)
    }
})

// 8
const getCountryOfBirth = new Composer();
getCountryOfBirth.on("text", async (ctx) => {
    try {
        if(ctx.message.text === "/start") {
            return ctx.scene.leave()
        }
        if (ctx.message.text === "Начать заново" ) {
            await ctx.replyWithHTML("Подтвердите", Markup.keyboard([["Начать заново"]]));
            return ctx.wizard.selectStep(0);
        }
        await newDBconnect.updateOrder({key:"city_of_birth", value:`${cyrillicToTranslit.transform(ctx.message.text.trim().toUpperCase())}`});
        await ctx.replyWithHTML("Укажите страну рождения. Пример: <b>Россия или СССР </b>", Markup.keyboard([["Начать заново"]]))
        return ctx.wizard.selectStep(9);
    } catch (e) {
        console.log(e)
    }
})

// 9
const getLivingStreet = new Composer();
getLivingStreet.on("text", async (ctx) => {
    let country = ""
    try {
        if(ctx.message.text === "/start") {
            return ctx.scene.leave()
        }
        if (ctx.message.text === "Начать заново" ) {
            await ctx.replyWithHTML("Подтвердите", Markup.keyboard([["Начать заново"]]));
            return ctx.wizard.selectStep(0);
        }
        if (ctx.message.text.trim().toLowerCase() === "россия") {
            country = "Russia"
        } else if (ctx.message.text.trim().toLowerCase() === "ссср") {
            country = "USSR"
        } else {
            country = cyrillicToTranslit.transform(ctx.message.text).toUpperCase();
        }
        await newDBconnect.updateOrder({key:"country_of_birth", value:`${country}`});
        await ctx.replyWithHTML("Укажите улицу проживания. Пример: <b>ул.Гагарина</b>", Markup.keyboard([["Начать заново"]]))
        return ctx.wizard.selectStep(10);
    } catch (e) {
        console.log(e)
    }
})

// 10
const getHouseNumber = new Composer();
getHouseNumber.on("text", async (ctx) => {
    try {
        if(ctx.message.text === "/start") {
            return ctx.scene.leave()
        }
        if (ctx.message.text === "Начать заново" ) {
            await ctx.replyWithHTML("Подтвердите", Markup.keyboard([["Начать заново"]]));
            return ctx.wizard.selectStep(0);
        }
        await newDBconnect.updateOrder({key:"living_street", value:`${cyrillicToTranslit.transform(ctx.message.text).toUpperCase()}`});
        await ctx.replyWithHTML("Укажите номер дома. Пример: <b>34/2</b>")
        return ctx.wizard.selectStep(11);
    } catch (e) {
        console.log(e)
    }
})

// 11
const getLivingIndex = new Composer();
getLivingIndex.on("text", async (ctx) => {
    try {
        if(ctx.message.text === "/start") {
            return ctx.scene.leave()
        }
        if (ctx.message.text === "Начать заново" ) {
            await ctx.replyWithHTML("Подтвердите", Markup.keyboard([["Начать заново"]]));
            return ctx.wizard.selectStep(0);
        }
        await newDBconnect.updateOrder({key:"house_number", value:`${ctx.message.text.toUpperCase()}`});
        await ctx.replyWithHTML("Укажите почтовый индекс. Пример: <b>192168</b>")
        return ctx.wizard.selectStep(12);
    } catch (e) {
        console.log(e)
    }
})

// 12
const getLivingCity = new Composer();
getLivingCity.on("text", async (ctx) => {
    try {
        if(ctx.message.text === "/start") {
            return ctx.scene.leave()
        }
        if (ctx.message.text === "Начать заново" ) {
            await ctx.replyWithHTML("Подтвердите<", Markup.keyboard([["Начать заново"]]));
            return ctx.wizard.selectStep(0);
        }
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
getSubjectIdAndMakeSerialNumber.on("text", async (ctx) => {
    try {
        if(ctx.message.text === "/start") {
            return ctx.scene.leave()
        }
        if (ctx.message.text === "Начать заново" ) {
            await ctx.replyWithHTML("Подтвердите", Markup.keyboard([["Начать заново"]]));
            return ctx.wizard.selectStep(0);
        }

        await newDBconnect.updateOrder({key:"living_city", value:`${cyrillicToTranslit.transform(ctx.message.text.toUpperCase())}`});
        await ctx.replyWithHTML("Напишите двузначный ГИБДД-код субьекта РФ, к которому относится место проживания, указанное на предыдущем шаге.<a href='https://ru.wikipedia.org/wiki/%D0%9A%D0%BE%D0%B4%D1%8B_%D1%81%D1%83%D0%B1%D1%8A%D0%B5%D0%BA%D1%82%D0%BE%D0%B2_%D0%A0%D0%BE%D1%81%D1%81%D0%B8%D0%B9%D1%81%D0%BA%D0%BE%D0%B9_%D0%A4%D0%B5%D0%B4%D0%B5%D1%80%D0%B0%D1%86%D0%B8%D0%B8'>Узнать код можно тут</a>")
        return ctx.wizard.selectStep(14);
    } catch (e) {
        console.log(e)
    }
})


// 14
const getApprove = new Composer();
getApprove.on("text", async (ctx) => {
    try {
        if(ctx.message.text === "/start") {
            return ctx.scene.leave()
        }
        if (ctx.message.text === "Начать заново" ) {
            await ctx.replyWithHTML("Подтвердите", Markup.keyboard([["Начать заново"]]));
            return ctx.wizard.selectStep(0);
        }

        await newDBconnect.updateOrder({key: "subject_id", value: `${serial_number(ctx.message.text)}`});
        await newDBconnect.getOrderInfo(async (result) => {
            if(ctx.state.prava === "+европейские"){
                await ctx.replyWithHTML(`
                 <b>Проверьте правильность введенной информации:</b>
                 Имя: ${result.first_name},
                 Фамилия: ${result.last_name}, 
                 Отчество: ${result.second_name}, 
                 Дата рождения: ${result.date_of_birth}, 
                 Место рождения: ${result.city_of_birth}, ${result.country_of_birth} 
                 Место проживания: ${result.living_index}, ${result.living_country}, ${result.living_city}, ${result.living_street}, ${result.house_number},
                 Пол: ${result.sex}
                 Цвет глаз: ${result.eyes}
                 Рост: ${result.height}`, Markup.keyboard([
                        ["Всё верно", "Не верно"]
                    ])
                )
            } else {
                await ctx.replyWithHTML(`
                 <b>Проверьте правильность введенной информации:</b>
                 Имя: ${result.first_name},
                 Фамилия: ${result.last_name}, 
                 Отчество: ${result.second_name}, 
                 Дата рождения: ${result.date_of_birth}, 
                 Место рождения: ${result.city_of_birth}, ${result.country_of_birth} 
                 Место проживания: ${result.living_index}, ${result.living_country}, ${result.living_city}, ${result.living_street}, ${result.house_number}`, Markup.keyboard([
                        ["Всё верно", "Не верно"]
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
getPhoto.on("text", async (ctx) => {
    try {
        if(ctx.message.text === "/start") {
            return ctx.scene.leave()
        }
        if (ctx.message.text === "Начать заново" ) {
            await ctx.replyWithHTML("Подтвердите", Markup.keyboard([["Начать заново"]]));
            return ctx.wizard.selectStep(0);
        }
        if (ctx.message.text === "Всё верно" || ctx.message.text === "Загрузить другое фото") {
            await newDBconnect.updateOrder({key: "id_code", value: `${id_code()}`});
            await newDBconnect.updateOrder({key: "passport_number", value: `${passport_number()}`});
            await newDBconnect.updateOrder({key: "national_driver_license", value: `${passport_number()}`});
            await ctx.replyWithHTML("<b>Загрузите фото как на документы, соотношение ширины к высоте 3:4. " +
                "Если уже есть фото 3х4см, сфотографируйте на телефон, обрежьте изображение по краям фотографии и отправляйте. В течение пары минут вам придут образцы.</b>", Markup.keyboard([["Начать заново"]]))
            return ctx.wizard.selectStep(16);
        }
        if (ctx.message.text === "Не верно" ) {
            await ctx.replyWithHTML("<b>Чтобы перейти к началу заполнения анкеты, нажмите кнопку 'Начать заново'</b>", Markup.keyboard([["Начать заново"]]));
            return ctx.wizard.selectStep(0);
        }
        if (ctx.message.text === "Начать заново" ) {
            await ctx.replyWithHTML("Подтвердите", Markup.keyboard([["Начать заново"]]));
            return ctx.wizard.selectStep(0);
        }
        if (ctx.message.text === "Сгенерировать заново") {
            await ctx.reply("Генерю...");
            return ctx.wizard.selectStep(7);
        }
    } catch (e) {
        console.log(e)
    }
})


// 16
const sendPhoto = new Composer();
sendPhoto.on("photo", async (ctx) => {
    const picture = ctx.message.photo[2].file_id;
    const fileUrl = await ctx.telegram.getFileLink(picture);

    try {
        if(ctx.message.text === "/start") {
            return ctx.scene.leave()
        }
        if (ctx.message.text === "Начать заново" ) {
            await ctx.replyWithHTML("Подтвердите", Markup.keyboard([["Начать заново"]]));
            return ctx.wizard.selectStep(0);
        }
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
            });

            if (ctx.state.prava === "РФ международные + европейские"){
                await ctx.replyWithDocument({ source: `/root/driveBot/temp/users/${ctx.message.chat.id}/Европейские(на пластик)_1.jpg` });
                await ctx.replyWithDocument({ source: `/root/driveBot/temp/users/${ctx.message.chat.id}/Европейские(на пластик)_2.jpg` });
            }
            await ctx.replyWithHTML(`Если образцы вышли хорошо, жмите кнопку <b>Оплатить</b>. В течение 1-5 минут после оплаты, вам придут файлы для печати. Чтобы начать заново жмите соотвествующую кнопку`, Markup.keyboard([
                    ["Оплатить", "Загрузить другое фото"],
                    ["Начать заново"]
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
getAnswer.on('text', async (ctx) => {
  try {

      switch (ctx.message.text) {
          case "Оплатить":
              try {
                  console.log("Оплатить")
                  await ctx.replyWithInvoice(getInvoice(ctx.from.id))
              } catch (e) {
                  console.log(e)
              }
          case "/start":
              return ctx.scene.leave();
          case "Начать заново":
              await ctx.replyWithHTML(`Подтвердите`, Markup.keyboard([
                      ["Начать заново"], ["Продолжить"]
                  ])
              )
              return ctx.wizard.selectStep(0);
          case "Загрузить другое фото":
              await ctx.replyWithHTML(`Подтвердите`, Markup.keyboard([
                      ["Загрузить другое фото"], ["Продолжить"]
                  ])
              )
              return ctx.wizard.selectStep(15)
      }
  } catch (e) {
      console.log(e)
  }
})

// 20
// const sendFinalData = new Composer();
// sendFinalData.on('text', async (ctx) => {  // это обработчик конкретного текста, данном случае это - "pay"
//     try {
//         await newDBconnect.getOrderInfo(async (result) => {
//             await convert_to_jpeg(result, "example").then(async () => {
//                 return await ctx.replyWithDocument({ source: `E:///myProjects/bots/driveBot/${ctx.message.chat.id}_full_1.jpg` });
//             });
//             return ctx.scene.leave();
//         });
//
//     } catch (e) {
//         console.log(e)
//     }
// })



const makeLicenseScene = new Scenes.WizardScene(
    "makeLicenseScene",
    getChoice,
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
    // sendFinalData,
)

export default makeLicenseScene;