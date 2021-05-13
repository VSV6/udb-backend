const mongoose = require('mongoose')

const { Comment, Post } = require('../models')

const isProvidedIdValid = (id) => mongoose.isValidObjectId(id)

const addComment = async (req, res) => {

    const pid = req.params.pid
    const uid = req.params.id

    if (!isProvidedIdValid(uid)) return res.status(404).send({ message: `No user with id ${uid}.` })

    if (!isProvidedIdValid(pid)) return res.status(404).send({ message: `No post with id ${pid}.` })

    try {
        req.body.commented_by = uid
        req.body.for_post = pid

        const comment = await Comment.create(req.body)

        await Post.findByIdAndUpdate(pid, { $push: { comments: comment._id } })

        return res.status(201).send({ data: comment })
    } catch (error) {
        console.log(error)
        return res.status(500).send({ message: 'Internal server error' })
    }
}

const deleteComment = async (req, res) => {

    let cid = req.params.cid
    let pid = req.params.pid

    if (!isProvidedIdValid(pid)) return res.status(404).send({ message: `No post with id ${pid}.` })

    if (!isProvidedIdValid(cid)) return res.status(404).send({ message: `No comment with id ${cid}.` })

    try {

        await Comment.findByIdAndDelete(cid)

        await Post.findByIdAndUpdate(pid, { $pull: { comments: cid } })

        return res.status(200).send({ message: 'Comment has been deleted.' })
    } catch (error) {
        console.log(error)
        return res.status(500).send({ message: 'Internal server error' })
    }
}

const getComment = async (req, res) => {

    const cid = req.params.cid

    if (!isProvidedIdValid(cid)) return res.status(404).send({ message: `No comment with id ${cid}.` })

    try {
        const comment = await Comment.findById(cid).populate('commented_by', "name email").exec()
        return res.status(302).send({ data: comment })
    } catch (error) {
        console.log(error)
        return res.status(500).send({ message: 'Internal server error' })
    }
}

const updateComment = async (req, res) => {
    let cid = req.params.cid

    if (!isProvidedIdValid(cid)) return res.status(404).send({ message: `No comment with id ${cid}.` })

    try {
        const comment = await Comment.findByIdAndUpdate(cid, req.body, { new: true })
        return res.status(410).send({ data: comment })
    } catch (error) {
        console.log(error)
        return res.status(500).send({ message: 'Internal server error' })
    }
}

module.exports = { addComment, deleteComment, getComment, updateComment }