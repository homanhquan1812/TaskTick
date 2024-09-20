require('dotenv').config()

const express = require('express')
const router = express.Router()
const updateInfo = require('../app/controller/UpdateInfoController')

router.put('/info', updateInfo.updateInfo)
router.put('/password', updateInfo.updatePassword)

module.exports = router