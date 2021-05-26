const cloudinary = require('../utils/cloudinary')
const mongoose = require('mongoose')

const { Comment, Post, User } = require('../models')

const isProvidedIdValid = (id) => mongoose.isValidObjectId(id)

const createPost = async (req, res) => {

    const id = req.params.id

    if (!isProvidedIdValid(id)) return res.status(404).send({ message: `No user with id ${id}.` })

    try {
        const { body, file } = req
        const { public_id, secure_url: url } = await cloudinary.uploader.upload(file.path)
        const { filename: name } = file
        // You can use 'originalname' from file. If you want to save originalname in db.

        body.created_by = id
        body.photo = {
            id: public_id,
            name,
            url
        }

        const post = await Post.create(body)

        await User.findByIdAndUpdate(id, { $push: { posts: post._id } })

        return res.status(201).send({ data: post })
    } catch (error) {
        console.log(error)
        return res.status(500).send({ message: 'Internal server error' })
    }
}

const deletePost = async (req, res) => {
    let pid = req.params.pid
    let uid = req.params.id

    if (!isProvidedIdValid(uid)) return res.status(404).send({ message: `No user with id ${uid}.` })

    if (!isProvidedIdValid(pid)) return res.status(404).send({ message: `No post with id ${pid}.` })

    try {
        await Comment.deleteMany({ for_post: pid })

        const { photo } = await Post.findById(pid)

        await cloudinary.uploader.destroy(photo.id)

        await Post.findByIdAndDelete(pid)

        await User.findByIdAndUpdate(uid, { $pull: { posts: pid } })

        return res.status(200).send({ message: 'Post has been deleted.' })
    } catch (error) {
        console.log(error)
        return res.status(500).send({ message: 'Internal server error' })
    }
}

const getPost = async (req, res) => {

    const pid = req.params.pid

    if (!isProvidedIdValid(pid)) return res.status(404).send({ message: `No post with id ${pid}.` })

    try {

        const post = await Post.findById(pid)
            .populate('created_by', "name email")
            .populate('comments', "comment commented_by")
            .populate('likes', "name")
            .exec()

        return res.status(302).send({ data: post })
    } catch (error) {
        console.log(error)
        return res.status(500).send({ message: 'Internal server error' })
    }
}

const getPosts = async (req, res) => {

    const id = req.params.id

    if (!isProvidedIdValid(id)) return res.status(404).send({ message: `No user with id ${id}.` })

    try {

        const post = await Post.find({})
            .populate('created_by', "name email photo")
            .populate({
                model: 'Comment',
                path: 'comments',
                populate: {
                    model: 'User',
                    path: 'commented_by',
                    select: 'name photo'
                }
            })
            .populate('likes', "name")
            .sort({ 'createdAt': 'desc' })
            .exec()

        return res.status(200).send({ data: post })
    } catch (error) {
        console.log(error)
        return res.status(500).send({ message: 'Internal server error' })
    }
}

const updatePost = async (req, res) => {
    let pid = req.params.pid

    if (!isProvidedIdValid(pid)) return res.status(404).send({ message: `No post with id ${pid}.` })

    try {
        const post = await Post.findByIdAndUpdate(pid, req.body, { new: true })
        return res.status(410).send({ data: post })
    } catch (error) {
        console.log(error)
        return res.status(500).send({ message: 'Internal server error' })
    }
}

module.exports = { createPost, deletePost, getPost, getPosts, updatePost }