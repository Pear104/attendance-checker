const userRouter = require("./user.js");
const checkAttendanceRouter = require("./checkAttendance.js");
const databaseRouter = require("./database.js");

const routes = (app) => {
  app.use("/user", userRouter);
  app.use("/attendance", checkAttendanceRouter);
  app.use("/database", databaseRouter);
  app.use("/", (req, res) => {
    res.send("ahihihi");
  });
};

module.exports = routes;
