const { model, Schema } = require('mongoose')

const postSchema = Schema({
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
    created_by: { type: Schema.Types.ObjectId, ref: 'User' },
    description: String,
    likes: [{ type: Schema.Types.ObjectId, ref: "Like" }],
    photo: {},
    title: String
},
    {
        timestamps: true
    }
)

const Post = model('Post', postSchema)

module.exports = Post