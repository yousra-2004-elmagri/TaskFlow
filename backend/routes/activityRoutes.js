const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activityController');
router.get('/:projectId', activityController.getActivitiesByProject);
module.exports = router;
