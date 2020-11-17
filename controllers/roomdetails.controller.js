// const decodeImage = require('./../utils/util');
const userService = require('./../models/roomdetails.model.js');
// const commonRes = require("./../utils/response");
// const commonErr = require("./../utils/errorFn");
// const id = decodeImage.id;
const fs = require("fs");
const userfeatureItem = "User"




/**To add the roles */
function createbooking(req, res) {


    userService.addbookings(req.body, function (err, data) {
        // console.log("data ...",data[0].phone_num,"--->",data[0].emailID);

        if (err) {
            console.log("Error: **Advertisement details updated**", err)
            res.send({ "status_code": "400", data: "Booking  not Confirmed" })
        }

        else {
            console.log("exists--->");
            res.send({ "status_code": "200", data })
        }
    });
}

function createpayment(req, res) {

    userService.addpayments(req.body, function (err, data) {
        // console.log("data ...",data[0].phone_num,"--->",data[0].emailID);

        if (err) {
            console.log("Error: **Advertisement details updated**", err)
            res.send({ "status_code": "400", data: "Payment  details  not updated" })
        }

        else {
            console.log("exists--->");
            res.send({ "status_code": "200", data })
        }
    });
}

function createpaymenthistory(req, res) {

    userService.addpaymenthistory(req.body, function (err, data) {
        // console.log("data ...",data[0].phone_num,"--->",data[0].emailID);

        if (err) {
            console.log("Error: **Advertisement details updated**", err)
            res.send({ "status_code": "400", data: "Payment  History  not updated" })
        }

        else {
            console.log("exists--->");
            res.send({ "status_code": "200", data })
        }
    });
}

function createrooms(req, res) {

    userService.addrooms(req.body, function (err, data) {
        // console.log("data ...",data[0].phone_num,"--->",data[0].emailID);

        if (err) {
            console.log("Error: **Advertisement details updated**", err)
            res.send({ "status_code": "400", data: "Room  details  not updated" })
        }

        else {
            console.log("exists--->");
            res.send({ "status_code": "200", data })
        }
    });
}




function viewbooking(req, res) {
    console.log("** login exists input data ** ");
    // var userdata = { "id": req.query.id };
    userService.getbookingdetails(req.query, function (err, data) {
        console.log("Response -->", data);
        if (err) {
            console.log("Error: **login exists details update**", err)
            res.send({ "status_code": "400", "status": "Booking details not found " })
        } else {
            // if(inputreq.phone_num == data[0].phone_num || inputreq.user_emailID == data[0].user_emailID){

            console.log("empty----->");
            res.send({ "status_code": "200", data });

        }
    });
}


function vieworgpayment(req, res) {
    console.log("** login exists input data ** ");
    // var userdata = { "id": req.query.id };
    userService.getorgpaymentdetails(req.query, function (err, data) {
        console.log("Response -->", data);
        if (err) {
            console.log("Error: **login exists details update**", err)
            res.send({ "status_code": "400", "status": "Organization payment details not found " })
        } else {
            // if(inputreq.phone_num == data[0].phone_num || inputreq.user_emailID == data[0].user_emailID){

            console.log("empty----->");
            res.send({ "status_code": "200", data });

        }
    });
}


function viewuserpayment(req, res) {
    console.log("** login exists input data ** ");
    // var userdata = { "id": req.query.id };
    userService.getuserpaymenthistory(req.query, function (err, data) {
        console.log("Response -->", data);
        if (err) {
            console.log("Error: **login exists details update**", err)
            res.send({ "status_code": "400", "status": "User Payment not found " })
        } else {
            // if(inputreq.phone_num == data[0].phone_num || inputreq.user_emailID == data[0].user_emailID){

            console.log("empty----->");
            res.send({ "status_code": "200", data });

        }
    });
}


function vieworgroom(req, res) {
    console.log("** login exists input data ** ");
    // var userdata = { "id": req.query.id };
    userService.getorgroom(req.query, function (err, data) {
        console.log("Response -->", data);
        if (err) {
            console.log("Error: **login exists details update**", err)
            res.send({ "status_code": "400", "status": "Rooms  not found " })
        } else {
            // if(inputreq.phone_num == data[0].phone_num || inputreq.user_emailID == data[0].user_emailID){

            console.log("empty----->");
            res.send({ "status_code": "200", data });

        }
    });
}







module.exports = {
    createbooking, createpayment, createpaymenthistory, createrooms, viewbooking, vieworgpayment, vieworgroom, viewuserpayment

};
