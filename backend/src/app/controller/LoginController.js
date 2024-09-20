const Users = require('../model/Users')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

class LoginController
{
    // [POST] /login
    async login(req, res, next) {
        const { username, password } = req.body

        try {
            // Find a user
            const usernameMatch = await Users.findOne({ username: username })
            
            if (!usernameMatch) {
                return res.status(401).json({
                    message: 'This username doesn\'t exist.'
                })
            }
            
            const passwordMatch = await bcrypt.compare(password, usernameMatch.password)

            if (!passwordMatch) {
                return res.status(401).json({
                    message: 'Password is incorrect.'
                })
            }

            const token = jwt.sign({ 
                _id: usernameMatch._id, 
                username: usernameMatch.username, 
                phonenumber: usernameMatch.phonenumber,
                name: usernameMatch.name,
                email: usernameMatch.email
            }, process.env.SECRET_KEY, { expiresIn: '1h' })

            req.session.username = usernameMatch.username

            // Send JWT token and user info as JSON response
            res.json({
                message: 'Login successful for this user.',
                token: token,
                user: {
                    _id: usernameMatch._id,
                    username: usernameMatch.username,
                    name: usernameMatch.name                    
                }
            })
        } catch (error) {
            next(error)
        }
    }
}

module.exports = new LoginController