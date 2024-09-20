require('dotenv').config()

const Users = require('../model/Users')
const bcrypt = require('bcrypt')

class RegisterController
{
    // [POST] /register
    async register(req, res, next)
    {
        try {
            const { name, email, phonenumber, username, password } = req.body

            // Validate input fields
            if (!name || !email || !phonenumber || !username || !password) {
                return res.status(400).json('All required fields must be filled.')
            }

            // Check matches
            const usernameMatch = await Users.findOne({ username: username})
            const emailMatch = await Users.findOne({ email: email})
            const phonenumberMatch = await Users.findOne({ phonenumber: phonenumber})
    
            if (usernameMatch) {
                return res.status(401).json({
                    message: 'This username already exists.'
                })
            } else if (emailMatch) {
                return res.status(401).json({
                    message: 'This email address already exists.'
                })
            } else if (phonenumberMatch) {
                return res.status(401).json({
                    message: 'This phone number already exists.'
                })
            }
            
            // Hashing + Salting
            const saltRounds = 10
            const hashedPassword = await bcrypt.hash(password, saltRounds)

            // User registration
            const newUser = new Users({ name, email, phonenumber, username, password: hashedPassword })

            await newUser.save()

            res.status(201).json('User registered successfully.')
        } catch (error) {
            next(error)
        }
    }
}

module.exports = new RegisterController