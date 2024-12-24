const express = require('express');
const app = express();
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const profileRoutes = require('./routes/profileRoutes');

app.use(express.json());
app.use(cors());

app.use('/api', userRoutes);
app.use('/userprofile', profileRoutes);



module.exports = app;