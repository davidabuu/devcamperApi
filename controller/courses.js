const Courses =  require('../models/Course');
const ErrorResponse = require('../utils/errResponse');
const asyncHandler = require('../middleware/async');
const Bootcamp = require('../models/Bootcamp');


// Get Courses
// Get specific courses by the ID
exports.getCourses = asyncHandler(async (req, res, next) => {
    if(req.params.bootcampId){
        const courses = await Courses.find({bootcamp: req.params.bootcampId});
        return res.status(200).json({
            success: true,
            count: courses.length,
            data: courses
        })
    }else {
        res.status(200).json(res.advancedResults);
    }
    const courses = await query;
    res.status(200).json({
        success: true,
        count: courses.length,
        data: courses
    });
});

//Get a single course
exports.getCourse = asyncHandler(async (req, res, next) => {
    const course = await Courses.findById(req.params.id).populate({
        path: 'bootcamp',
        select:'name description'
    });
    if(!course){
        return next(new ErrorResponse(`No cousre with the id of ${req.params.id}`, 404))
    }
    res.status(200).json({
        success: true,
        data: course
    });
});

//Add or Post a course
exports.addCourse = asyncHandler(async (req, res, next) => {
    req.body.bootcamp = req.params.bootcampId;
    req.body.user = req.user.id;
    const bootcamp = await Bootcamp.findById(req.params.bootcampId)
    if(!bootcamp){
        return next(new ErrorResponse(`No bootcamp with the id of ${req.params.bootcampId}`, 404));
    }
          //Make sure user is bootcamp owner
if(bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin'){
    return next(new ErrorResponse(`User is not authories to add a course to bootcamp id of ${bootcamp_.id},`, 404));
}
    const course = await Courses.create(req.body);
    res.status(200).json({
        success: true,
        data: course
    });
});

// Update a Course
exports.updateCourse = asyncHandler(async (req, res, next) => {
    let course = await Courses.findById(req.params.id)
    if(!course){
        return next(new ErrorResponse(`No course found  with the id of ${req.params.bootcampId}`, 404))
    }
            //Make sure user is course owner
if(course.user.toString() !== req.user.id && req.user.role !== 'admin'){
    return next(new ErrorResponse(`User is not authories to update a course to bootcamp id of ${bootcamp_.id},`, 404));
}
    course = await Courses.findByIdAndUpdate(req.params.id, req.body , {
        new: true,
        runValidators: true
    });
    res.status(200).json({
        success: true,
        data: course
    });
});

// Delete a Course
exports.deleteCourse = asyncHandler(async (req, res, next) => {
    const course = await Courses.findById(req.params.id)
    if(!course){
        return next(new ErrorResponse(`No course found  with the id of ${req.params.bootcampId}`, 404))
    }
            //Make sure user is bootcamp owner
if(course.user.toString() !== req.user.id && req.user.role !== 'admin'){
    return next(new ErrorResponse(`User is not authories to delete a  course to bootcamp id of ${bootcamp_.id},`, 404));
}
    await course.remove()
    res.status(200).json({
        success: true,
        data: {}
    });
});