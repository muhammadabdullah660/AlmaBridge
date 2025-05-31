const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require('cookie-parser');
const userRoutes = require("./routes/userRoutes");
const profileRoutes = require("./routes/profileRoutes");
const jobRoutes = require("./routes/jobRoutes");
const achievementsRoutes = require("./routes/achievementsRoutes");
const eventRoutes = require("./routes/eventRoutes");


app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

app.use("/api", userRoutes);
app.use("/api", profileRoutes);
app.use("/api", jobRoutes);
app.use("/api", achievementsRoutes);
app.use("/api", eventRoutes);

module.exports = app;
