const bcrypt = require('bcrypt')
const cloudinary = require('../utils/cloudinary')
const mongoose = require('mongoose')

const { User } = require('../models')

const isProvidedIdValid = (id) => mongoose.isValidObjectId(id)

const createUser = async (req, res) => {
    console.log(req.body)
    try {
        req.body.password = await bcrypt.hash(req.body.password, 10)

        const userWithPassword = await User.create(req.body)
        const userWithoutPassword = ({ ...userWithPassword })._doc
        delete userWithoutPassword.password

        return res.status(201).send({ data: userWithoutPassword })
    } catch (error) {
        console.log(error)
        if (error.code === 11000) return res.status(406).send({ message: 'This email has been taken.' })
        else return res.status(500).send({ message: 'Internal server error' })
    }
}

const deleteUser = async (req, res) => {
    let id = req.params.id

    if (!isProvidedIdValid(id)) return res.status(404).send({ message: `No user with id ${id}` })

    try {
        await User.findByIdAndDelete(id)
        return res.status(410).send({ message: 'User has been removed.' })
    } catch (error) {
        return res.status(500).send({ message: 'Internal server error' })
    }
}

const getUser = async (req, res) => {
    let id = req.params.id

    if (!isProvidedIdValid(id)) return res.status(404).send({ message: `No user with id ${id}` })

    try {
        const user = await User.findById(id).populate('posts').exec()
        return res.status(302).send({ data: user })
    } catch (error) {
        console.log(error)
        return res.status(500).send({ message: 'Internal server error' })
    }
}

const getUsers = async (req, res) => {
    try {
        const users = await User.find({})
        return res.status(200).send({ data: users })
    } catch (error) {
        console.log(error)
        return res.status(500).send({ message: 'Internal server error' })
    }
}

const updateUser = async (req, res) => {
    let id = req.params.id

    if (!isProvidedIdValid(id)) return res.status(404).send({ message: `No user with email ${req.body.email}` })

    try {
        const { body, file } = req
        const { url } = await cloudinary.uploader.upload(file.path)
        body.password = await bcrypt.hash(body.password, 10)
        body.photo = url

        const user = await User.findByIdAndUpdate(id, body, { new: true })

        return res.status(200).send({ data: user })
    } catch (error) {
        console.log(error)
        return res.status(500).send({ message: 'Internal server error' })
    }
}

module.exports = { createUser, deleteUser, getUser, getUsers, updateUser }