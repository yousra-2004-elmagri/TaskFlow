const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const activityRoutes =require('./routes/activityRoutes');


const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/auth", require("./routes/auth"));
app.use("/api/projects", require("./routes/projects"));
app.use("/api/tasks", require("./routes/tasks"));
app.use("/api/dashboard", require("./routes/dashboard"));
app.use('/api/activities', activityRoutes),
mongoose.connect("mongodb://127.0.0.1:27017/taskflow")
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.log("❌ MongoDB error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));