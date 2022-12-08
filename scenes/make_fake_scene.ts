import {Markup, Composer, Scenes} from "telegraf"
import { YooCheckout, ICreatePayment  } from '@a2seven/yoo-checkout';
import db_connect from "../libs/db_connect";
import convert_to_jpeg from "../libs/convert_to_jpeg";

const zero_step = new Composer();

zero_step.action("make_payment", async (ctx) => {
    const checkout = new YooCheckout({ shopId: '963431', secretKey: 'test_UdXJsS7hOt-PLFjMvqhXi_Zj6pa3kPN5L47LbjyrJw8' });
    const idempotenceKey = 'a41cffcc-67f2-ab2b-3c3e-f1a473e4e412';
    const createPayload: ICreatePayment = {
        amount: {
            value: '400.00',
            currency: 'RUB'
        },
        payment_method_data: {
            type: 'bank_card'
        },
        confirmation: {
            type: 'redirect',
            return_url: 'test'
        }
    };

    try {
        const payment = await checkout.createPayment(createPayload, idempotenceKey);
        const payment_id = payment.id;
        // @ts-ignore
        ctx.wizard.state.data.payment_id = payment.id;
        const confirmation_url = payment.confirmation.confirmation_url ? payment.confirmation.confirmation_url : 'empty';

        if (confirmation_url != null) {
            await ctx.answerCbQuery();
            await ctx.replyWithHTML(confirmation_url).then(async () => {
                let payment_result = await checkout.getPayment(payment_id);
                let counter = 0;
                async function getPayment() {
                    payment_result = await checkout.getPayment(payment_id);
                    if (payment_result.status === "waiting_for_capture" || counter === 15) {
                        clearInterval(interval_id);
                        // @ts-ignore
                        await ctx.replyWithHTML("Оплата прошла. Спасибо!", Markup.inlineKeyboard([
                            [Markup.button.callback("Скачать файл/ы","files_download" )],
                        ]));
                        // @ts-ignore
                        return ctx.wizard.selectStep(1)
                    }
                    if (counter === 15) {
                        clearInterval(interval_id);
                        // @ts-ignore
                        await ctx.replyWithHTML("По каким-то причинам оплата еще не поступила. " +
                            "Если у вас списались средства, но файлы не пришли в течении 10 минут, обратитесь в поддержку, нажав соответствующую кнопку.", Markup.inlineKeyboard([
                            [Markup.button.callback("Оплатить","make_payment" )],
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

zero_step.on("callback_query", async (ctx) => {
    try {
        // @ts-ignore
        ctx.wizard.state.data = {};
        await ctx.replyWithHTML("Если хотите оплатить, жмите оплатить",
            Markup.inlineKeyboard([
            [Markup.button.callback("Оплатить","make_payment")],
        ]));
    } catch (e) {
        console.log(e)
    }
})

// 1
const first_step = new Composer();
first_step.action("files_download", async (ctx) => {
    ctx.answerCbQuery();
    let chat_id = ctx.update.callback_query.from.id;
    let newDBconnect;
    newDBconnect = new db_connect(chat_id);
    await ctx.reply('Заказ успешно оплачен. В течениие 1-5 минут вам придут файлы для скачивания.')
    await newDBconnect.getOrderInfo(async (result: { type: object; }) => {
        await convert_to_jpeg(result, "original").then(async () => {
            // @ts-ignore
            await ctx.replyWithDocument({ source: `/root/driveBot/temp/users/${chat_id}/Полный_разворот_1.jpg` });
            // @ts-ignore
            await ctx.replyWithDocument({ source: `/root/driveBot/temp/users/${chat_id}/Полный_разворот_2.jpg` });
            // @ts-ignore
            await ctx.replyWithDocument({ source: `/root/driveBot/temp/users/${chat_id}/Короткая_версия.jpg` });
            // @ts-ignore
            if (result.type === "eu"){
                // @ts-ignore
                await ctx.replyWithDocument({ source: `/root/driveBot/temp/users/${chat_id}/Европейские(на пластик)_1.jpg` });
                // @ts-ignore
                await ctx.replyWithDocument({ source: `/root/driveBot/temp/users/${chat_id}/Европейские(на пластик)_2.jpg` });
            }
        });
        // @ts-ignore
        return ctx.scene.leave();
    });
})
















const make_fake_scene = new Scenes.WizardScene(
    "make_fake_scene",
    zero_step,
    first_step
)

export default make_fake_scene;