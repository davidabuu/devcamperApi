const ErrorResponse = require('../utils/errResponse');
const asyncHandler = require('../middleware/async');
const User = require('../models/User');
//Get all Users
//Get Request
exports.getUsers = asyncHandler(async (req, res, next) => {
    res.status(200).json(res.advancedResults);
});

//Get a single user
//Get Request
exports.getUser = asyncHandler(async (req, res, next) => {
   const user  = await User.findById(req.params.id);
   res.status(200).json({
       success: true,
       data: user
   })
});

//Create a User
//POST Request
exports.createUser = asyncHandler(async (req, res, next) => {
    const user  = await User.create(req.body);
    res.status(201).json({
        success: true,
        data: user
    })
});

//Update a User
//PUT Request
exports.updateUser = asyncHandler(async (req, res, next) => {
    const user  = await User.findByIdAndUpdate(req.params.id, req.body, {
        new:true,
        runValidators: true
    });
    res.status(200).json({
        success: true,
        data: user
    })
});

//DELETE a User
//DELETE Request
exports.deleteUser = asyncHandler(async (req, res, next) => {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({
        success: true,
        data:{}
    })
});