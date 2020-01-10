const express = require('express');
const {
    getPosts,
    getPost,
    createPost,
    updatePost,
    deletePost,
    getPostsInRadius,
    uploadPostPhoto
} = require('../controllers/posts');


// Include other ressource routers
const courseRouter = require('./courses')

const router = express.Router();

// Re-route into other resource routers
router.use('/:postId/courses', courseRouter)

router
    .route('/:id/photo')
    .put(uploadPostPhoto)

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