var connection = require('../db/databases.js');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const { sendMail } = require('../utils/emailverification.js');
const { comparePassword, createHashPassword } = require('../utils/helper.js');
const { request } = require('http');

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


var addrooms = function (request, callback) {
    data = request;

    dbQuery = "select * from room_details where id = ? ;";

    connection.query(dbQuery, [data.id], function (err, results) {
        if (!results.length) {
            console.log("inside insert query");

            dbQuery = "insert into room_details set floor_no =? ,room_no = ?,bed_no = ?,org_id = ?,user_id = ?;";
            console.log(dbQuery)
            connection.query(dbQuery, [data.floor_no, data.room_no, data.bed_no, data.org_id, data.user_id], function (err, db_results) {
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

            dbQuery = `update room_details set ${keys} where id = ?;`
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


var addbookings = function (request, callback) {
    data = request;

    dbQuery = "select * from booking_details where id = ? ;";

    connection.query(dbQuery, [data.id], function (err, results) {
        if (!results.length) {
            console.log("inside insert query");

            dbQuery = "insert into booking_details set org_id =? ,room_no = ?,user_id = ?,advance_amount = ?,joining_date = ?,bed_no = ?;";
            console.log(dbQuery)
            connection.query(dbQuery, [data.org_id, data.room_no, data.user_id, data.advance_amount, data.joining_date, data.bed_no], function (err, db_results) {
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

            dbQuery = `update booking_details  set ${keys} where id = ?;`
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


var addpayments = function (request, callback) {
    data = request;

    dbQuery = "select * from paymnet_details where id = ? ;";

    connection.query(dbQuery, [data.id], function (err, results) {
        if (!results.length) {
            console.log("inside insert query");

            dbQuery = "insert into payment_details set user_id =? ,amount = ?,elec_bill = ?,total = ?,due_date = ?,org_id = ?;";
            console.log(dbQuery)
            connection.query(dbQuery, [data.user_id, data.amount, data.elec_bill, data.total, data.due_date, data.org_id], function (err, db_results) {
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

            dbQuery = `update payment_details  set ${keys} where id = ?;`
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



var addpaymenthistory = function (request, callback) {
    data = request;

    dbQuery = "select * from payment_histoy where id = ? ;";

    connection.query(dbQuery, [data.id], function (err, results) {
        if (!results.length) {
            console.log("inside insert query");

            dbQuery = "insert into payment_histoy set user_id =? ,org_id = ?,amount_paid = ?,date = now();";
            console.log(dbQuery)
            connection.query(dbQuery, [data.user_id, data.org_id, data.amount_paid], function (err, db_results) {
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

            dbQuery = `update payment_histoy  set ${keys} where id = ?;`
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







/**Get the individual patient Details */
var getroom = function (request, callback) {
    data = request;
    dbQuery = "select * from room_details where org_id = ?;";
    connection.query(dbQuery, [data.org_id], function (err, results) {
        if (err) {
            callback(err, null)
        } else {

            callback(null, results);
            console.log("1234567", results)
            // notification.sendNotification('This is the test notification')
        }

    });
}

var getbookingdetails = function (request, callback) {
    data = request;

    dbQuery = "select * from booking_details where user_id = ?  ;";
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




var getorgpaymentdetails = function (request, callback) {
    data = request;

    dbQuery = "select * from payment_details where org_id = ?  ;";
    connection.query(dbQuery, [data.org_id], function (err, results) {
        if (err) {
            callback(err, null)
        } else {

            callback(null, results);
            console.log("1234567", results)
            // notification.sendNotification('This is the test notification')
        }

    });
}

var getuserpaymenthistory = function (request, callback) {
    data = request;

    dbQuery = "select * from payment_history where user_id = ? and org_id = ?  ;";
    connection.query(dbQuery, [data.user_id, data.org_id], function (err, results) {
        if (err) {
            callback(err, null)
        } else {

            callback(null, results);
            console.log("1234567", results)
            // notification.sendNotification('This is the test notification')
        }

    });
}

var getorgroom = function (request, callback) {
    data = request;

    dbQuery = "select * from room_details where org_id = ?  ;";
    connection.query(dbQuery, [data.org_id], function (err, results) {
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
    addbookings, addpayments, addpaymenthistory, addrooms, getbookingdetails, getorgpaymentdetails,
    getuserpaymenthistory, getorgroom
}