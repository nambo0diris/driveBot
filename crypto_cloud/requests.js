import axios from "axios";
import {
    CRYPTO_CLOUD_AUTH_TOKEN,
    CRYPTO_CLOUD_SHOP_ID
} from "../const.js";


await axios.post("https://api.cryptocloud.plus/v1/invoice/create", {
    "shop_id": `${CRYPTO_CLOUD_SHOP_ID}`,
    "amount": 111
},{
    headers: {
        "Authorization": `Token ${CRYPTO_CLOUD_AUTH_TOKEN}`,
    }
}).then(r => console.log(r))