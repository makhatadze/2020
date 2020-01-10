const mongoose = require('mongoose')

const CourseSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: [true, 'Please add a course title']
    },
    description: {
        type: String,
        required: [true, 'Please add a description']
    },
    weeks: {
        type: String,
        required: [true, 'Please add number of  weeks']
    },
    tuition: {
        type: Number,
        required: [true, 'Please add a tuition cost']
    },
    minimumSkill: {
        type: String,
        required: [true, 'Please add a minimum skill'],
        enum: ['beginner', 'intermediate', 'advanced']
    },
    scholarshipAvailable: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    post: {
        type: mongoose.Schema.ObjectId,
        ref: 'Post',
        required: true
    }
})

// Static method to get avg of course tuitions
CourseSchema.statics.getAverageCost = async function (postId) {
    const obj = await this.aggregate([{
            $match: {
                post: postId
            }
        },
        {
            $group: {
                _id: '$post',
                averageCost: {
                    $avg: '$tuition'
                }
            }
        }
    ]);

    try {
        await this.model('Post').findByIdAndUpdate(postId, {
            averageCost: Math.ceil(obj[0].averageCost / 10) * 10
        });
    } catch (err) {
        console.error(err);
    }
};

// Call getAverageCost after save
CourseSchema.post('save', function () {
    this.constructor.getAverageCost(this.post);
});

// Call getAverageCost before remove
CourseSchema.pre('remove', function () {
    this.constructor.getAverageCost(this.post);
});

module.exports = mongoose.model('Course', CourseSchema)