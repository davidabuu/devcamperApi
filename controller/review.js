const Review =  require('../models/Review');
const ErrorResponse = require('../utils/errResponse');
const asyncHandler = require('../middleware/async');
const Bootcamp = require('../models/Bootcamp');


// Get reviews
exports.getReviews = asyncHandler(async (req, res, next) => {
    if(req.params.bootcampId){
        const reviews = await Review.find({bootcamp: req.params.bootcampId});
        return res.status(200).json({
            success: true,
            count: reviews.length,
            data: reviews
        })
    }else {
        res.status(200).json(res.advancedResults);
    }
});
//GET a Single Review
exports.getReview = asyncHandler(async (req, res, next) => {
    const review = await Review.findById(req.params.id).populate({
        path: 'bootcamp',
        select: 'name description'
    });
    if(!review){
        return next(new ErrorResponse('No Review Found', 404));
    }
    res.status(200).json({
        success: true,
        data: review
    })
});
//POST Request
exports.addReview = asyncHandler(async (req, res, next) => {
    req.body.bootcamp = req.params.bootcampId;
    req.body.user = req.user.id
    const bootcamp = await Bootcamp.findById(req.params.bootcampId);
    if(!bootcamp){
        return next(new ErrorResponse(`No bootcamp found`, 404));
    }

    review = await Review.create(req.body);
    res.status(201).json({
        success: true,
        data: review
    })
});


//Update a review
exports.updateReview = asyncHandler(async (req, res, next) => {
    let review = await Review.findById(req.params.id);
    if(!review){
        return next(new ErrorResponse(`No review found`, 404));
    }
    //Make sure review belongs to user or user is an admin
    if(review.user.toSting() !== req.user.id && req.user.role !== 'admin'){
        return next(new ErrorResponse('Not authorised to update Review', 401))
    }
    review = await Review.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
    res.status(200).json({
        success: true,
        data: review
    })
});

//Delete a review
exports.deleteReview = asyncHandler(async (req, res, next) => {
    let review = await Review.findById(req.params.id);
    if(!review){
        return next(new ErrorResponse(`No review found`, 404));
    }
    //Make sure review belongs to user or user is an admin
    if(review.user.toSting() !== req.user.id && req.user.role !== 'admin'){
        return next(new ErrorResponse('Not authorised to update Review', 401))
    }
    await review.remove();
    res.status(200).json({
        success: true,
        data: review
    })
});
