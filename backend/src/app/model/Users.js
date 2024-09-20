const mongoose = require('mongoose')
const mongooseDelete = require('mongoose-delete')
const Schema = mongoose.Schema

const Users = new Schema({
    name: { type: String, maxLength: 255, required: true },
    username: { type: String, maxLength: 255, required: true, unique: true },
    email: { type: String, maxLength: 255, required: true, unique: true },
    password: { type: String, maxLength: 255, required: true },
    phonenumber: { type: String, maxLength: 255, required: true, unique: true },
    streak: { type: Number, default: 0 },
    lastStreakUpdate: { type: Date }
}, { timestamps: true })

Users.plugin(mongooseDelete, {
    deletedAt: true,
    overrideMethods: 'all'
})

module.exports = mongoose.model('users', Users)