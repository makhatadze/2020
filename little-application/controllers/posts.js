const Post = require('../models/Post')
const ErrorResponse = require('../utils/errorResponse')

// @desc   Get all Posts
// @route  Get /api/v1/posts
// @access Public
exports.getPosts = async (req, res, next) => {
    try {
        const post = await Post.find()

        if (!post) {
            res.status(400).json({
                success: false
            })
        }
        res.status(200).json({
            success: true,
            data: post
        })
    } catch (err) {
        res.status(400).json({
            success: false
        })
    }
}

// @desc   Get signle Post
// @route  Get /api/v1/posts/:id
// @access Public
exports.getPost = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id)

        if (!post) {
            return res.status(400).json({
                success: false
            })
        }
        res.status(200).json({
            success: true,
            data: post
        })
    } catch (err) {
        // res.send(400).json({
        //     success: false
        // });
        next(new ErrorResponse(`Post not fount with id of ${req.params.id}`, 404));
    }
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
exports.updatePost = async (req, res, next) => {

    const post = await Post.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })
    if (!post) {
        return res.status(400).json({
            success: false
        })
    }

    res.status(200).json({
        success: true,
        data: post
    })

}
// @desc   Delete Post
// @route  DELETE /api/v1/posts/:id
// @access Private
exports.deletePost = async (req, res, next) => {
    try {
        const post = await Post.findByIdAndDelete(req.params.id)

        if (!post) {
            return res.status(400).json({
                success: false
            })
        }

        res.status(200).json({
            success: true,
            count: post.length,
            data: {}
        })
    } catch (err) {
        res.status(400).json({
            success: false
        })
    }
}