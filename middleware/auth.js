const jwt = require('jsonwebtoken');
const asyncHandler = require('./async');
const ErrorResponse = require('../utils/errResponse');
const User = require('../models/User');

exports.protect = asyncHandler(async(req, res, next) => {
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        //SET Token from Bearer token and header
        token = req.headers.authorization.split(' ')[1];
    }
     //Set Token From Cookie
    // else if(req.cookies.token){
    //   token = req.cookies.token
    // }
    //Check Token
    if(!token){
        return next(new ErrorResponse('Not authorized to access this route', 401));
    }
    // Vefify the Token
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id);
        next();
    } catch (error) {
        return next(new ErrorResponse('Not authorized to access this route', 401));
    }
});


//Grant access to specifc roles
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.role)){
            return next(new ErrorResponse(`User role ${req.user.role} is not authorised to acess this route`, 403));
        }
        next();
    }
}