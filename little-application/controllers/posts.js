const Post = require('../models/Post')

// @desc   Get all Posts
// @route  Get /api/v1/posts
// @access Public
exports.getPosts = (req, res, next) => {
    res.status(200).json({
        success: true,
        msg: 'Show all posts',
    })
}

// @desc   Get signle Post
// @route  Get /api/v1/posts/:id
// @access Public
exports.getPost = (req, res, next) => {
    res.status(200).json({
        success: true,
        msg: 'Get  post'
    })
}

// @desc   Create new Post
// @route  Post /api/v1/posts/:id
// @access Private
exports.createPost = (req, res, next) => {
    res.status(200).json({
        success: true,
        msg: 'Create new post'
    })
}
// @desc   Update  Post
// @route  PUT /api/v1/posts/:id
// @access Private
exports.updatePost = (req, res, next) => {
    res.status(200).json({
        success: true,
        msg: 'Update  post'
    })
}
// @desc   Delete Post
// @route  DELETE /api/v1/posts/:id
// @access Private
exports.deletePost = (req, res, next) => {
    res.status(200).json({
        success: true,
        msg: 'Delete post'
    })
}