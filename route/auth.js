const express = require('express');
const { reset } = require('nodemon');
const {register, login, getMe, forgotPassword, resetPassword, updateDetails, updatePassword, logOut} = require('../controller/auth');
const {protect} = require('../middleware/auth')
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/logout', logOut);
router.get('/me', protect, getMe);
router.post('/forgotpassword', forgotPassword)
router.put('/updatedetails', updateDetails);
router.put('/updatepassword', updatePassword);
router.put('/resetpassword/:resetToken', resetPassword)
module.exports = router;