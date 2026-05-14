const router = require("express").Router();
const Project = require("../models/Project");
const Task = require("../models/Task");
const auth = require("../middleware/authMiddleware");

// جلب كل المشاريع
router.get("/", auth, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const projects = await Project.find({
      $or: [{ owner: req.user.id }, { members: req.user.id }]
    })
      .limit(limit)
      .skip((page - 1) * limit);
    const total = await Project.countDocuments();
    res.json({ data: projects, total, page, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// إنشاء مشروع
router.post("/", auth, async (req, res) => {
  try {
    const project = await Project.create({ ...req.body, owner: req.user.id });
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// تعديل مشروع
router.put("/:id", auth, async (req, res) => {
  try {
    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, owner: req.user.id },
      req.body,
      { new: true }
    );
    if (!project) return res.status(404).json({ message: "Not found" });
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// حذف مشروع
router.delete("/:id", auth, async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({ _id: req.params.id, owner: req.user.id });
    if (!project) return res.status(404).json({ message: "Not found" });
    await Task.deleteMany({ project: req.params.id });
    res.json({ message: "Project deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// جلب مهام مشروع
router.get("/:id/tasks", auth, async (req, res) => {
  try {
    const tasks = await Task.find({ project: req.params.id }).populate("assignedTo", "name email");
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// إضافة عضو
router.post("/:id/members", auth, async (req, res) => {
  try {
    const User = require("../models/User");
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).json({ message: "User not found" });
    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, owner: req.user.id },
      { $addToSet: { members: user._id } },
      { new: true }
    );
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// حذف عضو
router.delete("/:id/members/:userId", auth, async (req, res) => {
  try {
    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, owner: req.user.id },
      { $pull: { members: req.params.userId } },
      { new: true }
    );
    if (!project) return res.status(404).json({ message: "Not found or not authorized" });
    res.json({ message: "Member removed", project });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;