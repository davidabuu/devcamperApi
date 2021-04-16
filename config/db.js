const mongoose = require('mongoose');
//Connect To Database
const connectDB = async () => {
    await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser:true,
        useCreateIndex:true,
        useFindAndModify:false,
        useUnifiedTopology:true
    }).then(() => console.log('Mongo is connected'))
    .catch((err) => console.log(err));
}

module.exports = connectDB;