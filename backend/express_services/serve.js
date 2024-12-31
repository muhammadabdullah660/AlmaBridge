const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });
const app = require("./app");
require("./utils/sequelizeDB");

const PORT = 5000 || process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server Running on port ${PORT}`);
});
