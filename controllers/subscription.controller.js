// const decodeImage = require('./../utils/util');
const userService = require('./../models/subscription.model.js');
// const commonRes = require("./../utils/response");
// const commonErr = require("./../utils/errorFn");
// const id = decodeImage.id;
const fs = require("fs");
const userfeatureItem = "User"




/**To add the roles */
function createpackage(req, res) {


    userService.addpackages(req.body, function (err, data) {
        // console.log("data ...",data[0].phone_num,"--->",data[0].emailID);

        if (err) {
            console.log("Error: **Advertisement details updated**", err)
            res.send({ "status_code": "400", data: "Packages  not updated" })
        }

        else {
            console.log("exists--->");
            res.send({ "status_code": "200", data })
        }
    });
}

function createsubscription(req, res) {

    userService.addsubscription(req.body, function (err, data) {
        // console.log("data ...",data[0].phone_num,"--->",data[0].emailID);

        if (err) {
            console.log("Error: **Advertisement details updated**", err)
            res.send({ "status_code": "400", data: "Subscription details  not updated" })
        }

        else {
            console.log("exists--->");
            res.send({ "status_code": "200", data })
        }
    });
}






function viewSubscription(req, res) {
    console.log("** login exists input data ** ");
    // var userdata = { "id": req.query.id };
    userService.getsubscription(function (err, data) {
        console.log("Response -->", data);
        if (err) {
            console.log("Error: **login exists details update**", err)
            res.send({ "status_code": "400", "status": "Subscription details not found " })
        } else {
            // if(inputreq.phone_num == data[0].phone_num || inputreq.user_emailID == data[0].user_emailID){

            console.log("empty----->");
            res.send({ "status_code": "200", data });

        }
    });
}


function viewSubscriptionHistory(req, res) {
    console.log("** login exists input data ** ");
    // var userdata = { "id": req.query.id };
    userService.getsubscriptionhistory(function (err, data) {
        console.log("Response -->", data);
        if (err) {
            console.log("Error: **login exists details update**", err)
            res.send({ "status_code": "400", "status": "Subscription History not found " })
        } else {
            // if(inputreq.phone_num == data[0].phone_num || inputreq.user_emailID == data[0].user_emailID){

            console.log("empty----->");
            res.send({ "status_code": "200", data });

        }
    });
}



function viewpackages(req, res) {
    console.log("** login exists input data ** ");
    // var userdata = { "id": req.query.id };
    userService.getpackage(req.query, function (err, data) {
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




module.exports = {
    createpackage, viewpackages, viewSubscription, viewSubscriptionHistory, createsubscription
};
