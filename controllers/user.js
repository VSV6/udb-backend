const bcrypt = require('bcrypt')
const cloudinary = require('../utils/cloudinary')
const mongoose = require('mongoose')

const { User } = require('../models')

const isProvidedIdValid = (id) => mongoose.isValidObjectId(id)

const createUser = async (req, res) => {
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
        const user = await User.findByIdAndUpdate(id, req.body, { new: true })

        return res.status(200).send({ data: user })
    } catch (error) {
        console.log(error)
        return res.status(500).send({ message: 'Internal server error' })
    }
}

const updateUserPassword = async (req, res) => {
    let id = req.params.id

    if (!isProvidedIdValid(id)) return res.status(404).send({ message: `No user with email ${req.body.email}` })

    try {
        const { currentPassword, newPassword } = req.body
        const user = await User.findById(id).select('password')
        const isPassword = await bcrypt.compare(currentPassword, user.password)

        if (isPassword) {
            user.password = await bcrypt.hash(newPassword, 10)
            await user.save()
            return res.status(200).send({ message: 'Password has been updated.', type: 'success' })
        }
        else
            return res.status(200).send({ message: 'Current password is not matching.', type: 'error' })
    } catch (error) {
        console.log(error)
        return res.status(500).send({ message: 'Internal server error', type: 'error' })
    }
}

const updateUserProfileImage = async (req, res) => {
    let id = req.params.id

    if (!isProvidedIdValid(id)) return res.status(404).send({ message: `No user with email ${req.body.email}` })

    try {
        const { url } = await cloudinary.uploader.upload(req.file.path)
        const user = await User.findByIdAndUpdate(id, { photo: url }, { new: true })

        // const { body, file } = req
        // const { public_id, secure_url: url } = await cloudinary.uploader.upload(file.path)
        // const { filename: name } = file
        // You can use 'originalname' from

        return res.status(200).send({ data: user })
    } catch (error) {
        console.log(error)
        return res.status(500).send({ message: 'Internal server error' })
    }
}

module.exports = { createUser, deleteUser, getUser, getUsers, updateUser, updateUserPassword, updateUserProfileImage }