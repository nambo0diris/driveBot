import {Markup, Telegraf, Scenes, session} from "telegraf";
import db_connect from "./db_connect.js";
import dotenv from "dotenv"
import {startText} from "./content.js";
import makeLicenseScene from "./scenes/makeLicenseScene.js";
import makeDonationScene from "./scenes/makeDonationScene.js";
import getInvoice from "./get_invoice.js";
import convert_to_jpeg from "./convert_to_jpeg.js";
import commands from "./menu/commands.js";
import * as fs from "fs";
import * as path from "path";
dotenv.config();


const bot = new Telegraf(process.env.DEV_BOT_TOKEN);
const stage = new Scenes.Stage([makeLicenseScene]);

bot.use(session());
bot.use(stage.middleware());

bot.hears('Сделать сувенирные права', ctx => ctx.scene.enter("makeLicenseScene"))
bot.hears('Оплатить', async (ctx) => {
    try {
        console.log("Оплатить")
        await ctx.replyWithInvoice(getInvoice(ctx.from.id))
    } catch (e) {
        console.log(e)
    }
})
bot.on('pre_checkout_query', async (ctx) => {
    try {
        await ctx.answerPreCheckoutQuery(true)
    } catch (e) {
        console.log(e)
    }

}) // ответ на предварительный запрос по оплате


bot.on('successful_payment', async (ctx, next) => { // ответ в случае положительной оплаты
    try {
        let newDBconnect;
        newDBconnect = new db_connect(ctx.message.chat.id);
        await ctx.reply('Заказ успешно оплачен. В течениие 1-5 минут вам придут файлы для скачивания.')
        await newDBconnect.getOrderInfo(async (result) => {
            await convert_to_jpeg(result, "original").then(async () => {
                await ctx.replyWithDocument({ source: `/root/driveBot/temp/users/${ctx.message.chat.id}/Полный_разворот_1.jpg` });
                await ctx.replyWithDocument({ source: `/root/driveBot/temp/users/${ctx.message.chat.id}/Полный_разворот_2.jpg` });
                await ctx.replyWithDocument({ source: `/root/driveBot/temp/users/${ctx.message.chat.id}/Короткая_версия.jpg` });
                if (ctx.state.prava === "+европейские"){
                    await ctx.replyWithDocument({ source: `/root/driveBot/temp/users/${ctx.message.chat.id}/Европейские(на пластик)_1.jpg` });
                    await ctx.replyWithDocument({ source: `/root/driveBot/temp/users/${ctx.message.chat.id}/Европейские(на пластик)_2.jpg` });
                }
            });
            return ctx.scene.leave();
        });
    } catch (e) {
        console.log(e)
    }

})

// bot.command("/start", async ctx => {
//     await ctx.reply(startText, Markup.keyboard(
//         [
//             ["Сделать права"]
//         ]
//     ))
// })
bot.start(async (ctx) => {
    let newDBconnect;

    try {
        await fs.stat(`./temp/users/${ctx.message.chat.id}`, async (err) => {
            if (!err) {
                fs.readdir(`./temp/users/${ctx.message.chat.id}/`, (err, files) => {
                    if (err) throw err;
                    for (const file of files) {
                        fs.unlink(path.join(`./temp/users/${ctx.message.chat.id}/`, file), err => {
                            if (err) throw err;
                        });
                    }
                });
            } else if (err.code === 'ENOENT') {

            }
        });

        newDBconnect = new db_connect(ctx.message.chat.id);
        await newDBconnect.closeOrder();
        await newDBconnect.checkCustomer(async (result) => {
            if (typeof result === "undefined"){
                await newDBconnect.addNewCustomer();
            }
        });
        await ctx.replyWithHTML(startText, Markup.keyboard(
            [
                ["Сделать сувенирные права"]
            ]
        ))

    } catch (e) {

    }
})
bot.help(async ctx => {
    await ctx.reply(commands);
})
await bot.launch()