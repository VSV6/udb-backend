const { model, Schema } = require('mongoose')

const userSchema = Schema({
    email: {
        type: String,
        unique: true
    },
    name: String,
    password: {
        select: false,
        type: String
    },
    photo: {
        default: 'https://images.unsplash.com/photo-1587445104203-e4aaf3994e57?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        type: String
    },
    posts: [{ type: Schema.Types.ObjectId, ref: 'Post' }]
},
    {
        timestamps: true
    }
)

const User = model('User', userSchema)

module.exports = User