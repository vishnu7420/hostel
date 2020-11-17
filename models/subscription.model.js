var connection = require('../db/databases.js');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const { sendMail } = require('../utils/emailverification.js');
const { comparePassword, createHashPassword } = require('../utils/helper.js')

var app_url = "";
if (process.env.NODE_ENV == "development") {
    app_url = "http://localhost:3002/";
} else {
    app_url = "https://smscap.in/"
}
function get_mime_type_extension(mime_type) {
    if (mime_type == 'application/pdf;') {
        return '.pdf'
    }
    else if (mime_type == 'application/msword;') {
        return '.doc'
    }
    else if (mime_type == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document;') {
        return '.docx'
    }
    else if (mime_type == 'application/vnd.ms-excel;') {
        return '.xls'
    }
    else if (mime_type == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;') {
        return '.xlsx'
    }
    else if (mime_type == 'application/vnd.ms-powerpoint;') {
        return '.ppt'
    }
    else if (mime_type == 'application/vnd.openxmlformats-officedocument.presentationml.presentation;') {
        return '.pptx'
    }
    else if (mime_type == 'image/jpeg;') {
        return '.jpeg'
    }
    else if (mime_type == 'image/png;') {
        return '.png'
    }
    else if (mime_type == 'image/gif;') {
        return '.gif'
    }
    else if (mime_type == 'text/csv;') {
        return '.csv'
    }
    else if (mime_type == 'audio/mpeg;') {
        return '.mp3'
    }
    else if (mime_type == 'audio/mp3;') {
        return '.mp3'
    }
    else if (mime_type == 'audio/mid;') {
        return '.rmi'
    }
    else if (mime_type == 'audio/mp4;') {
        return '.mp4 audio'
    }
    else if (mime_type == 'audio/x-aiff;') {
        return '.aif'
    }
    else if (mime_type == 'video/mp4;') {
        return '.mp4'
    }
    else if (mime_type == 'video/x-flv;') {
        return '.flv'
    }

    else if (mime_type == 'application/x-mpegURL;') {
        return '.m3u8'
    }
    else if (mime_type == 'video/MP2T;') {
        return '.ts'
    }
    else if (mime_type == 'video/3gpp;') {
        return '.3gp'
    }
    else if (mime_type == 'video/quicktime;') {
        return '.mov'
    }
    else if (mime_type == 'video/x-msvideo;') {
        return '.avi'
    }
    else if (mime_type == 'video/x-ms-wmv;') {
        return '.wmv'
    }
}


function splitbase64(base64_image) {
    var splitted_image = base64_image.split("base64,")
    var full_mime = splitted_image[0];
    var base64_splitted = splitted_image[1];
    var mime_type = full_mime.split('data:')[1];

    console.log(mime_type)
    return { 'splitted_base64': base64_splitted, 'extension': get_mime_type_extension(mime_type), 'mime_type': mime_type }
}


var addpackages = function (request, callback) {
    data = request;

    dbQuery = "select * from packages where id = ? ;";

    connection.query(dbQuery, [data.id], function (err, results) {
        if (!results.length) {
            console.log("inside insert query");

            dbQuery = "insert into packages set name =? ,no_of_rooms = ?,cost = ?,validity = ?;";
            console.log(dbQuery)
            connection.query(dbQuery, [data.name, data.no_of_rooms, data.cost, data.validity], function (err, db_results) {
                if (err) {
                    callback(err, null)
                } else {

                    callback(null, db_results)

                }
            });
        } else {
            console.log("inside update query");
            let id = data.id
            delete data.id
            // delete data.user_image
            // if (data.prefered_course) {
            //     data.prefered_course = data.prefered_course.join()
            // }
            // data["image"] = path
            console.log(data)
            let keys = `${Object.keys(data).join(' = ? , ')} = ?`;

            let values = Object.values(data)
            // values.image = path
            values.push(id)

            dbQuery = `update packages set ${keys} where id = ?;`
            connection.query(dbQuery, values, function (err, db_results) {
                if (err) {
                    callback(err, null)
                } else {

                    callback(null, db_results)

                }
            });
        }
    });
}







var addsubscription = async function (request, callback) {
    data = request;
    insertQuery = [];

    insertQuery.push(`('${data.degree_id}' , '${data.course_id}' , '${data.course_type}' , now())`)

    // insertQuery.join(",")

    console.log("inside insert query");
    var [insertionRes] = await connection.promise().query(`insert into course_details(degree_id ,course_id,course_type,date) values ${insertQuery.join()}`)

    console.log(insertionRes)
    subscriptiondetails = [];
    console.log("1234567", insertionRes.insertId)
    subscriptiondetails.push(`('${insertionRes.insertId}' ,'${data.curn_pkg_id}' ,'${data.prev_pkg_id}' ,'${data.start_date}' , '${data.end_date}')`)

    connection.query(`insert into subscription_history (subscription_id,curn_pkg_id,prev_pkg_id,start_date,end_date) values ${subscriptiondetails.join()};  `, function (err, results) {
        if (err) {
            callback(err, null)
        } else {
            // console.log("results-->", results);


            callback(null, results)



        }
    });

}



/**Get the individual patient Details */
var getpackage = function (callback) {

    dbQuery = "select * from packages;";
    connection.query(dbQuery, function (err, results) {
        if (err) {
            callback(err, null)
        } else {

            callback(null, results);
            console.log("1234567", results)
            // notification.sendNotification('This is the test notification')
        }

    });
}

var getsubscription = function (request, callback) {
    data = request;

    dbQuery = "select * from subscription where user_id = ?  ;";
    connection.query(dbQuery, [data.user_id], function (err, results) {
        if (err) {
            callback(err, null)
        } else {

            callback(null, results);
            console.log("1234567", results)
            // notification.sendNotification('This is the test notification')
        }

    });
}




var getsubscriptionhistory = function (request, callback) {
    data = request;

    dbQuery = "select * from subscription_hisstory where subscription_id = ?  ;";
    connection.query(dbQuery, [data.subscription_id], function (err, results) {
        if (err) {
            callback(err, null)
        } else {

            callback(null, results);
            console.log("1234567", results)
            // notification.sendNotification('This is the test notification')
        }

    });
}






module.exports = {
    addpackages, addsubscription, getpackage, getsubscription, getsubscriptionhistory
}