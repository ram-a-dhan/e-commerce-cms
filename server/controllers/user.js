const { User } = require('../models')
const { comparePass } = require('../helpers/bcrypt')
const jwt = require('jsonwebtoken')
const customError = require('http-errors')

class userController {
    static async login(req, res, next) {
        try {
            let testUser = await User.findOne({ where: { username: req.body.username } })
            if (!testUser) throw customError(400, 'Wrong username / password!')

            let testPass = await comparePass(req.body.password, testUser.password)
            if (!testPass) throw customError(400, 'Wrong username / password!')

            let access_token = await jwt.sign({ id: testUser.id }, process.env.JWT_SECRET)
            if (!access_token) throw customError(500, 'Failed to generate access token!')

            res.status(200).json({ access_token })
        } catch (err) {
            next(err)
        }
    }

    static async register(req, res, next) {
        let newUser = {
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
        }
        newUser.role = req.body.role ? req.body.role : 'user'
        try {
            let reg = await User.create(newUser)
            res.status(201).json(reg)
        } catch (err) {
            next(err)
        }
    }
}

module.exports = userController