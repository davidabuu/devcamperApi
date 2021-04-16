const express = require('express');
const {getReviews, getReview, addReview, updateReview, deleteReview} = require('../controller/review');
const advancedResults = require('../middleware/advancedResult');
const {protect, authorize} = require('../middleware/auth');
const Review = require('../models/Review');
const routes = express.Router({mergeParams: true});
routes.route('/').get(advancedResults(Review, {
    path: 'bootcamp',
    select: 'name description'
}),getReviews).post(protect, authorize('user', 'admin'), addReview);
routes.route('/:id').get(getReview).put(protect, authorize('user', 'admin'), updateReview).delete(protect, authorize('user', 'admin'), deleteReview);
module.exports = routes;