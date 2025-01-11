const express = require('express');
const app = express();
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const profileRoutes = require('./routes/profileRoutes');
const jobRoutes = require('./routes/jobRoutes');

app.use(express.json());
app.use(cors());

app.use('/api', userRoutes);
app.use('/api/userprofile', profileRoutes);
app.use('/api/jobposting', jobRoutes);


module.exports = app;