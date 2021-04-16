const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const errorHandler = require('./middleware/error');
const fileupload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const mongoSantize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss  = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');
//Get the routes
//Evniromnetal Variable
dotenv.config({path: './config/config.env'});
//Middleware
const morgan = require('morgan');
const bootcamps = require('./route/bootcamps');
const courses = require('./route/courses');
const auth = require('./route/auth');
const users = require('./route/user');
const reviews = require('./route/review');
const connectDB = require('./config/db');
//Init the app
const app = express();
//File Upload
app.use(fileupload());

//Set Static folder
app.use(express.static(path.join(__dirname, 'public')));
//Connect to Database
connectDB()
const PORT = process.env.PORT || 5000;
console.log(process.env.PORT)
const server = app.listen(PORT, () => {
    console.log('Server is Running');
});
//Body Parser
app.use(express.json());
//Cookie Parse
//Sanitize Data
app.use(mongoSantize());
//Set Security Headers
app.use(helmet());
//Prevent XSS attackes and cross scritping
app.use(xss());     
// Rate Limiting
const limiter = rateLimit({
    windowMs:1110 * 60 * 1000,// Ten  minutes
    max:100
});
app.use(limiter);
// Prevnt Http Param Pollution
app.use(hpp());
//Enable CORS
app.use(cors());
app.use(cookieParser());
//The routes request
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);
app.use('/api/v1/auth', auth)
app.use('/api/v1/user', users);
app.use('/api/v1/review', reviews);
app.use(errorHandler);

// Handled unhandled rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    //Close server
    server.close(() => process.exit(1));
});