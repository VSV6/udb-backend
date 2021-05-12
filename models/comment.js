const { model, Schema } = require('mongoose')

const commentSchema = Schema({
    comment: String,
    commented_by: { type: Schema.Types.ObjectId, ref: "User" }
}, {
    timestamps: true
})

const Comment = model('Comment', commentSchema)

module.exports = Comment