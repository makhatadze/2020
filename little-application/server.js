const express = require('express');
const dotenv = require('dotenv');

const morgan = require('morgan');

// Route
const posts = require('./routes/posts');

// Load env vars
dotenv.config({
  path: './config/config.env'
});

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

app.listen(
  PORT,
  console.log(`Server running ${process.env.NODE_ENV} mode on port ${PORT}`)
);
