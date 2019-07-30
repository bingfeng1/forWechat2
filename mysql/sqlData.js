// 对于数据库操作比较薄弱，所以这里简单写一下
const mysql = require('mysql');
const pool = mysql.createPool({
    // 这里请使用自己的数据库地址，此地址为本地虚拟机默认设置
});

const createUser = {
    insert(params) {
        pool.query('INSERT INTO ?? SET ?', params, function (error, results, fields) {
            if (error) throw error;
            console.log(results.insertId);
        });
    }
}

const createToken = {
    insert(params) {
        pool.query('INSERT INTO ?? SET ?', params, function (error, results, fields) {
            if (error) throw error;
            console.log(results.insertId);
        });
    },
    select(params,cb){
        pool.query('SELECT `openid` FROM ?? WHERE `openid` = ?', params,cb);
    }
}

module.exports = {
    createUser,
    createToken
}