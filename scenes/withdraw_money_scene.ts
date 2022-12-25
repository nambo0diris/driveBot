import {Composer, Markup, Scenes} from "telegraf";
import db_connect from "../libs/db_connect";
// @ts-ignore
import { v4 as uuidv4 } from 'uuid';

var newDBconnect: db_connect;

//step 0
const info = new Composer();
info.on("callback_query", async ctx => {
    try {
        await ctx.replyWithHTML(``)
    } catch (e) {
        console.log(e);
    }
});


const withdraw_money_scene = new Scenes.WizardScene(
    "withdraw_money_scene",
    info,
)

export default withdraw_money_scene;