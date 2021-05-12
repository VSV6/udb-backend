const { model, Schema } = require('mongoose')

const likesSchema = Schema({
    name: { type: Schema.Types.ObjectId, ref: "User" }
}, {
    timestamps: true
})

const Like = model('Like', likesSchema)

module.exports = Like