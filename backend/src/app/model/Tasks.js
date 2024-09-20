const mongoose = require('mongoose')
const mongooseDelete = require('mongoose-delete')
const Schema = mongoose.Schema

const Tasks = new Schema({
    title: { type: String, maxLength: 255, required: true },
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'users',
        required: true
    },
    description: { type: String },
    photo: { type: String },
    finished: { type: Boolean, required: true, default: false }
}, { timestamps: true })

Tasks.plugin(mongooseDelete, {
    deletedAt: true,
    overrideMethods: 'all'
})

module.exports = mongoose.model('tasks', Tasks)