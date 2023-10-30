const express = require("express");
require("dotenv").config();
const cors = require("cors");
const app = express();
const routes = require("./src/routes");

app.use(
  cors()

  //   {
  //   origin: "*",
  //   methods: ["POST", "PUT", "DELETE", "GET"],
  // }
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

routes(app);

app.listen(process.env.PORT, () =>
  console.log("Listening at port: " + process.env.PORT)
);
