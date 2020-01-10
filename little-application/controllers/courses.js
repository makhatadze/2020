const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
const Course = require('../models/Course')


// @desc Get courses
// @route GET /api/v1/courses
// @route GET /api/v1/bootcamps/:postId/courses
// @access Public

exports.getCourses = asyncHandler(async (req, res, next) => {
    let query

    if (req.params.postId) {
        query = Course.find({
            post: req.params.postId
        })
    } else {
        query = Course.find()
    }

    const courses = await query

    res.status(200).json({
        success: true,
        count: courses.length,
        data: courses
    })

})