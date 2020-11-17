
var middleware = require('../utils/middleware');
var userctrl = require('../controllers/roomdetails.controller.js');

var router = require('express').Router();

router.route('/booking')
    .post(userctrl.createbooking)
    .get(userctrl.viewbooking);

router.route('/payment')
    .post(userctrl.createpayment)

router.route('/rooms')
    .post(userctrl.createrooms)
    .get(userctrl.vieworgroom);

router.route('/paymethistory')
    .post(userctrl.createpaymenthistory);


router.route('/userpayment')
    .get(userctrl.viewuserpayment);

router.route('/orgpayment')
    .get(userctrl.vieworgpayment);


module.exports = router

