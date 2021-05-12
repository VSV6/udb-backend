const bcrypt = require('bcrypt')

const User = require('../models/user')
const { generateJWT } = require('../middlewares/auth')

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body

        const isUser = await User.findOne({ email }).select('name password')

        if (isUser) {
            const isPasswordMatch = await bcrypt.compare(password, isUser.password)

            if (isPasswordMatch) {
                const access = generateJWT(isUser)
                return res.status(200).send({ access, user: { email, _id: isUser._id, name: isUser.name } })
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

module.exports = { loginUser }