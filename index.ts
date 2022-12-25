import {Markup, Telegraf, Scenes, session} from "telegraf";
import db_connect from "./libs/db_connect.js";
import dotenv from "dotenv"
import {startText} from "./content.js";
import commands from "./menu/commands.js";
import * as fs from "fs";
import * as path from "path";
import make_passport_scene from "./scenes/make_passport_scene.js";
import make_drive_license_scene from "./scenes/make_driver_license_scene.js";
import withdraw_money_scene from "./scenes/withdraw_money_scene";
dotenv.config();
// @ts-ignore
const bot = new Telegraf(process.env.BOT_TOKEN);
// @ts-ignore
const stage = new Scenes.Stage([make_passport_scene, make_drive_license_scene, withdraw_money_scene]);
bot.use(session());
// @ts-ignore
bot.use(stage.middleware());



// bot.action('withdraw', async ctx => {
//     try {
//         // @ts-ignore
//         return ctx.scene.enter(withdraw_money_scene);
//     } catch (e) {
//         console.log(e)
//     }
// });

bot.action('go_to_fake_market', async ctx => {
    ctx.answerCbQuery();
    try {
        await ctx.replyWithHTML("Какую бутафорию/сувенир вы хотите сделать?",
            Markup.inlineKeyboard([
                [Markup.button.callback("🚘 Бутафорские водительские удостоверения","drive_license" )],
                [Markup.button.callback("👓 Бутафорские паспорта (в разработке)", "passports")],
            ]));

    } catch (e) {
        console.log(e)
    }
})
bot.action('tutorial', async ctx => {
    try {
        // @ts-ignore
        await ctx.replyWithHTML(`Чтобы подготовить фото с соотношением сторон 3х4, вы можете воспользоваться простейшим приложением, скачать его на андроид можно по 👉 <a href='https://play.google.com/store/apps/details?id=com.arumcomm.cropimage'>этой ссылке</a>👈
для айфона приложение мы можете скачать 
по 👉 <a href='https://apps.apple.com/ru/app/%D0%BE%D0%B1%D1%80%D0%B5%D0%B7%D0%BA%D0%B0-%D1%84%D0%BE%D1%82%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B9/id442008567'>этой ссылке</a>👈`)
        await ctx.replyWithDocument({
            source: "/root/driveBot/examples/example.mp4",
        },Markup.inlineKeyboard([
            [Markup.button.callback("🐣 В начало","start" )],
        ]))
    } catch (e) {
        console.log(e)
    }
})
bot.action('start', async ctx => {
    try {
        await ctx.replyWithHTML(startText, Markup.inlineKeyboard(
            [
                [Markup.button.callback("⭐ Перейти к выбору бутафории", "go_to_fake_market")],
                [Markup.button.callback("🎥 Посмотреть видео-инструкцию", "tutorial")],
            ]
        ));
    } catch (e) {
        console.log(e)
    }
})
bot.on("callback_query", async ctx => {
    try {
        // Armenia, Argentina, Austria, Australia, Azerbaijan, Bulgaria, Brazil, Canada, Cyprus, Germany, Dominican Republic, Estonia, Egypt, Spain, Finland, Georgia, Italy, Tajikistan
        await ctx.answerCbQuery();
        // @ts-ignore
        if (ctx.callbackQuery["data"] === "passport") {
            // @ts-ignore
            await ctx.scene.enter("make_passport_scene");
        }
        // @ts-ignore
        if (ctx.callbackQuery["data"] === "drive_license") {
            // @ts-ignore
            await ctx.scene.enter("make_driver_license_scene");
        }
    } catch (e) {
        console.log(e)
    }
})

bot.start(async (ctx) => {
    try {
        await fs.stat(`/root/driveBot/temp/users/${ctx.message.chat.id}`, async (err) => {
            if (!err) {
                fs.readdir(`/root/driveBot/temp/users/${ctx.message.chat.id}/`, (err, files) => {
                    if (err) throw err;
                    for (const file of files) {
                        fs.unlink(path.join(`/root/driveBot/temp/users/${ctx.message.chat.id}/`, file), err => {
                            if (err) throw err;
                        });
                    }
                });
            } else if (err.code === 'ENOENT') {

            }
        });

        // @ts-ignore
        let newDBconnect = new db_connect();
        await newDBconnect.getUserInfo(ctx.update.message.chat.id, async (result: any) => {
            if (typeof result === "undefined") {
                // @ts-ignore
                await newDBconnect.addNewUser({user_id: ctx.update.message.chat.id, ref_id: ctx.startPayload});
            }
            if(ctx.startPayload !== ""){
                // @ts-ignore
                await newDBconnect.getUserInfo(ctx.startPayload, async (res:any) => {
                    console.log(res)
                    const redirect_count = res.redirect_count + 1;
                    await newDBconnect.updateUserInfo({user_id: ctx.startPayload, key:"redirect_count", value: redirect_count})
                })
            }

        });

        await newDBconnect.count(ctx.update.message.chat.id, async (result:any) => {
            let count = Number(result["COUNT(*)"]) + 134;
            await newDBconnect.getUserInfo(ctx.update.message.chat.id, async (res:any) => {
                await ctx.replyWithHTML(`Распространяйте реферальную ссылку и получайте <b>30%</b> с каждой оплаты ваших рефералов.
Ваша реферальная ссылка: https://t.me/dev_test_drive_bot?start=${ctx.update.message.chat.id}

Переходов по вашей реферальной ссылке было: <b>${res.redirect_count}</b>.
Ваши рефералы сделали сделок: <b>${res.orders_count}</b>.
Ваш баланс: <b>${res.score}</b> рублей.
Выплачено: <b>${res.widthdraw}</b> рублей.
Всего заработано: <b>${res.widthdraw + res.score}</b> рублей.

Чтобы сделать выплату, введите команду /withdraw "номер телефона", привязанного к банку или номер банковской карты)
<b>Например:</b>
/withdwraw +79991111111
/withdwraw 1111 2222 1111 2222
/withdwraw 1111222211112222
`);

                await ctx.replyWithHTML(`⚡⚡ Количество людей, уже получивших копии: <b>${count}</b>⚡⚡`);
                await ctx.replyWithHTML(startText, Markup.inlineKeyboard(
                    [
                        [Markup.button.callback("⭐ Перейти к выбору бутафории", "go_to_fake_market")],
                        [Markup.button.callback("🎥 Посмотреть видео-инструкцию", "tutorial")],
                    ]
                ));
            })
        })
    } catch (e) {
        console.log(e)
    }
})
bot.command("/support", async (ctx) => {
    try {
        await ctx.replyWithHTML("Если у вас возникли вопросы по использованию бота или у вас прошла оплата, но файлы не пришли в течении 10 минут, пишите @xeroxDoc_bot_support.\n" +
            "Чтобы начать сначала жмите /start.");
    } catch (e) {
        console.log(e)
    }
})
bot.command("/withdraw", async (ctx) => {
    try {
        await ctx.replyWithHTML(`Ожидайте выплату в течение 24 часов, если оплата не поступила, обратитесь в поддержку 👉 /support`);

    } catch (e) {
        console.log(e)
    }
})
bot.help(async ctx => {
    await ctx.reply(commands);
})
await bot.launch();