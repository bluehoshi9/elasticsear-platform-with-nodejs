const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });
const app = require("./app");

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`App running on port ${port}...`);
  console.log(`Start link for this project:  http://127.0.0.1:3000/upload`);
});
