const express = require('express');
const {getCourses, getCourse, updateCourse, deleteCourse, addCourse} = require('../controller/courses');
const advancedResults = require('../middleware/advancedResult');
const Course = require('../models/Course');
const {protect, authorize} = require('../middleware/auth');
const routes = express.Router({mergeParams: true});
routes.route('/').get(advancedResults(Course, {
    path: 'bootcamp',
    select: 'name description'
}),getCourses).post(protect,authorize('publisher', 'admin'),addCourse);
routes.route('/:id').get(getCourse).put(protect,authorize('publisher', 'admin'),updateCourse).delete(protect,authorize('publisher', 'admin'),deleteCourse);
module.exports = routes;