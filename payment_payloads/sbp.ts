import {ICreatePayment} from "@a2seven/yoo-checkout";


// @ts-ignore
export const sbp = (email) => {
    let payload: ICreatePayment;
    return payload = {
        amount: {
            value: '499.00',
            currency: 'RUB'
        },
        payment_method_data: {
            type: 'sbp',

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
                email: email,
            },
            items: [
                {
                    payment_subject: "service",
                    payment_mode: "full_payment",
                    vat_code: 1,
                    quantity: "1",
                    description: "Бутафория - Водительское Удостоверение",
                    amount: {
                        value: "499.00",
                        currency: "RUB",
                    },
                }
            ],
        },
    };
}