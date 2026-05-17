const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const authMiddleware = require('../middleware/auth'); 

router.get('/my-tasks', authMiddleware, taskController.getProjectTasks);

module.exports = router;