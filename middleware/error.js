const ErrorResponse = require("../utils/errResponse");

const errorHandler = (err, req, res, next) => {
    let error = {...err}
    error.message = err.message;
    // Log to console for dev
    console.log(error.stack);
    // Mongoose bad objectId
    if(err.name === 'CastError'){
        const message = `Bootcamp not found with id of ${err.value}`;
        error = new ErrorResponse(message, 404);
    }
    //Mongoose Duplicate Key
    if(err.code === 11000){
        const message = 'Duplicate Field Entered';
        error = new ErrorResponse(message, 400);
    }
    // Mongoose validtion Error
    if(err.name === 'ValidationError'){
        const message = Object.values(err.errors).map(val => val.message);
        error = new ErrorResponse(message, 400);
    }
    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || 'Server Error'
    });
}

module.exports = errorHandler;