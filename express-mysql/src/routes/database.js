const express = require("express");
const route = express.Router();
const databaseController = require("../controllers/database.js");

route.get("/getstate", databaseController.getDBState);
route.post("/register", databaseController.postGottenFingerprintId);
route.post("/update", databaseController.postUpdateFingerprintGotten);
route.post("/delete", databaseController.postDeletedSuccess);
route.post("/empty", databaseController.postEmpty);

module.exports = route;
