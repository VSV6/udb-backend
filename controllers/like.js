const mongoose = require('mongoose')

const { Like, Post } = require('../models')

const isProvidedIdValid = (id) => mongoose.isValidObjectId(id)

const addLike = async (req, res) => {

    const pid = req.params.pid
    const uid = req.params.id

    if (!isProvidedIdValid(uid)) return res.status(404).send({ message: `No user with id ${uid}.` })

    if (!isProvidedIdValid(pid)) return res.status(404).send({ message: `No post with id ${pid}.` })

    try {
        const like = await Like.create({ name: uid })

        await Post.findByIdAndUpdate(pid, { $push: { likes: like._id } })

        return res.status(201).send({ data: like })
    } catch (error) {
        console.log(error)
        return res.status(500).send({ message: 'Internal server error' })
    }
}

const deleteLike = async (req, res) => {

    let lid = req.params.lid
    let pid = req.params.pid

    if (!isProvidedIdValid(lid)) return res.status(404).send({ message: `No like with id ${lid}.` })

    if (!isProvidedIdValid(pid)) return res.status(404).send({ message: `No post with id ${pid}.` })

    try {

        await Like.findByIdAndDelete(lid)

        await Post.findByIdAndUpdate(pid, { $pull: { likes: lid } })

        return res.status(410).send({ message: 'Unliked!' })
    } catch (error) {
        console.log(error)
        return res.status(500).send({ message: 'Internal server error' })
    }
}

const getLike = async (req, res) => {

    const lid = req.params.lid

    if (!isProvidedIdValid(lid)) return res.status(404).send({ message: `No like with id ${lid}.` })

    try {
        const like = await Like.findById(lid).populate('name', "name email").exec()
        return res.status(302).send({ data: like })
    } catch (error) {
        console.log(error)
        return res.status(500).send({ message: 'Internal server error' })
    }
}

module.exports = { addLike, deleteLike, getLike }