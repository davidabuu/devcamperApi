const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: [true, 'Please Add A Course Title']
    },
    description:{
        type: String,
        required: [true, 'Please add a Description']
    },
    weeks:{
        type: String,
        required: [true, 'Please add a number of weeks']
    },
    tuition:{
        type: Number,
        required: [true, 'Please add a tution cost']
    },
    minimumSkill:{
        type: String,
        required: [true, 'Please add a minimum Skill'],
        enum: ['beginner', 'intermediate', 'advanced']
    },
    scholarshipAvaliable: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    bootcamp: {
        type: mongoose.Schema.ObjectId,
        ref:'Bootcamp',
        required: true
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref:'User',
        required: true
    }
});
//Static Method to get average of course tuition
CourseSchema.statics.getAverageCost  = async function(bootcampId){
    console.log('Cal Avg Cost')
    const obj = await this.aggregate([
        {
            $match: {bootcamp: bootcampId}
        },
        {
            $group:{
                _id: '$bootcamp',
                averageCost: {$avg : '$tuition'}
            }
        }
    ]);
    try {
        await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
            averageCost: Math.ceil(obj[0].averageCost / 10) * 10
        })
    } catch (error) {
        console.log(error);
    }
}
// Call averageCost after save
CourseSchema.post('save', function() {
   this.constructor.getAverageCost(this.bootcamp);
});
//Cal Before Save
CourseSchema.pre('save', function() {

});
CourseSchema.pre('remove', function() {
    this.constructor.getAverageCost(this.bootcamp);
});
module.exports = mongoose.model('Course', CourseSchema);