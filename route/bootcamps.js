const express = require('express');
const {getBootcamp, getBootcamps, updateBootcamps, deleteBootcamp, createBootcamp, getBootcampsInRadius, bootcampPhotoUpload} = require('../controller/bootcamps');
const advancedResults = require('../middleware/advancedResult');
const Bootcamp = require('../models/Bootcamp');
// Include other resouce routers
const courseRouter = require('./courses');
const reviewRouter = require('./review');
const routes = express.Router();
const {protect, authorize} = require('../middleware/auth');
// Re-route into other resouce
routes.use('/:bootcampId/courses', courseRouter);
routes.use('/:bootcampId/review', reviewRouter);
routes.route('/:id/photo').put(protect,authorize('publisher', 'admin'),  bootcampPhotoUpload);
routes.route('/radius/:zipcode/:distance').get(getBootcampsInRadius);
routes.route('/').get(advancedResults(Bootcamp, 'courses'),getBootcamps).post(protect, authorize('publisher', 'admin'), createBootcamp)
routes.route('/:id').get(getBootcamp).put(protect, authorize('publisher', 'admin'),updateBootcamps).delete(protect, authorize('publisher', 'admin'),deleteBootcamp)
module.exports = routes;