require('dotenv').config()

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Users = require('../model/Users')
const { multipleMongooseToObject, mongooseToObject } = require('../../util/mongoose')

class UpdateInfoController {
    async updateInfo(req, res, next) {
        const { name, email, phonenumber, username } = req.body
        const token = req.headers.authorization.split(' ')[1]

        try {
            const decoded = jwt.verify(token, process.env.SECRET_KEY)
            const id = decoded._id

            await Users.findByIdAndUpdate(id, {
                name, email, phonenumber, username
            })

            // Generate a new JWT with updated details
            const newToken = jwt.sign({
                _id: id,
                username: username,
                name: name,
                email: email,
                phonenumber: phonenumber
            }, process.env.SECRET_KEY, { expiresIn: '1h' })

            res.status(200).json({
                message: "Information updated successfully.",
                username: username,
                name: name,
                email: email,
                phonenumber: phonenumber,
                token: newToken
            })
            
        } catch (error) {
            next(error)
        }
    }

    //
    async updatePassword(req, res, next) {
        const { oldPassword, newPassword } = req.body
        const token = req.headers.authorization.split(' ')[1]

        try {
            const decoded = jwt.verify(token, process.env.SECRET_KEY)
            const id = decoded._id
            const user = await Users.findById(id)
            const passwordMatch = await bcrypt.compare(oldPassword, user.password)

            if (!passwordMatch) {
                return res.status(401).json('Old password is incorrect.')
            }

            const hashedPassword = await bcrypt.hash(newPassword, 10)

            await Users.findByIdAndUpdate(id, {
                password: hashedPassword
            })

            res.status(200).json('Password updated successfully.')
            
        } catch (error) {
            next(error)
        }
    }
}

module.exports = new UpdateInfoController