import mysql from 'mysql';
import config from "../config.js";
export default class db_connect {
    constructor(userChatId) {
        this.userChatId = userChatId;
        this.pool = mysql.createPool(config);
    }
    connectDb = () => {
        this.pool.connect()
    }
    addNewCustomer = async () => {
        let post  = {customer_id: this.userChatId};
        try {
            await this.pool.query('INSERT INTO customer SET ?', post, function (error, results, fields) {
                if (error) throw error;
            });
        } catch (e) {
            console.log(e)
        }
    }
    updateCustomerInfo = async (data) => {
        try {
            await this.pool.query(`UPDATE users SET ${data.key}=? WHERE id=${this.userChatId}`, data.value, function (error, results, fields) {
                if (error) throw error;
            });
        } catch (e) {
            console.log(e)
        }
    }
    checkCustomer = async (callback) => {
        try {
            return  this.pool.query(`SELECT * FROM customer WHERE customer_id = ?`, [this.userChatId], function (error, results, fields) {
                callback(Object.values(JSON.parse(JSON.stringify(results)))[0]);
            });
        } catch (e) {
            console.log(e)
        }
    }
    addNewOrder = async (order_data) => {
        try {
            await this.pool.query(`INSERT INTO orders SET user_id=${order_data.user_id}, payment_type=${order_data.payment_type}` , function (error, results, fields) {
                if (error) throw error;
            });
        } catch (e) {
            console.log(e)
        }
    }
    closeOrder = async (data) => {
        try {
            await this.pool.query(`UPDATE orders SET status=? WHERE user_id=${this.userChatId} and status=0`, 1, function (error, results, fields) {
                if (error) throw error;
            });
        } catch (e) {
            console.log(e)
        }
    }

    updateOrder = async (data) => {
        try {
            await this.pool.query(`UPDATE orders SET ${data.key}=? WHERE user_id=${this.userChatId} and status=0`, data.value, function (error, results, fields) {
            });
        } catch (e) {
            console.log(e)
        }
    }

    getOrderInfo = async (callback) => {
        try {
            let result = await this.pool.query(`SELECT * FROM orders WHERE user_id=? and status=0`, [this.userChatId], (error, results) => {
                callback(Object.values(JSON.parse(JSON.stringify(results)))[0]);
            });
            return result;

        } catch (e) {
            console.log(e)
        }
    }
    close() {
        this.pool.end();
    }
}
