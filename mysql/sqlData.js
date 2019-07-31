// 对于数据库操作比较薄弱，所以这里简单写一下
const mysql = require('mysql');
const pool = mysql.createPool({
    // 这里请使用自己的数据库地址，此地址为本地虚拟机默认设置
    connectionLimit: 10,
});

/**
 * 
 * @param {*} params 数组，第一个为表名，第二个为对象（属性与列名一致）
 */
const INSERT = (params) => {
    return new Promise((resolve, reject) => {
        pool.query('INSERT INTO ?? SET ?', params, function (error, results) {
            if (error) reject(error);
            resolve(results);
        });
    })
}

/**
 * 
 * @param {*} params 数组，第一个为查询字段(数组)，第二个为表名，第三个为对象（查询条件）
 * @param {*} cb 
 */
const SELECT = params => {
    return new Promise((resolve, reject) => {
        let sql = params[2] ? 'SELECT ?? FROM ?? WHERE ?' : 'SELECT ?? FROM ??'
        pool.query(sql, params, (error, results)=>{
            if (error) reject(error);
            resolve(results);
        });
    })
}

/**
 * 
 * @param {*} params 数组，第一个为表名，第二个为改变的值，第三个为条件
 */
const UPDATE = params =>{
    return new Promise((resolve, reject) => {
        let sql = params[2] ? 'UPDATE ?? SET ? WHERE ?' : 'UPDATE ?? SET ?'
        pool.query(sql, params, (error, results)=>{
            if (error) reject(error);
            resolve(results);
        });
    })
}

const dealSql = {
    INSERT,
    SELECT,
    UPDATE
}

module.exports = dealSql