const express = require("express");
const route = express.Router();
const userController = require("../controllers/user.js");

route.get("/find", userController.find);

module.exports = route;
