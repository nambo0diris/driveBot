import {Composer, Markup, Scenes} from "telegraf";

const bla = new Composer();
bla.on("callback_query",async (ctx) => {
    await ctx.answerCbQuery();
    await ctx.replyWithHTML("В разработке", Markup.inlineKeyboard([
        [Markup.button.callback("👉 Назад", "prev_step")],
        [Markup.button.callback("👉 Начать заново (жми два раза)", "start_again")],
    ]))
    // @ts-ignore
    return ctx.wizard.selectStep(1)
})
const bla2 = new Composer();
bla2.on("callback_query",async (ctx) => {
    await ctx.replyWithHTML("В разработке", Markup.inlineKeyboard([
        [Markup.button.callback("👉 1", "prev_step")],
        [Markup.button.callback("👉 2", "start_again")],
    ]))

})


const make_passport_scene = new Scenes.WizardScene(
    "make_passport_scene",
    bla,
    bla2
)

export default make_passport_scene;