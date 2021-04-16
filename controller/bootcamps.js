const Bootcamp =  require('../models/Bootcamp');
const ErrorResponse = require('../utils/errResponse');
const path = require('path')
const asyncHandler = require('../middleware/async');
const geCoder = require('../utils/geoCoder');
//Get all Bootcamps
//Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
        res.status(200).json(res.advancedResults)
})

//Get single bootcamp
//Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
        const bootcamp = await Bootcamp.findById(req.params.id);
        if(!bootcamp){
            return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id},`, 404));
        }
        res.status(200).json({success: true, data: bootcamp})
});
//Create a Bootcamp
//Private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
       //Add User to req.body
       req.body.user = req.user.id
       //Check for published bootcamp
       const publishedBootcamp = await Bootcamp.findOne({user: req.user.id});
       //If the user is not an admin only add one bootcamp
       if(publishedBootcamp && req.user.role !== 'admin'){
           return next(new ErrorResponse(`The user with ${req.user.id} has laready been published`, 400));
       }
        const bootcamp = await Bootcamp.create(req.body);
        res.status(201).json({
            success: true,
            data: bootcamp
        })   
})
//Update Bootcamp
//Private
exports.updateBootcamps = asyncHandler(async (req, res, next) => {
        let bootcamp = await Bootcamp.findById(req.params.id);
        if(!bootcamp){
            return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id},`, 404));
         }
         if(bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin'){
            return next(new ErrorResponse(`User is not authoriesdc to with id of ${req.params.id},`, 404));
        }
        bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
            new:true,
            runValidators:true
        })
        res.status(200).json(({success: true, data: bootcamp}))
})
//Make sure user is bootcamp owner
//Delete all Bootcamps
//Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
        const deleteBootcamp = await Bootcamp.findById(req.params.id);
        if(!deleteBootcamp){
            return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id},`, 404));
        }
        //Make sure user is bootcamp owner
if(deleteBootcamp.user.toString() !== req.user.id && req.user.role !== 'admin'){
    return next(new ErrorResponse(`User is not authories to delete with id of ${req.params.id},`, 404));
}
       !deleteBootcamp.remove();
        res.status(200).json({deleted: true})
});
//Get Bootcamps within a radius
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
    const {zipcode, distance} = req.params;
    // Get The Lat/Lng for geocoder
    const loc = await geCoder.geocode(zipcode);
    const lat = loc[0].latitude;
    const lng = loc[0].longitude;
    //Calc Radius using radians
    //Divide distance By Radius of Earth
    // Earth Radius = 3, 9663 .i / 6, 378 km
    const radius = distance / 3963;
    const bootcamps = await Bootcamp.find({
        location:{ $geoWithin: { $centerSphere: [[ lng, lat ], radius ] } }
    });
    console.log(zipcode)
    console.log(distance)
    res.status(200).json({
        success: true,
        count: bootcamps.length,
        data: bootcamps
    });
});
//Upload Photo For Bootcamp
exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id);
    if(!bootcamp){
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id},`, 404));
    };
    //Make sure user is bootcamp owner
if(bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin'){
    return next(new ErrorResponse(`User is not authories to update with id of ${req.params.id},`, 404));
}
    if(!req.files){
        return next(new ErrorResponse(`Please Upload a File,`, 400));
    }
    const file = req.files.file;
    //Make sure image is a photo
    if(!file.mimetype.startsWith('image')){
        return next(new ErrorResponse(`Please Upload an Image File,`, 400));
    }

    //Check File Size
    if(file.size > process.env.MAX_FILES_UPLOAD){
        return next(new ErrorResponse(`Please Upload an Image Less Than ${process.env.MAX_FILES_UPLOAD},`, 400));
    }
    // Creat custom filename
    file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;
    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
        if(err){
            console.log(err)
            return next(new ErrorResponse(`Problem with file upload, 500`))
        }
        await Bootcamp.findByIdAndUpdate(req.params.id, {photo: file.name});
        res.status(200).json({
            success: true,
            data: file.name
        })
    })
});