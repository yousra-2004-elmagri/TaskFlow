const router = require("express").Router();
const Task = require("../models/Task");
const Project = require("../models/Project");
const auth = require("../middleware/authMiddleware");

router.get("/", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const now = new Date();

    const activeProjects = await Project.countDocuments({
      $or: [{ owner: userId }, { members: userId }],
      status: "actif"
    });

    const assignedTasks = await Task.countDocuments({ assignedTo: userId });

    const completedTasks = await Task.countDocuments({
      assignedTo: userId,
      status: "terminé"
    });

    const lateTasks = await Task.countDocuments({
      assignedTo: userId,
      status: { $ne: "terminé" },
      deadline: { $lt: now }
    });

    const inProgressTasks = await Task.find({
      assignedTo: userId,
      status: "en cours"
    }).sort({ priority: -1, deadline: 1 });

    res.json({
      activeProjects,
      assignedTasks,
      completedTasks,
      lateTasks,
      inProgressTasks
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;