
var middleware = require('../utils/middleware');
var userctrl = require('../controllers/user.controller.js');

var router = require('express').Router();
/**To add the roles */
router.route('/userroles')
    .post(userctrl.createroles)
    .get(userctrl.viewuserroles);;

router.route('/users')
    .post(userctrl.createusers)
    .get(userctrl.viewindividualuser);


router.route('/allusers')

    .get(userctrl.viewalluserdetails);



router.route('/login')
    .post(userctrl.checklogin);

router.route('/weblogin')
    .post(userctrl.checkweblogin);


router.route('/otp')
    .post(userctrl.createotp);

router.route('/verifyotp')
    .post(userctrl.validateotp);

router.route('/editpassword')
    .post(userctrl.editpassword);




module.exports = router

