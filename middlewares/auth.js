const jwt = require('jsonwebtoken')

const authenticateAccess = (req, res, next) => {
    const access = req.headers.authorization?.split(' ')[1]

    if (access) {
        try {
            jwt.verify(access, process.env.ACCESS_KEY)
            next()
        } catch (error) {
            console.log(error)
            return res.status(401).send({ message: 'User is unauthorized!' })
        }
    }
    else
        return res.status(406).send({ message: 'No access token is provided.' })
}

const authenticateUser = (req, res, next) => {
    const access = req.headers.authorization?.split(' ')[1]

    if (access) {
        try {
            const { _id } = jwt.verify(access, process.env.ACCESS_KEY)

            if (_id === req.params.id)
                return next()
            else
                return res.status(403).send({ message: 'User is forbidden!' })
        } catch (error) {
            console.log(error)
            return res.status(401).send({ message: 'User is unauthorized!' })
        }
    }
    else
        return res.status(406).send({ message: 'No access token is provided.' })
}

const generateJWT = ({ email, _id, name, password }) => {
    return jwt.sign({ email, _id, name, password }, process.env.ACCESS_KEY, { expiresIn: '1d' })
}

module.exports = { authenticateAccess, authenticateUser, generateJWT }