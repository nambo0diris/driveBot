import mysql from 'mysql';
import config from "./config.js";
export default class db_connect {
    constructor(userChatId) {
        this.userChatId = userChatId;
        this.handleDisconnect = () => {
            this.connection = mysql.createConnection(config);
            // Recreate the connection, since
            // the old one cannot be reused.
            try {
                this.connection.connect(function(err) {              // The server is either down
                    if(err) {                                     // or restarting (takes a while sometimes).
                        console.log('error when connecting to db:', err);
                        setTimeout(this.handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
                    }                                     // to avoid a hot loop, and to allow our node script to
                });                                     // process asynchronous requests in the meantime.
                                                        // If you're also serving http, display a 503 error.
            } catch (e) {
                console.log(e)
            }
            try {
                this.connection.on('error', function(err) {
                    console.log('db error', err);
                    if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
                        setTimeout(this.handleDisconnect, 2000);                         // lost due to either server restart, or a
                    } else {                                      // connnection idle timeout (the wait_timeout
                        throw err;                                  // server variable configures this)
                    }
                });
            } catch (e) {
                console.log(e)
            }
        }
        try {
            this.handleDisconnect();
        } catch (e) {
            console.log(e)
        }

    }
    connectDb = () => {
        this.connection.connect()
    }
    addNewCustomer = async () => {
        let post  = {customer_id: this.userChatId};
        try {
            await this.connection.query('INSERT INTO customer SET ?', post, function (error, results, fields) {
                if (error) throw error;
                console.log(results)
            });
        } catch (e) {
            console.log(e)
        }
    }
    updateCustomerInfo = async (data) => {
        try {
            await this.connection.query(`UPDATE users SET ${data.key}=? WHERE id=${this.userChatId}`, data.value, function (error, results, fields) {
                // if (error) throw error;
                console.log(results)
            });
        } catch (e) {
            console.log(e)
        }
    }
    checkCustomer = async (callback) => {
        try {
            return  this.connection.query(`SELECT * FROM customer WHERE customer_id = ?`, [this.userChatId], function (error, results, fields) {
                callback(Object.values(JSON.parse(JSON.stringify(results)))[0]);
            });
        } catch (e) {
            console.log(e)
        }
    }
    addNewOrder = async () => {
        let data = {user_id: this.userChatId};
        console.log(data)
        try {
            await this.connection.query('INSERT INTO orders SET ?',data , function (error, results, fields) {
                if (error) throw error;
                console.log(results)
            });
        } catch (e) {
            console.log(e)
        }
    }
    closeOrder = async (data) => {
        try {
            await this.connection.query(`UPDATE orders SET status=? WHERE user_id=${this.userChatId} and status=0`, 1, function (error, results, fields) {
                if (error) throw error;
                console.log(results)
            });
        } catch (e) {
            console.log(e)
        }
    }

    updateOrder = async (data) => {
        try {
            await this.connection.query(`UPDATE orders SET ${data.key}=? WHERE user_id=${this.userChatId} and status=0`, data.value, function (error, results, fields) {
                console.log(results)
            });
        } catch (e) {
            console.log(e)
        }
    }

    getOrderInfo = async (callback) => {
        try {
            return this.connection.query(`SELECT * FROM orders WHERE user_id=? and status=0`, [this.userChatId], (error, results) => {
                callback(Object.values(JSON.parse(JSON.stringify(results)))[0]);
            });
        } catch (e) {
            console.log(e)
        }
    }
    close() {
        this.connection.end();
    }
}
