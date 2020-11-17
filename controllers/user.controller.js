// const decodeImage = require('./../utils/util');
const userService = require('./../models/user.model.js');
// const commonRes = require("./../utils/response");
// const commonErr = require("./../utils/errorFn");
// const id = decodeImage.id;
const fs = require("fs");
const userfeatureItem = "User"




/**To add the roles */
function createroles(req, res) {


    userService.addroles(req.body, function (err, data) {
        // console.log("data ...",data[0].phone_num,"--->",data[0].emailID);

        if (err) {
            console.log("Error: **Advertisement details updated**", err)
            res.send({ "status_code": "400", data: "roles details  not updated" })
        }

        else {
            console.log("exists--->");
            res.send({ "status_code": "200", data })
        }
    });
}

function createusers(req, res) {

    userService.addusers(req.body, function (err, data) {
        // console.log("data ...",data[0].phone_num,"--->",data[0].emailID);

        if (err) {
            console.log("Error: **Advertisement details updated**", err)
            res.send({ "status_code": "400", data: "user details details  not updated" })
        }

        else {
            console.log("exists--->");
            res.send({ "status_code": "200", data })
        }
    });
}





function checklogin(req, res) {
    console.log("** login exists input data ** ");
    // var userdata = { "id": req.query.id };
    userService.getlogin(req.body, function (err, data) {
        console.log("Response -->", data);
        if (err) {
            console.log("Error: **login exists details update**", err)
        } else {
            // if(inputreq.phone_num == data[0].phone_num || inputreq.user_emailID == data[0].user_emailID){
            if (data.length == 1) {
                console.log("empty----->");
                res.send({ "status_code": "200", "data": "login succes", data });
            }

            else {
                console.log("exists--->");
                res.send({ "status_code": "400", "Messages": "login Failed" })
            }

        }
    });
}


function checkweblogin(req, res) {
    console.log("** login exists input data ** ");
    // var userdata = { "id": req.query.id };
    userService.getweblogin(req.body, function (err, data) {
        console.log("Response -->", data);
        console.log(">>>>>>>>>>",err)
        if (err) {
            console.log("Error: **login exists details update**", err)
            res.send({ "status_code": "400", "Messages": "login Failed" })
        } else {
            // if(inputreq.phone_num == data[0].phone_num || inputreq.user_emailID == data[0].user_emailID){
            if (data.length == 1) {
                console.log("empty----->");
                res.send({ "status_code": "200", "data": "login succes", data });
            }

            else {
                console.log("exists--->");
                res.send({ "status_code": "400", "Messages": "login Failed" })
            }

        }
    });
}

function viewalluserdetails(req, res) {
    console.log("** login exists input data ** ");
    // var userdata = { "id": req.query.id };
    userService.getuser(function (err, data) {
        console.log("Response -->", data);
        if (err) {
            console.log("Error: **login exists details update**", err)
            res.send({ "status_code": "400", "status": "user data not found " })
        } else {
            // if(inputreq.phone_num == data[0].phone_num || inputreq.user_emailID == data[0].user_emailID){

            console.log("empty----->");
            res.send({ "status_code": "200", data });

        }
    });
}


function viewindividualuser(req, res) {
    console.log("** login exists input data ** ");
    // var userdata = { "id": req.query.id };
    userService.getindividualuser(req.query, function (err, data) {
        console.log("Response -->", data);
        if (err) {
            console.log("Error: **login exists details update**", err)
            res.send({ "status_code": "400", "status": "user data not found " })
        } else {
            // if(inputreq.phone_num == data[0].phone_num || inputreq.user_emailID == data[0].user_emailID){

            console.log("empty----->");
            res.send({ "status_code": "200", data });

        }
    });
}

function viewuserroles(req, res) {
    console.log("** login exists input data ** ");
    // var userdata = { "id": req.query.id };
    userService.getusereoles(function (err, data) {
        console.log("Response -->", data);
        if (err) {
            console.log("Error: **login exists details update**", err)
            res.send({ "status_code": "400", "status": "user data not found " })
        } else {
            // if(inputreq.phone_num == data[0].phone_num || inputreq.user_emailID == data[0].user_emailID){

            console.log("empty----->");
            res.send({ "status_code": "200", data });

        }
    });
}


function createotp(req, res) {

    userService.addotp(req.body, function (err, data) {
        // console.log("data ...",data[0].phone_num,"--->",data[0].emailID);

        if (err) {
            console.log("Error: **Advertisement details updated**", err)
            res.send({ "status_code": "400", "message": "Something Went Wrong" })
        }

        else {
            console.log("exists--->");
            res.send({ "status_code": "200", data })
        }
    });
}

function validateotp(req, res) {

    userService.checkotp(req.body, function (err, data) {
        // console.log("data ...",data[0].phone_num,"--->",data[0].emailID);

        if (err) {
            console.log("Error: **Advertisement details updated**", err)
            res.send({ "status_code": "400", "message": "OTP Incorrect" })
        }

        else {
            if (data.length == []) {
                console.log("exists--->");
                res.send({ "status_code": "400", "message": "OTP Incorrect" })
            } else {
                console.log("exists--->");
                res.send({ "status_code": "200", "data": "OTP VERIFIED" })
            }
        }
    });
}


function editpassword(req, res) {

    userService.changepassword(req.body, function (err, data) {
        // console.log("data ...",data[0].phone_num,"--->",data[0].emailID);

        if (err) {
            console.log("Error: **Advertisement details updated**", err)
            res.send({ "status_code": "400", "message": "password is not updated" })
        }

        else {
            console.log("exists--->");
            res.send({ "status_code": "200", "data": "Password has been Changed" })
        }
    });
}




module.exports = {
    createroles, createusers, checklogin, viewalluserdetails,
    viewuserroles, createotp, validateotp, editpassword, viewindividualuser, checkweblogin
};
