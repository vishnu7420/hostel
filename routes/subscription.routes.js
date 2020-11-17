
var middleware = require('../utils/middleware');
var userctrl = require('../controllers/subscription.controller.js');

var router = require('express').Router();

router.route('/package')
    .post(userctrl.createpackage)
    .get(userctrl.viewpackages);;

router.route('/subscription')
    .post(userctrl.createsubscription)
    .get(userctrl.viewSubscription);


router.route('/subscriptionhistory')

    .get(userctrl.viewSubscriptionHistory);


module.exports = router

