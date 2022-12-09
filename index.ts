import {Markup, Telegraf, Scenes, session} from "telegraf";
import db_connect from "./libs/db_connect.js";
import dotenv from "dotenv"
import {startText} from "./content.js";
import commands from "./menu/commands.js";
import * as fs from "fs";
import * as path from "path";
import make_passport_scene from "./scenes/make_passport_scene.js";
import make_drive_license_scene from "./scenes/make_driver_license_scene.js";
dotenv.config();
// @ts-ignore
const bot = new Telegraf(process.env.BOT_TOKEN);
// @ts-ignore
const stage = new Scenes.Stage([make_passport_scene, make_drive_license_scene]);
bot.use(session());
// @ts-ignore
bot.use(stage.middleware());
bot.action('go_to_fake_market', async ctx => {
    try {
        await ctx.replyWithHTML("Какую бутафорию/сувенир вы хотите сделать?",
            Markup.inlineKeyboard([
                [Markup.button.callback("Карты UNO (в разработке)","drive_license" )],
                [Markup.button.callback("Карты Imaginarium (в разработке)","drive_license" )],
                [Markup.button.callback("Бутафорские водительские удостоверения","drive_license" )],
                [Markup.button.callback("Бутафорские паспорта (в разработке)", "passports")],
            ]));
        // @ts-ignore
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
    let newDBconnect: db_connect;

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

        newDBconnect = new db_connect(ctx.message.chat.id);
        await newDBconnect.closeOrder();
        await newDBconnect.checkCustomer(async (result: any) => {
            if (typeof result === "undefined"){
                await newDBconnect.addNewCustomer();
            }
        });
        await ctx.replyWithHTML(startText, Markup.inlineKeyboard(
            [
                [Markup.button.callback("⭐ Перейти к выбору бутафории", "go_to_fake_market")],
            ]
        ));
    } catch (e) {
        console.log(e)
    }
})
bot.help(async ctx => {
    await ctx.reply(commands);
})
await bot.launch()