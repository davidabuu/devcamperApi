const fs = require('fs');
const mongoose = require('mongoose');
const colors = require('colors')
const dotenv = require('dotenv');

//Load Env Vars
dotenv.config({path:'./config/config.env'})

//Load Models
const Bootcamp = require('./models/Bootcamp');
const Course = require('./models/Course');
const User = require('./models/User');
const Review = require('./models/Review');
//Connect To The Database
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser:true,
    useCreateIndex:true,
    useFindAndModify:false,
    useUnifiedTopology:true
}).then(() => console.log('Mongo is connected'))
.catch((err) => console.log(err));
//Read JOSN FILES
const bootcamps = JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8'));
const courses = JSON.parse(fs.readFileSync(`${__dirname}/_data/courses.json`, 'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/_data/users.json`, 'utf-8'));
const review = JSON.parse(fs.readFileSync(`${__dirname}/_data/reviews.json`, 'utf-8'));
// Import into DB
const importData = async () => {
    try {
        await Bootcamp.create(bootcamps);
        await Course.create(courses);
        await User.create(users);
        await Review.create(review);
        console.log('Data Imported');
        process.exit();
    } catch (error) {
        console.log(error);
    }
};

//Delete The Data
const deleteData = async () => {
    try {
        await Bootcamp.deleteMany();
        await Course.deleteMany();
        await User.deleteMany();
        await Review.deleteMany();
        console.log('Data Deleted');
        process.exit();
    } catch (error) {
        console.log(error);
    }
};
if(process.argv[2] === '-i'){
    importData();
}else if(process.argv[2] === '-d'){
    deleteData();
}