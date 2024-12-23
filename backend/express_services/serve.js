const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });var pg = require("pg");
const app = require('./app');
require('./utils/sequelizeDB');





const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server Running on port ${PORT}`);
});