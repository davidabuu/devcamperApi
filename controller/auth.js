const ErrorResponse = require('../utils/errResponse');
const asyncHandler = require('../middleware/async');
const User = require('../models/User');
const crypto = require('crypto');
const { response } = require('express');
const sendEmail = require('../utils/sendEmail');

//Register A User
//POST Request
exports.register = asyncHandler(async (req, res, next) => {
    const {name, email, password, role} = req.body;
    //Create User
    const user = await User.create({
        name,
        email,
        password,
        role
    });
    sendTokenResponse(user, 200, res);
});

//Login User
//Post Request
exports.login = asyncHandler(async (req, res, next) => {
    const {email, password} = req.body;
    //Validate Email and Password
    if(!email || !password){
        return next(new ErrorResponse('Please provide an email and password'), 400);
    }
    //Check for user
    const user = await User.findOne({email}).select('+password');
    if(!user){
        return next(new ErrorResponse('Invalid Credentials'), 401);
    }
    //check if passoward matches
    const isMatch = await user.matchPassword(password);
    if(!isMatch){
        return next(new ErrorResponse('Invalid Credentials'), 401);
    }
    sendTokenResponse(user, 200, res);
});

//Get current login user
exports.getMe = asyncHandler(async(req, res, next) => {
   const user = await User.findById(req.user.id);
   res.status(200).json({
       success: true,
       data: user
   })
});
//Log user Out
//GET Request
exports.logOut = asyncHandler(async(req, res, next) => {
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    })
    res.status(200).json({
        success: true,
        data:{}
    })
 });
//Forgot Password
//Post Request
exports.forgotPassword = asyncHandler(async(req, res, next) => {
    const user = await User.findOne({email: req.body.email});
    if(!user){
        return next(new ErrorResponse('There is no user with that email', 404));
    }
    //Get reset token
    const resetToken = user.getResetPasswordToken();
    await user.save({validateBeforeSave: false});
    //Create Reset URL
    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/resetpassword/${resetToken}`;
    const message = `You are recieving this email because you want to reset your passowrd to: \n\n ${resetUrl}`;
    try {
        await sendEmail({
            email: user.email,
            subject: 'Paasword Reset Token',
            message
        });
        res.status(200).json({success: true, data:' Email Sent'})
    } catch (error) {
       user.resetPasswordToken = undefined
       user.resetPasswordExpire = undefined
       await user.save({validateBeforeSave: false});
       return next(new ErrorResponse('Email could not be sent', 500))
    }
    res.status(200).json({
        success: true,
        data: user
    })
 });

 //Reset Password
exports.resetPassword = asyncHandler(async(req, res, next) => {
    //Get hashed Token
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.resetToken).digest('hex');
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now()}
    });
    if(!user){
        return next(new ErrorResponse('Invalid Token', 400))
    }
    //Set new Password
    user.password = req.body.password;
    user.resetPasswordToken = undefined,
    user.resetPasswordExpire = undefined;
    await user.save();
    sendTokenResponse(user, 200, res);
 });
 
// Get the Token From model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
    const token = user.getSignedJwtToken();
    const options = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true
    };
    if(process.env.NODE_ENV === 'production'){
        options.secure = true;
    }
    res.status(statusCode)
    .cookie('token', token, options)
    .json({success: true,
    token})
};


//Update User Details
exports.updateDetails = asyncHandler(async(req, res, next) => {
    const fieldsToUpdate = {
        name: req.body.name,
        email: req.body.email
    }
    const user = await User.findByIdAndDelete(req.user.id, fieldsToUpdate, {
        new: true,
        runValidators: true
    });
    res.status(200).json({
        success: true,
        data: user
    })
 });


 //Update The Password
exports.updatePassword = asyncHandler(async(req, res, next) => {
    const user = await User.findById(req.user.id).select('+password');
    //Check current Password
    if(!(await user.matchPassword(req.body.currentPassword))){
      return next(new ErrorResponse('Password is Incorrect', 401));
    }
    user.password = req.body.newPassword;
    await user.save()
   sendTokenResponse(user, 200 , res);
 });