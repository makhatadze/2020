const express = require('express');
const {
    getPosts,
    getPost,
    createPost,
    updatePost,
    deletePost,
    getPostsInRadius
} = require('../controllers/posts');

const router = express.Router();

router
    .route('/radius/:zipcode/:distance')
    .get(getPostsInRadius)

router
    .route('/')
    .get(getPosts)
    .post(createPost);
router
    .route('/:id')
    .get(getPost)
    .put(updatePost)
    .delete(deletePost);

module.exports = router;