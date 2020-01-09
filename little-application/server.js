const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const connectDB = require('./config/db')

// Load env vars
dotenv.config({
    path: './config/config.env'
});

// Connect Mongodb
connectDB()


// Route
const posts = require('./routes/posts');


const app = express();

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Own middleware
// const logger = require('./middleware/logger')
// app.use(logger)

// Mount roouters
app.use('/api/v1/posts', posts);

const PORT = process.env.PORT || 5000;

const server = app.listen(
    PORT,
    console.log(`Server running ${process.env.NODE_ENV} mode on port ${PORT}`)
);

// Handle unhandled promise  rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`)
    // Close server & exit process
    server.close(() => process.exit(1))
})