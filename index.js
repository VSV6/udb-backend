require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const Cors = require('cors')
const mongoose = require('mongoose')

const { authRoutes, commentRoutes, likeRoutes, postRoutes, userRoutes } = require('./routes')

const app = express()
const PORT = process.env.PORT || 4000

app.use(bodyParser.json())
app.use(Cors())

app.use('/udb/api/v1/auth', authRoutes)
app.use('/udb/api/v1/comment', commentRoutes)
app.use('/udb/api/v1/like', likeRoutes)
app.use('/udb/api/v1/post', postRoutes)
app.use('/udb/api/v1/user', userRoutes)

mongoose.connect('mongodb://localhost:27017/udb', { useFindAndModify: false, useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Successfully connected to mongodb!!')
        app.listen(PORT, () => console.log(`Server is running on port ${PORT}.`))

    })
    .catch(error => console.log(`Error from mongodb: ${error}`))