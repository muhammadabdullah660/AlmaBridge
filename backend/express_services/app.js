const express = require("express");
const app = express();
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const profileRoutes = require("./routes/profileRoutes");
const jobRoutes = require("./routes/jobRoutes");
const achievementsRoutes = require("./routes/achievementsRoutes");

const path = require("path");

// Serve uploaded images as static files
app.use(
  "/uploadsAchieverPhotos",
  express.static(path.join(__dirname, "uploadsAchieverPhotos"))
);

app.use(express.json());
app.use(cors());

app.use("/api", userRoutes);
app.use("/api", profileRoutes);
app.use("/api/jobposting", jobRoutes);
app.use("/api/achievements", achievementsRoutes);

module.exports = app;
