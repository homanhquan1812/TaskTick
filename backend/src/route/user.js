const express = require('express');
const router = express.Router();
const userController = require('../app/controller/UserController')

router.get('/streak/:id', userController.readAUserStreakById)

module.exports = router;