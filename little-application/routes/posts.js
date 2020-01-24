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

const Post = require('../models/Post')

const advancedResults = require('../middleware/advancedResult')


// Include other ressource routers
const courseRouter = require('./courses')
const reviewRouter = require('./reviews')

const router = express.Router();

// Protect authentication
const {
    protect,
    authorize
} = require('../middleware/auth')

// Re-route into other resource routers
router.use('/:postId/courses', courseRouter)
router.use('/:postId/reviews', reviewRouter)

router
    .route('/:id/photo')
    .put(protect, authorize('publisher', 'admin'), uploadPostPhoto)

router
    .route('/radius/:zipcode/:distance')
    .get(getPostsInRadius)

router
    .route('/')
    .get(advancedResults(Post, 'courses'), getPosts)
    .post(protect, authorize('publisher', 'admin'), createPost);
router
    .route('/:id')
    .get(getPost)
    .put(protect, authorize('publisher', 'admin'), updatePost)
    .delete(protect, authorize('publisher', 'admin'), deletePost);

module.exports = router;