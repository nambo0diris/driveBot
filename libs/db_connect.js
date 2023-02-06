import mysql from 'mysql';
import config from "../config.js";
export default class db_connect {
    constructor() {
        this.pool = mysql.createPool(config);
    }
    connectDb = () => {
        this.pool.connect()
    }

    addNewOrder = async (order_data) => {
        try {
            await this.pool.query(`INSERT INTO orders (user_id, payment_type) VALUES ("${order_data.user_id}","${order_data.payment_type}")` , function (error, results, fields) {
                if (error) throw error;
            });
        } catch (e) {
            console.log(e)
        }
    }

    closeOrder = async (data) => {
        try {
            await this.pool.query(`UPDATE orders SET status=? WHERE user_id=${user_data.user_id} and status=0`, 1, function (error, results, fields) {
                if (error) throw error;
            });
        } catch (e) {
            console.log(e)
        }
    }

    updateOrder = async (data) => {
        try {
            await this.pool.query(`UPDATE orders SET ${data.key}=? WHERE user_id=${data.user_id} and status='open'`, data.value, function (error, results, fields) {
            });
        } catch (e) {
            console.log(e)
        }
    }

    getOrderInfo = async (data, callback) => {
        try {
            let result = await this.pool.query(`SELECT * FROM orders WHERE user_id=? and status=0`, [data.user_id], (error, results) => {
                callback(Object.values(JSON.parse(JSON.stringify(results)))[0]);
            });
            return result;

        } catch (e) {
            console.log(e)
        }
    }
    count = async (data, callback) => {
        try {
            return await this.pool.query(`SELECT COUNT(*) FROM orders WHERE status='success'`, [data.user_id], (error, results) => {
                try {
                    callback(Object.values(JSON.parse(JSON.stringify(results)))[0]);
                } catch (e) {
                    console.log(e)
                }
            });
        } catch (e) {
            console.log(e)
        }
    }

    getUserInfo = async (user_id, callback) => {
        console.log(
            user_id
        )
        try {
            return  await this.pool.query(`SELECT * FROM users WHERE user_id = ?`, [Number(user_id)], function (error, results, fields) {
                try {
                    callback(Object.values(JSON.parse(JSON.stringify(results)))[0]);
                } catch (e) {
                    console.log(e)
                }
            });
        } catch (e) {
            console.log(e)
        }
    }
    checkRefId = async (data, callback) => {
        try {
            return  await this.pool.query(`SELECT * FROM users WHERE user_id = ?`, [data.user_id], function (error, results, fields) {
                callback(Object.values(JSON.parse(JSON.stringify(results)))[0]);
            });
        } catch (e) {
            console.log(e)
        }
    }
    addNewUser = async (user_data) => {
        try {
            await this.pool.query(`INSERT INTO users (user_id, ref_id) VALUES ("${Number(user_data.user_id)}","${user_data.ref_id}")` , function (error, results, fields) {
                if (error) throw error;
            });
        } catch (e) {
            console.log(e)
        }
    }
    updateUserInfo = async (data) => {
        try {
            await this.pool.query(`UPDATE users SET ${data.key}=? WHERE user_id=${Number(data.user_id)}`, data.value, function (error, results, fields) {
                if (error) throw error;
            });
        } catch (e) {
            console.log(e)
        }
    }
    updateUserInfoFewFields = async (data) => {
        try {
            await this.pool.query(`UPDATE users SET score=${Number(data.score)}, orders_count=${Number(data.orders_count)}  WHERE user_id=${Number(data.user_id)}`, function (error, results, fields) {
                if (error) throw error;
            });
        } catch (e) {
            console.log(e)
        }
    }

    close() {
        this.pool.end();
    }
}
