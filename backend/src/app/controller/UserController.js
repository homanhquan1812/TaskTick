const Users = require('../model/Users')
const { multipleMongooseToObject, mongooseToObject } = require('../../util/mongoose')

class UserController {
    async readAUserStreakById(req, res, next) {
        try {
            const streak = await Users.findById(req.params.id, 'streak')

            res.status(200).json({
                streak: mongooseToObject(streak)
            })
        } catch (error) {
            next(error)
        }
    }
}

module.exports = new UserController