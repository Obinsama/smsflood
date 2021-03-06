'user strict';

const DB = require('./db');
const path = require('path');
const fs = require('fs');

class Helper{

    constructor(app){
        this.db = DB;
    }

    async addSocketId(userId, userSocketId){
        try {
            return await this.db.query(`UPDATE users SET socket_id = ?, online= ? WHERE id = ?`, [userSocketId,'Y',userId]);
        } catch (error) {
            console.log(error);
            return null;
        }
    }


    getChatList(userId){
        try {
            return Promise.all([
                this.db.query(`SELECT id, name, socket_id, online, updated_at FROM users WHERE id != ?`, [userId])
            ]).then( (response) => {
                return {
                    chatlist : response[0]
                };
            }).catch( (error) => {
                console.warn(error);
                return (null);
            });
        } catch (error) {
            console.warn(error);
            return null;
        }
    }

    async insertMessages(params){
        try {
            return await this.db.query("INSERT INTO messages (`receiver`, `message`, `status`) values (?,?,?)", [params.receiver, params.message, params.status]
            );
        } catch (error) {
            console.warn(error);
            return null;
        }
    }

    async getMessages(userId, toUserId){
        try {
            return await this.db.query(
                `SELECT id,from_user_id as fromUserId,to_user_id as toUserId,message,time,date,type,file_format as fileFormat,file_path as filePath FROM messages WHERE
					(from_user_id = ? AND to_user_id = ? )
					OR
					(from_user_id = ? AND to_user_id = ? )	ORDER BY id ASC
				`,
                [userId, toUserId, toUserId, userId]
            );
        } catch (error) {
            console.warn(error);
            return null;
        }
    }


}
module.exports = new Helper();