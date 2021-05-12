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

// mongodb://localhost:27017/udb
mongoose.connect('mongodb+srv://vivek_s:WbmDB66k@cluster0.onedp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', { useFindAndModify: false, useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Successfully connected to mongodb!!')
        app.listen(PORT, () => console.log(`Server is running on port ${PORT}.`))

    })
    .catch(error => console.log(`Error from mongodb: ${error}`))