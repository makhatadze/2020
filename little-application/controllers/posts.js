const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
const geocoder = require('../utils/geocoder')
const Post = require('../models/Post')

// @desc   Get all Posts
// @route  Get /api/v1/posts
// @access Public
exports.getPosts = asyncHandler(async (req, res, next) => {

    let query;
    // Copy req.query
    const reqQuery = {
        ...req.query
    }

    // Fields to exclude
    const removeFields = ['select', 'sort']

    // Loop over removeFields and delete them from reqQuery
    removeFields.forEach(param => delete reqQuery[param])

    console.log(reqQuery)

    // Create query string
    let queryStr = JSON.stringify(reqQuery)

    // Create operators ($gt, $gte, etc)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`)

    // Finding resourse
    query = Post.find(JSON.parse(queryStr))

    // Select Fields
    if (req.query.select) {
        const fields = req.query.select.split(',').join(' ')
        query = query.select(fields)
    }

    // Sort
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ')
        query = query.sort(sortBy)
    } else {
        query = query.sort('-createdAt')
    }

    // Executing query
    const post = await query

    res.status(200).json({
        success: true,
        data: post
    })

})

// @desc   Get signle Post
// @route  Get /api/v1/posts/:id
// @access Public
exports.getPost = asyncHandler(async (req, res, next) => {

    const post = await Post.findById(req.params.id)

    if (!post) {
        return next(new ErrorResponse(`Post not fount with id of ${req.params.id}`, 404));
    }
    res.status(200).json({
        success: true,
        data: post
    })

})

// @desc   Create new Post
// @route  Post /api/v1/posts/:id
// @access Private
exports.createPost = asyncHandler(async (req, res, next) => {

    const post = await Post.create(req.body);

    res.status(201).json({
        success: true,
        data: post
    })

})
// @desc   Update  Post
// @route  PUT /api/v1/posts/:id
// @access Private
exports.updatePost = asyncHandler(async (req, res, next) => {
    const post = await Post.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })
    if (!post) {
        return next(new ErrorResponse(`Post not fount with id of ${req.params.id}`, 404));
    }
    res.status(200).json({
        success: true,
        data: post
    })

})
// @desc   Delete Post
// @route  DELETE /api/v1/posts/:id
// @access Private
exports.deletePost = asyncHandler(async (req, res, next) => {

    const post = await Post.findByIdAndDelete(req.params.id)

    if (!post) {
        return next(new ErrorResponse(`Post not fount with id of ${req.params.id}`, 404));
    }

    res.status(200).json({
        success: true,
        count: post.length,
        data: {}
    })

})

// @desc   Get Post within a radius
// @route  Get /api/vs/posts/radius/:zipcode/:distance
// @access Private
exports.getPostsInRadius = asyncHandler(async (req, res, next) => {
    const {
        zipcode,
        distance
    } = req.params

    // Get lat/lng from geocoder
    const loc = await geocoder.geocode(zipcode)
    const lat = loc[0].latitude
    const lng = loc[0].longitude

    // Calc radius using radians
    // Divide distance by radius of Earth
    // Earth Radius = 3,963 miles / 6,378 km
    const radius = distance / 6378

    const posts = await Post.find({
        location: {
            $geoWithin: {
                $centerSphere: [
                    [lng, lat], radius
                ]
            }
        }
    })

    res.status(200).json({
        success: true,
        count: posts.length,
        data: posts
    })
})