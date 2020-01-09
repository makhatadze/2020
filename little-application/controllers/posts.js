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
exports.createPost = async (req, res, next) => {
    try {
        const post = await Post.create(req.body);

        res.status(201).json({
            success: true,
            data: post
        })
    } catch (err) {
        res.status(400).json({
            success: false
        })
    }
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