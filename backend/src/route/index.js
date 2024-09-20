require('dotenv').config()

const loginRouter = require('./login')
const registerRouter = require('./register')
const taskRouter = require('./task')
const updateInfoRouter = require('./updateinfo')
const userRouter = require('./user')

function route(app) {
    app.use('/login', loginRouter)
    app.use('/register', registerRouter)
    app.use('/task', taskRouter)
    app.use('/updateinfo', updateInfoRouter)
    app.use('/user', userRouter)

    const env = process.env.NODE_ENV
    
    console.log(`Environment: ${env}`)

    // Error handling middleware
    app.use((err, req, res, next) => {
        console.error(err.stack)

        if (env === 'development') {
            res.status(500).json({
                message: err.stack.split('\n').map(line => line.trim())
            })
        } else {
            res.status(500).json({
                message: 'Something went wrong!'
            })
        }
    })
}

module.exports = route