const bcrypt = require('bcrypt')

const User = require('../models/user')
const { generateJWT } = require('../middlewares/auth')

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body

        const isUser = await User.findOne({ email }).select('name password photo')

        if (isUser) {
            const isPasswordMatch = await bcrypt.compare(password, isUser.password)

            if (isPasswordMatch) {
                const access = generateJWT(isUser)
                return res.status(200).send({ access, user: { email, _id: isUser._id, name: isUser.name, photo: isUser.photo } })
            }
            else
                return res.status(401).send({ message: `Either email or password is wrong.` })
        }
        else
            return res.status(404).send({ message: `No user with email ${email}.` })

    } catch (error) {
        console.log(error)
        return res.status(500).send({ message: 'Internal server error' })
    }
}

const phoneLogin = async (req, res) => {
    try {
        const { phone } = req.body

        const isUser = await User.findOne({ phone })

        const Twilio = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)

        const msg = await Twilio.messages.create({
            body: 'Hi Bharath, this is from twilio account made by vivek. Basically its sms verifications service. ;)',
            from: process.env.TWILIO_PHONE_NUMBER,
            to: `+91${phone}`
        })

        console.log(msg)

        if (isUser) {
            const access = generateJWT(isUser)
            return res.status(200).send({ access, user: { email: isUser.email, _id: isUser._id, name: isUser.name } })
        }
        else {
            const user = await User.create({ email: `${phone}@gmail.com`, name: phone.toString(), phone })
            const access = generateJWT(user)
            return res.status(200).send({ access, user })
        }

    } catch (error) {
        console.log(error)
        return res.status(500).send({ message: 'Internal server error' })
    }
}

module.exports = { loginUser, phoneLogin }