const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: [true, 'Please Add A title for the review'],
        maxLength: 100
    },
    text:{
        type: String,
        required: [true, 'Please add a text']
    },
    rating:{
        type: Number,
        min:1,
        max:10,
        required: [true, 'Please add a rating between 1 and 10']
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
//Static Method to get average rating per bootcamp
ReviewSchema.statics.getAverageRating  = async function(bootcampId){
    console.log('Cal Avg Cost')
    const obj = await this.aggregate([
        {
            $match: {bootcamp: bootcampId}
        },
        {
            $group:{
                _id: '$bootcamp',
                averageRating: {$avg : '$rating'}
            }
        }
    ]);
    try {
        await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
            averageRating: obj[0].averageRating
        })
    } catch (error) {
        console.log(error);
    }
}
// Call averageCost after save
ReviewSchema.post('save', function() {
   this.constructor.getAverageRating(this.bootcamp);
});
//Cal Before Save
ReviewSchema.pre('save', function() {
    this.constructor.getAverageRating(this.bootcamp);
});
ReviewSchema.pre('remove', function() {
    this.constructor.getAverageRating(this.bootcamp);
})
// Prevent User From submittung more than one review per bootcamp
ReviewSchema.index({bootcamp: 1, user: 1}, {unique: true})
module.exports = mongoose.model('Review', ReviewSchema);