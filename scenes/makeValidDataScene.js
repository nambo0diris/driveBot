import {Composer, Scenes} from "telegraf";
const hi = new Composer();
hi.on("text", async (ctx) => {
    try {
        await ctx.replyWithHTML("<b>hi</b>")
        return ctx.wizard.next();
    } catch (e) {
        console.log(e)
    }
})

const makeValidDataScene = new Scenes.WizardScene(
    "makeValidDataScene",
        hi
    )
export default makeValidDataScene;