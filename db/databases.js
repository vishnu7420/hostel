const dataBase = require('mysql2');
// var uniqid = require('uniqid');
// const Promise = require('Promise');
// const fs = require('fs');    
var connection = null


// var moment = require('moment');


connection = dataBase.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: "hostel",
    multipleStatements: true
});

var value;
connection.connect((err) => {
    (err) ? console.log("Error:**DB Connection error**", err) : console.log("Info:**DB Connection Successful**");
});

module.exports = connection;