const Tasks = require('../model/Tasks')
const Users = require('../model/Users')
const { multipleMongooseToObject, mongooseToObject } = require('../../util/mongoose')
const jwt = require('jsonwebtoken')
const CronJob = require('cron').CronJob

class TaskController {
    constructor() {
        // Bind methods to ensure correct 'this' context
        this.updateAFinishedTask = this.updateAFinishedTask.bind(this)
        this.updateStreaks = this.updateStreaks.bind(this)
        this.resetFinishedFieldAndUpdateStreaks = this.resetFinishedFieldAndUpdateStreaks.bind(this)
        this.resetStreaksBeforeMidnight = this.resetStreaksBeforeMidnight.bind(this)

        // Start the cron jobs
        this.resetStreaksBeforeMidnight()
        this.resetFinishedFieldAndUpdateStreaks()
    }

    // [GET] /task/:id
    async readAllTasksById(req, res, next) {
        try {
            const task = await Tasks.find({ userId: req.params.id })

            if (!task) {
                return res.status(404).json('Task not found.')
            }

            res.json({
                task: multipleMongooseToObject(task)
            })
        } catch (error) {
            next(error)
        }
    }

    // [GET] /task/deleted/:id
    async readAllTasksDeletedById(req, res, next) {
        try {
            const task = await Tasks.findDeleted({ userId: req.params.id })

            if (!task) {
                return res.status(404).json('Task not found.')
            }

            res.json({
                task: multipleMongooseToObject(task)
            })
        } catch (error) {
            next(error)
        }
    }

    // [GET] /task/detail/:id
    async readATaskById(req, res, next) {
        try {
            const task = await Tasks.findById(req.params.id)

            if (!task) {
                return res.status(404).json('Task not found.')
            }

            res.json({
                task: mongooseToObject(task)
            })
        } catch (error) {
            next(error)
        }
    }

    // [POST] /task
    async createATask(req, res, next) {
        try {
            const { title, description, userId, photo } = req.body
            const newTask = new Tasks(req.body)

            await newTask.save()

            res.status(201).json('Task created successfully.')
        } catch (error) {
            next(error)
        }
    }

    // [PUT] /task/update/:id
    async updateATask(req, res, next) {
        try {
            const { title, photo, description } = req.body
            
            await Tasks.findByIdAndUpdate(req.params.id, req.body)

            res.status(200).json('Task updated successfully.')
        } catch (error) {
            next(error)
        }
    }

    // [PUT] /task/deleted/:id
    async updateARestoredTask(req, res, next) {
        try {            
            await Tasks.restore({ _id: req.params.id })

            res.status(200).json('Task restored successfully.')
        } catch (error) {
            next(error)
        }
    }

    // [PUT] /task/activate
    async changeFinishedToUnfinished(req, res, next) {
        try {            
            await Tasks.updateMany({ finished: true }, { finished: false })

            res.status(200).json('Task changed from finished to unfinished successfully.')
        } catch (error) {
            next(error)
        }
    }

    // [PUT] /task/:id
    async updateAFinishedTask(req, res, next) {
        try {
            const { finished } = req.body
            const taskId = req.params.id
    
            const task = await Tasks.findByIdAndUpdate(taskId, {
                finished
            }, { new: true })
    
            if (!task) {
                return res.status(404).json('Task not found.')
            }
    
            // Check and update streak immediately after finishing a task
            await this.updateStreaks()
    
            res.status(200).json('Task updated successfully.')
        } catch (error) {
            next(error)
        }
    }    

    // [DELETE] /task/delete/tem/:id
    async deleteATaskByIdTemporarily(req, res, next) {
        try {
            const task = await Tasks.findById(req.params.id)
            
            await task.delete()

            res.status(200).json('Task deleted successfully.')
        } catch (error) {
            next(error)
        }
    }

    // [DELETE] /task/delete/per/:id
    async deleteATaskByIdPermanently(req, res, next) {
        try {
            await Tasks.findByIdAndDelete(req.params.id)

            res.status(200).json('Task deleted successfully.')
        } catch (error) {
            next(error)
        }
    }

    async updateStreaks() {
        try {
            const users = await Users.find()
            const today = new Date()
            today.setHours(0, 0, 0, 0)
    
            for (const user of users) {
                const tasks = await Tasks.find({ userId: user._id })
                const allTasksFinished = tasks.length > 0 && tasks.every(task => task.finished)
    
                // Check if all tasks are finished and if the streak was not updated today
                if (allTasksFinished) {
                    const lastUpdate = user.lastStreakUpdate ? new Date(user.lastStreakUpdate) : null
                    if (!lastUpdate || lastUpdate < today) {
                        // Increment streak
                        const updatedUser = await Users.findByIdAndUpdate(
                            user._id,
                            { 
                                $inc: { streak: 1 },
                                $set: { lastStreakUpdate: new Date() }
                            },
                            { new: true }
                        )
                    }
                }
            }
        } catch (error) {
            console.error(error)
        }
    }    

    async resetFinishedFieldAndUpdateStreaks() {
        const job = new CronJob('0 0 0 * * *', async () => {
            try {
                await Tasks.updateMany({ finished: true }, { finished: false })
                console.log('Reset all tasks to unfinished at 12:00 AM')
                
                await this.updateStreaks()
            } catch (error) {
                next(error)
            }
        }, null, true, 'Asia/Ho_Chi_Minh')

        job.start()
    }

    async resetStreaksBeforeMidnight() {
        const streakResetJob = new CronJob('59 59 23 * * *', async () => {
            try {
                const users = await Users.find()
                
                for (const user of users) {
                    const tasks = await Tasks.find({ userId: user._id })
                    const allTasksFinished = tasks.every(task => task.finished)
    
                    if (!allTasksFinished) {
                        await Users.findByIdAndUpdate(user._id, { streak: 0 })
                    }
                }
                
                console.log('Checked and reset streaks at 11:59:59 PM')
            } catch (error) {
                next(error)
            }
        }, null, true, 'Asia/Ho_Chi_Minh')

        streakResetJob.start()
    }
}

module.exports = new TaskController()
