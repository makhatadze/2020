const path = require('path')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
const geocoder = require('../utils/geocoder')
const Post = require('../models/Post')

// @desc   Get all Posts
// @route  Get /api/v1/posts
// @access Public
exports.getPosts = asyncHandler(async (req, res, next) => {
    res.status(200).json(res.advancedResults)
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

    // Add user to req,body
    req.body.user = req.user.id;

    // Check for publieshed post
    const publieshedPost = await Post.findOne({
        user: req.user.id
    })

    // If the user is not an admin, they can only add one post
    if (publieshedPost && req.user.role !== 'admin') {
        return next(new ErrorResponse(`The user with ID ${req.user.id} has already published a post`, 400))
    }
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
    let post = await Post.findById(req.params.id)
    if (!post) {
        return next(new ErrorResponse(`Post not fount with id of ${req.params.id}`, 404));
    }
    // Make sure user is Post owner
    if (post.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`User ${req.params.id} is not authorized to update this bootcamp`, 404));
    }

    post = await Post.findOneAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })
    res.status(200).json({
        success: true,
        data: post
    })

})
// @desc   Delete Post
// @route  DELETE /api/v1/posts/:id
// @access Private
exports.deletePost = asyncHandler(async (req, res, next) => {

    const post = await Post.findById(req.params.id)

    if (!post) {
        return next(new ErrorResponse(`Post not fount with id of ${req.params.id}`, 404));
    }

    // Make sure user is Post owner
    if (post.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`User ${req.params.id} is not authorized to delete this bootcamp`, 404));
    }

    post.remove()

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

// @desc   Upload photo for Post
// @route  PUT /api/v1/posts/:id/photo
// @access Private
exports.uploadPostPhoto = asyncHandler(async (req, res, next) => {

    const post = await Post.findById(req.params.id)

    if (!post) {
        return next(new ErrorResponse(`Post not fount with id of ${req.params.id}`, 404));
    }
    // Make sure user is Post owner
    if (post.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`User ${req.params.id} is not authorized to update this post`, 404));
    }


    if (!req.files) {
        return next(new ErrorResponse(`Please upload Photo`, 400));
    }

    const file = req.files.file

    // Make sure the image is a photo
    if (!file.mimetype.startsWith('image')) {
        return next(new ErrorResponse(`Please upload an Image file`, 404));
    }

    // Check filesize
    if (file.size > process.env.MAX_FILE_UPLOAD) {
        return next(new ErrorResponse(`Please upload an Image less than ${process.env.MAX_FILE_UPLOAD}`,
            404));
    }

    // Create custom filename
    file.name = `photo_${post._id}${path.parse(file.name).ext}`

    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
        if (err) {
            console.error(err)
            return next(new ErrorResponse(`Problem with file upload`,
                500));
        }

        await Post.findByIdAndUpdate(req.params.id, {
            photo: file.name
        })

        res.status(200).json({
            success: true,
            data: file.name
        })
    })
})