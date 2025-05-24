const express = require("express");
const app = express();
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const profileRoutes = require("./routes/profileRoutes");
const jobRoutes = require("./routes/jobRoutes");
const achievementsRoutes = require("./routes/achievementsRoutes");
const eventRoutes = require("./routes/eventRoutes");


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.use("/api", userRoutes);
app.use("/api", profileRoutes);
app.use("/api", jobRoutes);
app.use("/api", achievementsRoutes);
app.use("/api", eventRoutes);

module.exports = app;
