const Post = require('../models/Post')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')

// @desc   Get all Posts
// @route  Get /api/v1/posts
// @access Public
exports.getPosts = asyncHandler(async (req, res, next) => {

    const post = await Post.find()

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