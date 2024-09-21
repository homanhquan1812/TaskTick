const express = require('express');
const router = express.Router();
const taskController = require('../app/controller/TaskController');

router.get('/detail/:id', taskController.readATaskById)
router.get('/deleted/:id', taskController.readAllTasksDeletedById)
router.get('/:id', taskController.readAllTasksById)
router.post('/', taskController.createATask)
router.put('/edit/:id', taskController.updateATask)
router.put('/deleted/:id', taskController.updateARestoredTask)
router.put('/re-activate', taskController.changeFinishedToUnfinished)
router.put('/:id', taskController.updateAFinishedTask)
router.delete('/delete/tem/:id', taskController.deleteATaskByIdTemporarily)
router.delete('/delete/per/:id', taskController.deleteATaskByIdPermanently)

module.exports = router;