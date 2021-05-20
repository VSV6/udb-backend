require('dotenv').config()
const express = require('express')
// const bodyParser = require('body-parser')
const Cors = require('cors')
const mongoose = require('mongoose')

const { authRoutes, commentRoutes, likeRoutes, postRoutes, userRoutes } = require('./routes')

const app = express()
const isProd = () => {
    if (process.env.IS_PROD === 'true') {
        console.log('MongoDB is connected to prod.')
        return process.env.MONGODB_ATLAS
        // 'mongodb+srv://vivek_s:WbmDB66k@cluster0.onedp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
    }
    else {
        console.log('MongoDB is connected to dev.')
        return 'mongodb://localhost:27017/udb'
    }
}
const PORT = process.env.PORT || 4000

// Cors should be on top of the bodyparser otherwise it'll give cors error
app.use(Cors())
app.use(express.json())
app.use(express.static('public'))

app.use('/udb/api/v1/auth', authRoutes)
app.use('/udb/api/v1/comment', commentRoutes)
app.use('/udb/api/v1/like', likeRoutes)
app.use('/udb/api/v1/post', postRoutes)
app.use('/udb/api/v1/user', userRoutes)

mongoose.connect(isProd(), { useCreateIndex: true, useFindAndModify: false, useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Successfully connected to mongodb!!')
        app.listen(PORT, () => console.log(`Server is running on port ${PORT}.`))

    })
    .catch(error => console.log(`Error from mongodb: ${error}`))