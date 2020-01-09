const express = require('express')
const dotenv = require('dotenv')


// Route
const posts = require('./routes/posts')

// Load env vars
dotenv.config({
    path: './config/config.env'
})

const app = express()

const logger = (req, res, next) => {
    console.log(`${req.method} ${req.protocol}://${req.get('host')}${req.originalUrl}`)
    next()
}

app.use(logger)
// Mount roouters
app.use('/api/v1/posts', posts);


const PORT = process.env.PORT || 5000

app.listen(PORT, console.log(`Server running ${process.env.NODE_ENV
} mode on port ${PORT}`))