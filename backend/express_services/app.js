const express = require('express');
const app = express();
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');

app.use(express.json());
app.use(cors());

app.use('/api', userRoutes);



module.exports = app;