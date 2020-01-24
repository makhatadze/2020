const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
const Review = require('../models/Review')
const Post = require('../models/Post')

// @desc Get reviews
// @route GET /api/v1/reviews
// @route GET /api/v1/posts/:postId/reviews
// @access Public

exports.getReviews = asyncHandler(async (req, res, next) => {
    if (req.params.postId) {
        const reviews = await Review.find({
            post: req.params.postId
        })
        return res.status(200).json({
            success: true,
            count: reviews.length,
            data: reviews
        })
    } else {
        res.status(200).json(res.advancedResults)
    }
})

// @desc Get Single review
// @route GET /api/v1/reviews/:id
// @access Public

exports.getReview = asyncHandler(async (req, res, next) => {
    const review = await Review.findById(req.params.id).populate({
        path: 'post',
        select: 'name description'
    })

    if (!review) {
        return next(new ErrorResponse(`No review found with the id of ${req.params.id}`, 404))
    }

    res.status(200).json({
        success: true,
        data: review
    })
})

// @desc   Add reviews
// @route  POST /api/v1/posts/:postId/reviews
// @access Private

exports.addReview = asyncHandler(async (req, res, next) => {
    req.body.post = req.params.postId;
    req.body.user = req.user.id;

    const post = await Post.findById(req.params.postId)

    if (!post) {
        return next(new ErrorResponse(`No Post with the id of ${req.params.postId}`, 404))
    }

    const review = await Review.create(req.body)

    res.status(201).json({
        success: true,
        data: review
    })
})


// @desc   Update reviews
// @route  Put /api/v1/reviews/:id
// @access Private

exports.updateReview = asyncHandler(async (req, res, next) => {

    let review = await Review.findById(req.params.id)

    if (!review) {
        return next(new ErrorResponse(`No Review with the id of ${req.params.id}`, 404))
    }
    // Make sure review belongs to user or user is admin
    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`Not authorized to update review`, 401))
    }

    review = await Review.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })

    res.status(200).json({
        success: true,
        data: review
    })
})

// @desc   Delete reviews
// @route  Delete /api/v1/reviews/:id
// @access Private

exports.deleteReview = asyncHandler(async (req, res, next) => {

    const review = await Review.findById(req.params.id)

    if (!review) {
        return next(new ErrorResponse(`No Review with the id of ${req.params.id}`, 404))
    }
    // Make sure review belongs to user or user is admin
    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`Not authorized to update review`, 401))
    }

    await review.remove()

    res.status(200).json({
        success: true,
        data: []
    })
})