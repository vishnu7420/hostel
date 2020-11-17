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


var addroles = function (request, callback) {
    data = request;

    dbQuery = "select * from user_roles where id = ? ;";

    connection.query(dbQuery, [data.id], function (err, results) {
        if (!results.length) {
            console.log("inside insert query");

            dbQuery = "insert into user_roles set roles =? ,date = now();";
            console.log(dbQuery)
            connection.query(dbQuery, [data.roles], function (err, db_results) {
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

            dbQuery = `update user_roles set ${keys} where id = ?;`
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







var addusers = function (request, callback) {
    data = request;


    insertQuery = [];
    if (data.user_image) {
        var returned_base_data = splitbase64(data.user_image);
        var path = "images/" + Date.now() + String(returned_base_data['extension']);
        console.log("--------------------------------------------", path)
        var bitmap = new Buffer.from(returned_base_data['splitted_base64'], 'base64');
        fs.writeFileSync(path, bitmap);
    }
    dbQuery = "select * from user_details where id = ? ;";

    connection.query(dbQuery, [data.id], async function (err, results) {
        if (!results.length) {
            let password = await createHashPassword(data.password)
            console.log("1234567", password)
            var referal_code = generateotp();
            console.log("123456", referal_code)
            insertQuery.push(`('${data.role_id}' ,'${data.name}' ,'${data.phone_number}' ,'${data.email_id}' ,'${password}' ,now(),
            '${data.place}' ,'${data.district}' ,'${data.father_name}' ,'${data.institution_name}' ,
            '${data.dob}' ,'${data.prefered_course.join()}' ,'${path}' ,'${data.educational_qualification}','${referal_code}','${data.referred_code}')`)


            var insert = new Promise((resolve, reject) => {
                connection.query(`insert into user_details (role_id,user_name,phone_num,email_id,password,date,place,district,father_name,institution_name,dob,prefered_course,image,educational_qualification,referal_code,referred_code) values ${insertQuery.join()}`, function (err, db_results) {
                    if (err) {
                        reject(err)
                    } else {

                        resolve(db_results);
                        console.log(resolve(db_results))
                    }
                })
            })
            console.log(insert)
            insert.then(insertionRes => {

                dbQuery = "select * from users  order by id desc limit 1";
                connection.query(dbQuery, function (err, results) {
                    if (err) {
                        callback(err, null)
                    } else {
                        results = results.map(item => {
                            item.prefered_course = item.prefered_course.split(',')
                            return item
                        })
                        // console.log("results-->", results);
                        if (results.length) {

                            for (i = 0; i < results.length; i++) {
                                // var type = get_mime_type_extension(results[i].mime_type)
                                results[i].upload_1 = app_url + results[i].image;

                            }
                            let token = jwt.sign({ userId: results[0].id }, 'MY_SECRET_KEY');
                            results[0].image = app_url + results[0].image;
                            results[0].token = token;
                            callback(null, results)
                        }


                    }
                });
            }).catch(err => {
                console.log(err)
            })
        } else {
            console.log("inside update query");
            let id = data.id
   
            delete data.id
            if (data.user_image) {

                data["image"] = path
            }
            delete data.user_image
            if (data.prefered_course) {
                data.prefered_course = data.prefered_course.join()
            }
         
            let keys = `${Object.keys(data).join(' = ? , ')} = ?`;

            let values = Object.values(data)
            values.image = path
            values.push(id)

            dbQuery = `update users set ${keys} where id = ?;`
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
var getuser = function (callback) {

    dbQuery = "select * from users order by id desc ;";
    connection.query(dbQuery, function (err, results) {
        if (err) {
            callback(err, null)
        } else {
            console.log("results-->", results);

            results = results.map(item => {
                item.prefered_course = item.prefered_course.split(',')
                return item
            })
            for (i = 0; i < results.length; i++) {
                if (results[i].image == null) {
                    results[i].image = null
                } else {

                    results[i].image = app_url + results[i].image;
                }


            }
            callback(null, results);
            console.log("1234567", results)
            // notification.sendNotification('This is the test notification')
        }

    });
}

var getindividualuser = function (request, callback) {
    data = request;

    dbQuery = "select * from users where id = ?  ;";
    connection.query(dbQuery, [data.user_id], function (err, results) {
        if (err) {
            callback(err, null)
        } else {
            console.log("results-->", results);

            results = results.map(item => {
                item.prefered_course = item.prefered_course.split(',')
                return item
            })
            for (i = 0; i < results.length; i++) {
                if (results[i].image == null) {
                    results[i].image = null
                } else {

                    results[i].image = app_url + results[i].image;
                }


            }
            callback(null, results);
            console.log("1234567", results)
            // notification.sendNotification('This is the test notification')
        }

    });
}

var getlogin = async function (request, callback) {
    data = request;
    // let password = await createHashPassword(data.password)
    dbQuery = "select id,user_name as name,email_id,password from  users where email_id = ?;";
    connection.query(dbQuery, [data.email_id], async function (err, results) {
        // console.log("12345", results[0].password)
        // try {
        // } catch (e) {
        //     console.log(e)
        // }

        let passwordConfirmation = await comparePassword(data.password, results[0].password);
        console.log(passwordConfirmation);
        if (passwordConfirmation) {
            let token = jwt.sign({ userId: results[0].id }, 'MY_SECRET_KEY');
            results[0].image = app_url + results[0].image;
            results[0].token = token;

            callback(null, results);
        } else {
            callback('Error', null);
        }

        // if (err) {
        //     callback(err, null)
        // } else {
        //     // notification.sendNotification('This is the test notification')
        //     for (i = 0; i < results.length; i++) {
        //         if (results[i].image == null) {
        //             results[i].image = null
        //         }
        //         else {

        //             results[i].image = app_url + results[i].image;
        //         }


        //     }
        //     callback(null, results)
        // }

    });
}

var getweblogin = async function (request, callback) {
    data = request;
    // let password = await createHashPassword(data.password)
    dbQuery = "select id,role_id,user_name as name,email_id,phone_num,password,dob,image  from  users where email_id = ? ;";
    connection.query(dbQuery, [data.email_id], async function (err, results) {
        console.log("12345", results[0].password)


        try {
            console.log(".............", results)
            let passwordConfirmation = await comparePassword(data.password, results[0].password);
            console.log(passwordConfirmation);
            if (passwordConfirmation) {
                let token = jwt.sign({ userId: results[0].id }, 'MY_SECRET_KEY');
                results[0].image = app_url + results[0].image;
                results[0].token = token;
                console.log(results)
                callback(null, results);
            } else {
                callback('Error', null);
            }
        } catch (e) {
            callback(true, null)
        }







    });
}


var getusereoles = function (callback) {
    // data = request;
    dbQuery = "select * from roles;";
    connection.query(dbQuery, function (err, results) {
        if (err) {
            callback(err, null)
        } else {


            callback(null, results);
        }

    });
}

function generateotp() {
    return Math.floor(1111 + Math.random() * (9999998 + 1 - 1111111));
}




var addotp = function (request, callback) {
    data = request;
    var otp = generateotp();

    dbQuery = "select * from otp_verification where user_id = ? ;";

    connection.query(dbQuery, [data.user_id], function (err, results) {
        if (!results.length) {
            console.log("inside insert query");

            dbQuery = "insert into otp_verification set email_id = ?,otp = ?,user_id = ? ,date = now() ;";
            console.log(dbQuery)
            connection.query(dbQuery, [data.email_id, otp, data.user_id], function (err, db_results) {
                if (err) {
                    callback(err, null)
                } else {
                    sendMail(data.email_id, "OTP Verification", 'Your Otp :' + otp + '\nPlease dont share Your otp')
                    callback(null, db_results)

                }
            });
        } else {
            console.log("inside update query");
            dbQuery = "update otp_verification set email_id = ?,otp = ?,date = now()  where user_id = ?;"
            connection.query(dbQuery, [data.email_id, otp, data.user_id], function (err, db_results) {
                if (err) {
                    callback(err, null)
                } else {
                    sendMail(data.email_id, "OTP Verification", 'Your Otp :' + otp + '\nPlease dont share Your otp')
                    callback(null, db_results)

                }
            });
        }
    });
}










var checkotp = function (request, callback) {
    data = request;

    dbQuery = "select * from otp_verification where user_id = ? and otp = ? ;";

    connection.query(dbQuery, [data.user_id, data.otp], function (err, results) {

        if (err) {
            callback(err, null)
        } else {
            console.log(results)
            callback(null, results)

        }
    });





}

var changepassword = async function (request, callback) {
    data = request;

    let password = await createHashPassword(data.password)
    dbQuery = "update  users set password = ? where id = ? ;";

    connection.query(dbQuery, [password, data.user_id], function (err, results) {

        if (err) {
            callback(err, null)
        } else {
            callback(null, results)

        }
    });



}





module.exports = {
    addroles, addusers, getuser, getlogin, getusereoles, addotp, checkotp,
    changepassword, getindividualuser,  getweblogin
}